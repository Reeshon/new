#!/bin/bash

# Set up logging
exec 1> >(tee "deploy_log.txt")
exec 2>&1

echo "=== Starting deployment $(date) ==="

# Store current directory and branch
REPO_PATH="C:/Users/reesh/OneDrive/Desktop/new"
echo "Changing to repository directory: $REPO_PATH"
cd "$REPO_PATH" || { echo "Failed to change directory"; exit 1; }

# Save current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

# Force checkout main and pull latest changes
echo "Force checking out main and pulling latest changes..."
git checkout -f main && git pull origin main

# Delete existing gh-pages branch if it exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "Deleting existing gh-pages branch..."
    git branch -D gh-pages
fi

# Create a new orphan gh-pages branch
echo "Creating orphan gh-pages branch..."
git checkout --orphan gh-pages || { echo "Failed to create gh-pages branch"; exit 1; }

# Remove all tracked files from the index and working tree
git rm -rf . 2>/dev/null

# Add website files from current directory
echo "Adding website files..."
git add -f .

echo "Committing changes..."
git commit -m "Deploy to gh-pages" || echo "Nothing to commit."

echo "Force pushing to GitHub..."
git push origin gh-pages --force || { echo "Failed to push gh-pages branch"; exit 1; }

echo "Switching back to original branch: $CURRENT_BRANCH"
git checkout -f "$CURRENT_BRANCH"

echo "Deployment complete! Check https://reeshon.github.io/new"
echo "=== Deployment finished $(date) ==="
echo "Check deploy_log.txt for the complete log"
echo "Press Ctrl+C to exit"
sleep 3600  # Keep terminal open for 1 hour
