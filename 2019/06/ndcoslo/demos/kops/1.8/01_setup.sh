#!/bin/bash

source ./00_common.sh

kops create cluster --cloud=digitalocean --name=$KOPS_NAME --networking=flannel --zones=lon1 --ssh-public-key=~/.ssh/id_rsa.pub --kubernetes-version 1.8.0
# kops create cluster --cloud=digitalocean --name=$KOPS_NAME --image=debian-9-x64 --networking=flannel --zones=lon1 --ssh-public-key=~/.ssh/id_rsa.pub --node-size=c-4 --kubernetes-version 1.8.0
# kops create cluster --cloud=digitalocean --name=$KOPS_NAME --image=ubuntu-16-04-x64 --networking=weave --zones=lon1 --ssh-public-key=~/.ssh/id_rsa.pub --node-size=s-8vcpu-32gb --kubernetes-version 1.8.0