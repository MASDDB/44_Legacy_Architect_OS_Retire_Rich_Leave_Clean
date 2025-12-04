import React, { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Icon from '../../AppIcon';

const FinancialsView = ({ financialData = null, onSave, isDemo = false }) => {
    // Demo data
    const defaultData = {
        revenue: '6000000',
        cogs: '2700000',
        opex: '2400000',
        interest: '50000',
        taxes: '0',
        depreciation: '100000',
        addbacks: {
            ownerCompensation: '150000',
            oneTimeExpenses: '75000',
            personalExpenses: '25000',
            other: '25000'
        }
    };

    const initialData = financialData || defaultData;

    const [revenue, setRevenue] = useState(initialData.revenue);
    const [cogs, setCogs] = useState(initialData.cogs);
    const [opex, setOpex] = useState(initialData.opex);
    const [interest, setInterest] = useState(initialData.interest);
    const [taxes, setTaxes] = useState(initialData.taxes || '0');
    const [depreciation, setDepreciation] = useState(initialData.depreciation);

    const [ownerCompensation, setOwnerCompensation] = useState(initialData.addbacks?.ownerCompensation || '0');
    const [oneTimeExpenses, setOneTimeExpenses] = useState(initialData.addbacks?.oneTimeExpenses || '0');
    const [personalExpenses, setPersonalExpenses] = useState(initialData.addbacks?.personalExpenses || '0');
    const [otherAddbacks, setOtherAddbacks] = useState(initialData.addbacks?.other || '0');

    const parseNumber = (value) => parseFloat(String(value).replace(/[\$,]/g, '')) || 0;

    // Calculations
    const revenueNum = parseNumber(revenue);
    const cogsNum = parseNumber(cogs);
    const opexNum = parseNumber(opex);
    const interestNum = parseNumber(interest);
    const taxesNum = parseNumber(taxes);
    const depreciationNum = parseNumber(depreciation);

    const grossProfit = revenueNum - cogsNum;
    const ebit = grossProfit - opexNum;
    const reportedEBITDA = ebit + depreciationNum + interestNum;

    const totalAddbacks =
        parseNumber(ownerCompensation) +
        parseNumber(oneTimeExpenses) +
        parseNumber(personalExpenses) +
        parseNumber(otherAddbacks);

    const normalizedEBITDA = reportedEBITDA + totalAddbacks;
    const ebitdaMargin = revenueNum > 0 ? (normalizedEBITDA / revenueNum) * 100 : 0;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatPercent = (value) => {
        return `${value.toFixed(1)}%`;
    };

    const handleSave = () => {
        if (onSave && !isDemo) {
            onSave({
                revenue,
                cogs,
                opex,
                interest,
                taxes,
                depreciation,
                addbacks: {
                    ownerCompensation,
                    oneTimeExpenses,
                    personalExpenses,
                    other: otherAddbacks
                }
            });
        }
    };

    return (
        <div>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Normalized EBITDA</span>
                        <Icon name="TrendingUp" size={18} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(normalizedEBITDA)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {formatPercent(ebitdaMargin)} margin
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Annual Revenue</span>
                        <Icon name="DollarSign" size={18} className="text-success" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(revenueNum)}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Add-Backs</span>
                        <Icon name="Plus" size={18} className="text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(totalAddbacks)}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Reported EBITDA</span>
                        <Icon name="BarChart2" size={18} className="text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(reportedEBITDA)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* EBITDA Calculator */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">EBITDA Calculator</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Annual Revenue
                            </label>
                            <Input
                                type="text"
                                value={revenue}
                                onChange={(e) => setRevenue(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Cost of Goods Sold (COGS)
                            </label>
                            <Input
                                type="text"
                                value={cogs}
                                onChange={(e) => setCogs(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                                Gross Profit: {formatCurrency(grossProfit)}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Operating Expenses (OpEx)
                            </label>
                            <Input
                                type="text"
                                value={opex}
                                onChange={(e) => setOpex(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Interest Expense
                            </label>
                            <Input
                                type="text"
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Depreciation & Amortization
                            </label>
                            <Input
                                type="text"
                                value={depreciation}
                                onChange={(e) => setDepreciation(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                        </div>

                        <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-foreground">Reported EBITDA</span>
                                <span className="font-bold text-foreground">{formatCurrency(reportedEBITDA)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add-Backs */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Add-Backs & Adjustments</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Owner Compensation (Above Market)
                            </label>
                            <Input
                                type="text"
                                value={ownerCompensation}
                                onChange={(e) => setOwnerCompensation(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                                Amount paid to owner(s) above market rate
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                One-Time Expenses
                            </label>
                            <Input
                                type="text"
                                value={oneTimeExpenses}
                                onChange={(e) => setOneTimeExpenses(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                                Non-recurring expenses (lawsuits, moving, etc.)
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Personal Expenses
                            </label>
                            <Input
                                type="text"
                                value={personalExpenses}
                                onChange={(e) => setPersonalExpenses(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                                Personal expenses run through the business
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Other Add-Backs
                            </label>
                            <Input
                                type="text"
                                value={otherAddbacks}
                                onChange={(e) => setOtherAddbacks(e.target.value)}
                                placeholder="$0"
                                disabled={isDemo}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                                Any other legitimate add-backs
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Total Add-Backs</span>
                                <span className="font-medium text-foreground">{formatCurrency(totalAddbacks)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-foreground">Normalized EBITDA</span>
                                <span className="text-xl font-bold text-primary">{formatCurrency(normalizedEBITDA)}</span>
                            </div>
                        </div>

                        {!isDemo && onSave && (
                            <Button onClick={handleSave} className="w-full mt-4">
                                Save Financials
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Valuation Estimate */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/30 rounded-xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Estimated Valuation Range</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Based on typical M&A multiples of 3-5x normalized EBITDA for small to mid-sized businesses
                        </p>
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Conservative (3x)</div>
                                <div className="text-2xl font-bold text-foreground">
                                    {formatCurrency(normalizedEBITDA * 3)}
                                </div>
                            </div>
                            <div className="text-2xl text-muted-foreground">-</div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Optimistic (5x)</div>
                                <div className="text-2xl font-bold text-primary">
                                    {formatCurrency(normalizedEBITDA * 5)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                        <Icon name="TrendingUp" size={28} className="text-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialsView;
