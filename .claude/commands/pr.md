### `.claude/commands/pr.md`
```markdown
---
allowed-tools: all
description: Prepare current branch for pull request
---

# Prepare Pull Request

Prepare the current feature branch for a pull request by:
1. Squashing checkpoint commits into meaningful commits
2. Running all checks
3. Pushing to origin
4. Providing PR creation instructions

Execute comprehensive PR preparation:

```bash
#!/bin/bash

# Check we're not on main/master
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]; then
    echo "❌ Cannot create PR from $CURRENT_BRANCH branch"
    exit 1
fi

echo "🔧 Preparing branch $CURRENT_BRANCH for pull request..."

# Step 1: Squash checkpoint commits
CHECKPOINT_COUNT=$(git log --oneline origin/$CURRENT_BRANCH..HEAD | grep "checkpoint:" | wc -l)
if [ "$CHECKPOINT_COUNT" -gt 0 ]; then
    echo "📦 Found $CHECKPOINT_COUNT checkpoint commits to squash..."
    
    # Interactive rebase to squash
    echo "Opening interactive rebase. Squash checkpoint commits into meaningful commits."
    git rebase -i origin/$CURRENT_BRANCH
fi

# Step 2: Run all checks
echo "🧪 Running all checks..."
if command -v npm &> /dev/null && [ -f package.json ]; then
    npm run lint
    npm test
elif command -v cargo &> /dev/null && [ -f Cargo.toml ]; then
    cargo fmt --check
    cargo clippy
    cargo test
elif command -v pytest &> /dev/null && [ -f pyproject.toml ]; then
    black --check .
    pytest
fi

# Step 3: Push to origin
echo "📤 Pushing changes to origin..."
git push --force-with-lease origin $CURRENT_BRANCH

# Step 4: Generate PR info
echo "✅ Branch is ready for pull request!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Git hosting platform (GitHub/GitLab/etc)"
echo "2. Create a new pull request from '$CURRENT_BRANCH' to 'main'"
echo "3. Use this template for your PR description:"
echo ""
echo "---PR TEMPLATE---"
echo "## Summary"
echo "[Brief description of changes]"
echo ""
echo "## Changes"
echo "$(git log --oneline origin/$CURRENT_BRANCH..HEAD | grep -v "checkpoint:" | sed 's/^/- /')"
echo ""
echo "## Testing"
echo "- [ ] All tests pass"
echo "- [ ] Linting passes"
echo "- [ ] Manual testing completed"
echo ""
echo "## Related Issues"
echo "Closes #[issue-number]"
echo "---END TEMPLATE---"