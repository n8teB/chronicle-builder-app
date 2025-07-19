# Chronicle Builder - GitHub Repository Setup Guide

## 🎯 **Quick Setup Commands**

Follow these steps to get your GitHub repository and automated builds working:

### **Step 1: Create GitHub Repository**

```bash
# Create repository on GitHub (do this manually or via CLI)
gh repo create chronicle-builder --public --description "Chronicle Builder - Your Story Workspace"

# Or use the GitHub website:
# 1. Go to github.com
# 2. Click "New repository"
# 3. Name: chronicle-builder
# 4. Description: Chronicle Builder - Your Story Workspace
# 5. Public repository
# 6. Don't initialize with README (we have files already)
```

### **Step 2: Add Remote and Push**

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/chronicle-builder.git

# Create main branch and push
git branch -M main
git add .
git commit -m "Initial commit: Chronicle Builder desktop app with automated builds"
git push -u origin main
```

### **Step 3: Enable GitHub Actions**

1. Go to your repository on GitHub
2. Click "Actions" tab
3. GitHub will automatically detect our workflow
4. Enable Actions if prompted

### **Step 4: Test the Build**

```bash
# Create a release tag to trigger builds
git tag v1.0.0
git push origin v1.0.0
```

## 🏗️ **Automated Build Features**

Our GitHub Actions workflow provides:

### **Triggers:**

- ✅ **Push to main branch** - Test builds
- ✅ **Pull requests** - PR validation
- ✅ **Release tags** (v\*) - Official releases
- ✅ **Manual trigger** - On-demand builds

### **Build Matrix:**

- 🪟 **Windows** - Creates `.exe` installer
- 🍎 **macOS** - Creates `.dmg` installer
- 🐧 **Linux** - Creates `.AppImage`

### **Artifacts:**

- Installers stored for 30 days
- Automatic release creation for tags
- Download links in Actions tab

## 📦 **Release Process**

### **For Testing (Development Builds):**

```bash
# Push changes to main
git add .
git commit -m "Your changes"
git push

# Check GitHub Actions tab for build status
# Download artifacts when build completes
```

### **For Official Releases:**

```bash
# 1. Update version in package.json
git add package.json
git commit -m "Bump version to 1.1.0"
git push

# 2. Create release tag
git tag v1.1.0
git push origin v1.1.0

# 3. GitHub automatically:
#    - Builds for all platforms
#    - Creates GitHub release
#    - Attaches installers to release
```

## 🛠️ **Repository Structure**

```
chronicle-builder/
├── .github/
│   └── workflows/
│       └── build.yml           # Automated build workflow
├── client/                     # React frontend source
├── public/                     # Electron main process & assets
├── dist-electron/              # Build output (gitignored)
├── package.json               # Dependencies & build scripts
├── GITHUB_SETUP.md            # This guide
├── AI_SETUP.md                # AI assistant setup
├── WINDOWS_BUILD_GUIDE.md     # Windows build instructions
└── README.md                  # Project documentation
```

## 🔧 **Workflow Configuration**

The build workflow (`.github/workflows/build.yml`) includes:

### **Build Steps:**

1. **Checkout code** - Downloads repository
2. **Setup Node.js** - Installs Node.js 18
3. **Install dependencies** - Runs `npm ci`
4. **Build web app** - Runs `npm run build:client`
5. **Build desktop app** - Runs `npm run electron-pack`
6. **Upload artifacts** - Stores installers
7. **Create releases** - For tagged versions

### **Platform-Specific Outputs:**

- **Windows**: `Chronicle-Builder-Setup.exe`
- **macOS**: `Chronicle-Builder.dmg`
- **Linux**: `Chronicle-Builder.AppImage`

## 📋 **Next Steps After Setup**

1. **Test the workflow:**

   - Push code and check Actions tab
   - Verify all three platforms build successfully

2. **Download and test installers:**

   - Go to Actions → Latest workflow
   - Download artifacts for each platform
   - Test installations on respective systems

3. **Create your first release:**
   - Tag with `v1.0.0`
   - Check that release is created automatically
   - Share download links with users

## 🎯 **Repository Settings**

### **Recommended Settings:**

- **Visibility**: Public (for easier sharing)
- **Actions**: Enabled
- **Pages**: Disabled (desktop app only)
- **Security**: Default settings

### **Branch Protection (Optional):**

- Protect main branch
- Require pull request reviews
- Require status checks to pass

## 🔗 **Useful Commands**

```bash
# Check build status
gh run list

# Download latest artifacts
gh run download

# Create release manually
gh release create v1.0.0 dist-electron/*.exe dist-electron/*.dmg dist-electron/*.AppImage

# View workflow logs
gh run view --log
```

## 🎉 **Success Indicators**

You'll know everything is working when:

✅ Repository created on GitHub  
✅ Code pushed successfully  
✅ GitHub Actions shows green checkmarks  
✅ Artifacts appear in workflow runs  
✅ Release created with installers attached  
✅ Desktop apps install and run on target platforms

Your automated build system is now ready! 🚀
