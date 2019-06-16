#!/bin/bash

source ./00_common.sh

kops delete cluster $KOPS_NAME --yes