# Version

## Code

```bash
curl -k https://kubernetes/api/v1/namespaces/default/pods
export TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`
echo $TOKEN
curl -k -H "Authorization: Bearer $TOKEN" https://kubernetes/api/v1/namespaces/default/pods
```
