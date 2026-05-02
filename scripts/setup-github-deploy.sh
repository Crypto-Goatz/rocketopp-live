#!/usr/bin/env bash
#
# setup-github-deploy.sh — Convert one Vercel project to GitHub-Actions builds.
#
# Usage:
#   bash scripts/setup-github-deploy.sh <github-owner/repo> <vercel-project-id>
#
# Example:
#   bash scripts/setup-github-deploy.sh Crypto-Goatz/onork-app prj_OJ0gi5HItdtUmQYclXirYk1BSJnt
#
# What it does:
#   1. Drops .github/workflows/deploy.yml into the repo (if missing).
#   2. Sets the 3 required GitHub repo secrets (VERCEL_TOKEN, ORG_ID, PROJECT_ID).
#   3. Patches vercel.json to disable git auto-deploys for main.
#   4. Pushes the changes.
#
# After this runs, every push to main will:
#   - Build on GitHub Actions (free for public, generous for private).
#   - Upload pre-built artifacts to Vercel via `vercel deploy --prebuilt`.
#   - Vercel charges ZERO build minutes — just hosts + serves.

set -euo pipefail

REPO="${1:?'Usage: setup-github-deploy.sh <owner/repo> <vercel-project-id>'}"
PROJECT_ID="${2:?'Need vercel project id (prj_...)'}"

VERCEL_TOKEN="${VERCEL_TOKEN:-cQHHaQsoyRBOchZmcSLqf4YK}"
VERCEL_ORG_ID="${VERCEL_ORG_ID:-team_VtbfSzhDgB6OwglLfuPDFcd2}"

echo "→ Setting GitHub secrets on $REPO"
echo "$VERCEL_TOKEN"   | gh secret set VERCEL_TOKEN      -R "$REPO"
echo "$VERCEL_ORG_ID"  | gh secret set VERCEL_ORG_ID     -R "$REPO"
echo "$PROJECT_ID"     | gh secret set VERCEL_PROJECT_ID -R "$REPO"

echo
echo "→ Cloning to a temp dir (so we don't disturb your local checkout)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
gh repo clone "$REPO" "$TMP/repo" -- --depth 1 --quiet
cd "$TMP/repo"

mkdir -p .github/workflows

echo "→ Writing .github/workflows/deploy.yml"
cat > .github/workflows/deploy.yml <<'YAML'
name: Deploy to Vercel (zero build minutes)

# Build runs entirely on GitHub Actions runners. Vercel only hosts the
# pre-built artifacts (vercel deploy --prebuilt), so Vercel build minutes
# are NOT consumed.

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: vercel-prod-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      VERCEL_ORG_ID:     ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel project config + env
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Install dependencies
        run: npm install --legacy-peer-deps --no-audit --no-fund

      - name: Build with Vercel CLI
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy pre-built artifacts to Vercel
        id: deploy
        run: |
          DEPLOY_URL=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$DEPLOY_URL" >> "$GITHUB_OUTPUT"
          echo "Deployed to: $DEPLOY_URL"

      - name: Summary
        run: |
          echo "### ✅ Deployed (zero Vercel build minutes used)" >> "$GITHUB_STEP_SUMMARY"
          echo "URL: ${{ steps.deploy.outputs.url }}"             >> "$GITHUB_STEP_SUMMARY"
          echo "Commit: \`${{ github.sha }}\`"                    >> "$GITHUB_STEP_SUMMARY"
YAML

echo "→ Patching vercel.json (disable git auto-deploys for main)"
if [ -f vercel.json ]; then
  python3 - <<PY
import json, sys, pathlib
p = pathlib.Path("vercel.json")
data = json.loads(p.read_text())
data.setdefault("\$schema", "https://openapi.vercel.sh/vercel.json")
data["git"] = {"deploymentEnabled": {"main": False}}
p.write_text(json.dumps(data, indent=2) + "\n")
print(" wrote vercel.json")
PY
else
  cat > vercel.json <<'JSON'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": {
      "main": false
    }
  }
}
JSON
  echo " created vercel.json"
fi

echo "→ Committing + pushing"
git add .github/workflows/deploy.yml vercel.json
git -c user.email=mike@rocketopp.com -c user.name="RocketOpp" \
  commit -m "ci: GitHub-Actions deploys (zero Vercel build minutes)

Builds run on GitHub Actions runners. vercel deploy --prebuilt uploads
artifacts only — Vercel charges no build minutes."
git push origin main

echo
echo "✓ Done. Watch the run at:"
echo "  https://github.com/$REPO/actions"
echo
echo "Future pushes to main on $REPO will:"
echo "  1. Build on GitHub Actions (free)"
echo "  2. Upload to Vercel (no build minutes)"
echo "  3. Promote to production"
