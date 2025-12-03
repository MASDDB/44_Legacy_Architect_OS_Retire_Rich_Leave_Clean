export const MISSION_METADATA = {
  cash_boost: {
    id: 'cash_boost',
    label: 'Cash-Boost Mission (Past Customer Reactivation)',
    description: 'Turn your past customers into fast booked jobs and cash in the next 30 days with outbound texts and follow-ups.',
    route: '/cash-boost'
  },
  ai_reception: {
    id: 'ai_reception',
    label: '24/7 AI Reception Mission (Missed Calls)',
    description: 'Stop leaking money on missed calls by installing an AI-powered receptionist that answers, qualifies, and books around the clock.',
    route: '#'
  },
  reviews_reputation: {
    id: 'reviews_reputation',
    label: 'Review & Reputation Mission',
    description: 'Ask happy customers for Google reviews automatically so buyers and new customers see steady social proof.',
    route: '#'
  },
  data_room: {
    id: 'data_room',
    label: 'Buyer-Ready Data Room Mission',
    description: 'Get your financials, contracts, and key documents organized in one place so you\'re ready for a buyer or bank anytime.',
    route: '#'
  }
};

export function calculateAiReadinessScore(answers) {
  let totalPoints = 0;
  let maxPoints = 0;

  if (answers.avgLeadsPerMonth !== undefined && answers.avgLeadsPerMonth !== '') {
    const leads = parseInt(answers.avgLeadsPerMonth) || 0;
    if (leads >= 100) {
      totalPoints += 4;
    } else if (leads >= 50) {
      totalPoints += 3;
    } else if (leads >= 20) {
      totalPoints += 2;
    } else if (leads >= 10) {
      totalPoints += 1;
    }
    maxPoints += 4;
  }

  if (answers.phoneAnswering) {
    const scores = {
      'AI / virtual receptionist': 4,
      'Call center / answering service': 3,
      'Office staff / dispatcher': 2,
      'Owner / family member': 1
    };
    totalPoints += scores[answers.phoneAnswering] || 0;
    maxPoints += 4;
  }

  if (answers.missedCallsPercent) {
    const scores = {
      '< 10%': 4,
      '10–25%': 3,
      '25–40%': 2,
      '40–60%': 1,
      '60%+': 0
    };
    totalPoints += scores[answers.missedCallsPercent] || 0;
    maxPoints += 4;
  }

  if (answers.leadTracking) {
    const scores = {
      'Yes': 4,
      'Sort of': 2,
      'No': 0
    };
    totalPoints += scores[answers.leadTracking] || 0;
    maxPoints += 4;
  }

  if (answers.estimateFollowUp) {
    const scores = {
      'Yes, every quote gets multiple follow-ups': 4,
      'Sometimes, but not consistent': 2,
      'No real process': 0
    };
    totalPoints += scores[answers.estimateFollowUp] || 0;
    maxPoints += 4;
  }

  if (answers.pastCustomerOutreach) {
    const scores = {
      'Yes, multiple times a year': 4,
      'Yes, once a year or less': 2,
      'Not really': 0
    };
    totalPoints += scores[answers.pastCustomerOutreach] || 0;
    maxPoints += 4;
  }

  if (answers.pastCustomerCount) {
    const scores = {
      '5,000+': 4,
      '2,000 – 5,000': 3,
      '500 – 2,000': 2,
      '< 500': 1
    };
    totalPoints += scores[answers.pastCustomerCount] || 0;
    maxPoints += 4;
  }

  if (answers.dashboardAccess) {
    const scores = {
      'Yes': 4,
      'Kind of': 2,
      'No': 0
    };
    totalPoints += scores[answers.dashboardAccess] || 0;
    maxPoints += 4;
  }

  if (maxPoints === 0) return 0;
  return Math.round((totalPoints / maxPoints) * 100);
}

export function calculateExitReadinessScore(answers) {
  let totalPoints = 0;
  let maxPoints = 0;

  if (answers.yearsInBusiness) {
    const scores = {
      '15+': 4,
      '7–15': 3,
      '3–7': 2,
      '<3': 1
    };
    totalPoints += scores[answers.yearsInBusiness] || 0;
    maxPoints += 4;
  }

  if (answers.revenueRange) {
    const scores = {
      '$5M+': 4,
      '$3M – $5M': 3,
      '$1M – $3M': 2,
      '$500k – $1M': 1,
      '< $500k': 0
    };
    totalPoints += scores[answers.revenueRange] || 0;
    maxPoints += 4;
  }

  if (answers.dashboardAccess) {
    const scores = {
      'Yes': 4,
      'Kind of': 2,
      'No': 0
    };
    totalPoints += scores[answers.dashboardAccess] || 0;
    maxPoints += 4;
  }

  if (answers.documentOrganization) {
    const scores = {
      'Everything is easy to find': 4,
      'We can find most things, but it\'s scattered': 2,
      'It\'s a mess': 0
    };
    totalPoints += scores[answers.documentOrganization] || 0;
    maxPoints += 4;
  }

  if (answers.businessValueClarity) {
    const scores = {
      'Very clear': 4,
      'Rough idea': 2,
      'No idea': 0
    };
    totalPoints += scores[answers.businessValueClarity] || 0;
    maxPoints += 4;
  }

  if (answers.exitTimeline) {
    const scores = {
      'Within 1 year': 2,
      '1–3 years': 4,
      '3–5 years': 3,
      '5+ years / not sure': 1
    };
    totalPoints += scores[answers.exitTimeline] || 0;
    maxPoints += 4;
  }

  if (maxPoints === 0) return 0;
  return Math.round((totalPoints / maxPoints) * 100);
}

export function scoreCashBoost(answers) {
  let score = 0;

  if (answers.pastCustomerCount) {
    const pastCustomerScores = {
      '< 500': 5,
      '500 – 2,000': 15,
      '2,000 – 5,000': 25,
      '5,000+': 35
    };
    score += pastCustomerScores[answers.pastCustomerCount] || 0;
  }

  if (answers.pastCustomerOutreach) {
    const outreachScores = {
      'Yes, multiple times a year': 0,
      'Yes, once a year or less': 10,
      'Not really': 25
    };
    score += outreachScores[answers.pastCustomerOutreach] || 0;
  }

  if (answers.estimateFollowUp) {
    const followUpScores = {
      'Yes, every quote gets multiple follow-ups': 0,
      'Sometimes, but not consistent': 10,
      'No real process': 20
    };
    score += followUpScores[answers.estimateFollowUp] || 0;
  }

  if (answers.mostImportant) {
    const goalScores = {
      'Increase profit in the next 6–12 months': 15,
      'Reduce chaos and get my time back': 5,
      'Get the business ready to sell': 5,
      'Prepare my family / team to take over': 5
    };
    score += goalScores[answers.mostImportant] || 0;
  }

  const leads = parseInt(answers.avgLeadsPerMonth) || 0;
  if (leads >= 100) {
    score += 15;
  } else if (leads >= 50) {
    score += 10;
  } else if (leads >= 20) {
    score += 5;
  }

  return Math.min(score, 100);
}

export function scoreAiReception(answers) {
  let score = 0;

  if (answers.missedCallsPercent) {
    const missedCallsScores = {
      '< 10%': 0,
      '10–25%': 10,
      '25–40%': 20,
      '40–60%': 30,
      '60%+': 40
    };
    score += missedCallsScores[answers.missedCallsPercent] || 0;
  }

  if (answers.phoneAnswering) {
    const answeringScores = {
      'Owner / family member': 20,
      'Office staff / dispatcher': 10,
      'Call center / answering service': 5,
      'AI / virtual receptionist': 0
    };
    score += answeringScores[answers.phoneAnswering] || 0;
  }

  if (answers.leadTracking) {
    const trackingScores = {
      'Yes': 0,
      'Sort of': 5,
      'No': 10
    };
    score += trackingScores[answers.leadTracking] || 0;
  }

  if (answers.mostImportant) {
    const goalScores = {
      'Reduce chaos and get my time back': 15,
      'Increase profit in the next 6–12 months': 5,
      'Get the business ready to sell': 5,
      'Prepare my family / team to take over': 5
    };
    score += goalScores[answers.mostImportant] || 0;
  }

  return Math.min(score, 100);
}

export function scoreReviewsReputation(answers) {
  let score = 30;

  if (answers.exitTimeline) {
    const timelineScores = {
      'Within 1 year': 20,
      '1–3 years': 15,
      '3–5 years': 10,
      '5+ years / not sure': 5
    };
    score += timelineScores[answers.exitTimeline] || 0;
  }

  if (answers.mostImportant) {
    const goalScores = {
      'Get the business ready to sell': 15,
      'Increase profit in the next 6–12 months': 5,
      'Reduce chaos and get my time back': 5,
      'Prepare my family / team to take over': 5
    };
    score += goalScores[answers.mostImportant] || 0;
  }

  if (answers.documentOrganization === 'It\'s a mess') {
    score += 5;
  } else if (answers.documentOrganization === 'We can find most things, but it\'s scattered') {
    score += 5;
  }

  return Math.min(score, 100);
}

export function scoreDataRoom(answers) {
  let score = 0;

  if (answers.documentOrganization) {
    const docsScores = {
      'Everything is easy to find': 0,
      'We can find most things, but it\'s scattered': 20,
      'It\'s a mess': 35
    };
    score += docsScores[answers.documentOrganization] || 0;
  }

  if (answers.dashboardAccess) {
    const dashboardScores = {
      'Yes': 0,
      'Kind of': 10,
      'No': 20
    };
    score += dashboardScores[answers.dashboardAccess] || 0;
  }

  if (answers.businessValueClarity) {
    const valuationScores = {
      'Very clear': 0,
      'Rough idea': 5,
      'No idea': 15
    };
    score += valuationScores[answers.businessValueClarity] || 0;
  }

  if (answers.exitTimeline) {
    const timelineScores = {
      'Within 1 year': 20,
      '1–3 years': 15,
      '3–5 years': 10,
      '5+ years / not sure': 5
    };
    score += timelineScores[answers.exitTimeline] || 0;
  }

  if (answers.mostImportant) {
    const goalScores = {
      'Get the business ready to sell': 15,
      'Prepare my family / team to take over': 15,
      'Increase profit in the next 6–12 months': 5,
      'Reduce chaos and get my time back': 5
    };
    score += goalScores[answers.mostImportant] || 0;
  }

  return Math.min(score, 100);
}

export function getMissionScores(answers) {
  return {
    cash_boost: scoreCashBoost(answers),
    ai_reception: scoreAiReception(answers),
    reviews_reputation: scoreReviewsReputation(answers),
    data_room: scoreDataRoom(answers)
  };
}

function buildWhyMessage(missionId, answers, score) {
  switch (missionId) {
    case 'cash_boost':
      if (answers.pastCustomerOutreach === 'Not really' &&
          ['2,000 – 5,000', '5,000+'].includes(answers.pastCustomerCount)) {
        return `Because you have a large base of past customers and aren't doing much to reach them, a Cash-Boost mission can turn quiet customers into booked work quickly.`;
      } else if (answers.estimateFollowUp === 'No real process') {
        return `You already pay to generate leads, but many quotes are never followed up on. This mission is designed to pull those dollars out of your estimate pile.`;
      } else if (['500 – 2,000', '2,000 – 5,000', '5,000+'].includes(answers.pastCustomerCount)) {
        return `With ${answers.pastCustomerCount} past customers on file, database reactivation can generate quick revenue wins with minimal marketing spend.`;
      }
      return 'Database reactivation turns past customers into repeat business with minimal acquisition cost.';

    case 'ai_reception':
      if (['25–40%', '40–60%', '60%+'].includes(answers.missedCallsPercent)) {
        return `You reported missing a significant percentage of calls (${answers.missedCallsPercent}). A 24/7 AI receptionist helps you stop losing jobs to voicemail.`;
      } else if (answers.phoneAnswering === 'Owner / family member') {
        return `Because the owner is answering phones, you're either missing calls during busy times or the owner can't focus on higher-value work. An AI receptionist solves both problems.`;
      }
      return 'An AI receptionist ensures you never miss an opportunity, even when your team is busy with current jobs.';

    case 'reviews_reputation':
      if (['Within 1 year', '1–3 years'].includes(answers.exitTimeline)) {
        return `With your exit timeline approaching, building social proof now increases buyer confidence and business value.`;
      } else if (answers.mostImportant === 'Get the business ready to sell') {
        return `Buyers look for consistent positive reviews as a sign of a healthy, well-managed business. Building this now adds to your valuation.`;
      }
      return 'Consistent 5-star reviews attract more customers and increase the perceived value of your business.';

    case 'data_room':
      if ((answers.documentOrganization === 'It\'s a mess' || answers.dashboardAccess === 'No') &&
          ['Within 1 year', '1–3 years'].includes(answers.exitTimeline)) {
        return `Your documents and key numbers are hard to find, and you're looking to exit soon. Buyers and banks see this as risk, which drags down valuation.`;
      } else if (answers.documentOrganization === 'It\'s a mess') {
        return `Disorganized documents create risk and slow down decision-making. A clean data room makes your business easier to run and more valuable to buyers.`;
      } else if (answers.businessValueClarity === 'No idea') {
        return `You don't know what your business is worth today. A data room exercise helps you see the value and prepare for a future sale or financing.`;
      }
      return 'A buyer-ready data room increases your business value and speeds up due diligence when the time comes.';

    default:
      return 'This mission addresses a key gap in your business operations.';
  }
}

export function getTopMissions(answers) {
  const missionScores = getMissionScores(answers);

  let entries = Object.entries(missionScores);

  entries.sort((a, b) => b[1] - a[1]);

  const cashBoostScore = missionScores.cash_boost;
  const cashBoostQualifies = cashBoostScore >= 60 &&
    ['500 – 2,000', '2,000 – 5,000', '5,000+'].includes(answers.pastCustomerCount);

  const aiReceptionScore = missionScores.ai_reception;
  const aiReceptionQualifies = aiReceptionScore >= 60 &&
    ['25–40%', '40–60%', '60%+'].includes(answers.missedCallsPercent);

  const top3Ids = entries.slice(0, 3).map(e => e[0]);

  if (cashBoostQualifies && !top3Ids.includes('cash_boost')) {
    const lowestInTop3 = entries.slice(0, 3).sort((a, b) => a[1] - b[1])[0];
    const cashBoostEntry = entries.find(e => e[0] === 'cash_boost');

    if (cashBoostEntry && lowestInTop3 && cashBoostEntry[1] >= lowestInTop3[1] - 10) {
      const lowestIndex = entries.findIndex(e => e[0] === lowestInTop3[0]);
      entries.splice(lowestIndex, 1);

      entries = entries.filter(e => e[0] !== 'cash_boost');
      entries.splice(0, 0, cashBoostEntry);
    }
  }

  if (aiReceptionQualifies && !top3Ids.includes('ai_reception')) {
    const lowestInTop3 = entries.slice(0, 3).sort((a, b) => a[1] - b[1])[0];
    const aiReceptionEntry = entries.find(e => e[0] === 'ai_reception');

    if (aiReceptionEntry && lowestInTop3 && aiReceptionEntry[1] >= lowestInTop3[1] - 10) {
      const lowestIndex = entries.findIndex(e => e[0] === lowestInTop3[0]);
      entries.splice(lowestIndex, 1);

      entries = entries.filter(e => e[0] !== 'ai_reception');
      entries.splice(1, 0, aiReceptionEntry);
    }
  }

  const top3 = entries.slice(0, 3);

  return top3.map(([id, score]) => {
    const meta = MISSION_METADATA[id];
    const why = buildWhyMessage(id, answers, score);
    return {
      id,
      label: meta.label,
      description: meta.description,
      score,
      why,
      route: meta.route
    };
  });
}

export function getScoreStatus(score) {
  if (score >= 70) {
    return { label: 'Strong foundation', color: 'green' };
  } else if (score >= 40) {
    return { label: 'In progress', color: 'yellow' };
  } else {
    return { label: 'Getting started', color: 'red' };
  }
}

export function getExitScoreStatus(score) {
  if (score >= 70) {
    return { label: 'Buyer-friendly', color: 'green' };
  } else if (score >= 40) {
    return { label: 'Needs work', color: 'yellow' };
  } else {
    return { label: 'Not buyer-ready', color: 'red' };
  }
}
