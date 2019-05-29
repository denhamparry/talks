# How do we become Cloud Native

## **Lewis Denham-Parry**

---

## Take **Photos**

^
Feel free

---

# [fit] **About** me

---

![](assets/jetstack.svg)

---

![](assets/cnw.jpg)

---

## **Mental Health**

# [fit] bit.ly/2K8HeoV

^
I've suffered
Find professional advice
OSMI Guideline for mental wellness at conferences handbook

---

## **Climate Change**

# [fit] bit.ly/2WopFYw

^
Global emissions 3% data centres

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
* Over 260 members including the World’s largest public cloud and enterprise software companies as well as dozens of innovative startups.

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
* Discuss the concept.

---

# Break **it** down

---

![fit](assets/cncf-trailmap-0.png)

---

# [fit] **1.** Containers

^
Who uses containers

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

# [fit] **2.** CI/CD

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

# [fit] 3. Orchestrations and Application definition

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

# [fit] Want to know more

---

## [fit] Tomorrow 14:30 (Room 2)
# [fit] **Workshop: Show me the Kubernetes**
## [fit] Salman Iqbal and Lewis Denham-Parry

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

# What's the tiller

^
Tiller used to write the Yaml and apply it to Kubernetes.
Required lots of access.
Security vulnerability.

---

# Security

^
Kubernetes is product first security second.
How do you manage security?

---

## [fit] 17:15 (Keynote)
# [fit] **Microservices & containers: getting your security team on board**
## [fit] Liz Rice

^
I follow the leaders.
Liz is one of them.
Works for aqua.

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

# [fit] 4. Observability and Analysis

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

# [fit] 5. Service Proxy, Discovery and Mesh

---

# [fit] 6. Network and Policy

---

![fit](assets/cncf-trailmap-2.png)

---

# [fit] 7. Distrabuted data and storage

---

# [fit] 8. Streaming and messaging

---

# [fit] 9. Container registry and runtime

---

# [fit] 10. Software distribution

---

# But why

---

# Empower people with tools

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

## 15:30 (Room 3)
# **Breaking Down Problems**
## Matt Heath

---

# [fit] This **could** be your **UHP***

^
Making developers lives easier.
Focusing on shipping code.

---

# [fit] Unique **hiring** policy

---

# **Change**

^
Change isn't easy.
What I had wasn't working for me.
This is.

---

# [fit] Thank you

## [fit] **@denhamparry**

# [fit] questions