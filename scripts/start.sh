#!/usr/bin/env bash
set -e
source "$(dirname"$0")/include.sh"

bootstrap
docker-compose up -d
npx lerna run start
