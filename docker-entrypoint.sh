#!/bin/sh
set -e

# Replace environment variables in config template
# This allows runtime configuration via Docker environment variables

echo "Generating app-config.json from environment variables..."

# Set defaults if not provided
: ${API_URL:=http://localhost:3000/api}
: ${APP_NAME:=Labyrinth Nexus}
: ${SESSION_TIMEOUT:=1800000}
: ${INACTIVITY_TIMEOUT:=1800000}
: ${REFRESH_BEFORE_EXPIRY:=120000}

# Create app-config.json with environment variables
cat > /usr/share/nginx/html/assets/config/app-config.json <<EOF
{
  "apiUrl": "${API_URL}",
  "appName": "${APP_NAME}",
  "sessionTimeout": ${SESSION_TIMEOUT},
  "inactivityTimeout": ${INACTIVITY_TIMEOUT},
  "refreshBeforeExpiry": ${REFRESH_BEFORE_EXPIRY}
}
EOF

echo "Configuration generated successfully:"
cat /usr/share/nginx/html/assets/config/app-config.json

# Execute the CMD
exec "$@"
