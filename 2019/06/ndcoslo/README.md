# What vulnerabilities? Live hacking of containers and orchestrators

## Description

We often see alerts about vulnerabilities being found in frameworks that we use today, but should we really care about them? What's the worst that can happen? Can someone own a container? Could they run a bitcoin miner on my servers? Are they able to own the cluster?

In this talk, we look at one of the worst-case scenarios from a real-world perspective. We have a red team member attempting to hack a cluster we own with a live hack on stage whilst the blue team member tries to stop it from happening.

We'll discuss developing best practices, implement security policies and how best to monitor your services to put preventative measures in place.

## Location

* NDC Oslo
* https://ndcoslo.com/talk/what-vulnerabilities-live-hacking-of-containers-and-orchestrators/

## References

* [Top 5 Docker Vulnerabilities](https://resources.whitesourcesoftware.com/blog-whitesource/top-5-docker-vulnerabilities)

### CVE-2018-1002105

* https://github.com/evict/poc_CVE-2018-1002105
* https://github.com/gravitational/cve-2018-1002105
* https://www.exploit-db.com/exploits/46052
* https://www.exploit-db.com/exploits/46053
* https://www.twistlock.com/labs-blog/demystifying-kubernetes-cve-2018-1002105-dead-simple-exploit/
* https://blog.appsecco.com/analysing-and-exploiting-kubernetes-apiserver-vulnerability-cve-2018-1002105-3150d97b24bb