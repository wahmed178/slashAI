#!/usr/bin/env python3
"""
Post-process the built entry JS for static SPA mode:
1. Replace hydrateRoot(document, ...) → createRoot(document.getElementById("root"), ...)
2. Wrap getOptions() calls in try/catch so server adapter code doesn't crash
"""
import glob, re, sys

files = glob.glob("dist/assets/index-*.js")
if not files:
    print("WARNING: No entry JS found")
    sys.exit(0)

for fpath in files:
    with open(fpath, "r") as f:
        content = f.read()

    original = content

    # 1. Replace (0,XX.hydrateRoot)(document, with (0,XX.createRoot)(document.getElementById("root"),)
    def fix_hydrate(m):
        full = m.group(0)
        return full.replace('.hydrateRoot', '.createRoot').replace('(document,', '(document.getElementById("root"),')

    content = re.sub(
        r'\(0,\w+\.hydrateRoot\)\(document,',
        fix_hydrate,
        content
    )

    # 2. Replace any remaining hydrateRoot property assignments/definitions
    # These are server adapter polyfills that crash without a backend.
    # Replace .hydrateRoot=function(e,t,n){...} with a no-op
    content = re.sub(
        r'\.hydrateRoot=function\([^)]*\)\{[^}]*\}',
        '.hydrateRoot=function(){return null}',
        content
    )

    # 3. Wrap server-adapter getOptions() in try/catch
    def wrap_get_options(m):
        var_name = m.group(1)
        replacement = "(await (function(){try{return " + var_name + ".getOptions()}catch{return{}}})())"
        return replacement

    content = re.sub(
        r'await (\w+)\.getOptions\(\)',
        wrap_get_options,
        content
    )

    if content != original:
        with open(fpath, "w") as f:
            f.write(content)
        print("Patched " + fpath)
    else:
        print("No changes needed in " + fpath)

# Verify results
for fpath in files:
    with open(fpath, "r") as f:
        content = f.read()
    hr = content.count("hydrateRoot")
    cr = content.count("createRoot")
    print("hydrateRoot: " + str(hr) + ", createRoot: " + str(cr))
