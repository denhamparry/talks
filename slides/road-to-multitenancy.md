---
marp: true
theme: edera-v2
paginate: true
footer: 'January 14th, 2026 | [London Platform User Group (LoPUG)](https://www.meetup.com/london-platform-user-group-lopug/events/311100198)'
---

<!-- _class: title -->

# The Road to Multitenancy

## Running Secure Multi-Tenant Workloads at Scale

Lewis Denham-Parry | [Edera.dev](https://edera.dev)
[London Platform User Group (LoPUG)](https://www.meetup.com/london-platform-user-group-lopug/events/311100198) | January 14th, 2026

<!--
Speaker Notes:
- Welcome everyone to "The Road to Multitenancy"
- Introduce yourself: Lewis Denham-Parry from Edera
- Set context: Platform engineering challenges in multi-tenant environments
- Preview: We'll explore the trade-offs and introduce a better solution
- Estimated time: 20-30 minutes with Q&A
- Encourage questions throughout or save for end
-->

---

<!-- _class: content -->

# The Multi-Tenancy Problem

**Challenge:** How do we run multiple untrusted workloads on shared infrastructure?

- **Security Isolation**: Each tenant's workload must be isolated from others
- **Performance**: Isolation shouldn't degrade application performance
- **Scale**: Must work with orchestrators like Kubernetes
- **Cost**: Shared resources reduce infrastructure costs

**The Dilemma**: Security vs Performance vs Scale

<!--
Speaker Notes:
- Multi-tenancy: running multiple customers/teams on shared infrastructure
- Core challenge: untrusted workloads (you don't control what they run)
- Security: tenant A shouldn't access or affect tenant B
- Performance: isolation mechanisms often add overhead
- Scale: Kubernetes promises density, but security limits it
- Cost: shared resources save money vs dedicated infrastructure
- The trilemma: traditionally you pick 2 of 3 (security, performance, scale)
- Platform engineers face this daily - it's not theoretical
-->

---

<!-- _class: content -->

# Scale vs Isolation: The Orchestrator Dilemma

**Kubernetes Promise:** Run many workloads on shared infrastructure

**Reality Check:**
- Orchestrators like Kubernetes were built for scale
- Multiple workloads share the same worker nodes
- Shared kernel = shared attack surface
- One compromised container can impact others

**The Contradiction:**
> Separate machines for isolation defeats the purpose of orchestration

<!--
Speaker Notes:
- Kubernetes was designed for bin-packing workloads onto nodes
- Core value: efficient resource utilization through sharing
- But sharing creates security concerns in multi-tenant scenarios
- All containers on a node share the Linux kernel
- Kernel vulnerability = all tenants on that node at risk
- Container escape: break out and access host or other containers
- The fundamental contradiction: isolation vs density
- Using separate machines for each tenant? That's pre-Kubernetes thinking
- We need a better solution that preserves both goals
-->

---

<!-- _class: content -->

# Current Approach #1: Separate Machines

**Solution:** Dedicated machines per tenant

**Pros:**
- ✅ Strong isolation guarantee
- ✅ Simple security model
- ✅ No shared kernel concerns

**Cons:**
- ❌ Defeats orchestration purpose
- ❌ Poor resource utilization
- ❌ High infrastructure costs
- ❌ Complex cluster management
- ❌ Doesn't scale economically

<!--
Speaker Notes:
- Most conservative approach: one tenant per machine/cluster
- Security is straightforward: physical/VM isolation
- No shared kernel = no kernel attack surface between tenants
- BUT: this is expensive and wasteful
- Example: 100 tenants = 100 machines, even if most are idle
- Resource utilization typically 20-30% (wasted capacity)
- Operational complexity: managing 100 clusters vs 1
- Infrastructure costs scale linearly with tenant count
- This approach works, but it's economically unsustainable
- Defeats the whole point of using Kubernetes for efficiency
-->

---

<!-- _class: content -->

# Current Approach #2: Shared Kernel

**Solution:** Standard container runtimes (containerd, CRI-O)

**The Security Problem:**
- All containers share the host kernel
- Kernel vulnerabilities affect all tenants
- Container escapes can access host
- Limited isolation between workloads

**Attack Vectors:**
- Kernel exploits
- Container runtime vulnerabilities
- Privilege escalation
- Resource exhaustion attacks

**Verdict:** Not suitable for untrusted multi-tenant workloads

<!--
Speaker Notes:
- Default Kubernetes setup: containerd or CRI-O runtime
- All containers share the Linux kernel on the host
- Container = process isolation using namespaces and cgroups
- But namespaces weren't designed for security boundaries
- One kernel vulnerability can compromise all containers
- Historical examples: Dirty COW, RunC escapes, kernel exploits
- Container escape: break out of namespace and access host
- Privilege escalation: gain root on host from container
- Resource exhaustion: one tenant starves others (noisy neighbor)
- Fine for trusted workloads (your own apps)
- NOT acceptable for untrusted multi-tenant scenarios
- Compliance and security teams rightfully reject this
-->

---

<!-- _class: content -->

# Current Approach #3: Kata Containers

**Solution:** Lightweight VMs for container isolation

**How It Works:**
- Each container runs in its own VM
- Separate kernel per container
- Hardware virtualization for isolation

**Pros:**
- ✅ Strong isolation (separate kernels)
- ✅ Compatible with Kubernetes

**Cons:**
- ❌ Performance overhead (VM startup)
- ❌ Higher memory footprint
- ❌ Slower cold starts (1-2 seconds)
- ❌ Additional infrastructure complexity

<!--
Speaker Notes:
- Kata Containers: lightweight VMs that look like containers
- Each container gets its own VM with its own kernel
- Uses hardware virtualization (KVM, Firecracker)
- Strong isolation: kernel vulnerability in one VM doesn't affect others
- Kubernetes compatible: implements CRI, drop-in replacement
- Security win: finally proper isolation for multi-tenancy
- BUT: performance trade-offs
- VM startup overhead: 1-2 seconds cold start (vs milliseconds for containers)
- Memory: each VM reserves memory for kernel (~100MB overhead)
- High-churn workloads (serverless, batch jobs) suffer most
- Infrastructure: need nested virtualization in cloud, specific host setup
- Good solution, but sacrifices the speed and density we want
-->

---

<!-- _class: content -->

# Current Approach #4: gVisor

**Solution:** Userspace kernel for application isolation

**How It Works:**
- Intercepts system calls
- Implements kernel functionality in userspace
- Limits direct kernel access

**Pros:**
- ✅ Improved isolation vs standard containers
- ✅ Smaller footprint than VMs

**Cons:**
- ❌ Performance penalty (syscall interception)
- ❌ Compatibility issues with some applications
- ❌ Limited system call support
- ❌ Added complexity in debugging

<!--
Speaker Notes:
- gVisor (Google's contribution): userspace kernel approach
- Every system call goes through gVisor's "Sentry" process
- Implements subset of Linux kernel in Go (in userspace)
- Reduces attack surface: app never directly accesses host kernel
- Better than shared kernel, but not as strong as VMs
- Smaller footprint than Kata: no full VM overhead
- BUT: performance tax on system calls
- Syscall interception adds latency (microseconds per call)
- I/O-heavy workloads see 10-30% performance degradation
- Compatibility: doesn't support all syscalls (some apps won't run)
- Debugging: syscall stack traces become complex
- Used by Google Cloud Run and some serverless platforms
- Trade-off: better than nothing, but still costs performance
-->

---

<!-- _class: content -->

# Comparison Matrix: Security vs Performance

| Approach | Security Isolation | Performance | Scale | Complexity |
|----------|-------------------|-------------|-------|------------|
| **Separate Machines** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **Shared Kernel** | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Kata Containers** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **gVisor** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Edera** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**The Gap:** Need security AND performance without compromise

<!--
Speaker Notes:
- Let's visualize what we've learned across these approaches
- Separate machines: secure and performant per tenant, but doesn't scale
- Shared kernel: scales great, but insecure for multi-tenancy
- Kata: good security, but performance suffers (VM overhead)
- gVisor: middle ground, but still performance penalty
- Notice the pattern: every solution compromises something
- Security OR performance OR scale - pick 2, sacrifice 1
- Complexity column: all add operational overhead
- The market gap: no solution delivers all three
- Platform engineers are stuck with trade-offs
- This is where Edera enters the picture
- (Pause before next slide for impact)
-->

---

<!-- _class: dark -->

# Enter Edera

## The Container Runtime Solution

**Focus:** Address the runtime layer to solve multi-tenancy challenges

**Key Insight:**
> By focusing on the container runtime, we can achieve both security isolation AND high performance

**Edera's Approach:**
- Security isolation without VMs
- Performance comparable to native containers
- Compatible with existing orchestrators (Kubernetes)
- Minimal infrastructure changes

<!--
Speaker Notes:
- Introducing Edera: a different approach to the problem
- Key insight: focus on the container runtime layer
- Runtime sits between Kubernetes and the containers
- This is where isolation decisions are made
- By innovating at the runtime, we can optimize both security AND performance
- No VMs required: avoid VM startup and memory overhead
- Near-native performance: minimal syscall overhead
- Kubernetes native: implements CRI interface, drop-in compatible
- Minimal changes: don't need to redesign your platform
- This is the "best of all worlds" solution
- Let's look at how it actually works
-->

---

<!-- _class: content -->

# How Edera Works: Technical Overview

**Container Runtime Integration:**

1. **Drop-in Replacement**: Compatible with Kubernetes CRI
2. **Process Isolation**: Each container in isolated environment
3. **System Call Filtering**: Secure syscall handling without performance hit
4. **Resource Limits**: Per-tenant resource guarantees
5. **Network Isolation**: Automatic tenant network segmentation

**Key Technologies:**
- Advanced namespace isolation
- Secure compute profiles
- Optimized system call handling
- Zero-trust networking

<!--
Speaker Notes:
- Technical architecture: how Edera achieves security + performance
- CRI compatible: works with any Kubernetes distribution (EKS, GKE, AKS, vanilla)
- Process isolation: enhanced beyond standard Linux namespaces
- Syscall filtering: selective syscall access, not blanket interception
- Unlike gVisor (intercepts all), Edera optimizes hot paths
- Resource guarantees: per-tenant CPU/memory/I/O limits enforced
- Network segmentation: automatic tenant isolation at network layer
- Advanced namespaces: goes beyond standard Linux kernel capabilities
- Secure compute profiles: eBPF-based security policies
- Optimized syscalls: fast path for common operations, security for risky ones
- Zero-trust network: no tenant-to-tenant communication by default
- Result: security isolation without the performance penalty
-->

---

<!-- _class: dark -->

# Benefits: Security + Performance Together

**Security Wins:**
- ✅ Strong isolation between tenants
- ✅ Reduced kernel attack surface
- ✅ Container escape protection
- ✅ Zero-trust networking

**Performance Wins:**
- ✅ Near-native application performance
- ✅ Fast cold starts (< 100ms)
- ✅ Low memory overhead
- ✅ No VM layer penalties

**Operational Wins:**
- ✅ Kubernetes-native integration
- ✅ Simple deployment model
- ✅ Minimal infrastructure changes

<!--
Speaker Notes:
- Let's break down the concrete benefits for platform teams
- SECURITY: tenant isolation comparable to VMs, without VMs
- Reduced attack surface: limited syscall exposure per tenant
- Container escape protection: even if they break out, contained
- Zero-trust network: no lateral movement between tenants
- PERFORMANCE: this is where Edera shines vs Kata/gVisor
- Near-native: < 5% overhead on most workloads (vs 10-30% for alternatives)
- Cold starts: milliseconds not seconds (critical for serverless, batch)
- Memory: minimal overhead per container (vs 100MB+ for Kata)
- No VM layer: avoid all virtualization penalties
- OPERATIONAL: platform engineers' favorite part
- Kubernetes native: kubectl, Helm, GitOps all work unchanged
- Simple deployment: update container runtime, no architecture redesign
- Minimal changes: existing workloads run without modification
- Finally a solution that doesn't force painful trade-offs
-->

---

<!-- _class: content -->

# Platform Engineering Impact

**Enable Multi-Tenancy at Scale:**

- **Developer Experience**: Deploy without security concerns
- **Cost Optimization**: Higher workload density per node
- **Simplified Operations**: Single cluster for multiple tenants
- **Compliance**: Meet security requirements without performance trade-offs

**Use Cases:**
- SaaS platforms with customer workloads
- CI/CD pipelines with untrusted code
- Development environments
- Edge computing deployments

**Result:** Build secure, performant platforms that scale

<!--
Speaker Notes:
- What does this mean for platform engineering teams in practice?
- Developer experience: devs can deploy without waiting for security reviews
- Self-service platforms: safe to give tenants direct k8s access
- Cost optimization: 3-5x higher density vs separate machines
- Cluster consolidation: 100 tenants on 20 nodes vs 100 clusters
- Operations: single control plane, unified monitoring, simpler upgrades
- Compliance: pass security audits without sacrificing speed
- Use case 1: SaaS platforms - customer workloads are inherently untrusted
- Use case 2: CI/CD - running arbitrary build scripts safely
- Use case 3: Dev environments - developers testing risky code
- Use case 4: Edge - limited resources, need density AND security
- Bottom line: build platforms that are both secure and fast
- No more "we can't do that for security reasons" blockers
-->

---

<!-- _class: content -->

# Conclusion: The Road Ahead

**Multi-tenancy is no longer a trade-off**

**Key Takeaways:**
1. Traditional solutions sacrifice either security or performance
2. Container runtime is the key layer for isolation
3. Edera delivers both security AND performance
4. Platform engineers can now build scalable multi-tenant systems

**Next Steps:**
- Learn more: [edera.dev](https://edera.dev)
- Try it: [github.com/edera-dev](https://github.com/edera-dev)
- Test your isolation: [github.com/edera-dev/am-i-isolated](https://github.com/edera-dev/am-i-isolated)

<!--
Speaker Notes:
- Wrapping up: the multi-tenancy challenge has a solution
- Key takeaway 1: the old trade-offs (separate machines, Kata, gVisor) force compromises
- Key takeaway 2: runtime layer is the innovation point - not app layer, not orchestrator
- Key takeaway 3: Edera proves you can have security AND performance
- Key takeaway 4: platform engineers can finally build what they've always wanted
- Next steps for the audience:
- Visit edera.dev to learn more about the technology
- GitHub has open source tools and examples
- am-i-isolated: fun tool to test your current isolation
- Run it on your clusters, see how containers can escape
- Demonstrates the problem visually
- We're building the future of secure container orchestration
- The road to multitenancy doesn't require trade-offs anymore
-->

---

<!-- _class: title -->

# Thank You

## Questions?

Lewis Denham-Parry
[Edera.dev](https://edera.dev)

[London Platform User Group (LoPUG)](https://www.meetup.com/london-platform-user-group-lopug/events/311100198) | January 14th, 2026

**Resources:**
- 🌐 [edera.dev](https://edera.dev)
- 💻 [github.com/edera-dev](https://github.com/edera-dev)
- 🔒 [github.com/edera-dev/am-i-isolated](https://github.com/edera-dev/am-i-isolated)

<!--
Speaker Notes:
- Thank the audience for their time and attention
- Open the floor for questions
- Common questions to expect:
  Q: "How does Edera compare to Firecracker/AWS Lambda's approach?"
  A: Firecracker is lightweight VMs, still has VM overhead. Edera is pure containers with runtime-level security.

  Q: "What's the actual performance overhead percentage?"
  A: < 5% for most workloads, compared to 10-30% for gVisor and VM startup delays for Kata.

  Q: "Does this work with existing Kubernetes deployments?"
  A: Yes, CRI-compatible. Update container runtime, workloads run unchanged.

  Q: "What's the learning curve for platform teams?"
  A: Minimal. If you know Kubernetes, you already know how to use it.

  Q: "Is it production-ready?"
  A: Visit edera.dev for current status and case studies.

  Q: "What about Windows containers?"
  A: Currently focused on Linux containers, the primary multi-tenant use case.
- Available after the talk for one-on-one discussions
- Point them to resources on the slide for self-service learning
- Thank event organizers and venue
-->
