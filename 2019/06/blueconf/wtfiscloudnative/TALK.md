# WTF IS Cloud Native

## **Lewis Denham-Parry**

---

## Take **Photos**

^
Feel free

---

![](assets/jetstack.svg)

^
Solutions engineer.
Consulting, training and opens source.

---

![](assets/cnw.jpg)

^
Come talk to me.

---

## **Mental Health**

* OSMI Conference Handbook: https://bit.ly/2K8HeoV

^
I've suffered.
Find professional advice.
Open Sourcing Mental Illness.
OSMI Guideline for mental wellness at conferences handbook.

---

## **Climate Change**

* Talk: https://bit.ly/2WopFYw
* Whitepaper: https://bit.ly/2I67oWD
* Petition: https://bit.ly/2wrS1CE

^
Global emissions 3% data centres.
Paul Johnston and Anne Currie.

---

# [fit] Follow the **yellow** brick road

---

# [fit] Follow the **CNCF** road

---

# [fit] What is the **CNCF**?

---

![60%](assets/cncf-horizontal.png)

---

![60%](assets/cncf-horizontal.png)

* Open source software foundation
* Host and nurture components of cloud native software stacks
* Members including the Worlds largest public cloud and enterprise software companies as well as dozens of innovative startups.

---

# [fit] Follow the **CNCF** road

---

# [fit] Follow the **CNCF Trail Map**

---

# [fit] https://**l**.cncf.io

---

# [fit] https://**landscape**.cncf.io

---

![fit](assets/landscape.png)

---

![left 50%](assets/cncf_trailmap.png)

# Trail map

* Map through the previously uncharted terrain of cloud native technologies.
* There are many routes to deploying a cloud native application.
* CNCF Projects represent a particularly well-travelled path.

---

![left 50%](assets/cncf_trailmap.png)

# Plan of action

* Go through each step.
* Discuss after if you want.
* Its a lightning talk but I love you.

---

# Break **it** down

---

![fit](assets/cncf-trailmap-0.png)

---

# **1.** 

## Containers

^
Who uses containers

---

![120%](assets/docker.gif)

---

# [fit] What do they **replace**

^
Physical boxes and VMs.
We still use them.
More efficiently.

---

## [fit] Control Groups + Namespaces

# [fit] = **Docker**

^
How can we be more efficient.
Manage applications alongside each other.

---

# Focus on **containers**

^
Get the best results from well structured containers.

---

# **2.**

## CI/CD

---

# [fit] **Avoid**
## [fit] works on my machine

^
Think of it as becoming your own dependency.
Do you want to wake up at 2am?

---

# [fit] Build **dependencies**

^
These should be contained as much as possible.

---

# [fit] **Multi-stage** builds

^
Build dependencies can be in base image.
Helps create smaller images.
Reduce attack surface within containers.

---

# [fit] **Automate**
# [fit] everything

^
Empower people to make changes.
If you make 10's, 100's or 1000's of changes a day they become trivial.
Remember fortnightly releases.

---

# **3.** 

## Orchestrations and Application definition

---

# Kubernetes

^
There are other options available.
Mesos and Nomad name a few.
Kubernetes won the war.

---

## [fit] Q. What manages containers
# [fit] A. **Containers**

^
Its just containers running containers.

---

![120%](assets/kubernetes0.gif)

---

![120%](assets/kubernetes1.gif)

---

# [fit] **NODES**
## [fit] master
## [fit] worker

^
Master nodes manage the cluster.
Its just an API.
Workers run containers.
You can scale your nodes.

---

# [fit] What are we **working** with

^
What's in the box

---

## [fit] **Pods**
## [fit] Deployments
## [fit] Services
## [fit] Ingresses

^
One or more containers.

---

## [fit] Pods
## [fit] **Deployments**
## [fit] Services
## [fit] Ingresses

^
Manages your pods.

---

## [fit] Pods
## [fit] Deployments
## [fit] **Services**
## [fit] Ingresses

^
Internal load balancer for pods.

---

## [fit] Pods
## [fit] Deployments
## [fit] Services
## [fit] **Ingresses**

^
External traffic load balancer for services.

---

# YAML

^
Used to create these.

---

# [fit] Helm

^
What is helm

---

# [fit] **Share** applications

^
We listed some kubernetes fundamentals.

---

# [fit] Share **Helm charts**

^
Helm uses charts to share applications

---

# [fit] What's the **tiller**

^
Tiller used to write the Yaml and apply it to Kubernetes.
Required lots of access.
Security vulnerability.

---

# Security

^
Kubernetes is product first security second.

---

# [fit] **Congratulations**

^
These first 3 steps are the min to be cloud native.

---

# [fit] **What's** next

^
We have more steps

---

![fit](assets/cncf-trailmap-1.png)

^
Lets look at why we'd want to continue our journey.

---

# **4.**

## [fit] Observability and Analysis

^
What's going on.

---

# [fit]  What's **happening** now

^
Wait, I'm Welsh...

---

# [fit]  What's **occurring**

^
This is good to know.
Dashboards are nice.
But what happens when something goes wrong.

---

# [fit] What has **occurred**

^
This is arguably more important.
Think of debugging your code via steps.
We shouldn't care where our application runs.
Should be able to step through the logs.

---

# [fit] But what about the **data**

^
Spoke about nodes and containers.
We can scrape information about them.
Can also create custom endpoints to scrape.

---

# **5.** 

## Service Proxy, Discovery and Mesh

---

# Scalability

^
What this really means

---

# [fit] **Where** is it

^
We don't really care where it is.
But need to know where to send traffic to.

---

# [fit] **Sidecar proxy**
# [fit] Service discovery
# [fit] Load balancing
# [fit] Authentication and authorization
# [fit] Encryption

^
A sidecar proxy runs alongside a pod.
Route/proxy traffic to and from the container it runs alongside.

---
# [fit] Sidecar proxy
# [fit] **Service discovery**
# [fit] Load balancing
# [fit] Authentication and authorization
# [fit] Encryption

^
Find/discover a healthy, available instance of the other service.
Typically performs a DNS lookup for this purpose.

---

# [fit] Sidecar proxy
# [fit] Service discovery
# [fit] **Load balancing**
# [fit] Authentication and authorization
# [fit] Encryption

^
Most orchestration frameworks already provide Layer 4 (transport layer) load balancing.
Layer 7 (application layer) load balancing.

---

# [fit] Sidecar proxy
# [fit] Service discovery
# [fit] Load balancing
# [fit] **Authentication and authorization**
# [fit] Encryption

^
Can authorize and authenticate requests made from both outside and within the app.

---

# [fit] Sidecar proxy
# [fit] Service discovery
# [fit] Load balancing
# [fit] Authentication and authorization
# [fit] **Encryption**

^
Can encrypt and decrypt requests and responses.

---

# **6.**

## Network and Policy

---

# [fit] Container Network Interface **(CNI)**

^
Between the network plugins and container execution.
Designed to be a minimal specification.
Adding and removing contianers when deleted.

---

# [fit] Open Policy Agent **(OPA)**

^
OPA is a lightweight general-purpose policy engine that can be co-located with your service.
You can integrate OPA as a sidecar, host-level daemon, or library.
A policy is a set of rules that governs the behaviour of a service.

---

![fit](assets/cncf-trailmap-2.png)

---

# **7.** 

## Distributed data and storage

^
Problems with storage.
Containers stop and lose state.
Number of solutions.

---

# [fit] Sharding

^
Sharding your database involves breaking up your big database into many, much smaller databases that share nothing and can be spread across multiple servers. 
These small databases are fast, easy to manage, and often are much cheaper to use as they are often implemented by using open source licensed databases.

---

# [fit] Node **Storage**

^
Data can be stored on the node.
What happens when containers move to another node.

---

# [fit] **Key value** pairs

^
Out the box Kubernetes uses etcd.
Use Raft protocol.

---

# **8.** 

## Streaming and messaging

^
Alternatives to REST

---


# g**RPC**

^
Remote procedure call
Low latency, highly scalable, distributed systems.
Designing a new protocol that needs to be accurate, efficient and language independent.

---

# [fit] Is it **better**

^
gRPC largely follows HTTP semantics over HTTP/2
Allow for full-duplex streaming.

---

# [fit] **NATS**

^
A simple, high performance open source messaging system.

---

# [fit] pub / **sub**

^
NATS is an open source, lightweight, high-performance cloud native infrastructure messaging system.
It implements a highly scalable and elegant publish-subscribe (pub/sub) distribution model.

---

# **9.** Container registry and runtime

^
When we started talking about containers I mentioned Docker.

---

# [fit] Container **Registry**

^
Why not just use Docker hub.
Dependencies.
Security.

---

# [fit] What's **in** your containers

^
Containers are built on other images.
What if there's an issue with an image.
Can we scan the images that are being used.

---

# [fit] **Runtimes**

^
There's more than just Docker.
Different options have different features.
Security for example.  GVisor.

---

# **10.** Software distribution

^
How do we know what we're running is what we built.

---

## [fit] **Case study**
# [fit] Chicago Tylenol Murders

^
1982
Laced with potassium cyanide.
Seven confirmed deaths.
Factory > Distribution.
Plastic seal

---

# How do we do this with **containers**

^
Digitally sign them.

---

# But **why**

---

# **Empower** people with tools

^
Should you have to learn all of this?
Problems of growth.
What about onboarding new people.

---

# None of this should be your **USP**

^
Unique selling point.
You shouldn't use something for using this technology.
I use Monzo - Matt Heath.

---

# [fit] This **could** be your **UHP***

^
Think I made this up.

---

# [fit] Unique **hiring** policy

^
Making peoples lives easier.
Focusing on shipping code.
This isn't a new technology.
It's a new mindset.

---

# Shift **left**

^
Pick up problems as quickly as possible.
How can we do this.

---

## [fit] **KubeCon Barcelona 2019**

## Search YouTube

---

# **Change**

^
Change isn't easy.
What I had wasn't working for me.
This is.
So back to the start.

---

# [fit] Thank you

## [fit] **@denhamparry**

##  slides - twitter???