FROM nginx:alpine

RUN apk add openssl
RUN openssl req \
	-x509 \
	-nodes \
	-days 365 \
	-subj "/C=CA/ST=QC/O=TripSit, Inc./CN=tripsit.local" \
	-addext "subjectAltName=DNS:tripsit.local" \
	-newkey rsa:2048 \
	-keyout "/etc/ssl/private/nginx-tripsit.key" \
	-out "/etc/ssl/certs/nginx-tripsit.crt"
