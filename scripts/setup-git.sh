#!/bin/sh
# One-time git setup for every machine that works on this repo (runs automatically on `npm install`).
# Protects against overwriting each other's work when two machines commit to main:
#   - hooks in .githooks: no commits with conflict markers or broken JSON, no push over commits you have not pulled
#   - a key-by-key merge for the translation dictionaries (src/i18n/*.json), see scripts/git/merge-i18n.mjs
#   - pull with rebase and auto-stash, so `git pull` replays your commits on top of the other machine's
git rev-parse --git-dir >/dev/null 2>&1 || exit 0   # not a git checkout (e.g. a hosting build): nothing to do

git config core.hooksPath .githooks
git config merge.i18n-json.name "WISE translation dictionaries: merge by key"
git config merge.i18n-json.driver "node scripts/git/merge-i18n.mjs %O %A %B"
git config pull.rebase true
git config rebase.autoStash true
git config fetch.prune true
chmod +x .githooks/* scripts/git/*.mjs 2>/dev/null
echo "git setup: hooks and translation merge driver installed"
