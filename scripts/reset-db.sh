#!/usr/bin/env bash
set -e

containers=$(docker ps -qaf name=tripsit_name)
if [[ -z $containers ]]; then
	docker rm -f $containers
fi

volumes=$(docker volume ls -qf name=tripsit-db)
if [[ -z $volumes ]]; then
	docker volume rm $volumes
fi

docker-compose up -d db
npm run migration:latest
