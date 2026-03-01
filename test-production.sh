#!/bin/bash

# Test Script for Student Management API
# Usage: ./test-production.sh <base_url>
# Example: ./test-production.sh https://student-management.vercel.app

BASE_URL="${1:-http://localhost:3000}"
HEADER_JSON="Content-Type: application/json"

echo "=== Student Management API Test Suite ==="
echo "Base URL: $BASE_URL"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test Counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function for testing
test_endpoint() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  local expected_status="$5"

  echo -n "Test: $name ... "

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "$HEADER_JSON")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "$HEADER_JSON" \
      -d "$data")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "$expected_status" ]; then
    echo -e "${GREEN}PASS${NC} (HTTP $http_code)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo "$body" | head -n 1
  else
    echo -e "${RED}FAIL${NC} (Expected $expected_status, got $http_code)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo "$body"
  fi
  echo ""
}

# Test 1: CREATE Student
echo "--- CREATE Operations ---"
test_endpoint "Create Student 1" "POST" "/api/students" \
  '{"first_name":"Alice","last_name":"Smith","email":"alice@test.com","phone":"555-0001"}' \
  "201"

# Test 2: CREATE Another Student
test_endpoint "Create Student 2" "POST" "/api/students" \
  '{"first_name":"Bob","last_name":"Johnson","email":"bob@test.com","phone":"555-0002"}' \
  "201"

# Test 3: GET All Students
echo "--- READ Operations ---"
test_endpoint "Get All Students" "GET" "/api/students" "" "200"

# Test 4: GET Specific Student
test_endpoint "Get Student by ID" "GET" "/api/students?id=1" "" "200"

# Test 5: UPDATE Student
echo "--- UPDATE Operations ---"
test_endpoint "Update Student" "PUT" "/api/students?id=1" \
  '{"status":"inactive"}' \
  "200"

# Test 6: DELETE Student
echo "--- DELETE Operations ---"
test_endpoint "Delete Student" "DELETE" "/api/students?id=2" "" "200"

# Test 7: Verify Delete
echo "--- Verify Operations ---"
test_endpoint "Get Remaining Students" "GET" "/api/students" "" "200"

# Summary
echo ""
echo "=== Test Summary ==="
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed!${NC}"
  exit 1
fi
