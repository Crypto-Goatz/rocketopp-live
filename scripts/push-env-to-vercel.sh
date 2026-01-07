#!/bin/bash
# Push environment variables to Vercel
# Usage: ./scripts/push-env-to-vercel.sh [env-file] [environment]
#
# Examples:
#   ./scripts/push-env-to-vercel.sh .env.local production
#   ./scripts/push-env-to-vercel.sh .env.staging preview
#
# Requires: VERCEL_TOKEN environment variable or ~/.vercel-token file

set -e

ENV_FILE="${1:-.env.local}"
ENVIRONMENT="${2:-production}"  # production, preview, or development

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get Vercel token
if [ -n "$VERCEL_TOKEN" ]; then
    TOKEN="$VERCEL_TOKEN"
elif [ -f ~/.vercel-token ]; then
    TOKEN=$(cat ~/.vercel-token)
else
    echo -e "${RED}Error: No Vercel token found${NC}"
    echo ""
    echo "To get a token:"
    echo "1. Go to https://vercel.com/account/tokens"
    echo "2. Create a new token"
    echo "3. Either:"
    echo "   - Set VERCEL_TOKEN environment variable"
    echo "   - Save it to ~/.vercel-token"
    echo ""
    echo "Example:"
    echo "  echo 'your-token-here' > ~/.vercel-token"
    echo "  chmod 600 ~/.vercel-token"
    exit 1
fi

# Check env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: $ENV_FILE not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Pushing env vars from $ENV_FILE to Vercel ($ENVIRONMENT)${NC}"
echo ""

# Count vars
TOTAL=$(grep -v '^#' "$ENV_FILE" | grep -v '^$' | grep '=' | wc -l | tr -d ' ')
CURRENT=0
SUCCESS=0
FAILED=0

# Read env file and push each variable
while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    [[ "$line" =~ ^#.*$ ]] && continue
    [[ -z "$line" ]] && continue
    [[ ! "$line" =~ = ]] && continue

    # Extract key and value
    KEY=$(echo "$line" | cut -d '=' -f 1)
    VALUE=$(echo "$line" | cut -d '=' -f 2-)

    # Skip if key is empty
    [ -z "$KEY" ] && continue

    CURRENT=$((CURRENT + 1))
    echo -n "[$CURRENT/$TOTAL] $KEY... "

    # Push to Vercel using the API
    RESPONSE=$(curl -s -X POST "https://api.vercel.com/v10/projects/rocketopp-live/env" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"key\": \"$KEY\",
            \"value\": \"$VALUE\",
            \"type\": \"encrypted\",
            \"target\": [\"$ENVIRONMENT\"]
        }" 2>&1)

    # Check if it's a duplicate (already exists)
    if echo "$RESPONSE" | grep -q "already exists"; then
        # Try to update instead
        RESPONSE=$(curl -s -X PATCH "https://api.vercel.com/v9/projects/rocketopp-live/env" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"key\": \"$KEY\",
                \"value\": \"$VALUE\",
                \"type\": \"encrypted\",
                \"target\": [\"$ENVIRONMENT\"]
            }" 2>&1)

        if echo "$RESPONSE" | grep -q '"key"'; then
            echo -e "${GREEN}updated${NC}"
            SUCCESS=$((SUCCESS + 1))
        else
            echo -e "${YELLOW}skipped (exists)${NC}"
        fi
    elif echo "$RESPONSE" | grep -q '"key"'; then
        echo -e "${GREEN}added${NC}"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}failed${NC}"
        FAILED=$((FAILED + 1))
        # Uncomment to debug:
        # echo "Response: $RESPONSE"
    fi

done < "$ENV_FILE"

echo ""
echo -e "${GREEN}Done!${NC} $SUCCESS succeeded, $FAILED failed"
echo ""
echo "Note: You may need to redeploy for changes to take effect:"
echo "  vercel deploy --prod --token \$VERCEL_TOKEN"
