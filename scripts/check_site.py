#!/usr/bin/env python3
"""Static checks for GitHub Pages; uses only Python standard library."""
from __future__ import annotations
import json
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
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
candidate_assets = {"style.css":22, "script.js":12, "pdt-motion.css":10,
                    "interest.js":14, "pdt-shop.css":7, "pdt-shop.js":5,
                    "guida-informativa.js":6}
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
    if 'preorder.css?v=22' not in text:
        ERRORS.append(f"{name}: latest gallery style missing")
    if '<strong>149 €</strong><span class="pdt-future-price">' not in text or '199' not in text or '<del class="pdt-compare-price">' in text:
        ERRORS.append(f"{name}: expected prominent pre-order 149 vs planned list 199")
    if re.search(r'(?<!\d)(?:189|99)\s*€|€\s*(?:189|99)\b', text) or 'Essential' in text or 'essential' in text:
        ERRORS.append(f"{name}: obsolete price or Essential marketing text remains")
    if 'pdt-shop.js?v=5' not in text or 'pdt-shop.css?v=7' not in text or 'interest.js?v=14' not in text:
        ERRORS.append(f"{name}: current Signature sales assets missing")
    if 'pdt-motion.js?v=8' not in text or 'pdt-motion.css?v=10' not in text:
        ERRORS.append(f"{name}: motion assets missing")

for name in ("index.html", "home-en.html", "home-es.html"):
    text = (ROOT / name).read_text(encoding="utf-8")
    if text.count('class="pdt-h-edition"') != 1:
        ERRORS.append(f"{name}: expected exactly one Signature card")
    if '<span class="pdt-future-price">' not in text or 'pdt-current-price' not in text or '<del class="pdt-compare-price">' in text:
        ERRORS.append(f"{name}: pre-order versus planned list price is not shown")
    if re.search(r'(?<!\d)(?:189|99)\s*€|€\s*(?:189|99)\b', text) or "Essential" in text or "essential" in text:
        ERRORS.append(f"{name}: outdated prices or Essential remain")
    if 'pdt-shop.css?v=7' not in text or 'pdt-shop.js?v=5' not in text:
        ERRORS.append(f"{name}: updated Signature-only sales styles or script missing")
    if 'pdt-motion.js?v=8' not in text or 'pdt-motion.css?v=10' not in text:
        ERRORS.append(f"{name}: motion assets missing")
    if 'data-shop-edition="essential"' in text:
        ERRORS.append(f"{name}: Essential is still selectable")

# The first screen must provide direct one-click links, not hidden accordions.
for name in ("index.html", "home-en.html", "home-es.html"):
    text = (ROOT / name).read_text(encoding="utf-8")
    for target in ("utilizzo-individuale.html", "setting-gruppo.html", "risorse-umane.html"):
        if f'<a class="pdt-first-action-link" href="{target}"' not in text:
            ERRORS.append(f"{name}: missing direct context link to {target}")
    if 'pdt-first-action-option' in text or 'pdt-first-action-answer' in text:
        ERRORS.append(f"{name}: obsolete context accordion still present")
    if 'pdt-first-action.css?v=5' not in text:
        ERRORS.append(f"{name}: updated direct-link styles missing")
    if name != "index.html" and text.count('hreflang="it"') < 3:
        ERRORS.append(f"{name}: Italian-only context destinations should be marked")
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

print(f"Checked {len(pages)} HTML pages, {len(locations) if 'locations' in globals() else 0} sitemap URLs, all local assets and 2 edition purchase-enquiry panels.")
if ERRORS:
    for item in ERRORS: print("FAIL:", item)
    sys.exit(1)
print("PASS: static site checks")
