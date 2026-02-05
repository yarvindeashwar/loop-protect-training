# Loop Protect - Product Context Document

This document provides comprehensive context about Loop Protect and its four products. Use this when editing talk tracks or slide content to ensure accuracy and provide additional detail when requested.

---

## Overview: How Delivery Revenue Gets Lost

### The Delivery Difference
- **Dine-in & Takeout**: Restaurant controls the full experience
- **Delivery**: Once food leaves the kitchen, visibility is lost. The platform owns the customer relationship, payment, and delivery

### Two Types of Loss
1. **Downtime Loss (Invisible Revenue)**: Money that never came in because customers couldn't find you on the app
2. **Chargeback Loss (Stolen Revenue)**: Money earned but taken back when customers complain and platforms issue refunds

---

## The Four Products

### 1. GUARD - Downtime Prevention

**Purpose**: Keep stores online and taking orders

**The Tech Chain**:
- Kitchen → POS (Toast, Square, Aloha) → Middleware (OLO) → Platforms (DoorDash, UberEats, Grubhub) → Customer
- Every connection point is a potential failure point
- If OLO breaks, ALL platforms go dark simultaneously

**Three Types of Downtime (Break Points)**:
1. **PBP (Paused by Platform)**: Platform decides to shut you down
   - Drivers waiting too long
   - Too many cancelled orders
   - Hours mismatch
   - Business decision by platform, not technical issue

2. **RSO (Restaurant System Outage)**: Technical problems
   - POS loses connection
   - OLO crashes
   - Tablet dies
   - WiFi goes down
   - Needs technical solutions

3. **PBR (Paused by Restaurant)**: Store-initiated
   - Accidentally toggled offline
   - Deliberately paused (short-staffed, overwhelmed kitchen)
   - Operational issue

**The GM Blind Spot**: From inside the restaurant, everything looks fine. But on the app, customers see "Currently Unavailable." You can't see what you can't see.

**How Guard Detects Problems**:
- UberEats: Official API with instant webhook notifications
- DoorDash (no API): Three independent workarounds:
  1. Platform monitoring
  2. Order flow analysis
  3. Availability checks
  - Redundancy ensures nothing is missed

**Guard Restore Modes**:
1. **Conservative**: Auto-restores only in clear-cut scenarios, maximum human oversight. Best for new clients.
2. **Balanced**: More aggressive restoration, still verifies before action. Most common upgrade target.
3. **Aggressive**: Maximum automation, minimum review. For well-trained teams.

**Smart Behavior**:
- Checks if problem still happening before action
- Verifies last restore actually stuck
- Rate limiting - backs off if repeated failures
- Escalates to humans when needed
- Doesn't hammer broken endpoints

**Key Metrics**:
- **Downtime %** = Total downtime hours / Scheduled operating hours × 100
- Only scheduled hours count (closed at 2am isn't downtime)
- **Lost Sales**: Based on YOUR store's historical data for that day/hour
- **Sales Saved**: Actual orders that came in after Guard restored connection

**Alerts**:
- Real-time alerts when downtime happens
- Weekly digest reports
- SMS alerts to GM's phone
- Can reply to text: "1" to snooze, "2" to override

---

### 2. RECOVER - Chargeback Recovery

**Purpose**: Win back money from unfair chargebacks

**Order States**:
1. **Fulfilled Orders** (customer received something):
   - Wrong items
   - Missing items
   - Quality issues (cold, damaged)
   - Platform refunds customer → deducts from your payout
   - This is "Inaccurate Order" category - most common loss type

2. **Unfulfilled Orders** (customer received nothing):
   - **Missed**: Order came in but never completed (POS issue, kitchen never saw it)
   - **Cancelled**: Someone actively stopped it (out of stock, overwhelmed, customer changed mind)
   - Different root causes require different dispute arguments

**Three Buckets of Loss**:
1. **Fulfilled Losses**: Customer reported problem, platform refunded, came out of YOUR payout
2. **Unfulfilled Losses**: Order never completed. Was payment owed?
3. **Unattributed Losses**: Not tied to specific order (system errors, fraud, unexplained adjustments)

**Key Flags**:
- **Merchant Charged = True**: Platform took money from you → Recover loss → Can dispute
- **Merchant Charged = False**: Order accuracy issue but platform didn't charge you → No money to recover

**For Unfulfilled Orders**:
- **Deducted**: Platform owed you money, then clawed it back → Recoverable
- **Never Paid**: Order never completed, no payment existed → Still a loss, potentially recoverable

**Dispute Windows**:
- Each platform has limited time windows to contest charges
- Miss the window = no recourse, charge stands forever
- Recover tracks deadlines automatically, files before time runs out

**Recovery Pipeline**:
1. Identify all recoverable losses
2. Check eligibility and documentation
3. Dispute formally with platform
4. Track status and escalate if needed

**Four Gates for Filing**:
1. Within dispute window?
2. Have proof to support claim?
3. Amount worth the effort?
4. Likely to win based on evidence?

**Dispute Lifecycle**:
- Detected → Queued → Submitted → Accepted/Denied/Expired

**Win Rates**:
- Inaccurate orders: 60-75%
- Missed orders: 50-70%
- Cancelled orders: 40-60%

**Payout Timing**: Dispute filed in September → Approved in October → Payout in November. Same money, different dates in different systems.

---

### 3. RE-ENGAGE - Customer Win-Back

**Purpose**: Automated review response to win back unhappy customers

**The Problem**:
- Dozens of reviews daily, most get no response
- Best practice: respond within 24 hours
- Reality: Most restaurants respond late or never

**How It Works**:
1. Captures low-rated reviews (1-3 stars) as they come in
2. Generates AI-powered responses (GPT-4) that sound human
3. Optionally includes coupon to win customer back
4. Posts automatically to platform
5. Tracks whether customer comes back and orders again

**Two Response Types**:
1. **AI-Generated**: Written by GPT-4, personalized to what customer said, sounds empathetic
2. **Template**: Pre-written by brand, consistent, faster

**Strategy**: AI for really negative reviews (personalization matters), templates for neutral reviews (speed matters)

**Configs (Rules)**:
- Star rating threshold
- Keyword triggers
- Platform
- Time of day
- Boolean logic (AND, OR, NOT)
- Review must match at least one config to get response

**Coupon Strategy**:
- 1-2 star: Offer coupon (customer really upset, need incentive)
- 3 star: Maybe no coupon (thoughtful response might be enough)

**Example Configs**:
- Missing items + 1-2 stars → AI response + $10 coupon
- Quality issue → AI + $5 coupon
- Wait time complaint → AI, no coupon (usually not restaurant's fault)

**Pipeline**:
1. Capture review
2. Evaluate against configs
3. Generate response
4. Optional human review
5. Post to platform
6. Track re-engagement

**Key Metrics**:
- **Re-engagement Rate**: Did customer come back and order again?
- **Voucher Lift**: Additional revenue from customers who used coupons
- **Response Time**: Same-day ideal, 48 hours acceptable, 3+ days too late

---

### 4. SOTU (State of the Union) - Diagnostics

**Purpose**: Tell you what's wrong and why. Root cause analysis.

**Three Questions SOTU Answers**:
1. **Leaderboard**: Where do I stand? How am I doing overall?
2. **Benchmark**: How do I compare to peers?
3. **Diagnostic**: What should I actually fix?

**Four Metrics (100 points total)**:
1. **Order Accuracy** (20 pts): Orders with no refund claims / Total orders
2. **Wait Time** (40 pts): Average time from order placed to pickup (BIGGEST LEVER)
3. **Downtime** (20 pts): Hours offline / Scheduled hours
4. **Bad Ratings** (20 pts): 1-2 star reviews / Total reviews

**Score Bands**:
- 90-100: Excellent
- 80-89: Good
- 70-79: Fair
- 60-69: Needs improvement
- Below 60: Critical

**Scoring Curve**: Rewards improvement more when struggling. Going from 5% to 4% error rate gives bigger boost than 1% to 0.5%.

**Peer Comparison**:
- Segment = restaurant type (not geography)
- McDonald's compared to other QSR, not steakhouses
- Four peer groups: Your chain, Your segment, Top 10%, Internal stores

**Pattern Detection (not just bad days)**:
- **Chronic Rule**: 84-day window (3 months) - slow-burn problems
- **Recent Rule**: 28-day window (1 month) - emerging problems
- **Acute Rule**: 14-day window (2 weeks) - crisis situations
- Shorter windows have higher thresholds (daily variance matters more)

**Diagnostic PDF for Flagged Stores**:
- Summary of what's flagged
- Day-wise breakdown (which days worst)
- Hour-wise breakdown (which shifts)
- Theme analysis (inaccuracy? wait time? ratings?)
- Item analysis (which menu items causing issues)

**Example Diagnosis**:
- Flag: High inaccuracy
- Days: Friday/Saturday worst
- Hours: 5-7 PM (dinner peak)
- Theme: Missing items
- Items: Guacamole, sour cream, salsa (all sides)
- Root cause: Sides station chaotic during dinner rush
- Solution: Retrain dinner shift on sides station procedures

**Reports Distribution**:
- Leaderboard → Leadership (big picture)
- CSV exports → Ops managers (dig into data)
- Diagnostic PDFs → Store level (action items)

---

## The Virtuous Cycle vs Death Spiral

**Virtuous Cycle** (upward spiral):
Better uptime → More orders → Better accuracy data → Better ratings → Better platform ranking → More visibility → More customers → More revenue to invest in operations

**Death Spiral** (downward spiral):
Downtime not detected → Customers order elsewhere → Chargebacks pile up → Can't afford staff → Short-staffed = worse service → More complaints → Worse ratings → Less visibility

**Key Insight**: There is no middle ground. You're always either improving or deteriorating.

---

## Platform Grading

Platforms grade restaurants daily on four metrics:
1. Avoidable driver wait time
2. Error rate
3. Downtime percentage
4. Customer rating

**Good grades** → Badges (Top Eats, Most Loved), featured placement, more visibility
**Bad grades** → Less visibility, fewer orders, death spiral begins

---

## Key Terminology

| Term | Definition |
|------|------------|
| PBP | Paused by Platform - platform business decision to shut you down |
| RSO | Restaurant System Outage - technical problems |
| PBR | Paused by Restaurant - store-initiated pause |
| OLO | Common middleware connecting POS to all platforms |
| Merchant Charged | Flag indicating if platform deducted money from you |
| Dispute Window | Limited time period to contest a charge |
| Win Rate | Won disputes / Total submitted |
| Re-engagement Rate | Percentage of customers who order again after response |
| SOTU | State of the Union - weekly diagnostic reports |
| Segment | Restaurant type for peer comparison |

---

## Summary

**Guard**: Prevent → Keep stores online
**Recover**: Correct → Win back unfair charges
**Re-Engage**: Retain → Win back unhappy customers
**SOTU**: Diagnose → Identify root causes

Together: Better metrics → Algorithmic lift → Customer loyalty → Root cause visibility → Compounding improvement
