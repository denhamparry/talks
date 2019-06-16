# Security Context

## Demos

### 1

* kubectl

```bash
$ kubectl apply -f security-context-1.yaml
pod/security-context-demo-1 created
$ kubectl get pod security-context-demo-1
$ kubectl exec -it security-context-demo-1 -- sh

```

### 2

* kubectl

```bash
$ kubectl apply -f security-context-2.yaml
pod/security-context-demo-2 created
$ kubectl get pod security-context-demo-2
$ kubectl exec -it security-context-demo-2 -- sh

```

* Container

```bash
$ ps aux
ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4332   724 ?        Ss   16:06   0:00 /bin/sh -c node server.js
2000         7  0.0  0.2 772120 22656 ?        Sl   16:06   0:00 node server.js
2000        12  0.0  0.0   4332   716 ?        Ss   16:06   0:00 sh
2000        18  0.0  0.0  17496  2080 ?        R+   16:07   0:00 ps aux
```

### 3

* kubectl

```bash
$ kubectl apply -f security-context-3.yaml
pod/security-context-demo-3 created
$ kubectl get pod security-context-demo-3
$ kubectl exec -it security-context-demo-3 -- sh
```

* Container

```bash
$ ps aux
```

## Reference

* [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)
