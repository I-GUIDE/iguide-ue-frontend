#!/bin/sh
set -e

echo "Generating Nginx config from template..."

envsubst '${SERVER_NAME} ${PRERENDER_URL}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"