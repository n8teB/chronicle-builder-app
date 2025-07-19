#!/bin/bash

# Chronicle Builder - GitHub Repository Setup Script
# Run this script to set up your GitHub repository and automated builds

echo "🚀 Chronicle Builder - GitHub Setup"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

echo "✅ Git repository detected"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI not found. Install from: https://cli.github.com/"
    echo "   Or create repository manually at: https://github.com/new"
    echo ""
fi

echo "📋 Next steps:"
echo ""
echo "1️⃣  Create GitHub Repository:"
echo "   Option A (with GitHub CLI):"
echo "     gh repo create chronicle-builder --public --description 'Chronicle Builder - Your Story Workspace'"
echo ""
echo "   Option B (manually):"
echo "     - Go to: https://github.com/new"
echo "     - Repository name: chronicle-builder"
echo "     - Description: Chronicle Builder - Your Story Workspace"
echo "     - Set to Public"
echo "     - Don't initialize with README"
echo ""

echo "2️⃣  Add Remote and Push:"
echo "     git remote add origin https://github.com/YOUR_USERNAME/chronicle-builder.git"
echo "     git branch -M main"
echo "     git add ."
echo "     git commit -m 'Initial commit: Chronicle Builder with automated builds'"
echo "     git push -u origin main"
echo ""

echo "3️⃣  Test Automated Builds:"
echo "     git tag v1.0.0"
echo "     git push origin v1.0.0"
echo ""

echo "4️⃣  Check Results:"
echo "     - Go to your GitHub repository"
echo "     - Click 'Actions' tab"
echo "     - Wait for builds to complete"
echo "     - Download installers from 'Artifacts'"
echo ""

echo "🔗 Useful Files Created:"
echo "   ✅ .github/workflows/build.yml - Automated builds"
echo "   ✅ README.md - Project documentation"
echo "   ✅ GITHUB_SETUP.md - Detailed setup guide"
echo "   ✅ .gitignore - Proper file exclusions"
echo ""

echo "🎯 Repository Features:"
echo "   ✅ Automated builds for Windows, macOS, Linux"
echo "   ✅ Release creation with installers"
echo "   ✅ Professional project structure"
echo "   ✅ Comprehensive documentation"
echo ""

echo "⚡ Quick Commands:"
echo "   Test build:     git add . && git commit -m 'test' && git push"
echo "   Create release: git tag v1.0.1 && git push origin v1.0.1"
echo "   View status:    gh run list (if GitHub CLI installed)"
echo ""

echo "🎉 Ready to create your repository!"
echo "   Replace YOUR_USERNAME in README.md with your GitHub username"

# Make the script executable
chmod +x "$0"

echo ""
echo "💡 Tip: Run the commands above one by one, replacing YOUR_USERNAME with your actual GitHub username"
