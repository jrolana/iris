set -euo pipefail

FUNCTION_NAME="send-invite-email"
ENV_FILE="${1:-supabase/functions/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  echo "Create it from supabase/functions/.env.example, then add real values for:"
  echo "  GMAIL_EMAIL"
  echo "  GMAIL_APP_PASSWORD"
  exit 1
fi

if command -v supabase >/dev/null 2>&1; then
  SUPABASE_BIN=(supabase)
else
  SUPABASE_BIN=(npx supabase)
fi

"${SUPABASE_BIN[@]}" secrets set --env-file "$ENV_FILE"
"${SUPABASE_BIN[@]}" functions deploy "$FUNCTION_NAME"

echo "Deployed $FUNCTION_NAME and synced secrets from $ENV_FILE"
