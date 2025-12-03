# Mission Scoring Test Scenarios

## Test Case 1: Perfect Cash-Boost Candidate

### Input Profile
```javascript
{
  pastCustomerCount: '5,000+',
  pastCustomerOutreach: 'Not really',
  estimateFollowUp: 'No real process',
  mostImportant: 'Increase profit in the next 6–12 months',
  avgLeadsPerMonth: 150
}
```

### Expected Cash-Boost Score
- Past customers 5,000+: **35 points**
- No outreach: **25 points**
- No follow-up: **20 points**
- Profit goal: **15 points**
- 150 leads/month: **15 points**
- **TOTAL: 110 → Capped at 100**

### Result
✅ Cash-Boost scores 100/100
✅ Qualifies for top 3 guarantee (score >= 60 AND customers >= 500)
✅ "Why" message: "Because you have a large base of past customers..."

---

## Test Case 2: AI Reception Priority

### Input Profile
```javascript
{
  missedCallsPercent: '60%+',
  phoneAnswering: 'Owner / family member',
  leadTracking: 'No',
  mostImportant: 'Reduce chaos and get my time back',
  pastCustomerCount: '< 500'
}
```

### Expected Scores
**AI Reception:**
- Missed calls 60%+: **40 points**
- Owner answering: **20 points**
- No tracking: **10 points**
- Chaos goal: **15 points**
- **TOTAL: 85/100**

**Cash-Boost:**
- < 500 customers: **5 points**
- (other factors low)
- **TOTAL: ~25/100**

### Result
✅ AI Reception scores 85/100 (Rank #1)
✅ Qualifies for guarantee (score >= 60 AND missed calls >= 25%)
✅ "Why" message: "You reported missing a significant percentage..."

---

## Test Case 3: Balanced Profile

### Input Profile
```javascript
{
  pastCustomerCount: '500 – 2,000',
  pastCustomerOutreach: 'Yes, once a year or less',
  missedCallsPercent: '25–40%',
  phoneAnswering: 'Office staff / dispatcher',
  documentOrganization: 'It\'s a mess',
  exitTimeline: '1–3 years',
  mostImportant: 'Get the business ready to sell'
}
```

### Expected Scores
**Cash-Boost:**
- 500-2K customers: **15 points**
- Once/year outreach: **10 points**
- Other factors: **~15 points**
- **TOTAL: ~40/100**

**AI Reception:**
- 25-40% missed: **20 points**
- Office staff: **10 points**
- **TOTAL: ~35/100**

**Data Room:**
- Messy docs: **35 points**
- Exit 1-3 years: **15 points**
- Sell goal: **15 points**
- **TOTAL: ~70/100**

**Reviews:**
- Base: **30 points**
- Exit timeline: **15 points**
- Sell goal: **15 points**
- **TOTAL: ~60/100**

### Result
✅ Data Room: 70/100 (Rank #1)
✅ Reviews: 60/100 (Rank #2)
✅ Cash-Boost: 40/100 (Rank #3)
   - Despite lower score, qualifies because score >= 60 NOT met
   - Natural ranking places it #3

---

## Test Case 4: Special Rule Activation

### Input Profile
```javascript
{
  pastCustomerCount: '2,000 – 5,000',
  pastCustomerOutreach: 'Not really',
  estimateFollowUp: 'Sometimes, but not consistent',
  mostImportant: 'Get the business ready to sell',
  documentOrganization: 'It\'s a mess',
  exitTimeline: 'Within 1 year',
  businessValueClarity: 'No idea',
  dashboardAccess: 'No'
}
```

### Expected Scores
**Data Room:**
- Messy docs: **35 points**
- No dashboard: **20 points**
- No valuation: **15 points**
- Exit 1 year: **20 points**
- Sell goal: **15 points**
- **TOTAL: 105 → Capped at 100**

**Cash-Boost:**
- 2-5K customers: **25 points**
- No outreach: **25 points**
- Sometimes follow-up: **10 points**
- Sell goal: **5 points**
- **TOTAL: 65/100**

**Reviews:**
- Base: **30 points**
- Exit 1 year: **20 points**
- Sell goal: **15 points**
- Messy docs: **5 points**
- **TOTAL: 70/100**

### Natural Ranking
1. Data Room: 100
2. Reviews: 70
3. Cash-Boost: 65

### After Special Rule (Cash-Boost qualifies: 65 >= 60 AND customers >= 500)
1. Data Room: 100
2. Reviews: 70
3. Cash-Boost: 65 ✅ **Forced into top 3**

### Result
✅ Special rule keeps Cash-Boost in top 3
✅ All three missions shown with clear scores
✅ User sees Cash-Boost is viable despite lower absolute score

---

## Scoring Transparency Benefits

1. **Predictable**: Same inputs always produce same outputs
2. **Debuggable**: Can trace exactly why a mission scored X points
3. **Tunable**: Change weights in one place to adjust recommendations
4. **Explainable**: Users see actual scores, not hidden algorithms
5. **Fair**: No arbitrary "priority" numbers - everything calculated from rules

---

## Future Tuning Strategy

Based on real-world data, adjust weights:

```javascript
// Before tuning
pastCustomerScores: { '2,000 – 5,000': 25 }

// After analysis: 2-5K customers convert better than expected
pastCustomerScores: { '2,000 – 5,000': 30 }

// Result: Cash-Boost scores 5 points higher for this cohort
```

All tuning is centralized in scoreUtils.js with clear labels.
