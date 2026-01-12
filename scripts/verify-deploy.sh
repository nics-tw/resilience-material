#!/bin/bash

SITE_URL=$1
EXPECTED_SHA=$2
MAX_RETRIES=20
SLEEP_INTERVAL=30

if [ -z "$SITE_URL" ] || [ -z "$EXPECTED_SHA" ]; then
  echo "❌ Error: Missing parameters."
  echo "Usage: $0 <SITE_URL> <EXPECTED_SHA>"
  exit 1
fi

echo "🔍 Starting deployment verification..."
echo "🌐 Site URL: ${SITE_URL}"
echo "🆔 Expected SHA: ${EXPECTED_SHA}"

for ((i=1; i<=MAX_RETRIES; i++)); do
  echo "⏳ Attempt $i of $MAX_RETRIES: Checking ${SITE_URL}/deploy.txt..."
  
  # Fetch the content of deploy.txt, silenty, with a timeout
  ACTUAL_SHA=$(curl -s --max-time 10 "${SITE_URL}/deploy.txt" | tr -d '[:space:]')
  
  if [ "$ACTUAL_SHA" = "$EXPECTED_SHA" ]; then
    echo "✅ Success: Deployment matches expected SHA."
    exit 0
  fi
  
  echo "⚠️ Actual SHA: ${ACTUAL_SHA:-"(empty or unavailable)"}"
  echo "💤 Waiting ${SLEEP_INTERVAL}s before next retry..."
  sleep $SLEEP_INTERVAL
done

echo "❌ Error: Deployment verification timed out after $MAX_RETRIES attempts."
exit 1
