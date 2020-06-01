#!/bin/sh

set -e

DOMAIN="tripsit.local"
KEY_PATH="/etc/ssl/private/nginx-tripsit.key"
CERT_PATH="/etc/ssl/certs/nginx-tripsit.crt"

# Generate TLS certification
if [ ! -f "$KEY_PATH" ]; then
	apk add openssl
	openssl req \
		-x509 \
		-nodes \
		-days 365 \
		-subj "/C=CA/ST=QC/O=TripSit, Inc./CN=$DOMAIN" \
		-addext "subjectAltName=DNS:$DOMAIN" \
		-newkey rsa:2048 \
		-keyout "$KEY_PATH" \
		-out "$CERT_PATH"
	nginx -s reload
fi

nginx -g "daemon off;"
