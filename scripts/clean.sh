#!/usr/bin/env bash
source "$(dirname "$0")/include.sh"

echo "Removing docker containers and volumes..."
docker stop $(docker ps -qf name=tripsit)
docker rm $(docker ps -qaf name=tripsit)
docker volume rm $(docker volume ls -qf name=tripsit)

echo "Removing node modules & lerna clean..."
npx lerna clean -y
rm -rf node_modules
npm i

echo "Installing node modules..."
bootstrap
docker-compose up -d
