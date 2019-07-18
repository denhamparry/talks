#!/bin/bash

source ./00_common.sh

set -x

doctl compute droplet create $NAME --size $SIZE --image $IMAGE --region $REGION --ssh-keys $SSHKEY

doctl compute droplet list

echo "doctl compute droplet list"