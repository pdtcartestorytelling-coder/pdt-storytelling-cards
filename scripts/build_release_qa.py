#!/usr/bin/env python3
"""Build a local QA-only web tree. No production/export/deploy mode."""
from pathlib import Path, PurePosixPath
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import argparse, hashlib, json, re, shutil, subprocess, sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "scripts/release-qa-allowlist.json"
PDF = "docs/commercial/PdT_Signature_Scheda_tecnica_rev01.pdf"
DOMAIN = "pdtstorytellingcards.com"
GATES = {f"A{i:02d}" for i in range(1, 15)}

def fail(message):
    raise SystemExit("FAIL QA package: " + message)

def safe_source(name):
    rel = PurePosixPath(name)
    if rel.is_absolute() or ".." in rel.parts or str(rel) != name or "\\" in name:
        fail("invalid path " + name)
    p = ROOT.joinpath(*rel.parts)
    if not p.is_file() or any(q.is_symlink() for q in (p, *p.parents) if q != ROOT and ROOT in q.parents):
        fail("missing file or symlink: " + name)
    return p

def allowed(name):
    p = PurePosixPath(name)
    if name in {"CNAME", "robots.txt", ".well-known/security.txt", PDF}:
        return True
    if len(p.parts) == 1 and p.suffix in {".html",".css",".js",".png",".ico",".webmanifest",".xml"} and not name.startswith("."):
        return True
    return len(p.parts) == 2 and p.parts[0] == "images" and p.suffix in {".webp",".avif",".png",".jpg",".svg"}

class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for key in ("href","src","poster","action","data-src"):
            if a.get(key):
                self.refs.append(a[key])
        if a.get("srcset"):
            self.refs.extend(part.strip().split()[0] for part in a["srcset"].split(",") if part.strip())
        if tag == "meta" and a.get("property") in {"og:image","og:url"} and a.get("content"):
            self.refs.append(a["content"])

def local_ref(source, value):
    value = value.strip()
    if not value or value.startswith("#") or value.lower().startswith(("data:","mailto:","tel:","javascript:")):
        return None
    u = urlsplit(value)
    if u.netloc and u.hostname not in {DOMAIN, "www."+DOMAIN}:
        return None
    if u.scheme and u.scheme not in {"http","https"}:
        return None
    path = unquote(u.path)
    if not path:
        return "index.html" if u.netloc else None
    if path.startswith("/") or u.netloc:
        path = path.lstrip("/")
    else:
        path = str(PurePosixPath(source).parent / path)
    if path.endswith("/") or not path:
        path += "index.html"
    parts = PurePosixPath(path).parts
    if ".." in parts or "\\" in path:
        fail("unexpected path traversal reference in " + source)
    return str(PurePosixPath(path))

def verify_references(web, selected):
    for name in sorted(selected):
        p = web / name
        refs = []
        if p.suffix == ".html":
            parser = Links()
            parser.feed(p.read_text(encoding="utf-8"))
            refs.extend(parser.refs)
        elif p.suffix == ".css":
            text = p.read_text(encoding="utf-8")
            refs.extend(m.group(1).strip().strip("'\"") for m in re.finditer(r"url\(\s*([^)]*?)\s*\)", text, re.I))
            refs.extend(m.group(1) for m in re.finditer(r"@import\s+['\"]([^'\"]+)['\"]", text, re.I))
        elif p.suffix == ".webmanifest":
            refs.extend(x["src"] for x in json.loads(p.read_text(encoding="utf-8")).get("icons", []))
        elif name == "sitemap.xml":
            for node in ET.parse(p).getroot().iter():
                if node.tag.endswith("}loc"):
                    refs.append(node.text or "")
                elif node.tag.endswith("}link") and node.get("href"):
                    refs.append(node.get("href"))
        for raw in refs:
            target = local_ref(name, raw)
            if target and target not in selected:
                fail(f"{name}: dependency not allowed or missing: {target}")

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True, help="new directory outside repository; web/ is QA ONLY")
    args = parser.parse_args()
    out = args.out.resolve()
    if out == ROOT or ROOT in out.parents or out in ROOT.parents or out.exists():
        fail("output must be a new directory outside the repository")
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    if config["mode"] != "QA_ONLY_NO_DEPLOY" or set(config["gates"]) != GATES or set(config["gates"].values()) != {"OPEN"}:
        fail("this builder only supports the unapproved QA snapshot; do not use for production")
    fixed, images = config["fixed"], config["eligible_images"]
    if len(set(fixed + images)) != len(fixed + images):
        fail("duplicate allowlist entry")
    for name in fixed + images:
        if not allowed(name):
            fail("disallowed entry " + name)
        safe_source(name)
    # Explicit set of root HTML pages. New pages require an intentional manifest change.
    if {p.name for p in ROOT.glob("*.html")} != {n for n in fixed if n.endswith(".html")}:
        fail("root HTML inventory changed: review allowlist")
    # Only known asset names appearing in web HTML/CSS/JS/manifest are copied.
    text = "\n".join(safe_source(n).read_text(encoding="utf-8") for n in fixed if PurePosixPath(n).suffix in {".html",".css",".js",".webmanifest"})
    selected = set(fixed) | {n for n in images if n in text}
    if not set(config["qa_only"]).issubset(selected):
        fail("missing QA-only dependency")
    web = out / "web"
    web.mkdir(parents=True, exist_ok=False)
    rows = []
    for name in sorted(selected):
        source = safe_source(name)
        dest = web / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, dest)
        data = dest.read_bytes()
        rows.append({"path":name,"size":len(data),"sha256":hashlib.sha256(data).hexdigest(),"qa_only":name in config["qa_only"]})
    verify_references(web, selected)
    actual = {p.relative_to(web).as_posix() for p in web.rglob("*") if p.is_file()}
    if actual != selected:
        fail("unexpected files in web tree")
    if any(n.startswith(("docs/","scripts/",".github/")) and n != PDF for n in actual):
        fail("internal file in web tree")
    if any(n.endswith(".html.txt") or n.endswith(".md") for n in actual):
        fail("draft or markdown in web tree")
    tracked = subprocess.check_output(["git","-C",str(ROOT),"ls-files","-z"], text=True).split("\0")
    sha = subprocess.check_output(["git","-C",str(ROOT),"rev-parse","HEAD"],text=True).strip()
    report = {"status":"QA_ONLY_NO_GO","source_sha":sha,"files":len(rows),"html":sum(r["path"].endswith(".html") for r in rows),"bytes":sum(r["size"] for r in rows),"inventory":rows,"excluded_tracked_paths":sorted(set(tracked)-selected-{""}),"gates":config["gates"],"warning":"Not a production artifact. Old privacy, unapproved claims, images and preliminary PDF require approval. No deploy mode."}
    (out / "qa-manifest.json").write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(f"PASS QA-only package: {report['files']} files, {report['html']} HTML, {report['bytes']} bytes; NO-GO; {len(report['excluded_tracked_paths'])} tracked paths excluded")
    print("NO deployment, no ZIP/web artifact uploaded. Manifest outside web tree.")

if __name__ == "__main__":
    main()
