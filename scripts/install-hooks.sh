#!/usr/bin/env bash
# Point this clone at the in-repo .githooks directory so pre-commit
# (and any future hooks) fire on every commit. Run once per checkout.
set -euo pipefail
cd "$(dirname "$0")/.."
git config core.hooksPath .githooks
chmod +x .githooks/*
echo "Hooks wired: $(git config core.hooksPath)"
