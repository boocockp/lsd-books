#!/usr/bin/env bash

cp -r build/* build_local
node_modules/http-server/bin/http-server build_local -p8000
