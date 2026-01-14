# GitHub Issue #75: Review and enhance Road to Multitenancy slide deck with diagrams

**Issue:** [#75](https://github.com/denhamparry/talks/issues/75)
**Status:** Complete
**Date:** 2026-01-14

## Problem Statement

The Road to Multitenancy slide deck (`slides/2026-01-14-road-to-multitenancy.md`) currently relies heavily on text-based explanations of complex multi-tenancy concepts, isolation approaches, and Edera's architecture. While the content is comprehensive, the presentation would benefit significantly from visual diagrams to enhance understanding and audience engagement.

### Current Behavior

- **Text-heavy slides**: Most slides use bullet points and text descriptions
- **Complex concepts**: Topics like kernel isolation, VM architectures, and performance trade-offs are explained verbally
- **Unused assets**: Extensive diagram collection exists in `slides/assets/diagrams/` but is not incorporated
- **Comparison challenges**: Matrix comparisons and trade-offs are harder to visualize

### Expected Behavior

- **Visual enhancement**: Complex concepts illustrated with diagrams
- **Asset utilization**: Existing performance benchmarks and architecture diagrams incorporated
- **Better engagement**: Visual learners benefit from diagrams alongside text
- **Professional appearance**: Balanced text-to-visual ratio throughout deck

## Current State Analysis

### Slide Deck Structure

**Location:** `slides/2026-01-14-road-to-multitenancy.md`
**Format:** MARP presentation with Edera V2 theme
**Slide count:** 19 slides (title, content, dark layouts)
**Current diagrams:** 1 (QR code on final slide)

**Content sections:**
1. Title slide (slide 1)
2. Multi-tenancy problem overview (slides 2-4)
3. Current approaches comparison (slides 5-10): Separate Machines, Shared Kernel, Kata, gVisor, Firecracker, Bare Metal
4. Comparison matrix (slide 12)
5. Edera introduction (slide 13)
6. Edera technical details (slides 14-16)
7. Platform impact and use cases (slides 17-20)
8. Conclusion and Q&A (slides 21-22)

### Existing Diagram Assets

**Location:** `slides/assets/diagrams/`

**Performance benchmarks available:**
- `cpu-benchmark.png` (112KB)
- `CPU Benchmark-Full Range.png` (54KB)
- `syscall-performance.png` (104KB)
- `System Call Performance.png` (49KB)
- `System Call Latency-fork and execve.png` (69KB)
- `System Call latency-getpgid.png` (50KB)
- `Memory Benchmarks-Full Range.png` (53KB)
- `memcpy-memset Benchmarks.png` (67KB)
- `Sysbench-memory Benchmarks.png` (73KB)
- `kcbench Runtimes.png` (51KB)
- `kernel-build-benchmark.png` (108KB)
- `nginx Runtimes.png` (48KB)

**Architecture diagrams available:**
- `edera-architecture-overview.png` (556KB)
- `edera-attack-with.png` (203KB)
- `edera-attack-without.png` (218KB)
- `type1-vs-type2-hypervisor.png` (39KB)

**Startup performance:**
- `container-startup-time.png` (52KB)
- `startup times.png` (46KB)

### Related Context

- **Theme:** Edera V2 (`themes/edera-v2.css`) with dark teal (#013a3b), light mint (#d0fdf2), cyan accent (#02f4d5)
- **Build system:** Makefile and npm scripts (`npm run build`, `make build`)
- **Output:** HTML and PDF formats (`dist/2026-01-14-road-to-multitenancy.html`, `.pdf`)
- **MARP syntax:** Images embedded with `![description](./assets/diagrams/filename.png)`

## Solution Design

### Approach

**Strategy:** Progressive diagram integration across the slide deck, prioritizing:
1. **Reuse existing assets** where they directly illustrate slide content
2. **Identify diagram gaps** where new visuals are needed
3. **Maintain balance** - enhance understanding without cluttering slides
4. **Theme consistency** - ensure diagrams work with Edera V2 color palette

**Rationale:**
- Existing assets represent significant work and are production-ready
- Visual diagrams reduce cognitive load for complex architectural concepts
- Performance benchmarks provide empirical evidence for claims
- Security visualizations make abstract threats concrete

**Trade-offs considered:**
- **Too many diagrams**: Can overwhelm slides and reduce focus
- **Too few diagrams**: Misses opportunity to clarify complex topics
- **Balance chosen**: 1-2 diagrams per complex concept, reusing assets where possible

### Implementation Plan by Slide

#### **Slide 2-3: The Multi-Tenancy Problem**
**Current:** Text-only description of trilemma
**Enhancement:**
- Consider adding a custom trilemma diagram (Security ↔ Performance ↔ Scale triangle)
- **Decision:** Skip for initial implementation - concept is abstract and text works well
- **Priority:** Low (future enhancement)

#### **Slide 4: Scale vs Isolation Dilemma**
**Current:** Text explanation of shared kernel concerns
**Enhancement:**
- **Add:** `edera-attack-without.png` to show shared kernel attack surface
- **Placement:** After "Shared kernel = shared attack surface" bullet
- **Benefit:** Visualizes container escape and cross-tenant vulnerability

**Code change:**
```markdown
**Reality Check:**
- Orchestrators like Kubernetes were built for scale
- Multiple workloads share the same worker nodes
- Shared kernel = shared attack surface
- One compromised container can impact others

![Shared kernel attack surface](./assets/diagrams/edera-attack-without.png)
```

#### **Slide 6: Shared Kernel Approach**
**Current:** Text-only security concerns
**Enhancement:**
- **Already planned for Slide 4**, no duplication needed
- **Decision:** Keep this slide text-only to avoid repetition

#### **Slide 7: Kata Containers**
**Current:** Text description of lightweight VMs
**Enhancement:**
- **Add:** `container-startup-time.png` to show VM startup overhead
- **Placement:** After cons section
- **Benefit:** Empirical evidence for 750ms vs 1.9s claim on slide 15

**Code change:**
```markdown
**Cons:**
- ❌ VM startup overhead (150-300ms with modern configurations, up to 1-2s with older setups)
- ❌ Higher memory footprint per container
- ❌ Additional infrastructure complexity

![Container startup time comparison](./assets/diagrams/container-startup-time.png)
```

#### **Slide 8: gVisor**
**Current:** Text description of userspace kernel
**Enhancement:**
- **Add:** `syscall-performance.png` to show performance impact
- **Placement:** After cons section
- **Benefit:** Visualizes the syscall interception overhead mentioned

**Code change:**
```markdown
**Cons:**
- ❌ Performance penalty from syscall interception (varies by workload)
- ❌ Limited syscall support and compatibility issues
- ❌ Added debugging complexity

![System call performance overhead](./assets/diagrams/syscall-performance.png)
```

#### **Slide 9: Firecracker**
**Current:** Text description of microVMs
**Enhancement:**
- **Add:** `startup times.png` for cold start comparison
- **Placement:** After pros section
- **Benefit:** Shows 125ms benchmark claim

**Code change:**
```markdown
**Pros:**
- ✅ Strong isolation via hardware virtualization (KVM)
- ✅ Fast startup times (~125ms vs 1-2s for Kata)
- ✅ Minimal memory footprint (~5MB per microVM)

![MicroVM startup times](./assets/diagrams/startup%20times.png)
```

**Note:** URL-encode space as `%20` in filename

#### **Slide 14: How Edera Works**
**Current:** Bullet points describing technical architecture
**Enhancement:**
- **Add:** `edera-architecture-overview.png` - comprehensive architecture diagram
- **Add:** `type1-vs-type2-hypervisor.png` - explains Type-1 hypervisor advantage
- **Placement:** After "Key Technologies" section or replace some bullets
- **Benefit:** Visual architecture understanding

**Code change:**
```markdown
**Key Technologies:**
- Type-1 hypervisor with microkernel architecture
- Paravirtualized zones (lightweight VMs)
- Secure compute profiles
- Network isolation with gateway control

![Edera architecture overview](./assets/diagrams/edera-architecture-overview.png)

![Type-1 vs Type-2 hypervisor comparison](./assets/diagrams/type1-vs-type2-hypervisor.png)
```

#### **Slide 15: Benefits - Security + Performance**
**Current:** Text bullet lists with performance claims
**Enhancement:**
- **Add:** `cpu-benchmark.png` - near-native CPU performance
- **Add:** `Memory Benchmarks-Full Range.png` - memory efficiency
- **Add:** `edera-attack-with.png` - security isolation visual (contrast with slide 4's edera-attack-without.png)
- **Placement:** Split across security and performance sections
- **Benefit:** Empirical validation of <5% overhead claims

**Code change:**
```markdown
**Security Wins:**
- ✅ Strong isolation between tenants
- ✅ Reduced kernel attack surface
- ✅ Container escape protection
- ✅ Gateway-controlled networking

![Edera security isolation](./assets/diagrams/edera-attack-with.png)

**Performance Wins:**
- ✅ Near-native application performance (<5% overhead)*
- ✅ Sub-second cold starts (~750ms vs 1.9s for Kata)*
- ✅ Low memory overhead
- ✅ Minimal virtualization penalties through paravirtualization

![CPU performance benchmark](./assets/diagrams/cpu-benchmark.png)

![Memory performance benchmark](./assets/diagrams/Memory%20Benchmarks-Full%20Range.png)
```

## Implementation Plan

### Step 1: Add diagram to Slide 4 (Shared Kernel Attack Surface)

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Changes:**
- Insert `edera-attack-without.png` after "Reality Check" bullets
- Add descriptive alt text

**Testing:**
```bash
make build
open dist/2026-01-14-road-to-multitenancy.html
```

**Expected result:** Diagram appears on slide 4, illustrating shared kernel risks

### Step 2: Add diagram to Slide 7 (Kata Containers Startup Time)

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Changes:**
- Insert `container-startup-time.png` after Kata cons section
- Verify benchmark data matches text claims

**Testing:**
```bash
make build
```

**Expected result:** Startup time comparison visible, validates 750ms vs 1.9s claim

### Step 3: Add diagram to Slide 8 (gVisor Syscall Performance)

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Changes:**
- Insert `syscall-performance.png` after gVisor cons section

**Testing:**
```bash
make build
```

**Expected result:** Syscall overhead visualization appears

### Step 4: Add diagram to Slide 9 (Firecracker Startup Times)

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Changes:**
- Insert `startup times.png` with URL-encoded space (`%20`)
- Verify 125ms benchmark aligns with text

**Testing:**
```bash
make build
```

**Expected result:** Firecracker startup benchmark displays correctly

### Step 5: Add architecture diagrams to Slide 14 (Edera Technical)

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Changes:**
- Insert `edera-architecture-overview.png` after Key Technologies
- Insert `type1-vs-type2-hypervisor.png` to explain hypervisor choice

**Testing:**
```bash
make build
```

**Expected result:** Architecture diagrams clarify Edera's technical design

### Step 6: Add performance benchmarks to Slide 15 (Benefits)

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Changes:**
- Insert `edera-attack-with.png` under Security Wins
- Insert `cpu-benchmark.png` under Performance Wins
- Insert `Memory Benchmarks-Full Range.png` under Performance Wins
- URL-encode space in filename

**Testing:**
```bash
make build
```

**Expected result:** Security and performance claims backed by visual evidence

### Step 7: Build and verify all outputs

**Commands:**
```bash
make build          # Build HTML
make build-pdf      # Build PDF
make serve-dist     # Preview with themed index
```

**Verification checklist:**
- [ ] All diagrams render in HTML output
- [ ] All diagrams render in PDF output
- [ ] Images are legible at presentation size
- [ ] No broken image links
- [ ] Diagrams align with Edera V2 theme aesthetics
- [ ] File sizes remain reasonable (<50MB total)

### Step 8: Review speaker notes

**File:** `slides/2026-01-14-road-to-multitenancy.md`

**Changes:**
- Update speaker notes to reference new diagrams
- Add guidance on when to pause and explain visuals

**Example addition for Slide 4:**
```markdown
<!--
Speaker Notes:
...
- Visual on screen shows the attack surface (edera-attack-without.png)
- Point out: one compromised container can escape to host or other containers
- This is the fundamental problem we're solving
-->
```

### Step 9: Accessibility review

**Changes:**
- Ensure all images have descriptive alt text
- Verify diagrams are understandable without color (for colorblind viewers)
- Check contrast ratios on diagrams

**Testing:**
```bash
# Manual review of alt text in markdown
grep "!\[" slides/2026-01-14-road-to-multitenancy.md
```

## Testing Strategy

### Unit Testing

**Image link validation:**
```bash
# Check all image references resolve to files
grep -o '\./assets/diagrams/[^)]*' slides/2026-01-14-road-to-multitenancy.md | while read path; do
  file="slides/${path#./}"
  if [ ! -f "$file" ]; then
    echo "Missing: $file"
  fi
done
```

**Expected:** All image paths resolve to existing files

### Integration Testing

**Test Case 1: HTML Build with Images**

1. Clean build directory: `make clean`
2. Build HTML: `make build`
3. Check HTML includes images: `grep -c '<img' dist/2026-01-14-road-to-multitenancy.html`
4. Open in browser: `open dist/2026-01-14-road-to-multitenancy.html`
5. Navigate through slides, verify all images load

**Expected result:** All 8+ diagrams visible, no broken images

**Test Case 2: PDF Build with Images**

1. Build PDF: `make build-pdf`
2. Open PDF: `open dist/2026-01-14-road-to-multitenancy.pdf`
3. Navigate through slides, verify diagrams render in PDF
4. Check file size: `ls -lh dist/2026-01-14-road-to-multitenancy.pdf`

**Expected result:** PDF includes all diagrams, file size <20MB

**Test Case 3: Themed Index Preview**

1. Build and serve: `make serve-dist`
2. Visit http://localhost:8080
3. Click "Road to Multitenancy" presentation
4. Verify themed landing page works with image-rich presentation

**Expected result:** Presentation loads correctly from index

### Regression Testing

**Existing functionality to verify:**
- [ ] QR code on final slide still displays
- [ ] Footer with event details appears on all pages
- [ ] MARP theme (Edera V2) applies correctly
- [ ] Speaker notes are preserved
- [ ] Pagination works in HTML and PDF
- [ ] Slide classes (title, content, dark) render correctly

**Edge cases:**
- [ ] Filename with spaces (`startup times.png`) encoded properly
- [ ] Large images (556KB `edera-architecture-overview.png`) load without timeout
- [ ] Multiple images per slide don't cause layout issues
- [ ] Diagrams work in both light and dark mode (if theme supports)

## Success Criteria

- [x] Issue #75 requirements analyzed and understood
- [x] Slide 4 includes shared kernel attack surface diagram
- [x] Slide 7 includes Kata container startup time comparison
- [x] Slide 8 includes gVisor syscall performance chart
- [x] Slide 9 includes Firecracker startup benchmark
- [x] Slide 14 includes Edera architecture overview and hypervisor comparison
- [x] Slide 15 includes security isolation diagram, CPU benchmark, and memory benchmark
- [x] All diagrams have descriptive alt text
- [x] Speaker notes reference diagrams appropriately
- [x] HTML build succeeds with all images
- [x] PDF build succeeds with all images
- [x] No broken image links
- [x] Diagrams enhance understanding without cluttering slides
- [x] File sizes remain reasonable (<50MB total output - PDF is 1.7MB)
- [x] Presentation reviewed for visual balance

## Files Modified

1. `slides/2026-01-14-road-to-multitenancy.md` - Add 8 diagram references across 6 slides
2. Speaker notes - Update to reference diagrams (embedded in .md file)

**No new files created** - all assets already exist in `slides/assets/diagrams/`

## Related Issues and Tasks

### Depends On

- None - all assets and infrastructure already exist

### Blocks

- None

### Related

- Issue may have been created after PR #74 which added diagram collection
- Consider creating follow-up issue for custom diagrams if needed (trilemma, cluster consolidation)

### Enables

- Better audience engagement during presentation
- More effective communication of technical concepts
- Professional presentation quality for Edera talks

## References

- [GitHub Issue #75](https://github.com/denhamparry/talks/issues/75)
- Slide deck: `slides/2026-01-14-road-to-multitenancy.md`
- Assets: `slides/assets/diagrams/`
- Theme: `themes/edera-v2.css`
- MARP Documentation: https://marpit.marp.app/image-syntax
- Build system: `Makefile`, `package.json`

## Notes

### Key Insights

1. **Existing assets are comprehensive** - 22 diagrams already available, most directly applicable
2. **MARP image syntax** - Simple markdown `![alt](path)` with relative paths
3. **URL encoding** - Spaces in filenames need `%20` encoding
4. **Balance is critical** - Not every slide needs a diagram; focus on complex concepts
5. **Performance claims** - Benchmarks provide empirical validation for marketing statements

### Alternative Approaches Considered

1. **Create all custom diagrams** - Time-intensive, existing assets are high-quality ❌
2. **Single architecture diagram** - Doesn't address performance/comparison needs ❌
3. **Chosen approach: Reuse existing + minimal custom** - Fast, professional quality ✅

### Diagrams Intentionally Skipped

- **Slide 2-3 (Trilemma)** - Abstract concept, text is sufficient
- **Slide 5 (Separate Machines)** - Text-based pros/cons clear enough
- **Slide 6 (Shared Kernel)** - Covered by Slide 4's diagram
- **Slide 10 (Bare Metal)** - Text conveys the wastefulness adequately
- **Slide 12 (Comparison Matrix)** - Table format already visual
- **Slide 17 (Platform Impact)** - Use case bullets don't need diagrams

**Rationale:** Focus diagrams on technical architecture and performance data, not abstract concepts

### Best Practices

**Accessibility:**
- Always include descriptive alt text: `![Description for screen readers](path)`
- Ensure diagrams are legible when projected (avoid tiny fonts)
- Test in both HTML and PDF formats

**Performance:**
- Optimize image sizes before adding (existing assets are reasonable: 39KB-556KB)
- Use relative paths (`./assets/diagrams/`) for portability
- Avoid embedding base64 images (MARP supports file references)

**Presentation Tips:**
- Pause after showing diagram to let audience absorb
- Point out key elements verbally ("Notice the hypervisor boundary here...")
- Don't read the diagram - explain what it shows
- Use diagrams to reinforce verbal points, not replace them

### Future Enhancements

**Potential new diagrams** (not in this plan, for future issues):
1. **Security-Performance-Scale Triangle** - Visual trilemma for slide 2
2. **Cluster Consolidation Before/After** - Show 100 clusters → 1 cluster for slide 17
3. **Edera Zone Isolation Detail** - Zoomed-in view of paravirtualized zone architecture

**Reason for deferring:** Current plan provides sufficient visual enhancement; these can be created if presentation feedback indicates need
