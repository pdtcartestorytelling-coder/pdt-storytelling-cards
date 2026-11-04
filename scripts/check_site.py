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

for name in ("pre-order.html", "pre-order-en.html", "pre-order-es.html"):
    text = (ROOT / name).read_text(encoding="utf-8")
    for edition in ("essential", "studio", "signature"):
        for fmt in ("webp", "avif"):
            asset = f"images/pdt-{edition}-hq.{fmt}"
            if asset not in text:
                ERRORS.append(f"{name}: missing {edition} {fmt} edition image")
    for edition in ("Essential", "Studio", "Signature"):
        if f"PdT {edition}" not in text:
            ERRORS.append(f"{name}: missing edition {edition}")
    studio_section = text.split("02 / PdT Studio", 1)[-1].split("03 / PdT Signature", 1)[0]
    required = {
        "pre-order.html": "22 schede operative stampate",
        "pre-order-en.html": "22 printed activity sheets",
        "pre-order-es.html": "22 fichas operativas impresas",
    }
    if required[name] not in studio_section:
        ERRORS.append(f"{name}: Studio must include printed activity sheets")
for edition in ("essential", "studio", "signature"):
    for fmt in ("webp", "avif"):
        file = ROOT / f"images/pdt-{edition}-hq.{fmt}"
        if not file.exists() or file.stat().st_size < 20000:
            ERRORS.append(f"{file.name}: missing or too small to be a full-size render")
css = (ROOT / "preorder.css").read_text(encoding="utf-8")
if ".pdt-tier-visual.pdt-edition-image{height:auto;aspect-ratio:4/3;" not in css:
    ERRORS.append("preorder.css: dedicated image card style missing")

print(f"Checked {len(pages)} HTML pages, {len(locations) if 'locations' in globals() else 0} sitemap URLs, all local assets and 3 edition panels.")
if ERRORS:
    for item in ERRORS: print("FAIL:", item)
    sys.exit(1)
print("PASS: static site checks")
