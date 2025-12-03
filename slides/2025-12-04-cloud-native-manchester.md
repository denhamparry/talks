---
marp: true
theme: edera-v2
paginate: true
header: 'Cloud-Native Manchester'
footer: 'December 4th, 2025'
---

# IvySketch: Design Patterns & AI Workflow

**Building GenAI Applications with Kubernetes and AI-Assisted Development**

Lewis Denham-Parry | Cloud-Native Manchester | December 4th, 2025

---

## About This Talk

- **Project Architecture** & Design Patterns
- **Kubernetes Deployment** Strategies
- **AI-Powered Development** Workflow
- **Real-World Examples** from Production

---

<!-- _class: lead -->

# Part 1: Introduction

---

## What is IvySketch?

**IvyBot** - AI-powered Axolotl character designer

- Chat with AI to design custom axolotl characters
- AI generates detailed prompts for image creation
- ComfyUI produces unique axolotl images
- Educational content about Edera (English Ivy)

**Live Demo:** https://ivysketch.me

---

## Technology Stack

**Backend:**

- Go + OpenTelemetry + Prometheus
- Chi router with middleware chain
- NATS JetStream for async processing

**Frontend:**

- React + Vite + TypeScript
- Tailwind CSS styling
- Server-Sent Events (SSE) for streaming

---

## Technology Stack (continued)

**AI Services:**

- **LLM:** Ollama (Qwen2.5:7B)
- **Image Gen:** ComfyUI (Flux.1-schnell)
- **Message Queue:** NATS JetStream

**Observability:**

- Prometheus (metrics)
- Grafana (dashboards)
- Jaeger (distributed tracing)

---

## Deployment

**Infrastructure:**

- **Local Dev:** Docker Compose
- **Production:** Kubernetes (EKS)
- **CI/CD:** GitHub Actions
- **Secrets:** Sealed Secrets

**Result:** Production-ready GenAI application with comprehensive observability

---

<!-- _class: lead -->

# Part 2: Architecture & Design Patterns

---

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────┐
│  Frontend   │────▶│   Backend    │────▶│ Ollama  │
│ React+Vite  │     │  Go Service  │     │   LLM   │
└─────────────┘     └──────┬───────┘     └─────────┘
                           │
                           ▼
                  ┌───────────────┐     ┌──────────┐
                  │  NATS Queue   │────▶│ ComfyUI  │
                  │  JetStream    │     │ ImageGen │
                  └───────────────┘     └──────────┘
                           │
                           ▼
                  ┌────────────────────────────┐
                  │   Observability Stack      │
                  │ Prometheus│Grafana│Jaeger  │
                  └────────────────────────────┘
```

---

## Backend Middleware Chain

```go
// src/main.go - Middleware composition
router := chi.NewRouter()

// Cross-cutting concerns as composable middleware
router.Use(middleware.Metrics)      // Prometheus metrics
router.Use(middleware.Tracing)      // OpenTelemetry spans
router.Use(middleware.CORS)         // Cross-origin requests
router.Use(middleware.RateLimit)    // Rate limiting
router.Use(middleware.Auth)         // API key auth (optional)

// Business logic handlers
router.Post("/chat", handleChat)
router.Post("/image/generate", handleImageGenerate)
```

---

## Middleware Benefits

**Clean Separation of Concerns:**

- Each middleware has single responsibility
- Easy to test in isolation
- Composable and reusable

**Observability Built-in:**

- Every request automatically traced
- Metrics collected for all endpoints
- Structured logging with context

**Security Layers:**

- CORS protection
- Rate limiting
- Optional API key authentication

---

## Frontend Architecture

**React Component Structure:**

```typescript
<App>
  <Header>
    <ModelInfoCard />
  </Header>
  <ChatBox>
    <MessageList>
      <MessageItem />
    </MessageList>
    <ImageGenerationPanel />
    <MessageInput />
  </ChatBox>
</App>
```

---

## Frontend: Streaming Chat

**Server-Sent Events (SSE):**

```typescript
const eventSource = new EventSource("/chat");

eventSource.onmessage = (event) => {
  const token = event.data;
  setMessages((prev) => updateLastMessage(prev, token));
};

eventSource.onerror = () => {
  eventSource.close();
};
```

**Benefits:**

- Real-time token streaming from LLM
- Progressive message rendering
- Better user experience than polling

---

## LLM Integration Pattern

**Ollama with OpenAI-Compatible API:**

```go
client := openai.NewClient(config.BaseURL)

resp, err := client.CreateChatCompletionStream(ctx, openai.ChatCompletionRequest{
    Model: config.Model,
    Messages: messages,
    Stream: true,
})

// Stream tokens to client
for chunk := range resp {
    token := chunk.Choices[0].Delta.Content
    fmt.Fprintf(w, "data: %s\n\n", token)
    flusher.Flush()
}
```

---

## Async Message Queue Pattern

**NATS JetStream for Image Generation:**

```go
// Backend publishes to queue
func (p *Publisher) PublishImageRequest(
    ctx context.Context,
    prompt string,
) error {
    msg := ImageRequest{
        SessionID: sessionID,
        Prompt:    prompt,
        Timestamp: time.Now(),
    }
    return p.js.Publish("ivysketch.images.generate", msg)
}
```

**Benefits:**

- Decouples frontend from slow image generation
- Enables horizontal scaling of workers
- Fault tolerance with message persistence

---

## Image Worker Service

**Consumer Pattern:**

```go
// Image worker consumes from queue
sub, _ := js.Subscribe("ivysketch.images.generate", func(msg *nats.Msg) {
    var req ImageRequest
    json.Unmarshal(msg.Data, &req)

    // Generate image with ComfyUI
    imageURL, err := comfyui.Generate(req.Prompt)

    // Publish result
    js.Publish("ivysketch.images.results", ImageResult{
        SessionID: req.SessionID,
        ImageURL:  imageURL,
    })

    msg.Ack()
})
```

---

## Distributed Tracing with OpenTelemetry

**Semantic Conventions for GenAI:**

```go
span.SetAttributes(
    attribute.String("gen_ai.system", "ollama"),
    attribute.String("gen_ai.request.model", "qwen2.5:7b"),
    attribute.String("gen_ai.operation.name", "chat"),
    attribute.Int64("gen_ai.usage.output_tokens", tokenCount),
)
```

**Follows OpenTelemetry v1.24.0+ conventions**

See: https://opentelemetry.io/docs/specs/semconv/

---

## Distributed Tracing: Trace Propagation

**NATS Message Trace Context:**

```go
// Inject trace context into NATS message
otel.GetTextMapPropagator().Inject(ctx, nats.HeaderCarrier(msg.Header))

// Extract trace context in consumer
ctx := otel.GetTextMapPropagator().Extract(
    context.Background(),
    nats.HeaderCarrier(msg.Header),
)
```

**Result:** End-to-end tracing across services and message queue

---

## Prometheus Metrics

**Custom Metrics for AI Workloads:**

```go
// Time to first token (TTFT)
ivysketch_first_token_latency_seconds

// Token generation rate
ivysketch_chat_tokens_total{type="output"}

// Queue depth monitoring
ivysketch_nats_queue_depth{stream="prompts"}

// ComfyUI generation time
ivysketch_image_generation_duration_seconds
```

---

<!-- _class: lead -->

# Part 3: Kubernetes Deployment Patterns

---

## Kubernetes Structure: Base + Overlays

```
k8s/
├── base/                    # Shared resources
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ollama-deployment.yaml
│   ├── nats-statefulset.yaml
│   └── services.yaml
├── overlays/
│   ├── development/         # Local (kind) config
│   │   └── kustomization.yaml
│   └── production/          # EKS config
│       ├── kustomization.yaml
│       ├── ingress.yaml
│       └── sealedsecret-ivysketch.yaml
└── observability/           # Monitoring stack
    ├── prometheus/
    └── grafana/
```

---

## Kustomize: Base Resources

**base/kustomization.yaml:**

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: ivysketch

resources:
  - namespace.yaml
  - backend-deployment.yaml
  - frontend-deployment.yaml
  - ollama-deployment.yaml
  - nats-statefulset.yaml
  - services.yaml
  - networkpolicies.yaml
```

---

## Kustomize: Production Overlay

**overlays/production/kustomization.yaml:**

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - ../../base

patchesStrategicMerge:
  - deployment-backend.yaml      # Replicas: 3, resources
  - deployment-ollama.yaml        # GPU nodes
  - deployment-image-worker.yaml  # GPU nodes

resources:
  - ingress.yaml
  - sealedsecret-ivysketch.yaml
```

---

## GPU Node Scheduling

**Ollama Deployment - GPU Requirements:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ivysketch-ollama
spec:
  template:
    spec:
      nodeSelector:
        node.kubernetes.io/instance-type: g5.2xlarge
      tolerations:
        - key: nvidia.com/gpu
          operator: Exists
          effect: NoSchedule
      containers:
        - name: ollama
          resources:
            limits:
              nvidia.com/gpu: "1"
```

---

## Sealed Secrets for Production

**Problem:** How to store secrets in Git securely?

**Solution:** Sealed Secrets Controller

```bash
# Encrypt secret with cluster public key
kubectl create secret generic ivysketch-secrets \
  --from-literal=API_KEY=secret123 \
  --from-literal=NATS_PASSWORD=secure456 \
  --dry-run=client -o yaml | \
kubeseal -o yaml > sealedsecret-ivysketch.yaml

# Commit encrypted secret to Git
git add k8s/overlays/production/sealedsecret-ivysketch.yaml
git commit -m "feat(k8s): update production secrets"
```

**Only the cluster can decrypt!**

---

## NetworkPolicies for Security

**Principle: Default Deny, Explicit Allow**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-netpol
spec:
  podSelector:
    matchLabels:
      app: ivysketch-backend
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: ivysketch-frontend
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: ivysketch-ollama
```

---

## Ingress and TLS

**cert-manager for Let's Encrypt:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ivysketch
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - ivysketch.me
      secretName: ivysketch-tls
  rules:
    - host: ivysketch.me
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ivysketch-frontend
                port:
                  number: 80
```

---

## Persistent Storage

**Ollama Model Storage:**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ollama-models
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: gp3
  resources:
    requests:
      storage: 20Gi
```

**Mounted to:** `/root/.ollama/models`

**Benefits:** Models persist across pod restarts, faster startup

---

## Observability Stack Deployment

**Prometheus (Helm):**

```bash
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace observability \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false
```

**ServiceMonitor for Backend:**

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: ivysketch-backend
spec:
  selector:
    matchLabels:
      app: ivysketch-backend
  endpoints:
    - port: metrics
      interval: 15s
```

---

<!-- _class: lead -->

# Part 4: AI-Powered Development Workflow

---

## Documentation-Driven Development

**Core Philosophy:** All work flows through documentation

```
GitHub Issue
    ↓
Plan Document (docs/plan/issues/NNN_*.md)
    ↓
Research Template (analyze codebase)
    ↓
Implementation (AI-guided)
    ↓
Tests (unit, integration, E2E)
    ↓
PR Review (AI + human)
    ↓
Production Deployment
```

**Result:** 326+ completed tasks across 13 phases

---

## Task Planning Structure

**docs/prompt_plan.md:**

```markdown
## Task Phase 1

- [x] Write tests for current Docker Compose functionality
- [x] Set up testing framework and CI pipeline
- [x] Create production frontend Dockerfile with nginx

## Task Phase 2

- [x] Create backend config package with env loader
- [x] Write unit tests for config package
- [x] Update backend to use centralized config

## Task Phase 3

- [x] Write tests for API key authentication
- [x] Implement API key middleware
```

**Sequential execution prevents scope creep**

---

## AI Workflow: Plan Phase

**Command:** `/workflow-issue-plan <issue-number>`

**What it does:**

1. Fetches issue details from GitHub
2. Researches relevant codebase files
3. Creates comprehensive implementation plan

**Output:** `docs/plan/issues/477_create_talk_*.md`

```markdown
# GitHub Issue #477: Create talk

## Problem Statement

[Clear description of the issue]

## Solution Design

[Approach, rationale, trade-offs]

## Implementation Plan

[Step-by-step actionable tasks]
```

---

## AI Workflow: Research Phase

**Command:** `/workflow-research-plan <file>`

**What it does:**

1. Reads research template with key questions
2. Analyzes codebase (Glob, Grep, Read)
3. Studies existing patterns and implementations
4. Creates detailed plan with code examples

**Research Techniques:**

- Find relevant files by pattern
- Search for code patterns
- Review related documentation
- Cross-reference with completed tasks

---

## AI Workflow: Action Phase

**Command:** `/workflow-action-plan <file>`

**What it does:**

1. Reads implementation plan
2. Creates comprehensive todo list
3. Implements all tasks incrementally
4. Runs tests and build verification
5. Updates plan status to "Complete"
6. Runs pre-commit hooks
7. Creates conventional commit

**Ensures:** No steps skipped, all tests pass, hooks validated

---

## AI Workflow: Review Phase

**Command:** `/workflow-code-review`

**Comprehensive Review:**

- Code quality and style compliance
- Error handling and logging patterns
- Test coverage analysis
- Security vulnerability detection
- Performance considerations
- Documentation completeness
- Pre-commit hook compliance

**Result:** High-quality PR ready for human review

---

## Custom Slash Commands

**Project-Specific Commands (.claude/commands/):**

- `/view-site` - View production site with Playwright MCP
- `/nats-check-messages` - Check NATS JetStream queue status
- `/github-issue-create` - Create GitHub issue with prompts
- `/github-action-create-issue` - Analyze failed CI, create issue

**Global Commands (~/.claude/commands/):**

- `/workflow-pr-feedback-plan` - Create plan from PR feedback
- `/workflow-pr-feedback-action` - Fetch, plan, and implement PR feedback
- `/git-pre-commit` - Run pre-commit hooks

---

## Plan Document Structure

**Comprehensive Template:**

```markdown
# GitHub Issue #NNN: Title

## Problem Statement

- Current behavior
- Expected behavior
- Impact

## Current State Analysis

- Relevant code/config
- Related context

## Solution Design

- Approach
- Implementation details
- Benefits

## Implementation Plan

- Step-by-step tasks
- Code examples
- Testing strategy

## Success Criteria

- [ ] Checkboxes for validation
```

---

## Real Example: Issue #310

**Problem:** Backend nil pointer dereference in image generation handler

**Plan Phase Output:**

- **Root cause:** Missing nil check for NATS publisher
- **Impact:** Production crashes when NATS disabled
- **Solution:** Add nil check + tests

**Implementation:** 3 files modified, 2 tests added

**Result:** Fixed in PR #311, deployed to production

**Time Saved:** ~2 hours of investigation + planning

---

<!-- _class: lead -->

# Part 5: Real-World Examples

---

## Example 1: NATS Integration Journey

**Timeline:** Issues #115 → #117 → #120 → #131

1. **#115:** Add NATS infrastructure to K8s

   - Plan: Research NATS deployment patterns
   - Action: Add NATS StatefulSet + auth config

2. **#117:** Integrate NATS for prompt handling
   - Plan: Design publisher/consumer pattern
   - Action: Implement backend NATS client

---

## Example 1: NATS Integration (continued)

3. **#120:** Fix: Chat endpoint not using NATS

   - Review: AI found disconnected implementation
   - Action: Wire up NATS publishing

4. **#131:** Fix: Production auth failures
   - Debug: Authorization violation errors
   - Action: Fix credential propagation

**Result:** Fully functional async message queue

---

## Example 1: Code Snippet

**NATS Publisher:**

```go
// src/pkg/nats/publisher.go
func (p *Publisher) PublishCharacterPrompt(
    ctx context.Context,
    sessionID, prompt string,
) error {
    msg := CharacterPromptMessage{
        SessionID: sessionID,
        Prompt:    prompt,
        Timestamp: time.Now(),
    }

    data, err := json.Marshal(msg)
    if err != nil {
        return fmt.Errorf("marshal: %w", err)
    }

    // Publish with trace context propagation
    return p.js.Publish("ivysketch.prompts.character.create", data)
}
```

---

## Example 2: ComfyUI Image Generation

**Timeline:** Issues #137 → #138 → #146 → #176

1. **#137:** Integrate ComfyUI for AI image generation

   - Plan: Research ComfyUI API and workflow format
   - Action: Implement ComfyUI client package

2. **#138:** Add ComfyUI to Docker Compose
   - Plan: Configure ComfyUI with Flux.1 model
   - Action: Create Dockerfile, add to compose.yaml

---

## Example 2: ComfyUI (continued)

3. **#146:** Fix: ComfyUI pod pending on K8s

   - Problem: Storage class issues, GPU node needed
   - Action: Add GPU node group, fix PVC

4. **#176:** Disable ComfyUI CI/CD builds
   - Problem: 16.3 GB image, CI disk space exhaustion
   - Solution: Local builds only, skip in GitHub Actions

**Lesson:** Large AI model images require infrastructure planning

---

## Example 3: Image Worker Service

**Timeline:** Issues #229 → #233 → #254

1. **#229:** Implement image worker for async generation

   - Plan: Design worker consuming NATS, calling ComfyUI
   - Action: Create worker service with S3 upload

2. **#233:** Implement integration tests for image worker
   - Plan: Test NATS consumer, ComfyUI client, S3 upload
   - Action: Comprehensive test suite with mocks

---

## Example 3: Image Worker (continued)

3. **#254:** Fix: Image worker pods crash-looping in K8s
   - Problem: Missing network policies, incorrect NATS credentials
   - Action: Add egress rules, fix secret propagation

**Result:** Production-ready async image generation pipeline

**Architecture:**

```
Chat → NATS Queue → Image Worker → ComfyUI → S3 → Frontend
```

---

<!-- _class: lead -->

# Part 6: Lessons Learned

---

## What Worked Well

✅ **Documentation-Driven Development**

- Clear plans reduced confusion
- Easy to onboard contributors
- Historical context preserved

✅ **AI-Assisted Planning**

- Faster research phase
- Comprehensive implementation plans
- Consistent documentation quality

✅ **Sequential Task Execution**

- Prevented scope creep
- Dependencies tracked naturally
- Clear progress visibility

---

## What Worked Well (continued)

✅ **Pre-commit Hooks**

- Caught issues before CI/CD
- Consistent code quality
- Prevented secrets from being committed

✅ **Comprehensive Testing**

- Unit, integration, E2E tests
- Testcontainers for integration tests
- High confidence in deployments

✅ **Observability from Day 1**

- Distributed tracing revealed issues quickly
- Custom metrics for AI workloads
- Grafana dashboards for production monitoring

---

## Challenge 1: GPU Node Security

**Issue #161:** Backend → Ollama communication blocked

**Problem:**

- GPU nodes use different security group than worker nodes
- K8s NetworkPolicies correct, AWS security groups blocked traffic

**Solution:**

```bash
# Add ingress rule to cluster security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-cluster \
  --source-group sg-node \
  --protocol all
```

**Lesson:** Multi-layer complexity (K8s + AWS)

---

## Challenge 2: Large Model Images

**Issues #176, #206:** CI/CD disk space exhaustion

**Problem:**

- Ollama image: 4.7 GB (with Qwen2.5:7B model)
- ComfyUI image: 16.3 GB (with Flux.1 models)
- GitHub Actions runners: limited disk space

**Solution:**

- Disabled CI/CD builds for Ollama and ComfyUI
- Local builds only
- Production deployments pull from local registry

**Lesson:** AI model sizes impact CI/CD architecture

---

## Challenge 3: Cold Start Latency

**Issue #113:** 30s first request latency

**Problem:**

- Ollama loads model on first request
- User waits ~30 seconds for first response

**Solution:**

- Preload model in Ollama Dockerfile
- Model baked into Docker image
- First request now <500ms

**Lesson:** Pre-warming AI services improves UX

---

## AI Development Best Practices

1. **Plan Before Code**

   - Use `/workflow-issue-plan` to create plan
   - Review plan with human before starting

2. **Research Thoroughly**

   - Use `/workflow-research-plan` for complex tasks
   - Understand existing patterns first

3. **Test Continuously**
   - Write tests alongside implementation
   - Run tests frequently during development

---

## AI Development Best Practices (continued)

4. **Review Objectively**

   - Use `/workflow-code-review` for PR preparation
   - Verify AI suggestions manually

5. **Document Decisions**

   - Capture rationale in plan documents
   - Update docs as implementation evolves

6. **Avoid Over-Engineering**
   - Keep solutions simple and focused
   - Don't add features beyond requirements

---

## Avoiding AI Pitfalls

❌ **Over-Engineering**

- AI tends to add unnecessary abstractions
- Keep it simple, solve the actual problem

❌ **Trusting AI Without Verification**

- Always review code changes
- Run tests, verify behavior

❌ **Skipping Manual Testing**

- Automated tests don't catch everything
- Test in production-like environment

❌ **Example Contamination**

- AI may use patterns from training data
- Ensure solutions fit your architecture

---

<!-- _class: lead -->

# Part 7: Conclusion & Q&A

---

## Key Takeaways

1. **Architecture:** Microservices + observability = production-ready GenAI apps
2. **Kubernetes:** Base + overlays pattern scales from dev to production
3. **AI Workflow:** Documentation-driven development with AI agents accelerates
   delivery
4. **Real-World:** 326+ tasks completed, production-deployed on EKS

**IvySketch proves AI-assisted development works at scale**

---

## Resources

**Project Links:**

- 🌐 Live Demo: https://ivysketch.me
- 🐙 GitHub: https://github.com/denhamparry/ivysketch
- 📸 Gallery: https://gallery.ivysketch.me

**Documentation:**

- Architecture Guide: `docs/architecture-guide.md`
- Kubernetes Guide: `k8s/README.md`
- AI Workflow: `.claude/commands/`

**Contact:**

- Lewis Denham-Parry
- GitHub: @denhamparry

---

## Questions?

**Thank you!**

🎨 IvySketch - AI-powered Axolotl designer 🤖 Built with AI-assisted development
☸️ Deployed on Kubernetes

**Try it:** https://ivysketch.me
