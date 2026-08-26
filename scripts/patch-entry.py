#!/usr/bin/env python3
"""Patch the TanStack Start entry JS for static SPA deployment."""
import glob, re, sys

entry_files = glob.glob("dist/assets/index-*.js")
if not entry_files:
    sys.exit("No entry JS found")

path = entry_files[0]
with open(path, "r") as f:
    content = f.read()

# 1. Replace hydrateRoot(document, with createRoot(document.getElementById("root"),
content = content.replace(
    "(0,mm.hydrateRoot)(document,",
    '(0,mm.createRoot)(document.getElementById("root"),'
)

# 2. Replace the lm() function to skip server adapter
old_lm = re.search(
    r"async function lm\(\)\{.*?\}var um=lm", content
)
if old_lm:
    new_lm = (
        "async function lm(){"
        "let e=await cm();"
        "window.__TSS_START_OPTIONS__={serializationAdapters:[]};"
        "e.update({basepath:``,serializationAdapters:[]});"
        "e.stores.matchesId.get().length||await ms(e);"
        "return e}"
        "var um=lm"
    )
    content = content[:old_lm.start()] + new_lm + content[old_lm.end():]
    print("Patched lm() function")
else:
    print("WARNING: Could not find lm() function")

with open(path, "w") as f:
    f.write(content)

# Verify
with open(path, "r") as f:
    c = f.read()

print(f"hydrateRoot call sites: {c.count('mm.hydrateRoot')}")
print(f"Oc.getOptions: {c.count('Oc.getOptions')}")
print(f"createRoot(document.getElementById: {c.count('createRoot(document.getElementById')}")
