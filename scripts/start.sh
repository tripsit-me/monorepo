#!/usr/bin/env bash

set -e
export base_path="$(dirname "$0")/.."

source "$base_path/scripts/source/bootstrap.sh"
source "$base_path/scripts/source/containerctl.sh"

bootstrap
containers_stop
docker-compose up
npx lerna run start
