#!/usr/bin/env python3
"""Patch the TanStack Start entry JS for static SPA deployment."""
import glob, re, sys

entry_files = glob.glob("dist/assets/index-*.js")
if not entry_files:
    sys.exit("No entry JS found")

path = entry_files[0]
with open(path, "r") as f:
    content = f.read()

# 1. Replace any .hydrateRoot(document, with .createRoot(document.getElementById("root"),
content = re.sub(
    r'(\.\w+)\.hydrateRoot\(document,',
    r'\1.createRoot(document.getElementById("root"),',
    content
)

# 2. Find and replace the async init function that calls lm()/cm() and Oc.getOptions()
# Pattern: async function X(){let e=await Y(),t;if(Oc){...}else ...;return t.push(ds),...;return e}
# We need to find: async function NAME(){let e=await PARENT(),...return e}
m = re.search(r'async function (\w+)\(\)\{let e=await \w+\(\),t;if\(Oc\)', content)
if m:
    name = m.group(1)
    start = m.start()
    # Find the end: look for the next 'var' or 'async function' or export after this function
    # The function ends with 'return e}'
    end_pattern = re.search(r'return e\}', content[start:])
    if end_pattern:
        end_idx = start + end_pattern.end()
        new_fn = (
            f'async function {name}(){{'
            'let e=await cm();'
            'window.__TSS_START_OPTIONS__={serializationAdapters:[]};'
            'e.update({basepath:``,serializationAdapters:[]});'
            'e.stores.matchesId.get().length||await ms(e);'
            'return e}'
        )
        content = content[:start] + new_fn + content[end_idx:]
        print(f"Patched {name}() function")
    else:
        print("WARNING: Could not find return e}")
else:
    # Fallback: find any function with Oc.getOptions
    m2 = re.search(r'if\(Oc\)\{let n=await Oc\.getOptions\(\)', content)
    if m2:
        # Replace the if(Oc) block with a simpler version
        content = re.sub(
            r'if\(Oc\)\{let n=await Oc\.getOptions\(\);n\.serializationAdapters=n\.serializationAdapters\?\?\[\],window\.__TSS_START_OPTIONS__=n,t=n\.serializationAdapters,e\.options\.defaultSsr=n\.defaultSsr\}else t=\[\],window\.__TSS_START_OPTIONS__=\{serializationAdapters:t\};',
            'window.__TSS_START_OPTIONS__={serializationAdapters:[]};',
            content
        )
        print("Patched Oc.getOptions block (fallback)")
    else:
        print("WARNING: Could not find init function or Oc block")

with open(path, "w") as f:
    f.write(content)

# Verify
with open(path, "r") as f:
    c = f.read()

print(f"hydrateRoot calls: {c.count('.hydrateRoot')}")
print(f"createRoot calls: {c.count('.createRoot')}")
print(f"Oc.getOptions: {c.count('Oc.getOptions')}")
