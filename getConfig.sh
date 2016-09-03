#!/usr/bin/env bash

env=$1
curl http://lsdbooks-${env}-site.s3-website-eu-west-1.amazonaws.com/config.json > build_local/config.json