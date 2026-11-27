#!/usr/bin/env python3
"""Static checks for GitHub Pages; uses only Python standard library."""
from __future__ import annotations
import json
import os
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

SOURCE_ROOT = Path(__file__).resolve().parents[1]
ROOT = Path(os.environ.get("PDT_WEB_ROOT", str(SOURCE_ROOT))).resolve()
ERRORS = []
IGNORE = {"", "#"}
IGNORE_SCHEMES = ("mailto:", "tel:", "data:", "javascript:", "https:", "http:", "//")
EXCEPTIONS = {"grazie.html", "thank-you.html", "gracias.html", "contatti-acquista.html", "404.html"}

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.duplicates = []
        self.links = []
        self.lang = False
        self.title = False
        self.canonical = False
        self.description = False
        self.h1s = 0
        self.images_without_alt = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = bool(a.get("lang"))
        if tag == "title":
            self.title = True
        if tag == "h1":
            self.h1s += 1
        if a.get("id"):
            if a["id"] in self.ids:
                self.duplicates.append(a["id"])
            self.ids.add(a["id"])
        if tag == "meta" and a.get("name", "").lower() == "description":
            self.description = bool(a.get("content"))
        if tag == "link" and a.get("rel", "").lower() == "canonical":
            self.canonical = True
        if tag == "img" and "alt" not in a:
            self.images_without_alt += 1
        for prop in ("href", "src", "action"):
            if a.get(prop):
                self.links.append(a[prop])

def local_path(base: Path, uri: str) -> tuple[Path | None, str]:
    uri = uri.strip()
    if uri in IGNORE or uri.lower().startswith(IGNORE_SCHEMES):
        return None, ""
    parsed = urllib.parse.urlsplit(uri)
    if parsed.scheme or parsed.netloc:
        return None, ""
    target = urllib.parse.unquote(parsed.path)
    if not target:
        return base, parsed.fragment
    path = (ROOT / target.lstrip("/")) if target.startswith("/") else (base.parent / target)
    if target.endswith("/") or target == "/":
        path = path / "index.html"
    try:
        path.resolve().relative_to(ROOT.resolve())
    except ValueError:
        ERRORS.append(f"{base.name}: reference outside repository: {uri}")
        return None, ""
    return path, parsed.fragment

pages = sorted(ROOT.glob("*.html"))
parsed = {}
for file in pages:
    page = Page()
    try:
        page.feed(file.read_text(encoding="utf-8"))
        parsed[file.resolve()] = page
    except Exception as exc:
        ERRORS.append(f"{file.name}: HTML parser error {exc}")
        continue
    if not page.lang: ERRORS.append(f"{file.name}: missing html lang")
    if not page.title: ERRORS.append(f"{file.name}: missing title")
    if page.h1s > 1: ERRORS.append(f"{file.name}: multiple h1 tags")
    if file.name not in EXCEPTIONS:
        if not page.description: ERRORS.append(f"{file.name}: missing meta description")
        if not page.canonical: ERRORS.append(f"{file.name}: missing canonical")
    if page.duplicates:
        ERRORS.append(f"{file.name}: duplicate IDs: {', '.join(page.duplicates)}")
    if page.images_without_alt:
        ERRORS.append(f"{file.name}: images without alt: {page.images_without_alt}")

for file, page in parsed.items():
    for raw in page.links:
        path, fragment = local_path(file, raw)
        if path is None: continue
        if not path.exists():
            ERRORS.append(f"{file.name}: broken local link: {raw}")
        elif fragment and path.suffix == ".html" and path.resolve() in parsed:
            if urllib.parse.unquote(fragment) not in parsed[path.resolve()].ids:
                ERRORS.append(f"{file.name}: broken anchor: {raw}")
        elif fragment and path == file and fragment not in page.ids:
            ERRORS.append(f"{file.name}: broken fragment: {raw}")

try:
    manifest = json.loads((ROOT / "site.webmanifest").read_text(encoding="utf-8"))
    for icon in manifest.get("icons", []):
        path, _ = local_path(ROOT / "index.html", icon.get("src", ""))
        if path and not path.exists():
            ERRORS.append(f"site.webmanifest: missing icon {icon['src']}")
except (ValueError, OSError) as exc:
    ERRORS.append(f"Manifest invalid: {exc}")

try:
    document = ET.parse(ROOT / "sitemap.xml")
    root = document.getroot()
    locations = [tag.text or "" for tag in root.iter() if tag.tag.endswith("}loc")]
    if not locations:
        ERRORS.append("sitemap.xml: no URLs")
    for loc in locations:
        path = urllib.parse.urlsplit(loc).path
        target = ROOT / (path.lstrip("/") if path != "/" else "index.html")
        if not target.exists():
            ERRORS.append(f"sitemap.xml: missing page {loc}")
except (ET.ParseError, OSError) as exc:
    ERRORS.append(f"Sitemap invalid: {exc}")

# Consolidated candidate: do not expose incomplete policies or revive old asset versions.
candidate_assets = {"style.css":23, "script.js":12, "pdt-motion.css":11,
                    "interest.js":14, "pdt-shop.css":7, "pdt-shop.js":6,
                    "guida-informativa.js":7}
deferred_policy = re.compile(r"^(?:terms-of-use|cookie-policy|legal-information|intellectual-property|sales-terms|returns-policy|product-safety|professional-use)(?:-en|-es)?\\.html$")
for file, page in parsed.items():
    for raw in page.links:
        url = urllib.parse.urlsplit(raw)
        name = url.path.rsplit("/", 1)[-1]
        if name in candidate_assets and url.query != f"v={candidate_assets[name]}":
            ERRORS.append(f"{file.name}: inconsistent shared asset version: {raw}")
        if deferred_policy.fullmatch(name):
            ERRORS.append(f"{file.name}: link to policy awaiting approval: {raw}")
for name in ("contatti.html", "contact-en.html", "contact-es.html",
             "pre-order.html", "pre-order-en.html", "pre-order-es.html"):
    text = (ROOT / name).read_text(encoding="utf-8")
    if 'method="post"' not in text or "form-action 'none'" not in text or "data-pdt-form-fallback" not in text:
        ERRORS.append(f"{name}: secure mail form guard missing")
    if 'name="updates_consent"' in text or "data-marketing-consent-text" in text:
        ERRORS.append(f"{name}: marketing collection is not approved")
    if "pdt-skip-link" not in text:
        ERRORS.append(f"{name}: skip link missing")
guide = (ROOT / "guida-informativa.js").read_text(encoding="utf-8")
if any(word in guide for word in ("Essential", "Studio", "tre edizioni", "three PdT editions", "tres ediciones")):
    ERRORS.append("guida-informativa.js: outdated editions")
if "updates_consent" in (ROOT / "interest.js").read_text(encoding="utf-8"):
    ERRORS.append("interest.js: marketing consent not approved")

for name in ("pre-order.html", "pre-order-en.html", "pre-order-es.html"):
    text = (ROOT / name).read_text(encoding="utf-8")
    for asset in ("images/pdt-cofanetto-signature-2026.webp",
                  "images/pdt-grafica-frontale-2026.webp",
                  "images/pdt-grafica-retro-2026.webp"):
        if asset not in text:
            ERRORS.append(f"{name}: missing approved Signature artwork {asset}")
        if not (ROOT / asset).is_file():
            ERRORS.append(f"{name}: approved Signature image not found: {asset}")
    if text.count('data-shop-card="signature"') != 1 or text.count('class="pdt-tier-card') != 1:
        ERRORS.append(f"{name}: expected only one Signature product card")
    if 'data-shop-edition="signature"' not in text or 'data-shop-edition="essential"' in text:
        ERRORS.append(f"{name}: Signature-only email CTA is missing or Essential remains")
    if 'data-interest-mailto' not in text or 'name="destination"' not in text or 'name="message"' not in text:
        ERRORS.append(f"{name}: commercial email enquiry form incomplete")
    if 'name="sector"' in text or 'name="interest"' in text:
        ERRORS.append(f"{name}: unnecessary enquiry field remains")
    if text.count('href="#interest"') < 3 or 'name="quantity"' not in text:
        ERRORS.append(f"{name}: direct enquiry path missing")
    if 'name="edition" value="top"' not in text or '<select name="edition"' in text:
        ERRORS.append(f"{name}: edition must be fixed to Signature")
    if text.count('<div class="pdt-edition-preview">') != 1 or text.count('<div class="preorder-gallery-image">') != 4:
        ERRORS.append(f"{name}: expected one Signature box and four gallery images")
    if any(fragment in text for fragment in ('pdt-edition-open','preorder-gallery-open',
                                            '<a class="pdt-edition-preview"',
                                            '<a class="preorder-gallery-image"',
                                            '<a href="images/')):
        ERRORS.append(f"{name}: fullscreen image control still present")
    if 'preorder.css?v=24' not in text:
        ERRORS.append(f"{name}: latest gallery style missing")
    if '<strong>149 €</strong><span class="pdt-future-price">' not in text or '199' not in text or '<del class="pdt-compare-price">' in text:
        ERRORS.append(f"{name}: expected prominent pre-order 149 vs planned list 199")
    if re.search(r'(?<!\d)(?:189|99)\s*€|€\s*(?:189|99)\b', text) or 'Essential' in text or 'essential' in text:
        ERRORS.append(f"{name}: obsolete price or Essential marketing text remains")
    if 'pdt-shop.js?v=6' not in text or 'pdt-shop.css?v=7' not in text or 'interest.js?v=14' not in text:
        ERRORS.append(f"{name}: current Signature sales assets missing")
    if 'pdt-motion.js?v=9' not in text or 'pdt-motion.css?v=11' not in text:
        ERRORS.append(f"{name}: motion assets missing")

for name in ("index.html", "home-en.html", "home-es.html"):
    text = (ROOT / name).read_text(encoding="utf-8")
    if text.count('class="pdt-h-edition"') != 1:
        ERRORS.append(f"{name}: expected exactly one Signature card")
    if '<span class="pdt-future-price">' not in text or 'pdt-current-price' not in text or '<del class="pdt-compare-price">' in text:
        ERRORS.append(f"{name}: pre-order versus planned list price is not shown")
    if re.search(r'(?<!\d)(?:189|99)\s*€|€\s*(?:189|99)\b', text) or "Essential" in text or "essential" in text:
        ERRORS.append(f"{name}: outdated prices or Essential remain")
    if 'pdt-shop.css?v=7' not in text or 'pdt-shop.js?v=6' not in text:
        ERRORS.append(f"{name}: updated Signature-only sales styles or script missing")
    if 'pdt-motion.js?v=9' not in text or 'pdt-motion.css?v=11' not in text:
        ERRORS.append(f"{name}: motion assets missing")
    if 'data-shop-edition="essential"' in text:
        ERRORS.append(f"{name}: Essential is still selectable")

# The first screen must provide direct one-click links, not hidden accordions.
for name in ("index.html", "home-en.html", "home-es.html"):
    text = (ROOT / name).read_text(encoding="utf-8")
    for target in {"index.html": ("utilizzo-individuale.html", "setting-gruppo.html", "risorse-umane.html"), "home-en.html": ("individual-en.html", "group-en.html", "hr-en.html"), "home-es.html": ("individual-es.html", "group-es.html", "hr-es.html")}[name]:
        if f'<a class="pdt-first-action-link" href="{target}"' not in text:
            ERRORS.append(f"{name}: missing direct context link to {target}")
    if 'pdt-first-action-option' in text or 'pdt-first-action-answer' in text:
        ERRORS.append(f"{name}: obsolete context accordion still present")
    if 'pdt-first-action.css?v=5' not in text:
        ERRORS.append(f"{name}: updated direct-link styles missing")
    if 'pdt-first-action-language' in text or 'hreflang="it"><span class="pdt-first-action-num"' in text:
        ERRORS.append(f"{name}: obsolete Italian-only context marker")
# The Italian provenance and professional positioning must be consistent
# across all storefront translations.
for name in ("index.html","home-en.html","home-es.html","pre-order.html","pre-order-en.html","pre-order-es.html"):
    text = (ROOT/name).read_text(encoding="utf-8")
    if 'class="pdt-origin ' not in text or "Made in Italy" not in text:
        ERRORS.append(f"{name}: missing Italian provenance module")
    if 'pdt-shop.css?v=7' not in text:
        ERRORS.append(f"{name}: outdated provenance stylesheet")
    if 'pdt-origin-title' not in text:
        ERRORS.append(f"{name}: missing provenance heading")
    if "images/pdt-cofanetto-signature-2026.webp" not in text:
        ERRORS.append(f"{name}: definitive 3D packaging render missing")
    if "pdt-cofanetto-chiuso-hero.webp" in text:
        ERRORS.append(f"{name}: obsolete hero render still referenced")
    if "102" not in text:
        ERRORS.append(f"{name}: original photograph count missing")

# Historical rendering sources are repository-only, not required in the QA web package.
if ROOT == SOURCE_ROOT:
    for edition in ("essential", "studio", "signature"):
        for fmt in ("webp", "avif"):
            file = ROOT / f"images/pdt-{edition}-hq.{fmt}"
            if not file.exists() or file.stat().st_size < 20000:
                ERRORS.append(f"{file.name}: missing or too small to be a full-size render")
motion_js=(ROOT/"pdt-motion.js").read_text(encoding="utf-8")
motion_css=(ROOT/"pdt-motion.css").read_text(encoding="utf-8")
if "pdt-cinema-sweep" not in motion_js or "pdt-cinema-edge" not in motion_js:
    ERRORS.append("pdt-motion.js: cinematic section layers missing")
if "pdt-cinema-zoom" not in motion_js or "pdt-cinema-card" not in motion_css:
    ERRORS.append("cinematic scroll-focus cards missing")
if "prefers-reduced-motion:reduce" not in motion_css:
    ERRORS.append("cinematic accessibility fallback missing")
css = (ROOT / "preorder.css").read_text(encoding="utf-8")
if ".pdt-tier-visual.pdt-edition-image{height:auto;aspect-ratio:4/3;" not in css:
    ERRORS.append("preorder.css: dedicated image card style missing")

# Signature product pages: three translations, contents, non-binding contact and existing assets.
product_pages = {"prodotto.html": "pre-order.html", "product-en.html": "pre-order-en.html", "product-es.html": "pre-order-es.html"}
for name, preorder in product_pages.items():
    text = (ROOT / name).read_text(encoding="utf-8")
    for marker in ('id="contents"', 'id="contexts"', 'id="method"', 'id="launch"', 'id="main-content"', 'pdt-skip-link', 'pdt-product.css?v=1', '102', '60', '22', '149', '199', '50'):
        if marker not in text:
            ERRORS.append(f"{name}: Signature product content missing {marker}")
    if text.count(f'href="{preorder}#interest"') != 2 or f'href="{preorder}#gallery"' not in text:
        ERRORS.append(f"{name}: product enquiry or gallery link missing")
    if '<form' in text or '<del' in text or 'data-shop-edition' in text:
        ERRORS.append(f"{name}: unexpected order functionality or prior-price discount")
    for asset in ('pdt-cofanetto-signature-2026.webp', '06_mazzi_affiancati.webp', '05_manuale_schede.webp', 'pdt-grafica-frontale-2026.webp'):
        if f'images/{asset}' not in text:
            ERRORS.append(f"{name}: product asset missing {asset}")
    for target in product_pages:
        if f'https://pdtstorytellingcards.com/{target}' not in text:
            ERRORS.append(f"{name}: translated product alternate missing {target}")

# Preliminary Signature specification sheet (not a certification).
spec_pdf = ROOT / "docs/commercial/PdT_Signature_Scheda_tecnica_rev01.pdf"
if not spec_pdf.is_file() or not spec_pdf.read_bytes().startswith(b"%PDF-") or not spec_pdf.read_bytes().rstrip().endswith(b"%%EOF"):
    ERRORS.append("Signature preliminary PDF missing or invalid header/trailer")
for name in product_pages:
    text = (ROOT / name).read_text(encoding="utf-8")
    if 'id="specifications"' not in text or 'href="#specifications"' not in text or 'href="docs/commercial/PdT_Signature_Scheda_tecnica_rev01.pdf"' not in text:
        ERRORS.append(f"{name}: preliminary specification section or PDF link missing")

# Method pages: theoretical context, illustrative approach, limitations and translations.
method_pages = {"metodo-pdt.html": "prodotto.html", "method-en.html": "product-en.html", "method-es.html": "product-es.html"}
for name, product in method_pages.items():
    text = (ROOT / name).read_text(encoding="utf-8")
    for marker in ('id="foundations"', 'id="visual-languages"', 'id="approach"', 'id="contexts"', 'id="reading"', 'id="limits-title"', 'pdt-skip-link', 'pdt-method.css?v=1', 'Damasio', 'Barthes', 'Maynard'):
        if marker not in text:
            ERRORS.append(f"{name}: method content missing {marker}")
    if f'href="{product}"' not in text or '<form' in text or 'data-shop-edition' in text:
        ERRORS.append(f"{name}: method product link or enquiry boundary invalid")
    for target in method_pages:
        if f'https://pdtstorytellingcards.com/{target}' not in text:
            ERRORS.append(f"{name}: translated method alternate missing {target}")

# Examples are read-only, fictional and translated.
example_pages = {"esempi-pdt.html": ("metodo-pdt.html", "prodotto.html"), "examples-en.html": ("method-en.html", "product-en.html"), "examples-es.html": ("method-es.html", "product-es.html")}
for name, (method, product) in example_pages.items():
    text = (ROOT / name).read_text(encoding="utf-8")
    for marker in ('id="individual"', 'id="group"', 'id="hr"', 'id="example-limits"', 'class="example-notice"', 'pdt-skip-link', 'pdt-examples.css?v=2'):
        if marker not in text:
            ERRORS.append(f"{name}: illustrative example missing {marker}")
    if text.count('class="example-questions"') != 3 or any(tag in text for tag in ('<form', '<input', '<textarea', 'data-shop-edition')):
        ERRORS.append(f"{name}: example structure or read-only boundary invalid")
    for target in example_pages:
        if f'https://pdtstorytellingcards.com/{target}' not in text:
            ERRORS.append(f"{name}: translated example alternate missing {target}")
    for source in (method, product):
        if f'href="{name}"' not in (ROOT / source).read_text(encoding="utf-8") or f'href="{source}"' not in text:
            ERRORS.append(f"{name}: missing reciprocal navigation to {source}")

# Editorial overview: metadata only; no original excerpt, embedded document or access flow.
manual_pages = {"manuale-pdt.html": ("metodo-pdt.html", "prodotto.html", "esempi-pdt.html"), "manual-en.html": ("method-en.html", "product-en.html", "examples-en.html"), "manual-es.html": ("method-es.html", "product-es.html", "examples-es.html")}
for name, sources in manual_pages.items():
    text = (ROOT / name).read_text(encoding="utf-8")
    for marker in ('id="manual"', 'id="sheets"', 'id="access"', 'class="manual-notice"', 'pdt-skip-link', 'pdt-manual.css?v=1', '60', '22', '102'):
        if marker not in text:
            ERRORS.append(f"{name}: editorial overview missing {marker}")
    if text.count('class="method-card manual-sheet"') != 3 or any(tag in text for tag in ('<form', '<input', '<textarea', '<iframe', '<object', '<embed', '.pdf"', 'data-shop-edition')):
        ERRORS.append(f"{name}: editorial overview contains unexpected content or access functionality")
    for target in manual_pages:
        if f'https://pdtstorytellingcards.com/{target}' not in text:
            ERRORS.append(f"{name}: translated editorial alternate missing {target}")
    for source in sources:
        if f'href="{name}"' not in (ROOT / source).read_text(encoding="utf-8") or f'href="{source}"' not in text:
            ERRORS.append(f"{name}: missing reciprocal navigation to {source}")

# Professional pathways: four routes per language, three settings only.
pathway_groups = [["psicologi-psicoterapeuti.html","utilizzo-individuale.html","setting-gruppo.html","risorse-umane.html"],["psychologists-en.html","individual-en.html","group-en.html","hr-en.html"],["psychologists-es.html","individual-es.html","group-es.html","hr-es.html"]]
for i, group in enumerate(pathway_groups):
    preorder = ("pre-order.html", "pre-order-en.html", "pre-order-es.html")[i]
    for j, name in enumerate(group):
        text = (ROOT / name).read_text(encoding="utf-8")
        for marker in ('id="directions"', 'id="resources"', 'id="other-pathways"', 'id="boundary-title"', 'pdt-pathways.css?v=1', f'href="{preorder}#interest"'):
            if marker not in text:
                ERRORS.append(f"{name}: pathway missing {marker}")
        if any(tag in text for tag in ('<form', '<input', '<textarea', 'data-shop-edition')):
            ERRORS.append(f"{name}: unexpected data collection or order functionality")
        for targets in pathway_groups:
            if f'https://pdtstorytellingcards.com/{targets[j]}' not in text:
                ERRORS.append(f"{name}: translated pathway alternate missing")
        for target in group:
            if target != name and f'href="{target}"' not in text:
                ERRORS.append(f"{name}: missing cross-pathway link {target}")

# Gallery: only existing artwork/rendering, explicit planned video status, no player.
gallery_pages = [["galleria-pdt.html","prodotto.html","pre-order.html"],["gallery-en.html","product-en.html","pre-order-en.html"],["gallery-es.html","product-es.html","pre-order-es.html"]]
for name, product, preorder in gallery_pages:
    text = (ROOT / name).read_text(encoding="utf-8")
    for marker in ('id="artwork"', 'id="sample"', 'id="videos"', 'pdt-gallery.css?v=1', 'pdt-cofanetto-signature-2026.webp', 'pdt-grafica-frontale-2026.webp', 'pdt-grafica-retro-2026.webp', f'href="{preorder}#interest"'):
        if marker not in text:
            ERRORS.append(f"{name}: gallery missing {marker}")
    if text.count('class="gallery-asset"') != 3 or text.count('class="method-card gallery-planned"') != 3 or any(tag in text for tag in ('<video', '<iframe', '<embed', '<object', '<form', '05_manuale_schede.webp', '06_mazzi_affiancati.webp')):
        ERRORS.append(f"{name}: unexpected gallery media or player")
    for target, _, _ in gallery_pages:
        if f'https://pdtstorytellingcards.com/{target}' not in text:
            ERRORS.append(f"{name}: missing translated gallery alternate")
    for source in (product, preorder):
        if f'href="{name}"' not in (ROOT / source).read_text(encoding="utf-8"):
            ERRORS.append(f"{name}: missing gallery link from {source}")

# Credibility pages: authentic profiles, project articles, no review collection or markup.
cred_pages = [["chi-siamo.html","articoli-pubblicazioni.html","prodotto.html","it"],["about-en.html","articles-en.html","product-en.html","en"],["about-es.html","articles-es.html","product-es.html","es"]]
for about, articles, product, lang in cred_pages:
    for name in (about, articles):
        text = (ROOT / name).read_text(encoding="utf-8")
        for marker in ('id="main-content"', 'id="project-articles"', 'pdt-skip-link', 'pdt-credibility.css?v=1', 'Roberto Antoniello'):
            if marker not in text:
                ERRORS.append(f"{name}: credibility content missing {marker}")
        if text.count('class="publication-card cred-article"') != 4 or any(marker in text for marker in ('<form', '<input', '<textarea', 'aggregateRating', '"@type":"Review"', '<iframe')):
            ERRORS.append(f"{name}: unexpected testimonial or publication structure")
        for stem in ["articolo-nascita-pdt","articolo-narrazione-coscienza-immagini","articolo-roland-barthes-fotografia","articolo-stili-modi-pdt"]:
            target = stem + ("" if lang == "it" else "-" + lang) + ".html"
            if f'href="{target}"' not in text:
                ERRORS.append(f"{name}: missing article link {target}")
    text = (ROOT / about).read_text(encoding="utf-8")
    if text.count('class="founder-card"') != 2 or 'id="testimonials"' not in text or 'Silvia Dierico' not in text:
        ERRORS.append(f"{about}: founders or testimonial status missing")
    if f'href="{about}#founders"' not in (ROOT / product).read_text(encoding="utf-8"):
        ERRORS.append(f"{product}: founder link missing")

# Free resources: editorial-only guide, paper checklist, glossary and local links.
resource_pages = [["risorse-pdt.html","index.html","metodo-pdt.html","articoli-pubblicazioni.html","manuale-pdt.html","esempi-pdt.html","prodotto.html"],["resources-en.html","home-en.html","method-en.html","articles-en.html","manual-en.html","examples-en.html","product-en.html"],["resources-es.html","home-es.html","method-es.html","articles-es.html","manual-es.html","examples-es.html","product-es.html"]]
for name, home, method, articles, manual, examples, product in resource_pages:
    text = (ROOT / name).read_text(encoding="utf-8")
    for marker in ('id="guide"', 'id="checklist"', 'id="glossary"', 'id="reading"', 'pdt-resources.css?v=1', 'class="resource-notice"', 'pdt-skip-link'):
        if marker not in text:
            ERRORS.append(f"{name}: resource missing {marker}")
    if text.count('class="method-card resource-guide"') != 3 or text.count('class="resource-checkmark"') != 6 or text.count('<dt>') != 6 or text.count('class="method-card resource-link"') != 4 or any(marker in text for marker in ('<form', '<input', '<textarea', '<iframe', '<object', '<embed', 'data-shop-edition', '.pdf"')):
        ERRORS.append(f"{name}: resource content or read-only boundary invalid")
    for target, *_ in resource_pages:
        if f'https://pdtstorytellingcards.com/{target}' not in text:
            ERRORS.append(f"{name}: missing translated resource alternate")
    for source in (home, method, articles, manual):
        if f'href="{name}"' not in (ROOT / source).read_text(encoding="utf-8"):
            ERRORS.append(f"{name}: missing entry from {source}")
    for target in (method, articles, manual, examples, product):
        if f'href="{target}"' not in text:
            ERRORS.append(f"{name}: missing local resource link {target}")

# SEO release candidate: canonical URLs, reciprocal language alternatives and crawlable navigation.
from html import unescape
seo_groups = [["index.html","home-en.html","home-es.html"],["prodotto.html","product-en.html","product-es.html"],["metodo-pdt.html","method-en.html","method-es.html"],["pre-order.html","pre-order-en.html","pre-order-es.html"],["risorse-pdt.html","resources-en.html","resources-es.html"],["psicologi-psicoterapeuti.html","psychologists-en.html","psychologists-es.html"],["utilizzo-individuale.html","individual-en.html","individual-es.html"],["setting-gruppo.html","group-en.html","group-es.html"],["risorse-umane.html","hr-en.html","hr-es.html"],["esempi-pdt.html","examples-en.html","examples-es.html"],["manuale-pdt.html","manual-en.html","manual-es.html"],["galleria-pdt.html","gallery-en.html","gallery-es.html"],["chi-siamo.html","about-en.html","about-es.html"],["articoli-pubblicazioni.html","articles-en.html","articles-es.html"],["contatti.html","contact-en.html","contact-es.html"],["articolo-nascita-pdt.html","articolo-nascita-pdt-en.html","articolo-nascita-pdt-es.html"],["articolo-narrazione-coscienza-immagini.html","articolo-narrazione-coscienza-immagini-en.html","articolo-narrazione-coscienza-immagini-es.html"],["articolo-roland-barthes-fotografia.html","articolo-roland-barthes-fotografia-en.html","articolo-roland-barthes-fotografia-es.html"],["articolo-stili-modi-pdt.html","articolo-stili-modi-pdt-en.html","articolo-stili-modi-pdt-es.html"],["faq.html"]]
seo_origin = "https://pdtstorytellingcards.com/"
seo_url = lambda name: seo_origin + ("" if name == "index.html" else name)
seo_languages = ("it", "en", "es")
seo_titles = set()
seo_descriptions = set()
seo_ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
seo_xml = ET.parse(ROOT / "sitemap.xml").getroot()
seo_rows = {node.findtext("s:loc", namespaces=seo_ns): node for node in seo_xml.findall("s:url", seo_ns)}
if len(seo_rows) != len(seo_xml.findall("s:url", seo_ns)) or set(seo_rows) != {seo_url(n) for group in seo_groups for n in group}:
    ERRORS.append("sitemap: duplicate or unexpected canonical URLs")
class SeoPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonicals = []
        self.alternates = {}
        self.description_text = []
        self.robots = []
        self.title_text = ""
        self.in_title = False
        self.schemas = []
        self.in_schema = False
        self.schema_text = ""
        self.lang_code = ""
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html": self.lang_code = a.get("lang", "")
        if tag == "title": self.in_title = True
        if tag == "link" and a.get("rel") == "canonical": self.canonicals.append(a.get("href"))
        if tag == "link" and a.get("rel") == "alternate" and a.get("hreflang"):
            self.alternates[a["hreflang"]] = a.get("href")
        if tag == "meta" and a.get("name") == "description": self.description_text.append(a.get("content", ""))
        if tag == "meta" and a.get("name") == "robots": self.robots.append(a.get("content", ""))
        if tag == "script" and a.get("type") == "application/ld+json": self.in_schema = True; self.schema_text = ""
    def handle_data(self, data):
        if self.in_title: self.title_text += data
        if self.in_schema: self.schema_text += data
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
        if tag == "script" and self.in_schema:
            self.in_schema = False
            try: self.schemas.append(json.loads(self.schema_text))
            except ValueError: ERRORS.append("invalid JSON-LD: " + self.title_text)
for group in seo_groups:
    expected = {seo_languages[i]: seo_url(name) for i, name in enumerate(group)}
    expected["x-default"] = seo_url(group[0])
    for i, name in enumerate(group):
        text = (ROOT / name).read_text(encoding="utf-8")
        page = SeoPage()
        page.feed(text)
        if page.canonicals != [seo_url(name)] or page.alternates != expected or page.lang_code != seo_languages[i]:
            ERRORS.append(f"{name}: canonical, reciprocal hreflang or language mismatch")
        if any("noindex" in value.lower() for value in page.robots):
            ERRORS.append(f"{name}: indexable URL has noindex")
        title = page.title_text.strip().casefold()
        desc = page.description_text[0].strip().casefold() if len(page.description_text) == 1 else ""
        if not title or title in seo_titles or not desc or desc in seo_descriptions:
            ERRORS.append(f"{name}: empty or duplicate title/description")
        seo_titles.add(title)
        seo_descriptions.add(desc)
        if not page.schemas:
            ERRORS.append(f"{name}: missing JSON-LD")
        if any(marker in text for marker in ('"@type":"Offer"', 'aggregateRating', '"@type":"Review"', 'google-site-verification')):
            ERRORS.append(f"{name}: premature commerce/review/verification metadata")
        node = seo_rows.get(seo_url(name))
        if node is None or {x.get("hreflang"): x.get("href") for x in node.findall("x:link", seo_ns)} != expected:
            ERRORS.append(f"{name}: sitemap alternate mismatch")
        resource = ("risorse-pdt.html", "resources-en.html", "resources-es.html")[i]
        menu = re.search(r'<ul class="nav-links">([\s\S]*?)</ul>', text)
        if not menu or f'href="{resource}"' not in menu.group(1) or 'class="container pdt-discovery-links"' not in text:
            ERRORS.append(f"{name}: missing localized resource navigation")
for name in ("404.html", "grazie.html", "thank-you.html", "gracias.html", "contatti-acquista.html", "privacy-policy.html", "privacy-policy-en.html", "privacy-policy-es.html"):
    page = SeoPage()
    page.feed((ROOT / name).read_text(encoding="utf-8"))
    if not any("noindex" in value.lower() for value in page.robots) or seo_url(name) in seo_rows:
        ERRORS.append(f"{name}: technical/privacy page should stay out of sitemap")
if "Sitemap: " + seo_origin + "sitemap.xml" not in (ROOT / "robots.txt").read_text(encoding="utf-8"):
    ERRORS.append("robots.txt: sitemap reference missing")

# Cumulative candidate guard: historic prices must not return to active commerce.
for name in ("index.html","home-en.html","home-es.html","pre-order.html","pre-order-en.html","pre-order-es.html","prodotto.html","product-en.html","product-es.html","pdt-shop.js","interest.js","guida-informativa.js"):
    text = (ROOT / name).read_text(encoding="utf-8")
    if re.search(r"(?:€\s*(?:159|179)\b|\b(?:159|179)\s*(?:€|EUR\b))", text, re.I):
        ERRORS.append(f"{name}: obsolete launch price")
for stem in ("articolo-nascita-pdt","articolo-narrazione-coscienza-immagini","articolo-roland-barthes-fotografia","articolo-stili-modi-pdt"):
    for suffix in ("","-en","-es"):
        name = stem + suffix + ".html"
        if 'class="article-editorial-note"' not in (ROOT / name).read_text(encoding="utf-8"):
            ERRORS.append(f"{name}: editorial context missing")
# The legal approval register remains explicitly open; this is not a deploy gate.
print(f"Checked {len(pages)} HTML pages, {len(locations) if 'locations' in globals() else 0} sitemap URLs, all local assets and 2 edition purchase-enquiry panels.")
if ERRORS:
    for item in ERRORS: print("FAIL:", item)
    sys.exit(1)
print("PASS: static site checks")
