#!/usr/bin/env basn

function docker_clean {
	echo "Removing docker containers and volumes..."
	docker stop $(docker ps -qf name=tripsit) 2> /dev/null || true
	docker rm $(docker ps -qaf name=tripsi) 2> /dev/null || true
	docker volume rm $(docker volume ls -qf name=tripsit) 2> /dev/null || true
}
