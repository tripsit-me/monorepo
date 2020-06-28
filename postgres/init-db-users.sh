#!/usr/bin/env bash
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_USER" <<-EOSQL
	CREATE DATABASE tripsit;

	CREATE USER psybot;
	GRANT ALL PRIVILEGES
		ON DATABASE psybot TO tripsit
		WITH PASSWORD 'P@ssw0rd';
EOSQL
