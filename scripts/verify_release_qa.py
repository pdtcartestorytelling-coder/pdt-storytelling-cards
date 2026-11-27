#!/usr/bin/env python3
"""Assert the QA web tree has not changed and contains no internal files."""
import hashlib, json, sys
from pathlib import Path
out=Path(sys.argv[1]).resolve()
web=out/"web"
report=json.loads((out/"qa-manifest.json").read_text(encoding="utf-8"))
assert report["status"]=="QA_ONLY_NO_GO"
expected={r["path"]:r for r in report["inventory"]}
actual={p.relative_to(web).as_posix():p for p in web.rglob("*") if p.is_file()}
assert set(actual)==set(expected), "file set changed during QA"
for name,p in actual.items():
    assert not p.is_symlink(), name
    data=p.read_bytes()
    assert len(data)==expected[name]["size"] and hashlib.sha256(data).hexdigest()==expected[name]["sha256"], name
assert not any(n.startswith(("scripts/",".github/")) or n.endswith((".html.txt",".md")) for n in actual)
assert {n for n in actual if n.startswith("docs/")}=={"docs/commercial/PdT_Signature_Scheda_tecnica_rev01.pdf"}
assert all(v=="OPEN" for v in report["gates"].values())
print("PASS: isolated QA tree unchanged, exact file set and SHA-256 verified; NO-GO")
