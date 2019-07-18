#!/bin/bash

source ./00_common.sh

set -x

doctl compute droplet delete $NAME -f