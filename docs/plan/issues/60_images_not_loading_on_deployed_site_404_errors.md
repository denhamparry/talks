# GitHub Issue #60: Images not loading on deployed site (404 errors)

**Issue:** [#60](https://github.com/denhamparry/talks/issues/60)
**Status:** Complete
**Labels:** bug, ci, deployment, static-assets
**Date:** 2025-12-04

## Problem Statement

Images are not loading on the deployed site at https://talks.denhamparry.co.uk/. The browser console shows 404 errors for image resources when viewing presentations.

### Current Behavior

- Presentation slides at https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.html show missing images
- Browser console displays 404 errors:
  ```
  ivysketch-qr.png:1  Failed to load resource: the server responded with a status of 404 ()
  ivy-train-to-manchester.png:1  Failed to load resource: the server responded with a status of 404 ()
  supremacy-book-cover.png:1  Failed to load resource: the server responded with a status of 404 ()
  ```
- Images exist in source code: `slides/assets/2025-12-04-cloud-native-manchester/*.png`
- Generated HTML references: `./assets/2025-12-04-cloud-native-manchester/*.png`
- Images work locally during development with `make serve`

### Expected Behavior

- All images should load correctly on deployed site
- No 404 errors in browser console
- Images should be included in Docker build artifacts
- Static assets should be served correctly by nginx

### Impact

- Degraded user experience on production site
- Presentations are incomplete without images
- Professional credibility affected by broken assets
- Issue affects all presentations with slide-specific images

## Current State Analysis

### Relevant Code/Config

**File:** `package.json:12`
```json
"copy-assets": "mkdir -p dist/assets && cp -r themes/assets/* dist/assets/",
```

**Problem:** This script only copies `themes/assets/*` to `dist/assets/`, which contains:
- `themes/assets/ederav2/edera-logo.png` → `dist/assets/ederav2/edera-logo.png`

**Missing:** Slide-specific assets in `slides/assets/` are NOT copied to `dist/`:
- `slides/assets/2025-12-04-cloud-native-manchester/*.png` (3 images, ~1.7MB total)
- `slides/assets/ederav2/*.png` (duplicate theme logo in slides dir)

**File:** `slides/2025-12-04-cloud-native-manchester.md:65,141,147`
```markdown
<img src="./assets/2025-12-04-cloud-native-manchester/supremacy-book-cover.png" ...>
<img src="./assets/2025-12-04-cloud-native-manchester/ivysketch-qr.png" ...>
<img src="./assets/2025-12-04-cloud-native-manchester/ivy-train-to-manchester.png" ...>
```

**File:** `dist/2025-12-04-cloud-native-manchester.html:168,221,225`

Generated HTML correctly preserves relative paths from markdown, but the assets don't exist:
```html
<img src="./assets/2025-12-04-cloud-native-manchester/supremacy-book-cover.png" ...>
```

**File:** `Dockerfile:88`
```dockerfile
COPY --from=builder /app/dist /usr/share/nginx/html
```

The Docker build copies the entire `dist/` directory, so if assets are missing from `dist/`, they won't be in the Docker image.

**File:** `nginx.conf:59-63`
```nginx
# Image files - long-term caching
location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|avif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable" always;
}
```

nginx configuration is correct for serving images, but the images don't exist in the Docker image.

### Root Cause

The `npm run copy-assets` script only copies theme assets (`themes/assets/`) to the distribution directory, but does NOT copy slide-specific assets (`slides/assets/`). This means:

1. **Local Development:** Works because MARP dev server (`make serve`) serves directly from `slides/` directory
2. **Production Build:** Fails because `dist/` doesn't contain slide assets, only theme assets
3. **Docker Image:** Missing assets because builder stage only includes `dist/` contents
4. **Deployed Site:** 404 errors because nginx can't serve non-existent files

### Directory Structure

**Source (working):**
```
slides/
├── assets/
│   ├── 2025-12-04-cloud-native-manchester/  ← NOT copied
│   │   ├── ivy-train-to-manchester.png (553KB)
│   │   ├── ivysketch-qr.png (439B)
│   │   └── supremacy-book-cover.png (718KB)
│   └── ederav2/
│       └── edera-logo.png
└── 2025-12-04-cloud-native-manchester.md

themes/
└── assets/
    └── ederav2/
        └── edera-logo.png  ← Copied by current script
```

**Distribution (broken):**
```
dist/
├── 2025-12-04-cloud-native-manchester.html
├── index.html
├── favicon.ico
└── assets/
    └── ederav2/           ← Only theme assets exist
        └── edera-logo.png
    # Missing: 2025-12-04-cloud-native-manchester/ directory
```

### Related Context

- This issue affects all presentations with slide-specific images
- Theme logo (`ederav2/edera-logo.png`) works because it's in `themes/assets/`
- MARP generates HTML with correct relative paths, build process is incomplete
- No existing test coverage for asset copying in `scripts/smoke-test.js`

## Solution Design

### Approach

Extend the `copy-assets` npm script to copy BOTH theme assets AND slide-specific assets to the `dist/` directory. This is the simplest solution that maintains the existing build workflow.

### Implementation

**Option 1: Extend copy-assets script (Chosen)**

Modify `package.json` to copy both directories:

```json
"copy-assets": "mkdir -p dist/assets && cp -r themes/assets/* dist/assets/ && [ -d slides/assets ] && cp -r slides/assets/* dist/assets/ || true"
```

**Benefits:**
- Minimal change to existing workflow
- No new dependencies or scripts required
- Works with existing Docker build process
- Backward compatible with projects that don't have `slides/assets/`

**Trade-offs:**
- Shell script in package.json (cross-platform concern)
- No validation of asset copying success
- Duplicates assets if same name exists in both directories (last write wins)

**Option 2: Separate npm script (Alternative)**

Add a new script for slide assets:

```json
"copy-theme-assets": "mkdir -p dist/assets && cp -r themes/assets/* dist/assets/",
"copy-slide-assets": "[ -d slides/assets ] && cp -r slides/assets/* dist/assets/ || true",
"copy-assets": "npm run copy-theme-assets && npm run copy-slide-assets",
```

**Benefits:**
- Clearer separation of concerns
- Easier to debug individual steps
- More maintainable

**Trade-offs:**
- More scripts to maintain
- Slightly slower (two separate executions)

**Chosen Approach:** Option 1 (extend existing script) for simplicity and minimal changes.

### Alternative Approaches Considered

1. **Change MARP output directory** - Configure MARP to output to `dist/` and keep assets in source
   - ❌ Rejected: MARP doesn't copy assets, only generates HTML
   - ❌ Would require custom build logic anyway

2. **Use MARP asset copying features** - Configure MARP to handle asset copying
   - ❌ Rejected: MARP CLI doesn't have built-in asset copying functionality
   - ❌ Would need custom plugin or post-processing

3. **Symlink slides/assets to dist/assets** - Create symlink instead of copying
   - ❌ Rejected: Doesn't work in Docker builds
   - ❌ Symlinks not portable across environments

4. **Keep assets in themes/ only** - Move all slide assets to themes directory
   - ❌ Rejected: Poor organization, mixes theme and content
   - ❌ Doesn't scale for multiple presentations

**Selected Approach (Option 1)** provides the best balance of simplicity, maintainability, and compatibility with the existing build system.

## Implementation Plan

### Step 1: Update copy-assets script

**File:** `package.json:12`

**Current:**
```json
"copy-assets": "mkdir -p dist/assets && cp -r themes/assets/* dist/assets/",
```

**Change to:**
```json
"copy-assets": "mkdir -p dist/assets && cp -r themes/assets/* dist/assets/ && [ -d slides/assets ] && cp -r slides/assets/* dist/assets/ || true",
```

**Explanation:**
- `[ -d slides/assets ]` - Check if `slides/assets/` directory exists
- `&& cp -r slides/assets/* dist/assets/` - Copy slide assets if directory exists
- `|| true` - Don't fail if `slides/assets/` doesn't exist (backward compatibility)

**Testing:**
```bash
# Clean and rebuild
npm run clean
npm run build

# Verify assets exist
ls -la dist/assets/2025-12-04-cloud-native-manchester/
# Should show: ivy-train-to-manchester.png, ivysketch-qr.png, supremacy-book-cover.png

ls -la dist/assets/ederav2/
# Should show: edera-logo.png (from themes/)
```

### Step 2: Verify Docker build includes assets

**File:** `Dockerfile` (no changes needed)

The existing Dockerfile already copies the entire `dist/` directory:
```dockerfile
COPY --from=builder /app/dist /usr/share/nginx/html
```

**Testing:**
```bash
# Build Docker image
make docker-build

# Run production container
make docker-prod

# Verify assets in container
docker exec -it <container-id> ls -la /usr/share/nginx/html/assets/2025-12-04-cloud-native-manchester/

# Test via HTTP
curl -I http://localhost:8081/assets/2025-12-04-cloud-native-manchester/ivysketch-qr.png
# Should return: HTTP/1.1 200 OK
```

### Step 3: Add smoke test for asset copying

**File:** `scripts/smoke-test.js`

**Add new test:**
```javascript
// Test: Slide-specific assets are copied
function testSlideAssets() {
  console.log('Testing slide-specific assets...');

  const slideAssetsDir = path.join(__dirname, '..', 'slides', 'assets');
  const distAssetsDir = path.join(__dirname, '..', 'dist', 'assets');

  if (!fs.existsSync(slideAssetsDir)) {
    console.log('  ℹ No slides/assets/ directory found, skipping');
    return;
  }

  // Get all asset directories in slides/assets/
  const assetDirs = fs.readdirSync(slideAssetsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  assetDirs.forEach(dir => {
    const sourceDir = path.join(slideAssetsDir, dir);
    const destDir = path.join(distAssetsDir, dir);

    if (!fs.existsSync(destDir)) {
      console.error(`  ✗ Asset directory not copied: ${dir}/`);
      process.exit(1);
    }

    // Verify all files were copied
    const sourceFiles = fs.readdirSync(sourceDir);
    sourceFiles.forEach(file => {
      const destFile = path.join(destDir, file);
      if (!fs.existsSync(destFile)) {
        console.error(`  ✗ Asset file not copied: ${dir}/${file}`);
        process.exit(1);
      }
    });

    console.log(`  ✓ Assets copied: ${dir}/ (${sourceFiles.length} files)`);
  });
}
```

**Add to main test execution:**
```javascript
// In main() function, add:
testSlideAssets();
```

**Testing:**
```bash
npm run test:smoke
# Should pass and show:
# ✓ Assets copied: 2025-12-04-cloud-native-manchester/ (3 files)
# ✓ Assets copied: ederav2/ (1 files)
```

### Step 4: Verify deployed site

**Manual verification after deployment:**

1. **Build and deploy:**
   ```bash
   # Trigger GitHub Actions workflow
   git push origin main
   ```

2. **Wait for Cloud Run deployment:**
   ```bash
   # Check deployment status
   gh workflow view "Deploy to Cloud Run" --web
   ```

3. **Test production site:**
   ```bash
   # Test image URLs
   curl -I https://talks.denhamparry.co.uk/assets/2025-12-04-cloud-native-manchester/ivysketch-qr.png
   # Should return: HTTP/2 200

   curl -I https://talks.denhamparry.co.uk/assets/2025-12-04-cloud-native-manchester/ivy-train-to-manchester.png
   # Should return: HTTP/2 200

   curl -I https://talks.denhamparry.co.uk/assets/2025-12-04-cloud-native-manchester/supremacy-book-cover.png
   # Should return: HTTP/2 200
   ```

4. **Verify in browser:**
   - Visit https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.html
   - Check slide 6 for "Supremacy" book cover
   - Check slide 10 for IvySketch QR code
   - Check slide 10 for Ivy train image
   - Open browser console, verify no 404 errors

### Step 5: Update documentation

**File:** `CLAUDE.md` (Presentation Workflow section)

**Add note about slide assets:**
```markdown
### Creating New Presentations

1. **Copy Template:**

   ```bash
   cp templates/basic-presentation.md slides/my-talk.md
   ```

2. **Add Slide-Specific Images (Optional):**

   If your presentation includes images:

   ```bash
   mkdir -p slides/assets/my-talk
   cp /path/to/image.png slides/assets/my-talk/
   ```

   Reference in markdown:
   ```markdown
   ![Image description](./assets/my-talk/image.png)
   ```

   **Note:** Assets in `slides/assets/` are automatically copied to `dist/assets/` during build.

3. **Build Slides:**

   ```bash
   npm run build       # Build HTML with assets
   npm run build:pdf   # Generate PDF
   ```
```

**Testing:**
- Review documentation for clarity
- Ensure instructions are accurate

## Testing Strategy

### Unit Testing

**Script validation:**
```bash
# Test copy-assets script directly
npm run copy-assets

# Verify both asset directories exist
test -d dist/assets/ederav2 && echo "✓ Theme assets copied"
test -d dist/assets/2025-12-04-cloud-native-manchester && echo "✓ Slide assets copied"

# Verify file count
find slides/assets -type f | wc -l    # Source count
find dist/assets -type f | wc -l      # Dist count (should match or exceed)
```

### Integration Testing

**Test Case 1: Clean build with slide assets**

1. Clean build artifacts: `npm run clean`
2. Run full build: `npm run build`
3. Verify slide assets exist:
   ```bash
   ls dist/assets/2025-12-04-cloud-native-manchester/
   # Expected: ivy-train-to-manchester.png, ivysketch-qr.png, supremacy-book-cover.png
   ```
4. Verify theme assets exist:
   ```bash
   ls dist/assets/ederav2/
   # Expected: edera-logo.png
   ```
5. Run smoke tests: `npm run test:smoke`
6. **Expected result:** All tests pass, no errors

**Test Case 2: Docker build includes assets**

1. Build Docker image: `make docker-build`
2. Run production container: `make docker-prod`
3. Verify assets in container:
   ```bash
   docker exec <container> ls /usr/share/nginx/html/assets/2025-12-04-cloud-native-manchester/
   ```
4. Test HTTP access:
   ```bash
   curl http://localhost:8081/assets/2025-12-04-cloud-native-manchester/ivysketch-qr.png -o /tmp/test.png
   file /tmp/test.png
   # Expected: PNG image data
   ```
5. **Expected result:** Images accessible via HTTP, correct MIME types

**Test Case 3: Missing slides/assets directory (backward compatibility)**

1. Temporarily rename `slides/assets`: `mv slides/assets slides/assets.bak`
2. Run build: `npm run build`
3. Verify build succeeds without errors
4. Restore directory: `mv slides/assets.bak slides/assets`
5. **Expected result:** Build succeeds even when `slides/assets/` doesn't exist

### Regression Testing

**Verify existing functionality:**

1. **Theme logo still works:**
   - Check `dist/assets/ederav2/edera-logo.png` exists
   - View presentation, verify Edera logo appears in top right

2. **Index page generation:**
   - Verify `dist/index.html` exists
   - Open in browser, verify all presentations listed

3. **Favicon generation:**
   - Verify `dist/favicon.ico` exists
   - Check file size matches theme logo

4. **PDF generation:**
   - Run `npm run build:pdf`
   - Verify PDFs generated (may fail locally, continue-on-error in CI)

5. **Watch mode:**
   - Run `npm run watch`
   - Edit slide file, verify rebuild triggered
   - Stop watch mode

6. **CI/CD workflow:**
   - Push to feature branch
   - Verify `build-slides.yml` workflow succeeds
   - Download artifacts, verify images included

### Production Validation

**After deployment:**

1. **Visual inspection:**
   - Open https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.html
   - Navigate to slides with images (slides 6, 10)
   - Verify images render correctly

2. **Browser console:**
   - Open DevTools console
   - Verify no 404 errors
   - Check Network tab for image requests (should be 200 OK)

3. **Performance:**
   - Check image load times (should be <1s with CDN)
   - Verify cache headers: `curl -I <image-url> | grep -i cache`

4. **Mobile devices:**
   - Test on mobile browser
   - Verify images load and display correctly

## Success Criteria

- [x] `slides/assets/` directory copied to `dist/assets/` during build
- [x] All three presentation images exist in `dist/assets/2025-12-04-cloud-native-manchester/`
- [x] Theme logo still works (backward compatibility)
- [x] Docker build includes slide assets
- [x] Smoke tests pass and verify asset copying
- [x] Production site loads images without 404 errors
- [x] Browser console shows no errors on presentation page
- [x] Documentation updated with asset usage instructions
- [x] Build succeeds when `slides/assets/` doesn't exist (backward compatibility)
- [x] CI/CD workflow passes with new changes
- [x] No regression in existing functionality (favicon, index, theme assets)

## Files Modified

1. `package.json:12` - Update `copy-assets` script to include slide assets
2. `scripts/smoke-test.js` - Add test for slide asset copying validation
3. `CLAUDE.md` - Document slide asset workflow in "Creating New Presentations" section

## Related Issues and Tasks

### Closes

- GitHub Issue #60 - Images not loading on deployed site (404 errors)

### Related

- `.github/workflows/build-slides.yml` - CI workflow that runs build
- `.github/workflows/cloudrun-deploy.yml` - Deployment workflow
- `Dockerfile:88` - Copies dist/ to nginx html root
- `nginx.conf:59-63` - Image file caching configuration

### Enables

- Adding images to future presentations without build issues
- Proper asset organization (theme vs. slide-specific)
- Better documentation for contributors

### Depends On

- None (standalone fix)

## References

- [GitHub Issue #60](https://github.com/denhamparry/talks/issues/60)
- Production site: https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.html
- MARP CLI documentation: https://github.com/marp-team/marp-cli
- Browser console error screenshot in issue

## Notes

### Key Insights

1. **MARP doesn't copy assets** - MARP CLI only generates HTML from markdown, doesn't handle asset copying
2. **Local dev vs production** - Different behavior because `make serve` uses source directory, production uses `dist/`
3. **Docker multi-stage build** - Assets must exist in `dist/` before Docker COPY stage
4. **Relative paths preserved** - MARP correctly generates `./assets/...` paths in HTML

### Design Decisions

**Why modify npm script instead of Dockerfile?**
- Assets should be in `dist/` for local builds too (not just Docker)
- `npm run serve:dist` should work locally for testing
- Keeps build logic in npm scripts, not scattered across multiple files

**Why use shell operators (`[ -d ]`, `&&`, `||`) in npm script?**
- Provides backward compatibility for projects without `slides/assets/`
- Prevents build failures if directory doesn't exist
- Common pattern in npm scripts, widely supported

**Why not use a separate Node.js script?**
- Simple file copy doesn't need JavaScript overhead
- Shell commands are faster for file operations
- Existing script already uses shell (`cp -r`)

### Best Practices

**Asset organization:**
- **Theme assets** (`themes/assets/`) - Shared across all presentations (logo, icons)
- **Slide assets** (`slides/assets/<presentation-name>/`) - Specific to one presentation

**Naming convention:**
- Use same name for asset directory as slide file (without `.md` extension)
- Example: `slides/my-talk.md` → `slides/assets/my-talk/`

**Image optimization:**
- Optimize images before committing (use `imagemagick`, `optipng`, etc.)
- Keep images under 1MB each when possible
- Use appropriate formats (PNG for screenshots, JPG for photos)

**Testing locally:**
- Always test with `npm run serve:dist` (production-like) before deploying
- Don't rely solely on `npm run serve` (dev server uses source directory)

### Monitoring

**After deployment, monitor:**
- Cloud Run logs for 404 errors: `gcloud logging read --project=denhamparry-talks`
- CDN cache hit rates for images
- Page load times with images included
- User reports of missing images

**Alerts:**
- Set up monitoring for 404 responses on `/assets/*` paths
- Track image load failures in browser error tracking (if implemented)
