# GitHub Issue #56: Fix 404 errors for edera-logo.png and favicon.ico on talks.denhamparry.co.uk

**Issue:** [#56](https://github.com/denhamparry/talks/issues/56)
**Status:** Complete
**Date:** 2025-12-04
**Labels:** bug, deployment, static-assets

## Problem Statement

The website at talks.denhamparry.co.uk is experiencing 404 errors for critical static assets that are needed for branding and user experience.

### Current Behavior
- **edera-logo.png**: Failed to load resource (404 error)
  - Logo is referenced in CSS but not being served by nginx
  - Logo exists in `themes/assets/ederav2/edera-logo.png` (source)
  - CSS references `./assets/ederav2/edera-logo.png` at line 484
- **favicon.ico**: Failed to load resource (404 error)
  - No favicon file exists in repository
  - Browsers request `/favicon.ico` by default
- Browser console shows 404 errors when page loads
- Edera logo is not visible in top right corner of slides
- Browser tab shows missing favicon (generic icon)

### Expected Behavior
- The Edera logo should be visible in the top right corner of content slides
- The favicon should display in the browser tab
- No 404 errors in the browser console
- Static assets should be served correctly by nginx on Cloud Run

### Impact
- **Branding:** Edera logo missing affects professional appearance
- **User Experience:** No favicon makes browser tabs less identifiable
- **SEO/Credibility:** Console errors may affect perceived site quality
- **Professional Quality:** 404 errors suggest incomplete deployment

## Current State Analysis

### Build Process Analysis

**Build workflow:** `npm run build` (package.json:12)
1. Runs `marp -I slides/ -o dist/`
2. Generates HTML files from markdown slides
3. Runs `npm run generate-index` to create index.html

**MARP configuration:** `marp.config.js`
- Input: `./slides` directory
- Output: `./dist` directory
- Theme set: `./themes` directory
- Allows local files: `true`

**Key finding:** MARP only copies markdown content to HTML, **not theme assets**

### Dockerfile Analysis

**File:** `Dockerfile`

**Builder stage (lines 1-40):**
```dockerfile
COPY themes/ ./themes/
COPY slides/ ./slides/
RUN npm run build
```

**Production stage (lines 78-111):**
```dockerfile
COPY --from=builder /app/dist /usr/share/nginx/html
```

**Problem identified:**
- Builder copies `themes/` and `slides/` to build slides
- Builder outputs HTML to `/app/dist/`
- Production stage **only copies `/app/dist/` to nginx html directory**
- **Theme assets are NOT in `/app/dist/` after build**
- **Result:** `themes/assets/ederav2/edera-logo.png` never makes it to production nginx

### CSS Theme Reference

**File:** `themes/edera-v2.css` (line 484)

```css
section::before {
  content: '';
  position: absolute;
  top: var(--spacing-sm);
  right: var(--margin-horizontal);
  width: 5rem;
  height: 5rem;
  background: url('./assets/ederav2/edera-logo.png') no-repeat center;
  background-size: contain;
  z-index: 10;
}
```

**Path analysis:**
- CSS is in `themes/edera-v2.css`
- References `./assets/ederav2/edera-logo.png` (relative path)
- Expected resolved path: `themes/assets/ederav2/edera-logo.png`
- **Problem:** When HTML is in `dist/`, CSS path resolves to `dist/assets/ederav2/edera-logo.png` which doesn't exist

### Nginx Configuration Analysis

**File:** `nginx.conf`

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|avif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable" always;
}
```

**Findings:**
- Nginx is configured to serve image files correctly
- Has proper MIME types and caching headers
- **Problem is not nginx config** - files simply don't exist in `/usr/share/nginx/html`

### Related Implementation (Issue #51)

**File:** `docs/plan/issues/51_add_edera_logo_to_top_right_of_edera_v2_slide_deck.md`

Issue #51 successfully added the logo to CSS but **did not address deployment of static assets**:
- Logo asset created: `themes/assets/ederav2/edera-logo.png` ✅
- CSS updated to reference logo: `themes/edera-v2.css:484` ✅
- **Missing:** Copying theme assets to dist directory during build ❌

### Favicon Analysis

**Current state:**
- No `favicon.ico` file exists anywhere in repository
- No favicon references in generated HTML
- Browsers request `/favicon.ico` by default (returns 404)

**Options:**
1. Create favicon from Edera logo
2. Use simple colored square as favicon
3. Generate from Edera brand colors

## Solution Design

### Root Cause

The build process does not copy theme assets to the `dist/` directory:

1. **MARP behavior:** MARP CLI converts markdown to HTML but does not bundle CSS assets
2. **Dockerfile limitation:** Production stage only copies `dist/` directory
3. **Missing step:** No mechanism to copy `themes/assets/` to `dist/assets/`

### Solution Approach

**Two-part solution:**

1. **Copy theme assets during build** - Update build script to copy assets to dist
2. **Create favicon** - Generate favicon.ico from Edera logo

This approach:
- ✅ Minimal changes to existing workflow
- ✅ Works with current Docker multi-stage build
- ✅ No changes needed to nginx configuration
- ✅ Assets available at expected paths in production
- ✅ Maintainable for future asset additions

### Implementation Strategy

#### Part 1: Copy Theme Assets to Dist

**Update package.json build script:**

**Current:**
```json
"build": "marp -I slides/ -o dist/ && npm run generate-index"
```

**New:**
```json
"build": "marp -I slides/ -o dist/ && npm run copy-assets && npm run generate-index"
```

**Add new scripts:**
```json
"copy-assets": "mkdir -p dist/assets && cp -r themes/assets/* dist/assets/",
"generate-favicon": "node scripts/generate-favicon.js"
```

**Rationale:**
- `copy-assets`: Copies all theme assets to `dist/assets/` after MARP build
- `generate-favicon`: Uses Node.js script for better error handling
- Creates directory structure if missing
- Works on Unix-based systems (Linux/macOS in CI/Docker)
- Simple, no additional dependencies for asset copying

**Alternative approach (cross-platform):**
Use `cpx` or `ncp` npm package for Windows compatibility:
```json
"copy-assets": "cpx 'themes/assets/**/*' dist/assets/"
```
- ❌ Requires additional dependency
- ❌ More complex for simple use case
- ✅ Only needed if Windows dev environment support required

**Decision:** Use `cp -r` since:
- CI runs on Linux (ubuntu-latest)
- Docker build runs on Linux (alpine)
- macOS supports `cp -r`
- Windows users can use Docker or WSL

#### Part 2: CSS Path Update (If Needed)

**Current CSS path:** `url('./assets/ederav2/edera-logo.png')`

**Analysis:**
- When HTML is in `dist/example.html`
- CSS is inlined or linked from `dist/`
- Current path `./assets/ederav2/edera-logo.png` resolves to `dist/assets/ederav2/edera-logo.png` ✅

**No change needed** - path is already correct for dist directory structure

#### Part 3: Create Favicon

**Option A: Simple colored square (Quick fix)**
```bash
# Create 32x32 PNG with Edera brand color
convert -size 32x32 xc:#02f4d5 dist/favicon.ico
```
- ✅ Fastest solution
- ❌ Not visually distinctive
- ❌ Requires ImageMagick

**Option B: Convert Edera logo to favicon (Better branding)**
```bash
# Resize edera-logo.png to favicon size
convert themes/assets/ederav2/edera-logo.png -resize 32x32 dist/favicon.ico
```
- ✅ Consistent branding
- ✅ Uses existing logo
- ❌ Requires ImageMagick
- ⚠️ May not scale well (logo designed for larger size)

**Option C: Manual favicon creation (Best quality)**
1. Create 32x32 favicon manually from Edera logo
2. Save as `public/favicon.ico` (new directory)
3. Copy to dist during build
- ✅ Best visual quality
- ✅ Optimized for small size
- ❌ Manual design work required

**Option D: No favicon (Simplest)**
- Ignore favicon 404 (common, not critical)
- ❌ Unprofessional
- ❌ Console errors remain

**Decision:** Option B (convert logo) as MVP, can upgrade to Option C later
- Good enough for initial fix
- Uses existing brand asset
- Can be automated in build

**Implementation:**
```json
"generate-favicon": "[ -f themes/assets/ederav2/edera-logo.png ] && convert themes/assets/ederav2/edera-logo.png -resize 32x32 dist/favicon.ico || echo 'ImageMagick not found, skipping favicon'"
```

**Alternative for Docker (add to Dockerfile):**
```dockerfile
# Install ImageMagick in builder stage
RUN apk add --no-cache imagemagick

# Generate favicon after build
RUN convert themes/assets/ederav2/edera-logo.png -resize 32x32 dist/favicon.ico
```

## Implementation Plan

### Step 1: Update package.json Build Scripts

**File:** `package.json`

**Changes:**
Update scripts section to copy assets and generate favicon:

```json
"scripts": {
  "clean": "rm -rf dist/ .marp/",
  "generate-index": "node scripts/generate-index.js",
  "copy-assets": "mkdir -p dist/assets && cp -r themes/assets/* dist/assets/",
  "generate-favicon": "[ -f themes/assets/ederav2/edera-logo.png ] && (command -v convert >/dev/null 2>&1 && convert themes/assets/ederav2/edera-logo.png -resize 32x32 dist/favicon.ico || echo '⚠️  ImageMagick not found, skipping favicon generation') || echo '⚠️  Logo not found, skipping favicon'",
  "build": "marp -I slides/ -o dist/ && npm run copy-assets && npm run generate-index && npm run generate-favicon",
  "build:pdf": "marp -I slides/ --pdf -o dist/",
  "watch": "marp -I slides/ -w -o dist/",
  "serve": "marp -s -I slides/",
  "accessibility-audit": "node scripts/check-contrast.js"
}
```

**Key changes:**
1. New `copy-assets` script copies `themes/assets/*` to `dist/assets/`
2. New `generate-favicon` script converts logo to favicon (with fallback)
3. Updated `build` script chains: marp → copy-assets → generate-index → generate-favicon

**Testing:**
```bash
# Clean build
npm run clean

# Run build
npm run build

# Verify assets copied
ls -la dist/assets/ederav2/edera-logo.png
ls -la dist/favicon.ico

# Check dist structure
tree dist/
```

**Expected result:**
```
dist/
├── assets/
│   └── ederav2/
│       └── edera-logo.png
├── favicon.ico
├── index.html
└── *.html (slide presentations)
```

### Step 2: Install ImageMagick in Dockerfile

**File:** `Dockerfile`

**Changes:**
Add ImageMagick to builder stage (after line 9):

```dockerfile
# Install Chromium for MARP PDF generation and ImageMagick for favicon
RUN apk add --no-cache chromium imagemagick
```

**Rationale:**
- Enables favicon generation in CI and Docker builds
- Alpine package `imagemagick` provides `convert` command
- Small package (~25MB), acceptable for builder stage
- Not included in production stage (only dist/ is copied)

**Testing:**
```bash
# Build Docker image
docker build --target builder -t talks-builder .

# Verify ImageMagick installed
docker run --rm talks-builder convert --version
```

**Expected result:**
```
Version: ImageMagick 7.x.x
```

### Step 3: Update .dockerignore (If Needed)

**File:** `.dockerignore` (check if exists)

**Check current state:**
```bash
cat .dockerignore 2>/dev/null || echo "File does not exist"
```

**If .dockerignore exists and excludes themes/assets:**
Remove or comment out any lines excluding `themes/assets/`:
```
# themes/assets/  # <- Remove this line if present
```

**If .dockerignore doesn't exist:**
No change needed.

**Testing:**
```bash
# Verify themes/assets/ would be copied
docker build --target builder -t talks-builder .
docker run --rm talks-builder ls -la /app/themes/assets/
```

**Expected result:**
Should show `ederav2/` directory.

### Step 4: Test Local Build

**Commands:**
```bash
# Clean previous build
npm run clean

# Install dependencies (if needed)
npm install

# Run full build
npm run build

# Verify assets
ls -la dist/assets/ederav2/edera-logo.png
ls -la dist/favicon.ico

# Check dist structure
find dist/ -type f
```

**Expected output:**
```
dist/assets/ederav2/edera-logo.png  <- Logo copied ✅
dist/favicon.ico                     <- Favicon generated ✅
dist/index.html                      <- Index page ✅
dist/example-presentation.html       <- Slide HTML ✅
```

**Validation:**
```bash
# Check logo file size (should be ~4KB)
ls -lh dist/assets/ederav2/edera-logo.png

# Check favicon file size (should be ~1-2KB)
ls -lh dist/favicon.ico

# Verify logo is PNG
file dist/assets/ederav2/edera-logo.png

# Verify favicon is ICO
file dist/favicon.ico
```

### Step 5: Test Docker Build (Production)

**Commands:**
```bash
# Build Docker image (production stage)
docker build --target production -t talks:test .

# Run container
docker run -d -p 8080:8080 --name talks-test talks:test

# Wait for container to start
sleep 3

# Test logo endpoint
curl -I http://localhost:8080/assets/ederav2/edera-logo.png

# Test favicon endpoint
curl -I http://localhost:8080/favicon.ico

# Test homepage
curl -s http://localhost:8080/ | grep -o 'edera-logo.png'
```

**Expected results:**
```bash
# Logo should return 200 OK
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: ~4000

# Favicon should return 200 OK
HTTP/1.1 200 OK
Content-Type: image/x-icon
Content-Length: ~1500

# Homepage should reference logo
assets/ederav2/edera-logo.png
```

**Cleanup:**
```bash
docker stop talks-test
docker rm talks-test
docker rmi talks:test
```

### Step 6: Verify CSS Path Resolution

**File:** `dist/*.html` (generated files)

**Validation:**
```bash
# Build slides
npm run build

# Check how CSS is embedded
grep -A5 "edera-logo.png" dist/*.html | head -20

# Serve locally and test
python3 -m http.server 8000 --directory dist &
sleep 1

# Test in browser (manual check)
open http://localhost:8000/

# Check browser console - should have no 404 errors
# Check logo appears in top right of content slides

# Stop server
kill %1
```

**Expected result:**
- CSS path `./assets/ederav2/edera-logo.png` resolves correctly
- Logo loads successfully (check Network tab)
- No 404 errors in console
- Logo visible in top right corner

### Step 7: Update CI/CD Workflow (If Needed)

**File:** `.github/workflows/build-slides.yml`

**Review current build step (line 37-38):**
```yaml
- name: Build HTML slides
  run: npm run build
```

**Analysis:**
- Already uses `npm run build` ✅
- Our updated build script includes asset copying ✅
- No workflow changes needed ✅

**Verification:**
After merging changes, check GitHub Actions artifacts:
1. Go to Actions tab
2. Find "Build MARP Slides" workflow run
3. Download `slides-html` artifact
4. Unzip and verify `assets/ederav2/edera-logo.png` is present

### Step 8: Test Cloud Run Deployment

**Prerequisites:**
- Changes merged to main branch
- Docker image built and pushed (via workflow)
- Cloud Run deployment triggered

**Manual testing:**
```bash
# After deployment completes, test production URL
curl -I https://talks.denhamparry.co.uk/assets/ederav2/edera-logo.png

# Should return 200 OK
HTTP/2 200
content-type: image/png
cache-control: public, immutable
```

**Browser testing:**
1. Visit https://talks.denhamparry.co.uk
2. Open DevTools Console
3. Verify no 404 errors
4. Check Network tab - `edera-logo.png` should return 200
5. Check Network tab - `favicon.ico` should return 200
6. Navigate to a presentation slide
7. Verify Edera logo appears in top right corner
8. Verify favicon appears in browser tab

### Step 9: Update Documentation

**File:** `CLAUDE.md` (project documentation)

**Changes:**
Add to "Presentation Workflow (MARP)" section:

```markdown
### Build Process

The build process (`npm run build`) performs these steps:

1. **Generate HTML** - MARP converts markdown to HTML
2. **Copy Assets** - Theme assets copied to `dist/assets/`
3. **Generate Index** - Creates `index.html` listing all presentations
4. **Generate Favicon** - Converts Edera logo to `favicon.ico`

**Build output structure:**
```
dist/
├── assets/
│   └── ederav2/
│       └── edera-logo.png    # Edera logo for slides
├── favicon.ico                # Browser tab icon
├── index.html                 # Presentation listing
└── *.html                     # Individual presentations
```

**Static Assets:**
- **Logo:** `dist/assets/ederav2/edera-logo.png` - Appears in top right of content slides
- **Favicon:** `dist/favicon.ico` - Browser tab icon
- **CSS:** Inlined in HTML files by MARP
- All assets served by nginx in production
```

**File:** `README.md`

**Changes:**
Add troubleshooting section:

```markdown
## Troubleshooting

### Missing logo or favicon (404 errors)

If you see 404 errors for `edera-logo.png` or `favicon.ico`:

**Cause:** Static assets not copied during build

**Solution:**
```bash
# Rebuild with asset copying
npm run clean
npm run build

# Verify assets exist
ls dist/assets/ederav2/edera-logo.png
ls dist/favicon.ico
```

### Favicon not generating

**Cause:** ImageMagick not installed

**Solution:**
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Alpine (Docker)
apk add imagemagick
```

The build will continue without favicon if ImageMagick is unavailable (non-blocking).
```

### Step 10: Add CHANGELOG Entry

**File:** `CHANGELOG.md`

**Changes:**
Add to top of file under `## [Unreleased]`:

```markdown
### Fixed
- Fix 404 errors for edera-logo.png and favicon.ico on talks.denhamparry.co.uk ([#56](https://github.com/denhamparry/talks/issues/56))
  - Updated build process to copy theme assets to dist directory
  - Added favicon generation from Edera logo
  - Installed ImageMagick in Docker builder stage
  - Static assets now available at `/assets/ederav2/edera-logo.png` and `/favicon.ico`
  - Edera logo now displays correctly in top right of slides
  - Browser tabs now show Edera favicon
```

## Testing Strategy

### Unit Testing

**Test 1: Assets Copied During Build**
```bash
# Clean build
npm run clean
npm run build

# Verify logo copied
[ -f dist/assets/ederav2/edera-logo.png ] && echo "✅ Logo copied" || echo "❌ Logo missing"

# Verify favicon generated
[ -f dist/favicon.ico ] && echo "✅ Favicon generated" || echo "❌ Favicon missing"

# Verify file types
file dist/assets/ederav2/edera-logo.png | grep -q PNG && echo "✅ Logo is PNG" || echo "❌ Wrong format"
file dist/favicon.ico | grep -q icon && echo "✅ Favicon is ICO" || echo "❌ Wrong format"
```

**Test 2: Build Script Chains Correctly**
```bash
# Run build with verbose output
npm run build 2>&1 | tee build.log

# Verify steps executed in order
grep -q "marp" build.log && echo "✅ MARP ran"
grep -q "copy-assets" build.log && echo "✅ Assets copied"
grep -q "generate-index" build.log && echo "✅ Index generated"
grep -q "generate-favicon" build.log && echo "✅ Favicon generated"
```

**Test 3: Docker Build Includes Assets**
```bash
# Build production image
docker build --target production -t talks:test .

# Check assets in container
docker run --rm talks:test ls /usr/share/nginx/html/assets/ederav2/edera-logo.png
docker run --rm talks:test ls /usr/share/nginx/html/favicon.ico

# Cleanup
docker rmi talks:test
```

### Integration Testing

**Test Case 1: Local Server - Logo Loads**

**Steps:**
1. Build slides: `npm run build`
2. Start local server: `python3 -m http.server 8000 --directory dist`
3. Open browser: `http://localhost:8000/`
4. Navigate to any presentation
5. Check browser console
6. Check Network tab

**Expected Result:**
- No 404 errors in console
- Logo loads successfully (200 OK)
- Logo visible in top right corner of content slides
- Favicon loads successfully (200 OK)
- Favicon visible in browser tab

**Pass Criteria:** All assets return 200 OK, logo and favicon display correctly

---

**Test Case 2: Docker Container - Assets Served**

**Steps:**
1. Build Docker image: `docker build -t talks:test .`
2. Run container: `docker run -d -p 8080:8080 --name talks-test talks:test`
3. Test logo: `curl -I http://localhost:8080/assets/ederav2/edera-logo.png`
4. Test favicon: `curl -I http://localhost:8080/favicon.ico`
5. Test in browser: `open http://localhost:8080/`
6. Cleanup: `docker stop talks-test && docker rm talks-test`

**Expected Result:**
```
HTTP/1.1 200 OK
Content-Type: image/png
Cache-Control: public, immutable
```

**Pass Criteria:** Both assets return 200 OK with correct headers

---

**Test Case 3: Cloud Run Production - End-to-End**

**Steps:**
1. Merge PR to main branch
2. Wait for Docker build workflow to complete
3. Wait for Cloud Run deployment to complete
4. Visit: `https://talks.denhamparry.co.uk`
5. Open DevTools Console and Network tab
6. Navigate to several presentations
7. Check for 404 errors

**Expected Result:**
- No 404 errors in console
- Logo visible on all content slides
- Favicon visible in browser tab
- Network tab shows 200 OK for both assets

**Pass Criteria:** Production site has no 404 errors, all assets load correctly

---

**Test Case 4: PDF Export (Regression)**

**Steps:**
1. Build PDF: `npm run build:pdf`
2. Open PDF: `open dist/example-presentation.pdf`
3. Check logo on multiple slides
4. Verify logo positioning

**Expected Result:**
- PDF builds successfully
- Logo appears in PDF slides
- Logo positioned correctly (top right)
- No broken image placeholders

**Pass Criteria:** PDF export still works, logo renders correctly

### Regression Testing

**Existing Functionality to Verify:**

1. **HTML Build Still Works**
   ```bash
   npm run clean
   npm run build
   ls dist/*.html
   ```
   - Should generate HTML files ✅

2. **Index Page Generation**
   ```bash
   npm run build
   cat dist/index.html | grep -q "Presentations"
   ```
   - Index page should list presentations ✅

3. **Live Reload Development Server**
   ```bash
   npm run serve
   # Open http://localhost:8080 in browser
   # Edit slide file, check auto-reload
   ```
   - Server should work with live reload ✅

4. **Docker Compose Dev Environment**
   ```bash
   docker-compose up dev
   # Visit http://localhost:8080
   ```
   - Dev container should still work ✅

5. **Clean Command**
   ```bash
   npm run build
   npm run clean
   [ ! -d dist ] && echo "✅ Cleaned" || echo "❌ Not cleaned"
   ```
   - Clean should remove dist directory ✅

6. **GitHub Actions Build**
   - Push to branch, check workflow runs successfully
   - Download artifacts, verify assets included ✅

### Edge Cases

**Edge Case 1: ImageMagick Not Installed**
```bash
# Temporarily rename convert to simulate missing ImageMagick
# Build should complete with warning but without favicon
npm run build
# Should see: "⚠️  ImageMagick not found, skipping favicon generation"
# Build should succeed (non-blocking)
```

**Edge Case 2: Logo File Missing**
```bash
# Temporarily rename logo file
mv themes/assets/ederav2/edera-logo.png themes/assets/ederav2/edera-logo.png.bak
npm run build
# Should see: "⚠️  Logo not found, skipping favicon"
# Build should succeed (non-blocking)
mv themes/assets/ederav2/edera-logo.png.bak themes/assets/ederav2/edera-logo.png
```

**Edge Case 3: Multiple Presentations**
```bash
# Build with multiple slide files
npm run build
# Check all HTML files reference logo correctly
grep -r "edera-logo.png" dist/*.html
# All should use correct relative path
```

**Edge Case 4: Browser Without Favicon Support**
- Test in text-based browser (lynx, curl)
- Should not break page loading
- Missing favicon should be silent failure

## Success Criteria

- [ ] `npm run build` copies `themes/assets/*` to `dist/assets/`
- [ ] `dist/assets/ederav2/edera-logo.png` exists after build
- [ ] `dist/favicon.ico` exists after build (if ImageMagick available)
- [ ] Local server serves logo at `/assets/ederav2/edera-logo.png` (200 OK)
- [ ] Local server serves favicon at `/favicon.ico` (200 OK)
- [ ] Docker build includes ImageMagick in builder stage
- [ ] Docker production image contains assets in `/usr/share/nginx/html/assets/`
- [ ] Docker container serves both assets correctly
- [ ] Cloud Run deployment shows no 404 errors in browser console
- [ ] Logo visible in top right corner of content slides on production
- [ ] Favicon visible in browser tab on production
- [ ] PDF export still works (regression test)
- [ ] GitHub Actions build artifacts include assets
- [ ] Documentation updated with build process details
- [ ] CHANGELOG entry added
- [ ] All integration tests pass
- [ ] All edge cases handled gracefully

## Files Modified

1. **`package.json`** - Add `copy-assets` and `generate-favicon` scripts, update `build` script
2. **`Dockerfile`** - Add ImageMagick to builder stage (line 9)
3. **`CLAUDE.md`** - Document build process and asset structure
4. **`README.md`** - Add troubleshooting section for missing assets
5. **`CHANGELOG.md`** - Add fix entry for issue #56
6. **`docs/plan/issues/56_fix_404_errors_for_edera_logo_png_and_favicon_ico.md`** (THIS FILE) - Implementation plan

## Files Created

1. **`dist/assets/ederav2/edera-logo.png`** (generated during build) - Copied from themes
2. **`dist/favicon.ico`** (generated during build) - Generated from logo

## Related Issues and Tasks

### Depends On
- Issue #51: Add Edera logo to top right of Edera V2 slide deck - Logo CSS implementation exists

### Blocks
- None

### Related
- Issue #51: Logo CSS added but deployment not addressed
- Issue #8: Containerize MARP slides - Docker configuration
- Issue #26: Deploy talks website to Google Cloud Run - Deployment infrastructure
- Issue #30: Fix Cloud Run deployment GHCR image pull authentication - Related deployment fix

### Enables
- Professional branded presentations in production
- Complete deployment without console errors
- Better SEO and user experience

## References

- [GitHub Issue #56](https://github.com/denhamparry/talks/issues/56)
- Related plan: `docs/plan/issues/51_add_edera_logo_to_top_right_of_edera_v2_slide_deck.md`
- Build workflow: `.github/workflows/build-slides.yml`
- Docker deployment: `.github/workflows/cloudrun-deploy.yml`
- MARP documentation: https://github.com/marp-team/marp-cli
- ImageMagick convert: https://imagemagick.org/script/convert.php

## Notes

### Key Insights

1. **MARP doesn't bundle assets**: MARP CLI only converts markdown to HTML, doesn't copy theme assets
2. **Multi-stage Docker limitation**: Production stage only gets files explicitly copied from builder
3. **Favicon is optional but expected**: Browsers always request `/favicon.ico`, returning 404 is poor UX
4. **Build script chaining**: npm scripts can chain multiple commands with `&&` for sequential execution
5. **Non-blocking favicon**: ImageMagick may not be available locally, build should continue without it

### Alternative Approaches Considered

1. **Serve assets from themes/ directly** ❌
   - Why not: Production nginx only has dist/ directory
   - Would require mounting themes/ in Docker
   - Breaks clean separation of source and build artifacts

2. **Embed logo as base64 in CSS** ❌
   - Why not: Increases CSS file size (~5KB added)
   - No caching benefits
   - Harder to update logo
   - Doesn't solve favicon issue

3. **Use public/ directory for static assets** ❌
   - Why not: MARP doesn't have concept of public directory
   - Would require additional copying logic
   - Less intuitive than copying from themes/assets

4. **Copy assets in Dockerfile directly** ❌
   - Why not: Build should work locally without Docker
   - npm scripts are cross-platform
   - Local development uses `npm run build`

5. **Copy assets to dist/ during build (Chosen)** ✅
   - **Why selected:**
     - Works locally and in CI/Docker
     - Single source of truth (themes/assets)
     - Clean dist/ structure
     - No changes to deployment process
     - Assets available at expected paths

### Design Decisions

**Decision 1: Use npm script for asset copying**
- **Rationale:** Works in all environments (local, CI, Docker)
- **Trade-off:** Unix-only `cp` command (acceptable for Linux/macOS/Docker)
- **Alternative:** Could use `cpx` package for Windows support (not needed currently)

**Decision 2: Generate favicon from logo**
- **Rationale:** Consistent branding, automated process
- **Trade-off:** Requires ImageMagick dependency
- **Mitigation:** Made non-blocking (warning only if missing)

**Decision 3: Chain scripts in build command**
- **Rationale:** Single `npm run build` command handles everything
- **Trade-off:** Longer build time (marginal - asset copying is fast)
- **Benefit:** Developer ergonomics - one command for complete build

**Decision 4: Install ImageMagick in Docker only**
- **Rationale:** CI and production builds always have it available
- **Trade-off:** Local dev might not have it (warning shown)
- **Benefit:** Guaranteed favicon generation in deployments

### Best Practices

**Build Process:**
- Keep source and build artifacts separate
- Use dist/ for all generated files
- Make build scripts idempotent (can run multiple times)
- Chain related build steps in single command

**Static Assets:**
- Copy assets during build, not at runtime
- Maintain source of truth in themes/assets
- Use relative paths in CSS for portability
- Optimize asset sizes (logos should be <10KB)

**Docker Multi-stage:**
- Install build tools in builder stage only
- Copy minimal files to production stage
- Keep production images small (no build tools)
- Use explicit COPY from builder stage

**Deployment:**
- Verify assets in dist/ before Docker build
- Test asset serving in Docker container locally
- Check production URLs after deployment
- Monitor browser console for 404 errors

### Maintenance

**Adding New Assets:**
1. Add file to `themes/assets/`
2. Reference in CSS with relative path
3. Run `npm run build` - automatically copied

**Updating Logo:**
1. Replace `themes/assets/ederav2/edera-logo.png`
2. Run `npm run build` - favicon regenerated
3. Verify in browser

**Favicon Customization:**
If ImageMagick resize isn't good enough:
1. Create custom 32x32 favicon manually
2. Save to `themes/assets/favicon.ico`
3. Update `generate-favicon` script to copy instead of convert
