# Talk Prep

## Song

* [If you're gonna be dumb](https://www.youtube.com/watch?v=4IUvBXCzeCU)

## Prometheus and Grafana

* [Dashboard README.md](ticketing.kubernetes/ticketing.dashboard/README.md)
* [Testing README.md](ticketing.kubernetes/testing/README.md)

```bash
$ kubectl --namespace monitoring port-forward $(kubectl get pod --namespace monitoring -l prometheus=kube-prometheus -l app=prometheus -o template --template "{{(index .items 0).metadata.name}}") 9090:9090
Handling connection for 9090
```

## Grafana

* Access Grafana via [http://localhost:3000](http://localhost:3000):

```bash
$ export POD_NAME=$(kubectl get pods --namespace default -l "app=grafana,release=grafana" -o jsonpath="{.items[0].metadata.name}")
$ kubectl --namespace default port-forward $POD_NAME 3000
Handling connection for 3000
```

* Get Password

```bash
$ kubectl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
...
```

## Tests

```bash
ab -p test.json -T application/json -c 1 -n 200 https://developmentsquad.com/api/tickets
```

## HPA

```bash
$ kubectl apply -f ticketing.queue/hpa.yml
horizontalpodautoscaler.autoscaling/ticketingworker created
```