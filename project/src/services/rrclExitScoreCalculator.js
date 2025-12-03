/**
 * RRLC Exit Score Calculator
 * Calculates exit readiness scores based on assessment responses
 */

/**
 * Calculate overall exit score from assessment data
 * @param {Object} assessmentData - Assessment responses
 * @returns {Object} - Calculated scores and valuations
 */
export function calculateExitScore(assessmentData) {
  const financialScore = calculateFinancialScore(assessmentData);
  const operationalScore = calculateOperationalScore(assessmentData);
  const marketScore = calculateMarketScore(assessmentData);

  // Overall score is weighted average
  const overallScore = Math.round(
    financialScore * 0.4 +
    operationalScore * 0.35 +
    marketScore * 0.25
  );

  // Calculate valuation multiples based on score
  const { valuationMultipleLow, valuationMultipleHigh } = calculateValuationMultiples(overallScore, assessmentData);

  // Calculate estimated valuations
  const annualRevenue = assessmentData.annual_revenue || 0;
  const estimatedValuationLow = annualRevenue * valuationMultipleLow;
  const estimatedValuationHigh = annualRevenue * valuationMultipleHigh;

  return {
    overall_exit_score: overallScore,
    financial_score: financialScore,
    operational_score: operationalScore,
    market_score: marketScore,
    valuation_multiple_low: valuationMultipleLow,
    valuation_multiple_high: valuationMultipleHigh,
    estimated_valuation_low: estimatedValuationLow,
    estimated_valuation_high: estimatedValuationHigh,
    recommendations: generateRecommendations(overallScore, financialScore, operationalScore, marketScore),
    action_plan: generateActionPlan(assessmentData, overallScore)
  };
}

/**
 * Calculate financial readiness score (0-100)
 */
function calculateFinancialScore(data) {
  let score = 0;
  const weights = {
    revenue: 20,
    revenueGrowth: 20,
    grossMargin: 20,
    ebitdaMargin: 20,
    customerConcentration: 10,
    recurringRevenue: 10
  };

  // Revenue size scoring
  const revenue = data.annual_revenue || 0;
  if (revenue >= 10000000) score += weights.revenue;
  else if (revenue >= 5000000) score += weights.revenue * 0.8;
  else if (revenue >= 2000000) score += weights.revenue * 0.6;
  else if (revenue >= 1000000) score += weights.revenue * 0.4;
  else if (revenue >= 500000) score += weights.revenue * 0.2;

  // Revenue growth scoring
  const growth = data.revenue_growth_rate || 0;
  if (growth >= 30) score += weights.revenueGrowth;
  else if (growth >= 20) score += weights.revenueGrowth * 0.8;
  else if (growth >= 10) score += weights.revenueGrowth * 0.6;
  else if (growth >= 5) score += weights.revenueGrowth * 0.4;
  else if (growth >= 0) score += weights.revenueGrowth * 0.2;

  // Gross margin scoring
  const grossMargin = data.gross_margin || 0;
  if (grossMargin >= 70) score += weights.grossMargin;
  else if (grossMargin >= 60) score += weights.grossMargin * 0.8;
  else if (grossMargin >= 50) score += weights.grossMargin * 0.6;
  else if (grossMargin >= 40) score += weights.grossMargin * 0.4;
  else if (grossMargin >= 30) score += weights.grossMargin * 0.2;

  // EBITDA margin scoring
  const ebitdaMargin = data.ebitda_margin || 0;
  if (ebitdaMargin >= 25) score += weights.ebitdaMargin;
  else if (ebitdaMargin >= 20) score += weights.ebitdaMargin * 0.8;
  else if (ebitdaMargin >= 15) score += weights.ebitdaMargin * 0.6;
  else if (ebitdaMargin >= 10) score += weights.ebitdaMargin * 0.4;
  else if (ebitdaMargin >= 5) score += weights.ebitdaMargin * 0.2;

  // Customer concentration scoring (lower is better)
  const customerConcentration = data.customer_concentration || 100;
  if (customerConcentration <= 10) score += weights.customerConcentration;
  else if (customerConcentration <= 20) score += weights.customerConcentration * 0.8;
  else if (customerConcentration <= 30) score += weights.customerConcentration * 0.6;
  else if (customerConcentration <= 50) score += weights.customerConcentration * 0.4;
  else score += weights.customerConcentration * 0.2;

  // Recurring revenue scoring
  const recurringRevenue = data.recurring_revenue_percentage || 0;
  if (recurringRevenue >= 80) score += weights.recurringRevenue;
  else if (recurringRevenue >= 60) score += weights.recurringRevenue * 0.8;
  else if (recurringRevenue >= 40) score += weights.recurringRevenue * 0.6;
  else if (recurringRevenue >= 20) score += weights.recurringRevenue * 0.4;
  else if (recurringRevenue >= 10) score += weights.recurringRevenue * 0.2;

  return Math.round(score);
}

/**
 * Calculate operational readiness score (0-100)
 */
function calculateOperationalScore(data) {
  let score = 0;
  const weights = {
    financialStatements: 20,
    cleanBooks: 20,
    documentedProcesses: 20,
    managementTeam: 20,
    customerContracts: 10,
    ipDocumentation: 10
  };

  if (data.has_financial_statements) score += weights.financialStatements;
  if (data.has_clean_books) score += weights.cleanBooks;
  if (data.has_documented_processes) score += weights.documentedProcesses;
  if (data.has_management_team) score += weights.managementTeam;
  if (data.has_customer_contracts) score += weights.customerContracts;
  if (data.has_ip_documentation) score += weights.ipDocumentation;

  return Math.round(score);
}

/**
 * Calculate market readiness score (0-100)
 */
function calculateMarketScore(data) {
  let score = 50; // Base score

  // Industry factors
  const highValueIndustries = ['technology', 'saas', 'healthcare', 'fintech'];
  if (highValueIndustries.includes(data.industry?.toLowerCase())) {
    score += 20;
  }

  // Years in business
  const years = data.years_in_business || 0;
  if (years >= 10) score += 15;
  else if (years >= 5) score += 10;
  else if (years >= 3) score += 5;

  // Employee count (scaled businesses)
  const employees = data.employee_count || 0;
  if (employees >= 50) score += 15;
  else if (employees >= 25) score += 10;
  else if (employees >= 10) score += 5;

  return Math.min(Math.round(score), 100);
}

/**
 * Calculate valuation multiples based on exit score
 */
function calculateValuationMultiples(overallScore, data) {
  let baseLow = 1.5;
  let baseHigh = 3.0;

  // Adjust based on overall score
  if (overallScore >= 80) {
    baseLow = 4.0;
    baseHigh = 6.0;
  } else if (overallScore >= 70) {
    baseLow = 3.0;
    baseHigh = 5.0;
  } else if (overallScore >= 60) {
    baseLow = 2.5;
    baseHigh = 4.0;
  } else if (overallScore >= 50) {
    baseLow = 2.0;
    baseHigh = 3.5;
  }

  // Industry premium adjustments
  const premiumIndustries = ['technology', 'saas', 'healthcare'];
  if (premiumIndustries.includes(data.industry?.toLowerCase())) {
    baseLow += 0.5;
    baseHigh += 1.0;
  }

  // Recurring revenue premium
  const recurringRevenue = data.recurring_revenue_percentage || 0;
  if (recurringRevenue >= 80) {
    baseLow += 1.0;
    baseHigh += 1.5;
  } else if (recurringRevenue >= 60) {
    baseLow += 0.5;
    baseHigh += 1.0;
  }

  return {
    valuationMultipleLow: Number(baseLow.toFixed(1)),
    valuationMultipleHigh: Number(baseHigh.toFixed(1))
  };
}

/**
 * Generate recommendations based on scores
 */
function generateRecommendations(overallScore, financialScore, operationalScore, marketScore) {
  const recommendations = [];

  if (overallScore >= 80) {
    recommendations.push({
      category: 'exit-ready',
      priority: 'high',
      title: 'Your Business is Exit-Ready',
      description: 'Your business shows strong exit readiness. Consider engaging an M&A advisor to explore exit opportunities.'
    });
  } else if (overallScore >= 60) {
    recommendations.push({
      category: 'near-ready',
      priority: 'medium',
      title: 'Close to Exit-Ready',
      description: 'Your business is approaching exit readiness. Focus on the recommendations below to maximize valuation.'
    });
  } else {
    recommendations.push({
      category: 'needs-work',
      priority: 'high',
      title: 'Significant Preparation Needed',
      description: 'Your business requires substantial preparation before pursuing an exit. Focus on foundational improvements first.'
    });
  }

  // Financial recommendations
  if (financialScore < 70) {
    recommendations.push({
      category: 'financial',
      priority: 'high',
      title: 'Strengthen Financial Metrics',
      description: 'Focus on improving revenue growth, margins, and reducing customer concentration to increase valuation multiples.'
    });
  }

  // Operational recommendations
  if (operationalScore < 70) {
    recommendations.push({
      category: 'operational',
      priority: 'high',
      title: 'Document Business Operations',
      description: 'Create comprehensive documentation of processes, systems, and ensure financial records are audit-ready.'
    });
  }

  // Market positioning recommendations
  if (marketScore < 70) {
    recommendations.push({
      category: 'market',
      priority: 'medium',
      title: 'Enhance Market Position',
      description: 'Build a stronger management team and establish the business as an independent, scalable entity.'
    });
  }

  return recommendations;
}

/**
 * Generate 10-day action plan based on assessment
 */
function generateActionPlan(data, overallScore) {
  const plan = {
    overview: `10-Day Action Plan to Improve Your Exit Score from ${overallScore} to ${Math.min(overallScore + 15, 100)}`,
    days: []
  };

  // Day 1-2: Financial cleanup
  plan.days.push({
    day: 1,
    title: 'Financial Records Audit',
    tasks: [
      'Gather last 3 years of financial statements',
      'Review for accuracy and completeness',
      'Identify any accounting irregularities'
    ]
  });

  plan.days.push({
    day: 2,
    title: 'EBITDA Normalization',
    tasks: [
      'Identify legitimate add-backs (owner compensation, one-time expenses)',
      'Document justification for each add-back',
      'Calculate normalized EBITDA'
    ]
  });

  // Day 3-4: Operational documentation
  plan.days.push({
    day: 3,
    title: 'Process Documentation',
    tasks: [
      'List all critical business processes',
      'Document step-by-step procedures',
      'Identify areas where owner is the single point of failure'
    ]
  });

  plan.days.push({
    day: 4,
    title: 'Contract Review',
    tasks: [
      'Compile all customer contracts',
      'Review for change-of-control clauses',
      'Flag any assignment restrictions'
    ]
  });

  // Day 5-6: Data room preparation
  plan.days.push({
    day: 5,
    title: 'Data Room Setup - Part 1',
    tasks: [
      'Create folder structure (Folders 0-10)',
      'Gather corporate documents (articles, bylaws, cap table)',
      'Organize financial records'
    ]
  });

  plan.days.push({
    day: 6,
    title: 'Data Room Setup - Part 2',
    tasks: [
      'Upload customer contracts and agreements',
      'Add vendor and supplier contracts',
      'Include employee agreements and org chart'
    ]
  });

  // Day 7-8: KPI and metrics
  plan.days.push({
    day: 7,
    title: 'KPI Development',
    tasks: [
      'Define key performance indicators for your industry',
      'Gather historical KPI data',
      'Create KPI dashboard for buyers to review'
    ]
  });

  plan.days.push({
    day: 8,
    title: 'Customer Analysis',
    tasks: [
      'Calculate customer concentration',
      'Analyze customer retention rates',
      'Document customer acquisition costs'
    ]
  });

  // Day 9-10: Final preparation
  plan.days.push({
    day: 9,
    title: 'Legal and IP Review',
    tasks: [
      'Verify all intellectual property is properly documented',
      'Ensure trademarks and patents are current',
      'Review any pending litigation or legal issues'
    ]
  });

  plan.days.push({
    day: 10,
    title: 'Final Review and Next Steps',
    tasks: [
      'Complete final review of all documentation',
      'Identify remaining gaps',
      'Schedule consultation with M&A advisor'
    ]
  });

  return plan;
}

/**
 * Get score category and description
 */
export function getScoreCategory(score) {
  if (score >= 80) {
    return {
      category: 'Excellent',
      color: 'success',
      description: 'Your business is highly attractive to buyers and ready for exit'
    };
  } else if (score >= 70) {
    return {
      category: 'Very Good',
      color: 'primary',
      description: 'Your business is in strong shape with minor improvements needed'
    };
  } else if (score >= 60) {
    return {
      category: 'Good',
      color: 'warning',
      description: 'Your business shows promise but needs focused improvements'
    };
  } else if (score >= 40) {
    return {
      category: 'Fair',
      color: 'warning',
      description: 'Significant work needed before pursuing an exit'
    };
  } else {
    return {
      category: 'Needs Improvement',
      color: 'destructive',
      description: 'Major foundational work required before considering an exit'
    };
  }
}
