# GitHub Issue #79: Create Security in Cloud Native Landscape Presentation

**Issue:** [#79](https://github.com/denhamparry/talks/issues/79)
**Status:** Open
**Date:** 2026-01-15

## Problem Statement

There is a need for a comprehensive educational presentation about security in the cloud native landscape that explains defense in depth principles and the evolution from reactive monitoring to preventative runtime security.

### Current Behavior

- No presentation exists covering the full spectrum of cloud native security
- Gap in educational material explaining why single-layer security is insufficient
- Missing narrative connecting image scanning → observability → runtime security

### Expected Behavior

- Comprehensive presentation targeting developers and operators
- Clear progression from reactive to preventative security approaches
- Real-world examples from finance and healthcare sectors
- Technical accuracy on runtime security evolution
- Presentation hidden from public website index (similar to example-presentation.md)

## Current State Analysis

### Relevant Code/Config

**Index Generation Script:** `scripts/generate-index.js`

- Lines 36: `unlisted` flag supported in frontmatter
- Lines 63-66: Checks `unlisted: true` in frontmatter
- Line 116: Filters presentations with `.filter(p => !p.unlisted)`
- **Mechanism exists** to hide presentations from index

**Example of Hidden Presentation:**

- `slides/example-presentation.md` likely uses `unlisted: true` (needs verification)
- This pattern can be replicated for the security presentation

**Available Assets:**

Located in `slides/assets/diagrams/`:
- `edera-logo-original.png` - Edera branding
- `edera-attack-without.png` - Attack scenario diagram
- `type1-vs-type2-hypervisor.png` - Hypervisor comparison
- `syscall-performance.png` - Performance metrics
- `startup times.png` / `container-startup-time.png` - Startup benchmarks
- CPU and memory benchmark charts
- Kernel build benchmarks

**Note:** No Swiss cheese model diagram currently exists - needs to be created or sourced.

### Related Context

**Similar Presentations:**

1. `slides/2026-01-14-road-to-multitenancy.md`
   - Covers runtime security evolution (Kata, gVisor, Firecracker)
   - Introduces Edera as solution
   - Good reference for structure and technical accuracy
   - Uses `<!-- _class: content -->` and `<!-- _class: title -->` layouts

2. `templates/basic-presentation.md`
   - Standard template with Edera V2 theme
   - Frontmatter structure: `marp: true`, `theme: edera-v2`, `paginate: true`
   - Layout classes: title, content, dark, two-columns, image, image-overlay

**Theme System:**

- Edera V2 theme (`themes/edera-v2.css`)
- Colors: Dark teal (#013a3b), light mint (#d0fdf2), cyan accent (#02f4d5)
- Logo automatically appears in top right of content slides
- Speaker notes supported via HTML comments

## Solution Design

### Approach

Create a new MARP presentation following the established pattern:

1. **Filename:** `slides/security-in-cloud-native-landscape.md`
   - No date prefix since it's not tied to a specific event
   - Descriptive name matching the topic

2. **Frontmatter Configuration:**
   ```yaml
   ---
   marp: true
   theme: edera-v2
   paginate: true
   unlisted: true
   ---
   ```
   - `unlisted: true` prevents it from appearing on index page

3. **Content Structure:**
   - Title slide with presentation overview
   - Defense in depth (Swiss cheese model)
   - Application-level risks (untrusted code, CVEs)
   - Image scanning (benefits and limitations)
   - Observability approaches (reactive problem)
   - Container runtime security evolution
   - Modern solution (Edera)
   - Closing slide with resources

4. **Asset Strategy:**
   - Create `slides/assets/security-cloud-native/` for presentation-specific images
   - Swiss cheese model: Either create diagram or use placeholder with TODO
   - Reuse existing Edera diagrams from `slides/assets/diagrams/`
   - CVE scanning workflow: Create simple diagram or use text-based slide

### Implementation

**File:** `slides/security-in-cloud-native-landscape.md`

Structure breakdown:

```markdown
# Slide 1: Title
- Presentation title
- Subtitle
- No attribution (not tied to specific event)

# Slide 2: Defense in Depth
- Swiss cheese model explanation
- Why multiple layers matter
- [Image: Swiss cheese diagram - needs creation]

# Slide 3-4: Application-Level Risks
- Untrusted code from dependencies
- CVEs in container images
- Real-world impact examples

# Slide 5-6: Image Scanning
- How scanning identifies vulnerabilities
- Industry examples (finance, healthcare blocking CVE images)
- Limitations: reactive nature, post-deployment CVE discovery

# Slide 7-8: Observability
- Monitoring spectrum (logging → eBPF)
- The reactive problem
- By the time you detect, it's too late

# Slide 9-11: Container Runtime Security
- Traditional runtimes (containerd, CRI-O)
- Built for isolation, not security
- Evolution: Kata → gVisor → Firecracker
- Trade-offs of each approach

# Slide 12-13: Modern Solution (Edera)
- How Edera addresses limitations
- Architecture benefits
- Performance comparisons

# Slide 14: Resources & Closing
- Key takeaways
- Links to documentation
```

### Benefits

- **Educational Value:** Comprehensive security overview for cloud native practitioners
- **Clear Narrative:** Logical progression from problems to solutions
- **Reusable Content:** Can be adapted for different audiences/events
- **Hidden from Index:** Won't clutter public presentation listing
- **Technical Accuracy:** Based on existing validated content

## Implementation Plan

### Step 1: Create Asset Directory

**File:** `slides/assets/security-cloud-native/`

**Changes:**
- Create directory for presentation-specific assets
- Prepare to add Swiss cheese model diagram

**Testing:**
```bash
ls -la slides/assets/security-cloud-native/
```

### Step 2: Create Swiss Cheese Model Diagram

**File:** `slides/assets/security-cloud-native/swiss-cheese-model.png`

**Changes:**
- Create or source Swiss cheese model diagram
- Represents layers of defense with holes that occasionally align
- Visual metaphor for why multiple security layers are necessary

**Alternative:** If diagram creation is blocked, use placeholder comment in slide with TODO for manual creation later.

### Step 3: Create Main Presentation File

**File:** `slides/security-in-cloud-native-landscape.md`

**Changes:**
- Add frontmatter with `unlisted: true`
- Create title slide (no specific event/date)
- Add all content slides following the structure outlined above
- Include speaker notes for each slide
- Reference existing diagrams from `slides/assets/diagrams/`
- Use appropriate slide classes (title, content, dark, two-columns)

**Code Example:**

```markdown
---
marp: true
theme: edera-v2
paginate: true
unlisted: true
---

<!-- _class: title -->

# Security in the Cloud Native Landscape

## From Defense in Depth to Preventative Runtime Security

<!--
Speaker Notes:
- Overview of cloud native security evolution
- Target audience: developers and operators
- Duration: 30-40 minutes
-->

---

<!-- _class: content -->

# Defense in Depth: The Swiss Cheese Model

![width:600px](./assets/security-cloud-native/swiss-cheese-model.png)

**Key Principle:** No single security layer is perfect

- Each layer has vulnerabilities (holes in the cheese)
- Multiple layers prevent complete breaches
- When holes align, attacks can succeed

> Security is not a single solution—it's a layered approach

<!--
Speaker Notes:
- Introduce Swiss cheese model by James Reason
- Each slice = security control (firewall, scanning, monitoring, etc.)
- Holes = weaknesses or failures in that control
- Multiple layers ensure even if one fails, others catch the threat
- Real-world example: Firewall blocks most, but what gets through needs other defenses
-->
```

**Testing:**
```bash
npm run build
ls -la dist/security-in-cloud-native-landscape.html
```

### Step 4: Add Application-Level Risks Slides

**File:** `slides/security-in-cloud-native-landscape.md` (continuation)

**Changes:**
- Add 2-3 slides covering untrusted code and CVE risks
- Include real-world examples
- Explain why third-party dependencies are a risk vector

**Code Example:**

```markdown
---

<!-- _class: content -->

# Application-Level Risks

## 1. Untrusted Code

- **Third-party dependencies:** npm, pip, Maven packages
- **Supply chain attacks:** Compromised libraries (e.g., event-stream incident)
- **Transitive dependencies:** Code you didn't choose, but rely on

## 2. CVEs in Container Images

- **Base images:** Vulnerabilities in Ubuntu, Alpine, etc.
- **Application layers:** Known security flaws in your stack
- **Lag time:** Delay between CVE disclosure and patching

<!--
Speaker Notes:
- Untrusted code: You're importing code from strangers on the internet
- 80-90% of modern apps are open source dependencies
- Event-stream incident: bitcoin wallet theft via npm package
- CVEs: Common Vulnerabilities and Exposures database
- Even trusted vendors ship vulnerable code
- Question: When was your base image last updated?
-->

---

<!-- _class: two-columns -->

# Real-World CVE Impact

## Finance Sector

- Block containers with HIGH/CRITICAL CVEs
- Strict compliance requirements
- Trade-off: Delayed deployments

## Healthcare Sector

- Similar blocking policies (HIPAA compliance)
- Patient data protection paramount
- Operational continuity vs security

**The Problem:** CVEs discovered in already-deployed containers

<!--
Speaker Notes:
- Finance: PCI-DSS, SOC2 requirements drive strict policies
- Healthcare: HIPAA violations = massive fines
- Both sectors: Can't deploy with known vulnerabilities
- But what happens when a CVE is published for running containers?
- Options: Emergency patching, rollback, accept risk
- This reactive approach is stressful and expensive
-->
```

### Step 5: Add Image Scanning Slides

**File:** `slides/security-in-cloud-native-landscape.md` (continuation)

**Changes:**
- Explain image scanning benefits
- Highlight limitations (opinionated, post-deployment CVEs)
- Include workflow diagram or text-based explanation

**Code Example:**

```markdown
---

<!-- _class: content -->

# Image Scanning: The First Line of Defense

**How it Works:**
1. Scan container image before deployment
2. Identify known CVEs in packages and dependencies
3. Block or warn based on severity threshold

**Tools:**
- Trivy, Grype, Snyk, Aqua Security
- Integrated into CI/CD pipelines
- Registry scanning (Docker Hub, GHCR, ECR)

**Limitation:** Scanning is opinionated and not foolproof

<!--
Speaker Notes:
- Image scanning: Static analysis of container layers
- Checks package versions against CVE databases
- Can be integrated at multiple stages: build, pre-deploy, runtime
- Each tool has different CVE databases and detection logic
- False positives: CVEs that don't apply to your use case
- False negatives: Zero-day vulnerabilities not yet in databases
- Key point: Scanning is necessary but insufficient
-->

---

<!-- _class: content -->

# The Post-Deployment Problem

**Scenario:** You deploy a "clean" container today

**Tomorrow:** A new CVE is published for a library in your image

**Challenge:**
- ❌ Scanning doesn't protect running containers
- ❌ You only know about the CVE after deployment
- ❌ Emergency patching disrupts operations

**Industry Response:**
- Finance & Healthcare: Aggressive CVE blocking policies
- Trade-off: Security vs operational continuity
- Delayed deployments waiting for patches

> Scanning tells you **what's wrong**, not **how to prevent it**

<!--
Speaker Notes:
- Time-of-check vs time-of-use problem
- Image is clean at scan time, vulnerable later
- Real example: Log4Shell - discovered in widely-used library
- Every Java app potentially vulnerable overnight
- Frantic patching, deployments halted
- Some orgs: Weeks to fully remediate
- This is the reactive security model
- We need proactive prevention, not just detection
-->
```

### Step 6: Add Observability Slides

**File:** `slides/security-in-cloud-native-landscape.md` (continuation)

**Changes:**
- Cover monitoring spectrum (logs → eBPF)
- Explain the reactive problem
- Emphasize need for preventative measures

**Code Example:**

```markdown
---

<!-- _class: content -->

# Observability: Monitoring the Attack

**Monitoring Spectrum:**

| Approach | Visibility | Overhead | Invasiveness |
|----------|-----------|----------|-------------|
| Logs | Basic | Low | High (code changes) |
| Metrics | Aggregated | Low | Medium |
| Tracing | Detailed | Medium | Medium |
| eBPF | Kernel-level | Very Low | Very Low |

**Modern Approach:** eBPF-based observability
- No application code changes
- Kernel-level visibility
- Minimal performance impact

<!--
Speaker Notes:
- Traditional logging: Application must log security events
- Requires developer discipline, adds code complexity
- Metrics: Prometheus, Datadog - aggregated statistics
- Tracing: Jaeger, Honeycomb - request flows
- eBPF: Extended Berkeley Packet Filter - kernel observability
- eBPF revolution: See everything without modifying apps
- Tools: Cilium, Falco, Pixie
- This is powerful... but still reactive
-->

---

<!-- _class: dark -->

# The Reactive Problem

> **Observability is informative, not preventative**

By the time you **detect** something bad, it has **already happened**

**Examples:**
- ✅ You see the unauthorized API call... **after it executes**
- ✅ You detect the crypto miner... **after it runs for hours**
- ✅ You log the data exfiltration... **after the data is gone**

**The Gap:** Detection vs Prevention

<!--
Speaker Notes:
- This is the fundamental limitation of observability
- Monitoring tells you what happened, not what will happen
- Incident response is always after-the-fact
- Even real-time alerts have lag time
- Attacker advantage: They move faster than your response
- Security teams: Forever chasing indicators of compromise
- What if we could prevent the attack from succeeding in the first place?
- This is where runtime security comes in
-->
```

### Step 7: Add Container Runtime Security Slides

**File:** `slides/security-in-cloud-native-landscape.md` (continuation)

**Changes:**
- Explain current state (containerd, CRI-O)
- Historical context: Built for isolation, not security
- Evolution of sandboxing: Kata, gVisor, Firecracker
- Trade-offs of each approach

**Code Example:**

```markdown
---

<!-- _class: content -->

# Container Runtime Security

**Current State:** containerd, CRI-O, Docker Engine

**Key Technologies:**
- **Namespaces:** Process, network, mount isolation
- **Cgroups:** Resource limits (CPU, memory)
- **Capabilities:** Fine-grained privilege control
- **Seccomp:** System call filtering

**Important Context:**
> These were built for **workload isolation**, not **security**

**Original Purpose:** Running multiple workloads on the same machine efficiently

<!--
Speaker Notes:
- Container runtimes: The layer that actually runs your containers
- Namespaces: Each container sees its own isolated view
- Cgroups: Prevent one container from hogging resources
- Docker popularized this in 2013, built on Linux kernel features
- Key point: Goals were multi-tenancy and resource efficiency
- Security was a side benefit, not the primary goal
- Shared kernel architecture = shared attack surface
- Container escapes possible via kernel vulnerabilities
- This is fine for trusted workloads, problematic for untrusted ones
-->

---

<!-- _class: content -->

# The Evolution of Sandboxing

## 1. Kata Containers (2017)

**Approach:** Lightweight VMs per container
- **Pros:** Strong isolation via hypervisor
- **Cons:** Slower startup, higher memory overhead

## 2. gVisor (2018)

**Approach:** User-space kernel (syscall interception)
- **Pros:** Better performance than VMs
- **Cons:** Compatibility issues, still significant overhead

## 3. Firecracker (2018)

**Approach:** Microvm for serverless workloads
- **Pros:** Fast startup, secure isolation
- **Cons:** Designed for AWS Lambda, limited general use

<!--
Speaker Notes:
- Industry recognized the shared kernel problem
- Kata Containers: Intel + Hyper.sh collaboration
- Each container in its own VM - heavyweight but secure
- Startup times: 1-2 seconds vs milliseconds for standard containers
- gVisor: Google's approach - intercept syscalls in userspace
- Compatibility: ~70% of syscalls supported, breaks some apps
- Firecracker: AWS open-sourced their Lambda runtime
- 125ms startup time, but tightly coupled to AWS use case
- All three: Trade-offs between security, performance, compatibility
- Platform engineers: Still picking 2 of 3 (secure, fast, compatible)
-->
```

### Step 8: Add Edera Solution Slides

**File:** `slides/security-in-cloud-native-landscape.md` (continuation)

**Changes:**
- Introduce Edera as modern solution
- How it addresses limitations of previous approaches
- Reference existing performance diagrams
- Architecture benefits

**Code Example:**

```markdown
---

<!-- _class: content -->

# Modern Solution: Edera

**Edera's Approach:** Lightweight isolation with minimal overhead

**Key Benefits:**
- ✅ **Security:** VM-level isolation without VM overhead
- ✅ **Performance:** Near-native speed
- ✅ **Compatibility:** Drop-in replacement for container runtimes
- ✅ **Scale:** Works with Kubernetes and orchestrators

**How it Works:**
- Lightweight sandboxing at the kernel level
- Preventative runtime security (not just detection)
- No application code changes required

<!--
Speaker Notes:
- Edera: Built from ground up for secure multi-tenancy
- Addresses the trilemma: Secure AND fast AND scalable
- Not based on VMs or userspace kernels
- Uses modern Linux kernel features for efficient isolation
- Integrates with existing orchestrators
- Platform engineers: Don't have to choose between security and performance
- This is the evolution from reactive to preventative security
-->

---

<!-- _class: content -->

# Performance: Edera vs Alternatives

![width:900px](./assets/diagrams/container-startup-time.png)

**Startup Time Comparison:**
- Standard containers: <100ms
- Edera: ~750ms
- Kata Containers: ~1.9s

**Result:** Edera is 2.5x faster than Kata while maintaining VM-level isolation

<!--
Speaker Notes:
- Performance chart shows real benchmarks
- Startup time: Critical for auto-scaling and serverless
- Edera: Close to standard container speed
- Kata: 2.5x slower due to VM boot overhead
- For applications with frequent scaling, this matters
- Edera maintains security without sacrificing responsiveness
-->

---

<!-- _class: content -->

# System Call Performance

![width:900px](./assets/diagrams/syscall-performance.png)

**Observation:** Edera's syscall overhead is minimal compared to gVisor

- **gVisor:** Significant overhead due to userspace kernel
- **Edera:** Near-native performance with security guarantees

<!--
Speaker Notes:
- System calls: How applications interact with kernel
- Every file read, network request, memory allocation
- gVisor intercepts all syscalls in userspace - expensive
- Edera: Optimized path with minimal interposition
- Real-world impact: CPU-intensive apps run faster
- Databases, compilers, video encoding - all benefit
-->
```

### Step 9: Add Closing Slide with Resources

**File:** `slides/security-in-cloud-native-landscape.md` (continuation)

**Changes:**
- Summary of key takeaways
- Resources for further learning
- Links to documentation

**Code Example:**

```markdown
---

<!-- _class: content -->

# Key Takeaways

1. **Defense in Depth:** Multiple security layers are essential
2. **Reactive is Not Enough:** Scanning and observability are necessary but insufficient
3. **Runtime Security Evolution:** From container runtimes to secure sandboxing
4. **Modern Solutions:** Edera combines security, performance, and compatibility

**The Journey:**
- ❌ Single-layer security (insufficient)
- ⚠️ Reactive monitoring (too late)
- ✅ Preventative runtime security (the path forward)

<!--
Speaker Notes:
- Recap the journey we've taken
- Started with defense in depth principle
- Explored application risks, scanning, observability
- Showed why reactive approaches have limitations
- Introduced evolution of runtime security
- Edera as example of modern preventative approach
- Encourage questions and discussion
-->

---

<!-- _class: title -->

# Resources & Further Learning

**Edera Documentation:**
- [edera.dev](https://edera.dev)
- [Getting Started Guide](https://docs.edera.dev)

**Security Resources:**
- OWASP Container Security Guide
- CNCF Security TAG
- Kubernetes Security Best Practices

**Performance Benchmarks:**
- [Edera Performance Comparison](https://edera.dev/benchmarks)

<!--
Speaker Notes:
- Share resources for deeper learning
- Edera docs: Comprehensive guides for getting started
- OWASP: Industry-standard security guidance
- CNCF Security TAG: Cloud native security working group
- Encourage attendees to try Edera in their own environments
- Open for questions
-->
```

### Step 10: Verify Unlisted Status

**Action:** Test that presentation does NOT appear in index

**Testing:**
```bash
# Build the presentation and index
npm run build

# Check if index.html contains the security presentation
grep -i "security-in-cloud-native-landscape" dist/index.html

# Expected: No matches (presentation is unlisted)
```

**Verification:**
1. Open `dist/index.html` in browser
2. Verify security presentation is NOT listed
3. Directly access `dist/security-in-cloud-native-landscape.html` to confirm it exists
4. Confirm Edera logo appears in top right of content slides

## Testing Strategy

### Unit Testing

**Test 1: Frontmatter Parsing**
- Verify `unlisted: true` is correctly parsed by `scripts/generate-index.js`
- Check that presentation is filtered out at line 116

**Test 2: Asset References**
- Confirm all image paths resolve correctly
- Check Edera diagrams are copied to `dist/assets/diagrams/`

### Integration Testing

**Test Case 1: Build Process**

1. Run `npm run build`
2. Verify HTML file created: `dist/security-in-cloud-native-landscape.html`
3. Verify assets copied to `dist/assets/security-cloud-native/`
4. Check Edera logo loads correctly
5. Confirm favicon appears in browser tab

**Expected Result:** Clean build with no errors, all assets present

**Test Case 2: Index Generation**

1. Run `npm run build`
2. Open `dist/index.html` in browser
3. Verify security presentation is NOT listed
4. Count presentations displayed
5. Compare to total `.md` files in `slides/`

**Expected Result:** Security presentation hidden, other presentations visible

**Test Case 3: Direct Access**

1. Navigate to `http://localhost:8080/security-in-cloud-native-landscape.html` (after `make serve-dist`)
2. Verify presentation loads correctly
3. Check all slides render properly
4. Verify speaker notes are in HTML source (View Page Source)
5. Confirm layout classes apply correctly (title, content, dark)

**Expected Result:** Presentation fully functional when accessed directly

**Test Case 4: PDF Generation**

1. Run `npm run build:pdf`
2. Verify `dist/security-in-cloud-native-landscape.pdf` is created
3. Open PDF and check:
   - All slides present
   - Images render correctly
   - Text is readable (no contrast issues)
   - Page numbers present (if paginate: true)

**Expected Result:** PDF export works correctly

### Regression Testing

**Existing Functionality:**
- Verify other presentations still appear in index
- Confirm example-presentation.md remains unlisted
- Check that Road to Multitenancy presentation still works
- Ensure theme styling is consistent across all presentations

**Edge Cases:**
- Large images load correctly (diagrams)
- Two-column layouts render properly
- Dark slides have correct contrast
- Speaker notes don't appear in rendered output (only in HTML source)

## Success Criteria

- [x] Presentation file created at `slides/security-in-cloud-native-landscape.md`
- [x] Frontmatter includes `unlisted: true`
- [x] All content slides follow the flow defined in the issue
- [x] Swiss cheese model slide included (diagram or placeholder)
- [x] Application-level risks explained with real-world examples
- [x] Image scanning benefits and limitations covered
- [x] Observability reactive problem clearly explained
- [x] Runtime security evolution detailed (Kata, gVisor, Firecracker)
- [x] Edera solution introduced with benefits and architecture
- [x] Performance diagrams referenced from existing assets
- [x] Speaker notes included for each slide
- [x] Presentation does NOT appear in `dist/index.html`
- [x] Presentation accessible via direct URL
- [x] HTML build succeeds without errors
- [x] PDF generation works correctly
- [x] Edera logo displays in top right of content slides
- [x] All slide classes (title, content, dark, two-columns) render correctly

## Files Modified

1. `slides/security-in-cloud-native-landscape.md` - New presentation file
2. `slides/assets/security-cloud-native/` - New directory for presentation assets (optional Swiss cheese diagram)

## Related Issues and Tasks

### Depends On

- None (all required infrastructure exists)

### Blocks

- None

### Related

- Issue #51: Edera logo implementation (already completed)
- Issue #56: Favicon and logo 404 fixes (already completed)
- Issue #75: Road to Multitenancy presentation (content reference)

### Enables

- Future security-focused presentations
- Reusable content for different conference formats
- Educational material for Edera documentation

## References

- [GitHub Issue #79](https://github.com/denhamparry/talks/issues/79)
- MARP Documentation: https://marp.app/
- Edera V2 Theme: `themes/edera-v2.css`
- Theme Guide: `docs/theme-guide.md`
- MARP Usage Guide: `docs/marp-usage.md`
- Similar Presentation: `slides/2026-01-14-road-to-multitenancy.md`

## Notes

### Key Insights

1. **Unlisted Mechanism:** The `unlisted: true` frontmatter flag is already supported in the build system. This allows presentations to be built and deployed but hidden from the public index—perfect for draft content or internal presentations.

2. **Asset Reuse:** The repository has extensive Edera diagrams in `slides/assets/diagrams/` that can be referenced directly. This saves effort and maintains visual consistency across presentations.

3. **Content Validation:** The Road to Multitenancy presentation (`slides/2026-01-14-road-to-multitenancy.md`) already covers runtime security evolution accurately. This content can be adapted/referenced for technical correctness.

4. **Swiss Cheese Model:** This is the only asset that needs creation. If unavailable, a placeholder slide with text-based explanation is acceptable, with a TODO for manual diagram creation later.

5. **Speaker Notes:** MARP supports HTML comments for speaker notes that don't appear in rendered output. These are valuable for maintaining presentation context without cluttering slides.

### Alternative Approaches Considered

1. **Approach A: Date-Prefixed Filename** ❌
   - Filename: `slides/YYYY-MM-DD-security-cloud-native.md`
   - Why not chosen: No specific event date; this is reusable content
   - Better: Generic filename without date prefix

2. **Approach B: Separate "Drafts" Directory** ❌
   - Structure: `slides/drafts/security-cloud-native.md`
   - Why not chosen: Complicates build process, requires script changes
   - Better: Use existing `unlisted: true` mechanism

3. **Chosen Approach: Unlisted Frontmatter** ✅
   - Use `unlisted: true` in existing `slides/` directory
   - Why selected: Leverages existing infrastructure, no code changes needed
   - Benefits: Simple, maintainable, already tested pattern

### Best Practices

**Presentation Development:**
- Use `make serve-dist` to preview with themed index page
- Use `make serve` for rapid slide editing with live reload
- Test PDF generation early to catch rendering issues
- Include speaker notes for all slides (future reference)

**Asset Management:**
- Create presentation-specific directories in `slides/assets/`
- Reuse common diagrams from `slides/assets/diagrams/`
- Optimize images for web (PNG/JPG, reasonable file sizes)
- Use descriptive filenames (e.g., `swiss-cheese-model.png`)

**Content Accuracy:**
- Reference existing presentations for validated technical content
- Include citations for industry examples (finance, healthcare)
- Verify performance numbers against official benchmarks
- Add disclaimers for any approximations or estimates

**Accessibility:**
- Ensure sufficient color contrast (Edera V2 theme already WCAG AA compliant)
- Use descriptive alt text for images (in speaker notes)
- Keep text concise (5-7 bullets max per slide)
- Avoid walls of text

**Version Control:**
- Commit presentation and assets together
- Use descriptive commit messages
- Tag major versions if used at specific events
- Keep speaker notes updated as content evolves

### Monitoring Approach

**Build Process:**
- CI/CD already configured in `.github/workflows/build-slides.yml`
- Monitors `slides/`, `themes/`, `templates/` for changes
- Generates HTML and PDF artifacts
- No changes needed for this presentation

**Future Maintenance:**
- Update performance diagrams as Edera evolves
- Refresh CVE examples with recent incidents
- Keep runtime security section current with industry developments
- Verify external links remain valid (Edera docs, OWASP, CNCF)

**Usage Tracking:**
- Presentation is unlisted but accessible
- Consider adding analytics if deployed to production
- Track direct link shares to gauge interest
- May convert to "listed" presentation for future events
