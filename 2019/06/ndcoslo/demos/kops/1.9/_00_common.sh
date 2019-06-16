#!/bin/bash

# https://github.com/kubernetes/kops
# https://github.com/kubernetes/kops/blob/master/docs/tutorial/digitalocean.md

export KOPS_NAME=<kops-name>> # where <kops-name> is the name of the cluster you want to setup.

export KOPS_STATE_STORE=do://<bucket-name> # where <bucket-name> is the name of the bucket you set earlier
export DIGITALOCEAN_ACCESS_TOKEN=<access-token>  # where <access-token> is the access token generated earlier to use the V2 API

# DigitalOCcean Spaces is S3 compatible so we just override some S3 configurations to talk to our bucket
export S3_ENDPOINT=ams3.digitaloceanspaces.com # this can also be ams3.digitaloceanspaces.com or sgp1.digitaloceanspaces.com depending on where you created your Spaces bucket
export S3_ACCESS_KEY_ID=<access-key-id>  # where <access-key-id> is the Spaces API Access Key for your bucket
export S3_SECRET_ACCESS_KEY=<secret-key>  # where <secret-key> is the Spaces API Secret Key for your bucket

# this is required since DigitalOcean support is currently in alpha so it is feature gated
export KOPS_FEATURE_FLAGS="AlphaAllowDO"