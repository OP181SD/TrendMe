#!/usr/bin/env bash
# Smoke test: hit the running backend and check each endpoint answers.
# Usage: bash backend/scripts/smoke.sh [BASE_URL]   (default http://localhost:8000)
# Start the backend first: cd backend && uvicorn app.main:app --port 8000
set -u

BASE="${1:-http://localhost:8000}"
pass=0
fail=0

check() { # name  expected_http  actual_http  body_substring  body
  local name="$1" want="$2" got="$3" needle="$4" body="$5"
  if [ "$got" = "$want" ] && printf '%s' "$body" | grep -q "$needle"; then
    echo "  ok   $name (HTTP $got)"
    pass=$((pass + 1))
  else
    echo "  FAIL $name (HTTP $got, want $want; looked for '$needle')"
    printf '       body: %s\n' "$(printf '%s' "$body" | head -c 300)"
    fail=$((fail + 1))
  fi
}

# curl helper: prints "<http_code>\n<body>"
req() { curl -s -o - -w '\n%{http_code}' "$@"; }

echo "Smoke test -> $BASE"

# 1. /health (no keys needed)
out=$(req "$BASE/health"); code=$(printf '%s' "$out" | tail -n1); body=$(printf '%s' "$out" | sed '$d')
check "GET /health" 200 "$code" '"ok"' "$body"

# 2. /search/videos in demo mode (no Oriane; reads stored rows from Supabase)
out=$(req -X POST "$BASE/search/videos" -H 'Content-Type: application/json' \
  --data '{"query":"smoke test","limit":3,"demo":true}')
code=$(printf '%s' "$out" | tail -n1); body=$(printf '%s' "$out" | sed '$d')
check "POST /search/videos (demo)" 200 "$code" '"videos"' "$body"

# 3. /search/videos validation: query too short -> 422
out=$(req -X POST "$BASE/search/videos" -H 'Content-Type: application/json' --data '{"query":"x"}')
code=$(printf '%s' "$out" | tail -n1); body=$(printf '%s' "$out" | sed '$d')
check "POST /search/videos (bad input)" 422 "$code" 'detail' "$body"

echo "----"
echo "passed: $pass   failed: $fail"
[ "$fail" -eq 0 ]
