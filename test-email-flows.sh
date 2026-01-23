#!/bin/bash

# Test Email Upgrade Flows
# This script tests all email endpoints with the new upgrade flow

API_URL="http://localhost:3000/api/emails"
TEST_EMAIL="test@example.com"

echo "🧪 Testing Email Upgrade Flows"
echo "================================"
echo ""
echo "Make sure your dev server is running on localhost:3000"
echo "Replace TEST_EMAIL below with your actual test email address"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Test Email Address: ${TEST_EMAIL}${NC}"
echo ""

# Regular User - Trial Expiring
echo -e "${BLUE}1. Sending Regular User - Trial Expiring Email...${NC}"
curl -X POST $API_URL/send-trial-expiring \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"firstName\":\"John\",\"daysLeft\":2,\"isEtsyUser\":false}" \
  -s | jq '.'
echo -e "${GREEN}✓ Check your email and click 'Upgrade to Pro'${NC}"
echo -e "  Should go to: /settings?action=upgrade"
echo ""

# Regular User - Trial Expired
echo -e "${BLUE}2. Sending Regular User - Trial Expired Email...${NC}"
curl -X POST $API_URL/send-trial-expired \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"firstName\":\"John\",\"isEtsyUser\":false}" \
  -s | jq '.'
echo -e "${GREEN}✓ Check your email and click 'Upgrade to Pro'${NC}"
echo -e "  Should go to: /settings?action=upgrade"
echo ""

# Etsy User - Trial Expiring
echo -e "${BLUE}3. Sending Etsy User - Trial Expiring Email...${NC}"
curl -X POST $API_URL/send-trial-expiring \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"firstName\":\"Jane\",\"daysLeft\":2,\"isEtsyUser\":true}" \
  -s | jq '.'
echo -e "${GREEN}✓ Check your email and click 'Activate Your 3 Months Free'${NC}"
echo -e "  Should go to: /settings?action=upgrade&promo=true"
echo ""

# Etsy User - Trial Expired
echo -e "${BLUE}4. Sending Etsy User - Trial Expired Email...${NC}"
curl -X POST $API_URL/send-trial-expired \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"firstName\":\"Jane\",\"isEtsyUser\":true}" \
  -s | jq '.'
echo -e "${GREEN}✓ Check your email and click 'Activate 3 Months Free'${NC}"
echo -e "  Should go to: /settings?action=upgrade&promo=true"
echo ""

# Trial Started (for reference - no upgrade buttons)
echo -e "${BLUE}5. Sending Trial Started Email (Regular)...${NC}"
curl -X POST $API_URL/send-trial-started \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"firstName\":\"Test\",\"isEtsyUser\":false}" \
  -s | jq '.'
echo -e "${GREEN}✓ This email only has 'Get Started' button to dashboard${NC}"
echo ""

# Subscription Success (for reference - no upgrade buttons)
echo -e "${BLUE}6. Sending Subscription Success Email...${NC}"
curl -X POST $API_URL/send-subscription-success \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"firstName\":\"Test\",\"planType\":\"monthly\",\"isEtsyUser\":false}" \
  -s | jq '.'
echo -e "${GREEN}✓ This email only has 'Go to Dashboard' button${NC}"
echo ""

echo "================================"
echo -e "${YELLOW}📧 All test emails sent!${NC}"
echo ""
echo "Expected Behavior:"
echo "  • Regular users: Clicking upgrade button → auto-opens upgrade modal"
echo "  • Etsy users: Clicking upgrade button → auto-opens Stripe checkout with promo field"
echo "  • Modal says 'Upgrade to Hunnimoon Pro' (no trial language)"
echo "  • After login, automatically directed to correct flow"
echo ""
