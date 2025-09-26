#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/home/tunapro/probot-blocks"
BRANCH="stable"
PROJECT_USER="tunapro"

run_as_project_user() {
	sudo -u "$PROJECT_USER" -H bash -lc "$*"
}

# Ensure repo exists
if [ ! -d "$REPO_DIR/.git" ]; then
	echo "Git repo not found at $REPO_DIR" >&2
	exit 1
fi

# Fetch and compare
run_as_project_user "cd '$REPO_DIR' && git fetch origin '$BRANCH' --quiet"
LOCAL_SHA=$(run_as_project_user "cd '$REPO_DIR' && git rev-parse HEAD")
REMOTE_SHA=$(run_as_project_user "cd '$REPO_DIR' && git rev-parse origin/'$BRANCH'")

if [ "$LOCAL_SHA" = "$REMOTE_SHA" ]; then
	echo "No updates on $BRANCH (local=$LOCAL_SHA)"
	exit 0
fi

echo "Updating $BRANCH: $LOCAL_SHA -> $REMOTE_SHA"
run_as_project_user "cd '$REPO_DIR' && git reset --hard '$REMOTE_SHA' --quiet"

# Build as project user (keeps node_modules owned by user)
echo "Running npm ci && npm run build as $PROJECT_USER"
run_as_project_user "cd '$REPO_DIR' && npm ci && npm run build"

# Deploy (skip build since we already built)
echo "Deploying..."
sudo bash "$REPO_DIR/setup/deploy.sh" --skip-build

echo "Auto-update completed successfully." 