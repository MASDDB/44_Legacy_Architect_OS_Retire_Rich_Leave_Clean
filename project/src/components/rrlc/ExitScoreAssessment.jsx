import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import Icon from '../AppIcon';
import { calculateExitScore, getScoreCategory } from '../../services/rrclExitScoreCalculator';
import { captureEmail, recordSMSConsent, submitAssessment } from '../../services/rrclService';
import { useAuth } from '../../contexts/AuthContext';

const ExitScoreAssessment = ({ onComplete, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailCaptureId, setEmailCaptureId] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    business_name: '',
    industry: '',
    years_in_business: '',
    annual_revenue: '',
    employee_count: '',
    revenue_growth_rate: '',
    gross_margin: '',
    ebitda_margin: '',
    customer_concentration: '',
    recurring_revenue_percentage: '',
    has_financial_statements: false,
    has_clean_books: false,
    has_documented_processes: false,
    has_management_team: false,
    has_customer_contracts: false,
    has_ip_documentation: false,
    phone_number: '',
    sms_consent: false
  });

  const [results, setResults] = useState(null);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailCapture = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: captureError } = await captureEmail(formData.email);
      if (captureError) throw new Error(captureError);

      setEmailCaptureId(data?.id);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to proceed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssessment = async () => {
    setLoading(true);
    setError('');

    try {
      // Calculate scores
      const calculatedScores = calculateExitScore({
        business_name: formData.business_name,
        industry: formData.industry,
        years_in_business: parseInt(formData.years_in_business) || 0,
        annual_revenue: parseFloat(formData.annual_revenue) || 0,
        employee_count: parseInt(formData.employee_count) || 0,
        revenue_growth_rate: parseFloat(formData.revenue_growth_rate) || 0,
        gross_margin: parseFloat(formData.gross_margin) || 0,
        ebitda_margin: parseFloat(formData.ebitda_margin) || 0,
        customer_concentration: parseFloat(formData.customer_concentration) || 0,
        recurring_revenue_percentage: parseFloat(formData.recurring_revenue_percentage) || 0,
        has_financial_statements: formData.has_financial_statements,
        has_clean_books: formData.has_clean_books,
        has_documented_processes: formData.has_documented_processes,
        has_management_team: formData.has_management_team,
        has_customer_contracts: formData.has_customer_contracts,
        has_ip_documentation: formData.has_ip_documentation
      });

      // Save assessment if user is logged in
      if (user) {
        await submitAssessment(user.id, {
          email_capture_id: emailCaptureId,
          business_name: formData.business_name,
          industry: formData.industry,
          years_in_business: parseInt(formData.years_in_business) || 0,
          annual_revenue: parseFloat(formData.annual_revenue) || 0,
          employee_count: parseInt(formData.employee_count) || 0,
          revenue_growth_rate: parseFloat(formData.revenue_growth_rate) || 0,
          gross_margin: parseFloat(formData.gross_margin) || 0,
          ebitda_margin: parseFloat(formData.ebitda_margin) || 0,
          customer_concentration: parseFloat(formData.customer_concentration) || 0,
          recurring_revenue_percentage: parseFloat(formData.recurring_revenue_percentage) || 0,
          has_financial_statements: formData.has_financial_statements,
          has_clean_books: formData.has_clean_books,
          has_documented_processes: formData.has_documented_processes,
          has_management_team: formData.has_management_team,
          has_customer_contracts: formData.has_customer_contracts,
          has_ip_documentation: formData.has_ip_documentation,
          ...calculatedScores,
          raw_answers: formData
        });
      }

      // Handle SMS consent if provided
      if (formData.sms_consent && formData.phone_number && emailCaptureId) {
        await recordSMSConsent(
          emailCaptureId,
          formData.phone_number,
          'I agree to receive SMS updates about my exit readiness. Standard rates may apply. Reply STOP to opt out.'
        );
      }

      setResults(calculatedScores);
      setStep(5);

      if (onComplete) {
        onComplete(calculatedScores);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'saas', label: 'SaaS' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'services', label: 'Professional Services' },
    { value: 'construction', label: 'Construction' },
    { value: 'other', label: 'Other' }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Get Your Exit Readiness Score</h2>
        <p className="text-muted-foreground">
          Discover what your business is worth and how ready it is for a successful exit
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Your Email"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />

        <Input
          label="Business Name"
          placeholder="Your Business Name"
          value={formData.business_name}
          onChange={(e) => handleChange('business_name', e.target.value)}
          required
        />

        <Select
          label="Industry"
          options={industryOptions}
          value={formData.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          required
        />

        <Input
          label="Years in Business"
          type="number"
          placeholder="5"
          value={formData.years_in_business}
          onChange={(e) => handleChange('years_in_business', e.target.value)}
          required
        />

        <Input
          label="Annual Revenue"
          type="number"
          placeholder="1000000"
          helperText="Enter your approximate annual revenue in dollars"
          value={formData.annual_revenue}
          onChange={(e) => handleChange('annual_revenue', e.target.value)}
          required
        />

        <Input
          label="Number of Employees"
          type="number"
          placeholder="10"
          value={formData.employee_count}
          onChange={(e) => handleChange('employee_count', e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={onClose} variant="outline" fullWidth>
          Cancel
        </Button>
        <Button
          onClick={handleEmailCapture}
          loading={loading}
          disabled={!formData.email || !formData.business_name || !formData.industry}
          fullWidth
        >
          Continue to Financial Metrics
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <Icon name="DollarSign" size={24} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Financial Metrics</h2>
        <p className="text-muted-foreground">
          Help us understand your financial performance
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Revenue Growth Rate (%)"
          type="number"
          placeholder="15"
          helperText="Year-over-year revenue growth percentage"
          value={formData.revenue_growth_rate}
          onChange={(e) => handleChange('revenue_growth_rate', e.target.value)}
        />

        <Input
          label="Gross Margin (%)"
          type="number"
          placeholder="60"
          helperText="Gross profit as a percentage of revenue"
          value={formData.gross_margin}
          onChange={(e) => handleChange('gross_margin', e.target.value)}
        />

        <Input
          label="EBITDA Margin (%)"
          type="number"
          placeholder="20"
          helperText="EBITDA as a percentage of revenue"
          value={formData.ebitda_margin}
          onChange={(e) => handleChange('ebitda_margin', e.target.value)}
        />

        <Input
          label="Customer Concentration (%)"
          type="number"
          placeholder="25"
          helperText="Percentage of revenue from your top customer"
          value={formData.customer_concentration}
          onChange={(e) => handleChange('customer_concentration', e.target.value)}
        />

        <Input
          label="Recurring Revenue (%)"
          type="number"
          placeholder="70"
          helperText="Percentage of revenue that is recurring or contractual"
          value={formData.recurring_revenue_percentage}
          onChange={(e) => handleChange('recurring_revenue_percentage', e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setStep(1)} variant="outline" fullWidth>
          Back
        </Button>
        <Button onClick={() => setStep(3)} fullWidth>
          Continue to Operations
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <Icon name="CheckCircle" size={24} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Operational Readiness</h2>
        <p className="text-muted-foreground">
          Check the items your business has in place
        </p>
      </div>

      <div className="space-y-3">
        <Checkbox
          label="Clean, audit-ready financial statements (3+ years)"
          checked={formData.has_financial_statements}
          onChange={(e) => handleChange('has_financial_statements', e.target.checked)}
        />

        <Checkbox
          label="Books are clean and reconciled monthly"
          checked={formData.has_clean_books}
          onChange={(e) => handleChange('has_clean_books', e.target.checked)}
        />

        <Checkbox
          label="Documented processes and procedures"
          checked={formData.has_documented_processes}
          onChange={(e) => handleChange('has_documented_processes', e.target.checked)}
        />

        <Checkbox
          label="Management team that can run without owner"
          checked={formData.has_management_team}
          onChange={(e) => handleChange('has_management_team', e.target.checked)}
        />

        <Checkbox
          label="Written customer contracts and agreements"
          checked={formData.has_customer_contracts}
          onChange={(e) => handleChange('has_customer_contracts', e.target.checked)}
        />

        <Checkbox
          label="Documented intellectual property and trademarks"
          checked={formData.has_ip_documentation}
          onChange={(e) => handleChange('has_ip_documentation', e.target.checked)}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setStep(2)} variant="outline" fullWidth>
          Back
        </Button>
        <Button onClick={() => setStep(4)} fullWidth>
          Continue to SMS Opt-in
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <Icon name="MessageSquare" size={24} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Stay Updated (Optional)</h2>
        <p className="text-muted-foreground">
          Get personalized tips to improve your exit readiness
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Mobile Number (Optional)"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone_number}
          onChange={(e) => handleChange('phone_number', e.target.value)}
        />

        {formData.phone_number && (
          <Checkbox
            label="I agree to receive SMS updates about my exit readiness. Standard rates may apply. Reply STOP to opt out."
            checked={formData.sms_consent}
            onChange={(e) => handleChange('sms_consent', e.target.checked)}
          />
        )}

        <div className="bg-muted border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            We respect your privacy. You can opt out at any time by replying STOP to any message.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={() => setStep(3)} variant="outline" fullWidth>
          Back
        </Button>
        <Button
          onClick={handleSubmitAssessment}
          loading={loading}
          fullWidth
        >
          Get My Exit Score
        </Button>
      </div>
    </div>
  );

  const renderStep5 = () => {
    if (!results) return null;

    const scoreCategory = getScoreCategory(results.overall_exit_score);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-4">
            <span className="text-4xl font-bold text-primary">{results.overall_exit_score}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your Exit Readiness Score
          </h2>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium bg-${scoreCategory.color}/10 text-${scoreCategory.color}`}>
            {scoreCategory.category}
          </div>
          <p className="text-muted-foreground mt-2">
            {scoreCategory.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{results.financial_score}</div>
            <div className="text-sm text-muted-foreground mt-1">Financial</div>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{results.operational_score}</div>
            <div className="text-sm text-muted-foreground mt-1">Operational</div>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{results.market_score}</div>
            <div className="text-sm text-muted-foreground mt-1">Market</div>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Estimated Valuation Range</h3>
          <div className="text-3xl font-bold text-accent mb-2">
            ${(results.estimated_valuation_low / 1000000).toFixed(1)}M - ${(results.estimated_valuation_high / 1000000).toFixed(1)}M
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {results.valuation_multiple_low}x - {results.valuation_multiple_high}x revenue multiple
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">What's Included ($4,997 Value)</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-success mt-0.5" />
              <span className="text-sm text-muted-foreground">10-Day Personalized Action Plan</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-success mt-0.5" />
              <span className="text-sm text-muted-foreground">Professional Data Room Setup (Folders 0-10)</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-success mt-0.5" />
              <span className="text-sm text-muted-foreground">EBITDA Normalization Calculator</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-success mt-0.5" />
              <span className="text-sm text-muted-foreground">Contract Change-of-Control Analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-success mt-0.5" />
              <span className="text-sm text-muted-foreground">RFI Response Templates</span>
            </li>
          </ul>
        </div>

        <Button onClick={onClose} fullWidth>
          Access Your Exit Readiness Dashboard
        </Button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
      <div className="bg-card rounded-xl shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Step {step} of 4</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>
      </div>
    </div>
  );
};

export default ExitScoreAssessment;
