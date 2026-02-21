import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { calculateAiReadinessScore, calculateExitReadinessScore, getTopMissions, getMissionScores, getScoreStatus, getExitScoreStatus } from './scoreUtils';
import { saveAuditResult, getLatestAuditForUser } from '../../services/aiAuditService';

const INDUSTRIES = [
  'HVAC',
  'Plumbing',
  'Electrical',
  'Roofing',
  'Landscaping',
  'General Contracting',
  'Other'
];

const REVENUE_RANGES = [
  '< $500k',
  '$500k – $1M',
  '$1M – $3M',
  '$3M – $5M',
  '$5M+'
];

const YEARS_OPTIONS = [
  '<3',
  '3–7',
  '7–15',
  '15+'
];

const MISSED_CALLS_OPTIONS = [
  '< 10%',
  '10–25%',
  '25–40%',
  '40–60%',
  '60%+'
];

const PAST_CUSTOMER_COUNTS = [
  '< 500',
  '500 – 2,000',
  '2,000 – 5,000',
  '5,000+'
];

const EXIT_TIMELINE_OPTIONS = [
  'Within 1 year',
  '1–3 years',
  '3–5 years',
  '5+ years / not sure'
];

export default function AIAuditPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const viewLatest = searchParams.get('view') === 'latest';
  const isStandalone = location.pathname === '/audit-checkup' || searchParams.get('mode') === 'standalone';

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState(null);
  const [recommendedMissions, setRecommendedMissions] = useState([]);

  const [answers, setAnswers] = useState({
    industry: '',
    revenueRange: '',
    fieldTechsCount: '',
    yearsInBusiness: '',
    avgLeadsPerMonth: '',
    phoneAnswering: '',
    missedCallsPercent: '',
    leadTracking: '',
    estimateFollowUp: '',
    pastCustomerOutreach: '',
    pastCustomerCount: '',
    toolsUsed: [],
    dashboardAccess: '',
    documentOrganization: '',
    exitTimeline: '',
    businessValueClarity: '',
    mostImportant: ''
  });

  useEffect(() => {
    if (viewLatest && user) {
      loadLatestAudit();
    }
  }, [viewLatest, user]);

  const loadLatestAudit = async () => {
    setIsLoading(true);
    const { data, error } = await getLatestAuditForUser(user.id);

    if (data && !error) {
      setAnswers(data.answers);
      setScores({
        aiReadiness: data.ai_readiness_score,
        exitReadiness: data.exit_readiness_score
      });
      setRecommendedMissions(data.recommended_missions);
      setShowResults(true);
    }

    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setAnswers(prev => {
      const currentValues = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return answers.industry && answers.revenueRange && answers.fieldTechsCount && answers.yearsInBusiness;
      case 2:
        return answers.avgLeadsPerMonth && answers.phoneAnswering && answers.missedCallsPercent && answers.leadTracking;
      case 3:
        return answers.estimateFollowUp && answers.pastCustomerOutreach && answers.pastCustomerCount;
      case 4:
        return answers.toolsUsed.length > 0 && answers.dashboardAccess && answers.documentOrganization;
      case 5:
        return answers.exitTimeline && answers.businessValueClarity && answers.mostImportant;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        calculateResults();
      }
    } else {
      alert('Please fill in all required fields before continuing.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResults = async () => {
    setIsLoading(true);

    const aiReadiness = calculateAiReadinessScore(answers);
    const exitReadiness = calculateExitReadinessScore(answers);
    const missionScores = getMissionScores(answers);
    const missions = getTopMissions(answers);

    setScores({
      aiReadiness,
      exitReadiness
    });
    setRecommendedMissions(missions);

    if (user) {
      await saveAuditResult({
        userId: user.id,
        answers,
        aiReadinessScore: aiReadiness,
        exitReadinessScore: exitReadiness,
        recommendedMissions: missions
      });
    }

    setShowResults(true);
    setIsLoading(false);
  };

  const startNewAudit = () => {
    setAnswers({
      industry: '',
      revenueRange: '',
      fieldTechsCount: '',
      yearsInBusiness: '',
      avgLeadsPerMonth: '',
      phoneAnswering: '',
      missedCallsPercent: '',
      leadTracking: '',
      estimateFollowUp: '',
      pastCustomerOutreach: '',
      pastCustomerCount: '',
      toolsUsed: [],
      dashboardAccess: '',
      documentOrganization: '',
      exitTimeline: '',
      businessValueClarity: '',
      mostImportant: ''
    });
    setCurrentStep(1);
    setShowResults(false);
    setScores(null);
    setRecommendedMissions([]);
  };

  if (showResults) {
    const resultsContent = (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Hidden Profit + Exit Audit Results</h1>
          <p className="text-lg text-gray-600">
            Here's where you stand today and the missions we recommend starting first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ScoreCard
            title="AI Readiness Score"
            score={scores.aiReadiness}
            status={getScoreStatus(scores.aiReadiness)}
          />
          <ScoreCard
            title="Exit Readiness Score"
            score={scores.exitReadiness}
            status={getExitScoreStatus(scores.exitReadiness)}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Recommended Missions</h2>
          <div className="space-y-4">
            {recommendedMissions.map((mission, index) => (
              <MissionCard key={mission.id} mission={mission} rank={index + 1} />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={startNewAudit} variant="outline">
            Run New Audit
          </Button>
          <Button onClick={() => navigate(isStandalone ? '/' : '/main-dashboard')}>
            {isStandalone ? 'Back to Homepage' : 'Back to Dashboard'}
          </Button>
        </div>
      </div>
    );

    if (isStandalone) {
      return (
        <div className="min-h-screen bg-gray-50">
          <main className="overflow-y-auto">
            {resultsContent}
          </main>
        </div>
      );
    }

    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {resultsContent}
          </main>
        </div>
      </div>
    );
  }

  const auditFormContent = (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hidden Profit + Exit Audit</h1>
        <p className="text-lg text-gray-600">
          Answer a few questions and we'll show you where the leaks are, how ready you are to step back, and which missions to turn on first.
        </p>
      </div>

      <ProgressStepper currentStep={currentStep} totalSteps={5} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
        {currentStep === 1 && <Step1BusinessSnapshot answers={answers} onChange={handleInputChange} />}
        {currentStep === 2 && <Step2LeadsAndCalls answers={answers} onChange={handleInputChange} />}
        {currentStep === 3 && <Step3FollowUp answers={answers} onChange={handleInputChange} />}
        {currentStep === 4 && <Step4Systems answers={answers} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} />}
        {currentStep === 5 && <Step5Exit answers={answers} onChange={handleInputChange} />}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={currentStep === 1}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isLoading}
        >
          {currentStep === 5 ? 'See Results' : 'Next'}
        </Button>
      </div>
    </div>
  );

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="overflow-y-auto">
          {auditFormContent}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {auditFormContent}
        </main>
      </div>
    </div>
  );
}

function ProgressStepper({ currentStep, totalSteps }) {
  const steps = ['Business', 'Leads & Calls', 'Follow-Up', 'Systems', 'Exit'];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className="text-xs mt-2 text-gray-600 text-center max-w-[80px]">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function Step1BusinessSnapshot({ answers, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Snapshot</h2>
        <p className="text-gray-600">This helps us compare you to peers and scale our recommendations.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
        <Select
          value={answers.industry}
          onChange={(value) => onChange('industry', value)}
          options={INDUSTRIES.map(i => ({ value: i, label: i }))}
          placeholder="Select industry"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue Range</label>
        <Select
          value={answers.revenueRange}
          onChange={(value) => onChange('revenueRange', value)}
          options={REVENUE_RANGES.map(r => ({ value: r, label: r }))}
          placeholder="Select revenue range"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Field Techs or Crews</label>
        <Input
          type="number"
          value={answers.fieldTechsCount}
          onChange={(e) => onChange('fieldTechsCount', e.target.value)}
          placeholder="Enter number"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
        <Select
          value={answers.yearsInBusiness}
          onChange={(value) => onChange('yearsInBusiness', value)}
          options={YEARS_OPTIONS.map(y => ({ value: y, label: y }))}
          placeholder="Select years"
        />
      </div>
    </div>
  );
}

function Step2LeadsAndCalls({ answers, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Leads & Calls</h2>
        <p className="text-gray-600">How much money comes in the front door, and how many calls slip through the cracks?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Average New Leads Per Month</label>
        <Input
          type="number"
          value={answers.avgLeadsPerMonth}
          onChange={(e) => onChange('avgLeadsPerMonth', e.target.value)}
          placeholder="Rough estimate is fine"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Who Usually Answers Your Phones?</label>
        <div className="space-y-2">
          {['Owner / family member', 'Office staff / dispatcher', 'Call center / answering service', 'AI / virtual receptionist'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="phoneAnswering"
                value={option}
                checked={answers.phoneAnswering === option}
                onChange={(e) => onChange('phoneAnswering', e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roughly What % of Calls Go Unanswered or to Voicemail During Business Hours?
        </label>
        <Select
          value={answers.missedCallsPercent}
          onChange={(value) => onChange('missedCallsPercent', value)}
          options={MISSED_CALLS_OPTIONS.map(o => ({ value: o, label: o }))}
          placeholder="Select percentage"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do You Track Where Your Leads Come From (Google, Ads, Referrals, etc.) in One Place?
        </label>
        <div className="space-y-2">
          {['Yes', 'Sort of', 'No'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="leadTracking"
                value={option}
                checked={answers.leadTracking === option}
                onChange={(e) => onChange('leadTracking', e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3FollowUp({ answers, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Follow-Up & Reactivation</h2>
        <p className="text-gray-600">We want to know if you're squeezing the juice from leads and past customers.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When You Send an Estimate, Do You Have a Structured Follow-Up Process?
        </label>
        <div className="space-y-2">
          {['Yes, every quote gets multiple follow-ups', 'Sometimes, but not consistent', 'No real process'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="estimateFollowUp"
                value={option}
                checked={answers.estimateFollowUp === option}
                onChange={(e) => onChange('estimateFollowUp', e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do You Currently Do Any Outreach to Past Customers (Database Reactivation)?
        </label>
        <div className="space-y-2">
          {['Yes, multiple times a year', 'Yes, once a year or less', 'Not really'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="pastCustomerOutreach"
                value={option}
                checked={answers.pastCustomerOutreach === option}
                onChange={(e) => onChange('pastCustomerOutreach', e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roughly How Many Past Customers Do You Have on File?
        </label>
        <Select
          value={answers.pastCustomerCount}
          onChange={(value) => onChange('pastCustomerCount', value)}
          options={PAST_CUSTOMER_COUNTS.map(c => ({ value: c, label: c }))}
          placeholder="Select count"
        />
      </div>
    </div>
  );
}

function Step4Systems({ answers, onChange, onCheckboxChange }) {
  const tools = [
    'Google Sheets / paper',
    'Jobber',
    'ServiceTitan',
    'Housecall Pro',
    'Other CRM',
    'Not sure'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Systems & Data</h2>
        <p className="text-gray-600">
          This tells us how much cleanup is needed before a buyer or partner will take you seriously.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Which Tools Do You Use to Manage Jobs and Customers?
        </label>
        <div className="space-y-2">
          {tools.map(tool => (
            <label key={tool} className="flex items-center">
              <input
                type="checkbox"
                checked={answers.toolsUsed.includes(tool)}
                onChange={(e) => onCheckboxChange('toolsUsed', tool, e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">{tool}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Can You See Your Key Numbers (Revenue, Average Ticket, Close Rate) in One Dashboard Today?
        </label>
        <div className="space-y-2">
          {['Yes', 'Kind of', 'No'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="dashboardAccess"
                value={option}
                checked={answers.dashboardAccess === option}
                onChange={(e) => onChange('dashboardAccess', e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How Organized Are Your Key Documents (Contracts, Insurance, Licenses, SOPs, etc.)?
        </label>
        <Select
          value={answers.documentOrganization}
          onChange={(value) => onChange('documentOrganization', value)}
          options={[
            { value: 'Everything is easy to find', label: 'Everything is easy to find' },
            { value: 'We can find most things, but it\'s scattered', label: 'We can find most things, but it\'s scattered' },
            { value: 'It\'s a mess', label: 'It\'s a mess' }
          ]}
          placeholder="Select option"
        />
      </div>
    </div>
  );
}

function Step5Exit({ answers, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exit & Timeline</h2>
        <p className="text-gray-600">This helps us prioritize missions that match your timeline and goals.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When Would You Ideally Like to Step Back or Sell the Business?
        </label>
        <Select
          value={answers.exitTimeline}
          onChange={(value) => onChange('exitTimeline', value)}
          options={EXIT_TIMELINE_OPTIONS.map(t => ({ value: t, label: t }))}
          placeholder="Select timeline"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How Clear Are You on What Your Business Is Worth Today?
        </label>
        <div className="space-y-2">
          {['Very clear', 'Rough idea', 'No idea'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="businessValueClarity"
                value={option}
                checked={answers.businessValueClarity === option}
                onChange={(e) => onChange('businessValueClarity', e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's Most Important to You Right Now?
        </label>
        <div className="space-y-2">
          {[
            'Increase profit in the next 6–12 months',
            'Reduce chaos and get my time back',
            'Get the business ready to sell',
            'Prepare my family / team to take over'
          ].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="mostImportant"
                value={option}
                checked={answers.mostImportant === option}
                onChange={(e) => onChange('mostImportant', e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ title, score, status }) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-end gap-4 mb-4">
        <div className="text-5xl font-bold text-gray-900">{score}</div>
        <div className="text-2xl text-gray-500 pb-1">/100</div>
      </div>
      <div className={`inline-block px-4 py-2 rounded-lg border ${colorClasses[status.color]}`}>
        {status.label}
      </div>
    </div>
  );
}

function MissionCard({ mission, rank }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
          {rank}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{mission.label}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{mission.score}</div>
              <div className="text-xs text-gray-500">Mission Score</div>
            </div>
          </div>
          <p className="text-gray-700 mb-3">{mission.description}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-blue-900">
              <span className="font-bold">Why this mission:</span> {mission.why}
            </p>
          </div>
          <Button
            onClick={() => navigate(mission.route)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {mission.id === 'cash_boost' ? 'Launch Cash-Boost Mission' : 'View Mission Details'}
          </Button>
        </div>
      </div>
    </div>
  );
}
