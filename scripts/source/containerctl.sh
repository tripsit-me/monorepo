#!/usr/bin/env bash

function containers_stop {
	running_containers=$(docker ps -qf name=tripsit)
	if [[ ! -z $running_containers ]]; then
		docker stop $(docker ps -qf name=tripsit)
	fi
}
