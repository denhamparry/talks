# Edera Diagrams

This directory contains diagrams and visual assets related to Edera's container security architecture.

## Files

### Logos
- **edera-logo.png** (3.9K) - Optimized Edera logo for slides
- **edera-logo-original.png** (4.2K) - Original Edera logo

### Architecture Diagrams
- **edera-architecture-overview.png** (556K) - Shows Edera Zones architecture with Kubernetes, Host OS, and Kernel components. Depicts how Customer A and B Pods with kernels connect to cloud infrastructure (VM/Bare Metal)
- **type1-vs-type2-hypervisor.png** (39K) - Technical diagram illustrating the difference between Type-1 and Type-2 hypervisor architectures. Shows how Type-1 hypervisors boot natively to control hardware versus Type-2 extensions integrated into existing OS kernels

### Security Comparison Diagrams
- **edera-attack-without.png** (218K) - Diagram showing attack vectors without Edera protection. Shows central attack icon connected to Web, AI, DB, and Kernel with multiple vulnerable paths
- **edera-attack-with.png** (203K) - Diagram showing contained threats with Edera protection. Illustrates how Edera isolates workloads to prevent lateral movement

### Performance Benchmarks

#### CPU Performance
- **cpu-benchmark.png** (112K) - Prime number calculation performance across four threads comparing Docker, Edera Protect, gVisor, and Kata Containers
- **CPU Benchmark-Full Range.png** (54K) - Full range CPU benchmark comparison across container runtimes

#### Memory Performance
- **Memory Benchmarks-Full Range.png** (53K) - Full range memory performance benchmarks across container solutions
- **Sysbench-memory Benchmarks.png** (73K) - Sysbench memory throughput tests (read, write operations)
- **memcpy-memset Benchmarks.png** (67K) - Memory copy and set operation benchmarks

#### System Call Performance
- **syscall-performance.png** (104K) - Operations per second comparison for fork, clone, and exec system calls across container runtimes
- **System Call Performance.png** (49K) - System call performance comparison
- **System Call Latency-fork and execve.png** (69K) - Latency measurements for fork and execve system calls
- **System Call latency-getpgid.png** (50K) - Latency measurements for getpgid system call

#### Build & Compile Performance
- **kernel-build-benchmark.png** (108K) - Linux kernel builds per hour comparison using kcbench tool
- **kcbench Runtimes.png** (51K) - Kernel compile benchmark runtime comparison

#### Application Performance
- **nginx Runtimes.png** (48K) - Nginx web server performance benchmarks

#### Startup Performance
- **container-startup-time.png** (52K) - Container startup time comparison across different runtimes
- **startup times.png** (46K) - Container startup time measurements

### Mascot
- **ivy-mascot.png** (20K) - Ivy the axolotl, Edera's mascot character

## Usage in Presentations

To use these diagrams in your MARP presentations:

```markdown
![Edera Architecture](./assets/diagrams/edera-architecture-overview.png)
```

Or for absolute paths from the slides directory:

```markdown
![Attack Without Edera](./assets/diagrams/edera-attack-without.png)
```

**Note for files with spaces in names:**

For diagrams with spaces in filenames (e.g., "CPU Benchmark-Full Range.png"), you can reference them in two ways:

```markdown
![CPU Benchmark](./assets/diagrams/CPU%20Benchmark-Full%20Range.png)
```

Or with proper escaping:

```markdown
![CPU Benchmark](<./assets/diagrams/CPU Benchmark-Full Range.png>)
```

## Sources

All diagrams sourced from official Edera resources:
- **Main website**: https://edera.dev/
- **Documentation**: https://docs.edera.dev/
- **Blog/Stories**: https://edera.dev/stories/
  - Hypervisor architecture: https://edera.dev/stories/why-edera-built-on-xen-a-secure-container-foundation
  - Performance benchmarks: https://edera.dev/stories/security-without-sacrifice-edera-performance-benchmarking
- **Downloaded**: January 14, 2026

## About Edera

Edera is a container-native Type-1 hypervisor that isolates every workload in its own lightweight "zone," preventing container escapes by design while maintaining near-native speed and full Kubernetes compatibility.

Key features:
- Built on Xen hypervisor foundation
- Per-container micro-VMs for complete isolation
- In-zone container runtime written in Rust
- Within 5% of baseline performance
- Over 50% faster than other isolation technologies
