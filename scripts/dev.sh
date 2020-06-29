#!/usr/bin/env bash

set -e

source_path="$(dirname "$0")/source"

source "$source_path/bootstrap.sh"
source "$source_path/containerctl.sh"

bootstrap
containers_stop
docker-compose up -d
npx lerna run dev
