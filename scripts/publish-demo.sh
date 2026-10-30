#!/bin/sh
# Publishes the live demo (sample data, demo mode on) to the gh-pages branch.
# GitHub Pages serves that branch. Run from the project folder: sh scripts/publish-demo.sh
set -e
tmp=$(mktemp -d)
cp -R public/. "$tmp"
sed -i.bak 's/demoMode: false/demoMode: true/' "$tmp/brand.js" && rm "$tmp/brand.js.bak"
touch "$tmp/.nojekyll"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Publish demo"
git push -f "$(cd - >/dev/null && git remote get-url origin)" gh-pages
rm -rf "$tmp"
