# GitHub Issue #68: Update 'The Road to Multitenancy' slide deck with additional isolation technologies and Edera use cases

**Issue:** [#68](https://github.com/denhamparry/talks/issues/68)
**Status:** Complete
**Date:** 2026-01-14

## Problem Statement

### Current Behavior

The "The Road to Multitenancy" presentation (`slides/road-to-multitenancy.md`) currently:
- Only mentions **kata** and **gvisor** as isolation technologies (lines 154-216)
- Has limited Edera use case references beyond general multi-tenancy
- Missing case studies and real-world application examples
- Firecracker is mentioned only in speaker notes (line 171) and Q&A section (line 473), not as a main isolation approach
- No dedicated coverage of bare metal isolation approaches
- Limited GPU/AI infrastructure use cases
- No specific references to compliance, edge computing, or production sandbox scenarios

### Expected Behavior

The presentation should:
- Include **Firecracker** and **Bare Metal** as dedicated isolation technology approaches with their own slides
- Add comprehensive Edera use case references for:
  - **Containers**: Untrusted Code/Sandbox, Multi-tenancy, Compliance, Edge Computing
  - **GPUs**: AI Infrastructure, Compliance
- Include case studies where available
- Maintain the existing flow and professional quality
- Continue to build successfully with the Edera V2 theme
- Keep information focused and avoid overwhelming slides

### Impact

- **Completeness**: Provides a more comprehensive view of the isolation technology landscape
- **Sales/Marketing**: Better showcases Edera's diverse use cases with real-world validation
- **Audience Value**: Platform engineers get a complete picture of all available options
- **Professional Quality**: Case studies add credibility and concrete examples

## Current State Analysis

### Relevant Code/Config

**Current Presentation Structure:**

1. **File:** `slides/road-to-multitenancy.md` (494 lines)
2. **Current Isolation Technology Coverage:**
   - Slide 5 (lines 89-117): "Current Approach #1: Separate Machines"
   - Slide 6 (lines 120-148): "Current Approach #2: Shared Kernel"
   - Slide 7 (lines 153-182): "Current Approach #3: Kata Containers"
   - Slide 8 (lines 185-216): "Current Approach #4: gVisor"
   - Slide 9 (lines 220-248): "Comparison Matrix" (includes all approaches + Edera)

3. **Firecracker Current Mentions:**
   - Line 171: In Kata speaker notes: "Uses hardware virtualization (KVM, Firecracker)"
   - Lines 473-474: In Q&A speaker notes comparing Firecracker to Edera

4. **Use Case Coverage:**
   - Slide 13 (lines 380-414): "Platform Engineering Impact" with generic use cases:
     - SaaS platforms with customer workloads
     - CI/CD pipelines with untrusted code
     - Development environments
     - Edge computing deployments
   - No specific Edera use case breakdown by product line (Containers vs GPUs)
   - No case studies referenced

### Related Context

**Edera Product Lines (from issue):**

1. **Edera for Containers:**
   - Untrusted Code / Production Grade Sandbox
   - Multi-tenancy & Isolation
   - Compliance & Regulatory Security
   - Edge Computing

2. **Edera for GPUs:**
   - GPUs & AI Infrastructure
   - Compliance & Regulatory Security

**Isolation Technologies to Add:**

1. **Firecracker:**
   - AWS Lambda's lightweight VM technology
   - MicroVMs with minimal memory footprint (~5MB)
   - Fast startup times (~125ms)
   - Hardware-level isolation via KVM

2. **Bare Metal:**
   - Direct hardware allocation per tenant
   - No virtualization layer
   - Maximum isolation and performance
   - High cost and low density

**Theme Compatibility:**
- Edera V2 theme supports all slide layouts needed
- Comparison matrix can be expanded (table support exists)
- Dark and content slides available for emphasis

## Solution Design

### Approach

**Phased Content Addition:**

1. **Phase 1: Add Isolation Technologies** (Slides 9-10)
   - Insert new slide for "Current Approach #5: Firecracker"
   - Insert new slide for "Current Approach #6: Bare Metal"
   - Update comparison matrix to include both new technologies

2. **Phase 2: Expand Use Cases** (New slides 15-16)
   - Add "Edera for Containers: Use Cases" slide after "Platform Engineering Impact"
   - Add "Edera for GPUs: Use Cases" slide
   - Include case study references where available

3. **Phase 3: Update Cross-References**
   - Update Q&A section to reference Firecracker slide
   - Ensure speaker notes reference new content
   - Maintain narrative flow

**Design Principles:**
- Keep existing slide order intact where possible
- New slides fit naturally into existing narrative
- Use dark slides for emphasis on Edera differentiators
- Maintain 5-7 bullet points per slide maximum
- Include speaker notes with implementation details

### Implementation

#### Change 1: Add Firecracker Isolation Slide

**Location:** Insert after current slide 8 (gVisor), before comparison matrix

**New Slide Content:**

```markdown
---

<!-- _class: content -->

# Current Approach #5: Firecracker

**Solution:** Lightweight microVMs for serverless and container workloads

**Pros:**
- ✅ Strong isolation via hardware virtualization (KVM)
- ✅ Fast startup times (~125ms vs 1-2s for Kata)
- ✅ Minimal memory footprint (~5MB per microVM)

**Cons:**
- ❌ Still VM overhead (vs pure containers)
- ❌ Limited to Linux guests
- ❌ Requires nested virtualization in cloud environments
- ❌ Specialized use case (designed for serverless)

<!--
Speaker Notes:
- Firecracker: AWS's answer to lightweight isolation
- Powers AWS Lambda and Fargate - production-proven at massive scale
- MicroVMs: stripped-down VMs with minimal device emulation
- Fast startup: ~125ms vs 1-2s for Kata (10x improvement)
- Memory: ~5MB overhead vs ~100MB for Kata
- KVM virtualization: hardware-level isolation guarantee
- BUT: still has VM layer, just optimized
- Limited to Linux guests: no Windows support
- Nested virtualization: need specific host configuration in cloud
- Purpose-built for serverless: not general-purpose container runtime
- Trade-off: better than Kata for startup time, but still not container-native
- Good for Function-as-a-Service, less ideal for long-running workloads
-->

---
```

#### Change 2: Add Bare Metal Isolation Slide

**Location:** Insert after Firecracker slide, before comparison matrix

**New Slide Content:**

```markdown
---

<!-- _class: content -->

# Current Approach #6: Bare Metal

**Solution:** Dedicated physical servers per tenant

**Pros:**
- ✅ Maximum isolation (physical separation)
- ✅ Predictable performance (no noisy neighbors)
- ✅ Full hardware control and resource access
- ✅ No virtualization overhead

**Cons:**
- ❌ Extremely poor resource utilization
- ❌ Highest infrastructure costs (dedicated hardware)
- ❌ Slow provisioning (minutes to hours vs seconds)
- ❌ Does not scale with tenant growth

<!--
Speaker Notes:
- Bare metal: the ultimate isolation approach - separate physical servers
- Maximum isolation: physical network boundaries, no shared CPU/memory/kernel
- Predictable performance: no virtualization overhead, no noisy neighbors
- Full hardware access: GPUs, specialized hardware, direct I/O
- No hypervisor tax: applications run at native hardware speed
- BUT: this is the most expensive and least scalable option
- Resource utilization: typical 10-30% (70-90% wasted capacity)
- Infrastructure costs: $100-$500/month per server, multiplied by tenant count
- Provisioning time: minutes to hours vs seconds for containers
- Scaling: adding 100 tenants = buying 100 servers
- This approach only makes sense for specialized workloads:
  - High-security government/financial workloads
  - GPU-intensive ML training with dedicated hardware
  - Compliance requirements mandating physical separation
- For most multi-tenant platforms, bare metal defeats the purpose
- Including this to show the full spectrum of isolation options
-->

---
```

#### Change 3: Update Comparison Matrix

**File:** `slides/road-to-multitenancy.md`
**Lines:** 220-248 (Current comparison matrix slide)

**Current Table:**

```markdown
| Approach | Security Isolation | Performance | Scale | Complexity |
|----------|-------------------|-------------|-------|------------|
| **Separate Machines** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **Shared Kernel** | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Kata Containers** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **gVisor** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Edera** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
```

**Updated Table:**

```markdown
| Approach | Security Isolation | Performance | Scale | Complexity |
|----------|-------------------|-------------|-------|------------|
| **Separate Machines** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **Shared Kernel** | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Kata Containers** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **gVisor** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Firecracker** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Bare Metal** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ |
| **Edera** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
```

**Rationale:**
- **Firecracker:** Strong security (4/5), good performance (4/5), moderate scale (3/5), moderate complexity (3/5)
- **Bare Metal:** Maximum security (5/5), best performance (5/5), poor scale (1/5), simple but inflexible (1/5)

#### Change 4: Add Edera Containers Use Cases Slide

**Location:** Insert after "Platform Engineering Impact" (slide 13, line 380)

**New Slide Content:**

```markdown
---

<!-- _class: dark -->

# Edera for Containers: Use Cases

**Untrusted Code / Production Grade Sandbox:**
- Run arbitrary user code safely in production
- CI/CD build environments executing untrusted scripts
- Code evaluation and testing platforms

**Multi-tenancy & Isolation:**
- SaaS platforms with customer workloads
- Shared Kubernetes clusters with strong tenant boundaries
- Developer self-service environments

**Compliance & Regulatory Security:**
- Meet PCI-DSS, HIPAA, SOC 2 requirements
- Financial services with strict isolation mandates
- Government and defense workload separation

**Edge Computing:**
- Resource-constrained edge nodes with security needs
- IoT gateways running untrusted workloads
- Retail/manufacturing edge deployments

<!--
Speaker Notes:
- Four key use case categories for Edera Containers
- UNTRUSTED CODE: This is the classic multi-tenancy problem
  - Example: GitHub Actions, GitLab Runners - running arbitrary user code
  - Code evaluation platforms: LeetCode, HackerRank, online IDEs
  - Production sandboxes: allow customers to run custom code in your SaaS
  - Key requirement: isolation without sacrificing speed
- MULTI-TENANCY: Shared infrastructure scenarios
  - SaaS platforms: Shopify, Salesforce-style multi-tenant applications
  - Shared k8s clusters: avoid cluster-per-tenant cost explosion
  - Developer environments: give teams isolated namespaces with confidence
  - Key requirement: tenant isolation + resource efficiency
- COMPLIANCE: Meeting regulatory requirements
  - PCI-DSS: payment processing workloads must be isolated
  - HIPAA: healthcare data workloads need strong boundaries
  - SOC 2: security audits require demonstrable isolation
  - Financial services: regulatory mandates for workload separation
  - Key requirement: auditable isolation that passes compliance
- EDGE COMPUTING: Limited resources with security needs
  - Edge nodes: small servers with limited CPU/memory
  - IoT gateways: running third-party code at the edge
  - Retail/manufacturing: edge deployments in untrusted environments
  - Key requirement: lightweight isolation on constrained hardware
- All of these work today with Edera - not theoretical use cases
- For case studies, visit edera.dev
-->

---
```

#### Change 5: Add Edera GPUs Use Cases Slide

**Location:** Insert after "Edera for Containers: Use Cases"

**New Slide Content:**

```markdown
---

<!-- _class: dark -->

# Edera for GPUs: Use Cases

**GPUs & AI Infrastructure:**
- Secure GPU sharing across multiple tenants
- AI/ML training workloads with isolation
- Inference serving with resource guarantees
- Prevent GPU memory attacks and side channels
- GPU-accelerated data processing pipelines

**Compliance & Regulatory Security:**
- Healthcare AI models with patient data isolation
- Financial ML workloads under regulatory mandates
- Government AI systems requiring security boundaries
- Research environments with sensitive datasets

**Key Benefits:**
- 🔒 Isolate GPU memory between tenants
- ⚡ Near-native GPU performance
- 💰 Maximize GPU utilization without security risk
- 📊 Per-tenant GPU resource limits and monitoring

<!--
Speaker Notes:
- GPU use cases: increasingly important as AI workloads grow
- GPUS & AI INFRASTRUCTURE: The core problem
  - GPU sharing: GPUs are expensive ($10k-$50k each), need multi-tenancy
  - Training workloads: multiple teams training models on shared GPU clusters
  - Inference serving: serving multiple models/customers from shared GPUs
  - GPU security: GPUs have their own attack surface and side channels
  - GPU memory attacks: one tenant reading another's GPU memory
  - Side channels: timing attacks via shared GPU execution units
  - Edera isolates GPU access just like CPU/memory isolation
- COMPLIANCE: Regulatory requirements for GPU workloads
  - Healthcare AI: training on patient data requires HIPAA compliance
  - Financial ML: fraud detection models under regulatory oversight
  - Government AI: defense and intelligence with strict security requirements
  - Research: universities with sensitive datasets (genomics, etc.)
  - Key issue: traditional isolation doesn't cover GPU attack surface
- KEY BENEFITS: What Edera for GPUs provides
  - GPU memory isolation: tenants can't access each other's GPU memory
  - Performance: minimal overhead, near-native GPU throughput
  - Utilization: safely share expensive GPUs across multiple tenants
  - Monitoring: per-tenant GPU metrics and resource limits
- This is cutting-edge: most GPU platforms don't have proper isolation
- Shared GPU clusters today are often "trust-based" - not acceptable
- Edera extends container isolation to GPU workloads
- For GPU-specific case studies and benchmarks, visit edera.dev
-->

---
```

#### Change 6: Update Q&A Section Firecracker Reference

**File:** `slides/road-to-multitenancy.md`
**Lines:** 473-474

**Current Text:**

```markdown
  Q: "How does Edera compare to Firecracker/AWS Lambda's approach?"
  A: Firecracker is lightweight VMs, still has VM overhead. Edera is pure containers with runtime-level security.
```

**Updated Text:**

```markdown
  Q: "How does Edera compare to Firecracker/AWS Lambda's approach?"
  A: See slide 9 for Firecracker details. Key difference: Firecracker uses microVMs (~125ms startup, ~5MB overhead), Edera is pure containers with runtime-level security (no VM layer). Both provide strong isolation, but Edera delivers container-native performance.
```

## Implementation Plan

### Step 1: Insert Firecracker Isolation Slide

**File:** `slides/road-to-multitenancy.md`

**Action:** Insert new Firecracker slide after line 216 (end of gVisor slide)

**Changes:**
- Add complete Firecracker slide content (approach, pros/cons, speaker notes)
- Position before comparison matrix slide

**Testing:**

```bash
npm run build
# Verify slide appears correctly in dist/road-to-multitenancy.html
```

### Step 2: Insert Bare Metal Isolation Slide

**File:** `slides/road-to-multitenancy.md`

**Action:** Insert new Bare Metal slide after Firecracker slide

**Changes:**
- Add complete Bare Metal slide content (approach, pros/cons, speaker notes)
- Position before comparison matrix slide

**Testing:**

```bash
npm run build
# Verify slide appears correctly and maintains flow
```

### Step 3: Update Comparison Matrix Table

**File:** `slides/road-to-multitenancy.md`
**Lines:** 220-248

**Action:** Update table to include Firecracker and Bare Metal rows

**Changes:**
- Add Firecracker row: 4 stars security, 4 stars performance, 3 stars scale, 3 stars complexity
- Add Bare Metal row: 5 stars security, 5 stars performance, 1 star scale, 1 star complexity
- Update speaker notes to reference new technologies

**Testing:**

```bash
npm run build
# Verify table renders correctly in HTML
npm run build:pdf
# Verify table renders correctly in PDF
```

### Step 4: Insert Edera Containers Use Cases Slide

**File:** `slides/road-to-multitenancy.md`

**Action:** Insert after line 414 (end of "Platform Engineering Impact" slide)

**Changes:**
- Add dark-themed slide with four use case categories
- Include comprehensive speaker notes with examples
- Reference case studies at edera.dev

**Testing:**

```bash
npm run build
# Verify slide uses dark theme correctly
# Verify bullets are readable and properly formatted
```

### Step 5: Insert Edera GPUs Use Cases Slide

**File:** `slides/road-to-multitenancy.md`

**Action:** Insert after Edera Containers use cases slide

**Changes:**
- Add dark-themed slide with GPU-specific use cases
- Include emoji icons for key benefits section
- Add detailed speaker notes covering GPU attack surface

**Testing:**

```bash
npm run build
# Verify emoji icons render correctly
# Verify dark theme maintains readability
```

### Step 6: Update Q&A Firecracker Reference

**File:** `slides/road-to-multitenancy.md`
**Lines:** 473-474

**Action:** Update Firecracker Q&A answer to reference new slide

**Changes:**
- Add reference to "See slide 9"
- Include specific technical details from new slide
- Maintain comparison clarity

**Testing:**

```bash
# Build and review final presentation
npm run build
npm run build:pdf
# Review complete slide deck for flow and consistency
```

### Step 7: Final Build and Verification

**Actions:**

1. Run complete build process
2. Review HTML output in browser
3. Review PDF output for printing
4. Verify all acceptance criteria met
5. Test presentation flow (advance through all slides)

**Commands:**

```bash
# Full build
make build

# Preview in browser
make serve-dist
# Visit http://localhost:8080 and test road-to-multitenancy.html

# Verify PDF
open dist/road-to-multitenancy.pdf

# Run smoke tests
make test-smoke
```

**Verification Checklist:**
- [ ] Firecracker slide renders correctly
- [ ] Bare Metal slide renders correctly
- [ ] Comparison matrix includes all 7 approaches
- [ ] Edera Containers use cases slide uses dark theme
- [ ] Edera GPUs use cases slide uses dark theme
- [ ] Q&A section references Firecracker slide
- [ ] All speaker notes are present
- [ ] Slide numbering is correct
- [ ] Theme styling is consistent
- [ ] PDF renders properly
- [ ] HTML renders properly
- [ ] Smoke tests pass

## Testing Strategy

### Unit Testing

**Slide Content Validation:**
- Verify all new slides have proper MARP class directives
- Check that all slides have speaker notes
- Ensure bullet points follow 5-7 items maximum guideline
- Validate markdown syntax (proper headers, lists, tables)

**Theme Compliance:**
- Verify dark slides use `<!-- _class: dark -->`
- Check that content slides use `<!-- _class: content -->`
- Ensure no custom styling that breaks theme

### Integration Testing

**Test Case 1: Complete Build**

1. Clean build directory: `make clean`
2. Run full build: `make build`
3. Verify outputs exist:
   - `dist/road-to-multitenancy.html` exists
   - `dist/road-to-multitenancy.pdf` exists
4. Check file sizes are reasonable (HTML ~200-300KB, PDF ~500KB-1MB)

**Expected Result:** Build completes without errors, both outputs generated

**Test Case 2: Theme Rendering**

1. Build HTML: `npm run build`
2. Serve locally: `make serve-dist`
3. Navigate to `road-to-multitenancy.html`
4. Review each new slide:
   - Firecracker slide (content theme, light mint background)
   - Bare Metal slide (content theme, light mint background)
   - Comparison matrix (expanded table)
   - Edera Containers use cases (dark theme, dark teal background)
   - Edera GPUs use cases (dark theme, dark teal background)
5. Verify logo appears in top right (except title slides)
6. Verify pagination appears in bottom right

**Expected Result:** All slides render with correct theme, colors, and layout

**Test Case 3: PDF Generation**

1. Build PDF: `npm run build:pdf`
2. Open `dist/road-to-multitenancy.pdf`
3. Verify:
   - All slides are present
   - Table renders correctly (comparison matrix)
   - Text is readable (no overflow)
   - Colors match theme (dark teal, light mint, cyan)
   - Page breaks occur at slide boundaries

**Expected Result:** PDF is presentation-ready with proper formatting

### Regression Testing

**Existing Functionality:**
- [ ] All original slides remain unchanged (except comparison matrix)
- [ ] Slide numbering updates correctly with new slides inserted
- [ ] Navigation flow works (arrow keys advance/retreat)
- [ ] Title and closing slides maintain formatting
- [ ] Footer metadata displays correctly
- [ ] Edera logo appears consistently

**Edge Cases:**
- [ ] Table with 7 rows renders without overflow (comparison matrix)
- [ ] Long speaker notes don't affect slide rendering (HTML comments)
- [ ] Dark theme slides maintain WCAG AA accessibility (contrast ratios)
- [ ] Emoji characters render in all browsers (GPU use cases slide)

**Smoke Test:**

```bash
make test-smoke
```

**Expected Output:** All smoke tests pass (verify HTML files exist, basic structure valid)

## Success Criteria

### Content Completion

- [x] Firecracker added as isolation technology alternative (slide inserted)
- [x] Bare Metal added as isolation technology alternative (slide inserted)
- [x] Comparison matrix updated with both new technologies
- [x] Untrusted Code / Production Grade Sandbox use case referenced
- [x] Multi-tenancy & Isolation use case referenced
- [x] Compliance & Regulatory Security (Containers) use case referenced
- [x] Edge Computing use case referenced
- [x] GPUs & AI Infrastructure use case referenced
- [x] Compliance & Regulatory Security (GPUs) use case referenced
- [x] Case studies mentioned with reference to edera.dev

### Build Quality

- [ ] Slide deck builds successfully (`make build` completes without errors)
- [ ] HTML output renders correctly in browser
- [ ] PDF output generates without errors
- [ ] Smoke tests pass (`make test-smoke` succeeds)

### Content Quality

- [ ] Content flows naturally with existing presentation
- [ ] Slides focused and avoid information overload (5-7 bullets max)
- [ ] Speaker notes comprehensive and helpful
- [ ] Consistency with existing Edera V2 theme styling maintained
- [ ] Technical accuracy verified (isolation tech specs correct)

### Presentation Ready

- [ ] Slide numbering correct
- [ ] Pagination displays properly
- [ ] Logo appears consistently (except title slides)
- [ ] Footer metadata correct
- [ ] All slides have speaker notes
- [ ] Narrative arc maintained: Problem → Solutions → Edera → Use Cases

## Files Modified

1. `slides/road-to-multitenancy.md`
   - Insert Firecracker isolation slide (~after line 216)
   - Insert Bare Metal isolation slide (~after Firecracker)
   - Update comparison matrix table (~lines 220-248)
   - Insert Edera Containers use cases slide (~after line 414)
   - Insert Edera GPUs use cases slide (~after Containers use cases)
   - Update Q&A Firecracker reference (~lines 473-474)

**Total Changes:**
- +6 new slides added
- 1 table updated (comparison matrix)
- 1 Q&A answer updated
- Estimated final presentation length: ~500-550 lines (up from 494)

**Build Outputs:**
- `dist/road-to-multitenancy.html` (regenerated)
- `dist/road-to-multitenancy.pdf` (regenerated)

## Related Issues and Tasks

### Depends On

- None (issue is self-contained)

### Blocks

- None

### Related

- Issue #66: Original creation of "The Road to Multitenancy" presentation
  - Reference: `docs/plan/issues/66_create_platform_engineering_talk_slide_deck_for_london_event.md`
  - Context: This issue extends the presentation created in #66

### Enables

- Future talks and presentations can reference expanded content
- Sales/marketing materials can leverage case study references
- Technical documentation can link to comprehensive isolation technology comparison

## References

- [GitHub Issue #68](https://github.com/denhamparry/talks/issues/68)
- [Edera Website](https://edera.dev) - For case studies and use case documentation
- [Firecracker Documentation](https://firecracker-microvm.github.io/) - Technical reference for Firecracker specs
- Current Presentation: `slides/road-to-multitenancy.md`
- Edera V2 Theme: `themes/edera-v2.css`
- MARP Documentation: https://marpit.marp.app/markdown

## Notes

### Key Insights

1. **Firecracker Positioning:**
   - Firecracker is already mentioned briefly but needs full treatment
   - Position as middle ground: faster than Kata, but still VM-based
   - Highlight AWS Lambda use case for credibility

2. **Bare Metal Inclusion:**
   - Important to show full spectrum of isolation options
   - Helps contextualize why other approaches exist
   - Reinforces Edera's value by showing the extreme alternative

3. **Use Case Organization:**
   - Separate containers and GPUs use cases for clarity
   - Use dark theme for Edera-focused slides (brand emphasis)
   - Include specific examples in speaker notes for presenter flexibility

4. **Case Study Strategy:**
   - Reference edera.dev for case studies rather than embedding them
   - Keeps slides focused and allows for updated case studies without slide changes
   - Gives audience a call-to-action to visit website

### Alternative Approaches Considered

1. **Approach A: Single Combined Use Cases Slide** - Why not chosen ❌
   - Would require cramming 8+ use cases on one slide
   - Violates "5-7 bullets maximum" guideline
   - Loses distinction between Container and GPU use cases

2. **Approach B: Embed Case Studies in Slides** - Why not chosen ❌
   - Makes slides too text-heavy
   - Case studies become stale (need slide updates when new ones available)
   - Reduces presenter flexibility

3. **Chosen Approach: Separate Slides + External Case Studies** - Why selected ✅
   - Maintains focus and readability
   - Clear separation of concerns (Containers vs GPUs)
   - Presenter can elaborate based on audience interest
   - Case studies accessible via website (always up-to-date)

### Best Practices

**Content Guidelines:**
- Keep bullet points concise (one line each when possible)
- Use speaker notes for elaboration and examples
- Dark slides for Edera differentiation (brand emphasis)
- Content slides for neutral technical comparison

**Presentation Flow:**
- Problem statement → Options → Edera → Use Cases → Conclusion
- Comparison matrix shows all options at once (decision matrix)
- Use case slides come after technical details (practical application)

**Maintenance:**
- Keep case study references generic (visit edera.dev)
- Update technical specs as technologies evolve
- Review comparison matrix ratings periodically

**Monitoring:**
- Track which slides resonate most during Q&A
- Note questions about specific isolation technologies
- Consider splitting or expanding slides based on audience interest
