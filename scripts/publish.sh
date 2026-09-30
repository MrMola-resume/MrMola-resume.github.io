#!/bin/sh
# Build the site and commit the output to the root of `main`, which GitHub Pages serves
# ("Deploy from a branch"). The Astro source lives on `source`.
#
# Run by .github/workflows/deploy.yml on every push to `source`. If Actions can't push, run
# it locally instead with `npm run deploy`. DRY_RUN=1 makes the commit but skips the push.
set -eu

root=$(pwd)
rev=$(git rev-parse --short HEAD)

npm run build
# Without this, Pages runs Jekyll, which drops folders starting with `_` (Astro's _astro/).
touch dist/.nojekyll

tmp=$(mktemp -d)
git fetch --quiet origin main
git worktree add --quiet --detach "$tmp" origin/main
trap 'git worktree remove --force "$tmp"' EXIT

cd "$tmp"
git rm -rq --ignore-unmatch .
cp -R "$root/dist/." .
git add -A
if git diff --cached --quiet; then
  echo "Nothing to publish: main already matches this build."
  exit 0
fi
git commit --quiet -m "Publish site from source@$rev"
if [ "${DRY_RUN:-}" = 1 ]; then
  echo "DRY_RUN: committed $(git rev-parse --short HEAD) on a detached main; not pushing."
  git show --stat --oneline HEAD | head -20
else
  git push --quiet origin HEAD:main
  echo "Published source@$rev to main."
fi
