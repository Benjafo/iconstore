### `.claude/commands/sync.md`
```markdown
---
allowed-tools: all
description: Sync feature branch with main/master
---

# Sync with Main

Keep your feature branch up to date with the latest changes from main/master.

Execute branch synchronization:

```bash
#!/bin/bash

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
MAIN_BRANCH="main"

# Check if main exists, otherwise use master
if ! git show-ref --verify --quiet refs/heads/main; then
    MAIN_BRANCH="master"
fi

if [[ "$CURRENT_BRANCH" == "$MAIN_BRANCH" ]]; then
    echo "📍 Already on $MAIN_BRANCH branch"
    git pull origin $MAIN_BRANCH
    exit 0
fi

echo "🔄 Syncing $CURRENT_BRANCH with $MAIN_BRANCH..."

# Stash any uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 Stashing uncommitted changes..."
    git stash
    STASHED=true
fi

# Fetch latest changes
git fetch origin

# Merge or rebase with main
echo "Choose sync method:"
echo "1) Merge (preserves all commits)"
echo "2) Rebase (creates linear history)"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        git merge origin/$MAIN_BRANCH
        ;;
    2)
        git rebase origin/$MAIN_BRANCH
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Pop stash if we stashed
if [ "$STASHED" = true ]; then
    echo "📤 Restoring stashed changes..."
    git stash pop
fi

echo "✅ Successfully synced with $MAIN_BRANCH"