#!/bin/sh

set -e

thelounge install thelounge-theme-discordapp
thelounge install thelounge-theme-mininapse
thelounge install thelounge-theme-solarized

if [ "$1" = "thelounge" -a "$(id -u)" = '0' ]; then
	find "${THELOUNGE_HOME}" \! -user node -exec chown node '{}' +
	exec su node -c "$*"
fi

exec "$@"
