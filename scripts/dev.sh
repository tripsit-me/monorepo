#!/usr/bin/env bash
set -e
source "$(dirname "$0")/include.sh"

if [[ ! -d "$base_path/node_modules" ]]; then
	bootstrap
fi
docker-compose up -d
npx lerna run dev
