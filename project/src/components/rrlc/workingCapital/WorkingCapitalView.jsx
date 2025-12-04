import React, { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Icon from '../../AppIcon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WorkingCapitalView = ({ workingCapitalData = null, onSave, isDemo = false }) => {
    // Demo data
    const defaultData = {
        currentAssets: {
            cash: '425000',
            accountsReceivable: '580000',
            inventory: '325000',
            prepaid: '40000'
        },
        currentLiabilities: {
            accountsPayable: '380000',
            accruedExpenses: '140000',
            shortTermDebt: '150000',
            deferredRevenue: '20000'
        },
        trend: [
            { month: 'Jul', assets: 1280, liabilities: 650, wc: 630 },
            { month: 'Aug', assets: 1310, liabilities: 670, wc: 640 },
            { month: 'Sep', assets: 1330, liabilities: 680, wc: 650 },
            { month: 'Oct', assets: 1350, liabilities: 685, wc: 665 },
            { month: 'Nov', assets: 1360, liabilities: 690, wc: 670 },
            { month: 'Dec', assets: 1370, liabilities: 690, wc: 680 }
        ]
    };

    const initialData = workingCapitalData || defaultData;

    // State for inputs
    const [assets, setAssets] = useState(initialData.currentAssets);
    const [liabilities, setLiabilities] = useState(initialData.currentLiabilities);

    const parseNumber = (value) => parseFloat(String(value).replace(/[\$,]/g, '')) || 0;

    // Calculations
    const totalAssets = Object.values(assets).reduce((sum, val) => sum + parseNumber(val), 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + parseNumber(val), 0);
    const workingCapital = totalAssets - totalLiabilities;
    const currentRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;
    const quickRatio = totalLiabilities > 0 ? (parseNumber(assets.cash) + parseNumber(assets.accountsReceivable)) / totalLiabilities : 0;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleSave = () => {
        if (onSave && !isDemo) {
            onSave({
                currentAssets: assets,
                currentLiabilities: liabilities
            });
        }
    };

    const getRatioStatus = (ratio, type) => {
        if (type === 'current') {
            if (ratio >= 1.5) return 'excellent';
            if (ratio >= 1.2) return 'good';
            if (ratio >= 1.0) return 'warning';
            return 'poor';
        } else { // quick ratio
            if (ratio >= 1.0) return 'excellent';
            if (ratio >= 0.8) return 'good';
            if (ratio >= 0.6) return 'warning';
            return 'poor';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'excellent': return 'text-success';
            case 'good': return 'text-accent';
            case 'warning': return 'text-warning';
            case 'poor': return 'text-destructive';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Net Working Capital</span>
                        <Icon name="DollarSign" size={18} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(workingCapital)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Assets - Liabilities
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Current Ratio</span>
                        <Icon name="Activity" size={18} className={getStatusColor(getRatioStatus(currentRatio, 'current'))} />
                    </div>
                    <div className={`text-2xl font-bold ${getStatusColor(getRatioStatus(currentRatio, 'current'))}`}>
                        {currentRatio.toFixed(2)}x
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Target: 1.2x - 2.0x</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Current Assets</span>
                        <Icon name="ArrowUpRight" size={18} className="text-success" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(totalAssets)}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Current Liabilities</span>
                        <Icon name="ArrowDownRight" size={18} className="text-destructive" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(totalLiabilities)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Calculator Inputs */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Current Assets</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Cash & Equivalents</label>
                                <Input
                                    value={assets.cash}
                                    onChange={(e) => setAssets({ ...assets, cash: e.target.value })}
                                    placeholder="$0"
                                    disabled={isDemo}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Accounts Receivable</label>
                                <Input
                                    value={assets.accountsReceivable}
                                    onChange={(e) => setAssets({ ...assets, accountsReceivable: e.target.value })}
                                    placeholder="$0"
                                    disabled={isDemo}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Inventory</label>
                                <Input
                                    value={assets.inventory}
                                    onChange={(e) => setAssets({ ...assets, inventory: e.target.value })}
                                    placeholder="$0"
                                    disabled={isDemo}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Prepaid Expenses</label>
                                <Input
                                    value={assets.prepaid}
                                    onChange={(e) => setAssets({ ...assets, prepaid: e.target.value })}
                                    placeholder="$0"
                                    disabled={isDemo}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Current Liabilities</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Accounts Payable</label>
                                <Input
                                    value={liabilities.accountsPayable}
                                    onChange={(e) => setLiabilities({ ...liabilities, accountsPayable: e.target.value })}
                                    placeholder="$0"
                                    disabled={isDemo}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Accrued Expenses</label>
                                <Input
                                    value={liabilities.accruedExpenses}
                                    onChange={(e) => setLiabilities({ ...liabilities, accruedExpenses: e.target.value })}
                                    placeholder="$0"
                                    disabled={isDemo}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Short-term Debt</label>
                                <Input
                                    value={liabilities.shortTermDebt}
                                    onChange={(e) => setLiabilities({ ...liabilities, shortTermDebt: e.target.value })}
                                    placeholder="$0"
                                    disabled={isDemo}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Deferred Revenue</label>
                                <Input
                                    value={liabilities.deferredRevenue}
                                    onChange={(e) => setLiabilities({ ...liabilities, deferredRevenue: e.target.value })}
                                    placeholder="$0"
                                    disabled={isDemo}
                                />
                            </div>
                        </div>
                        {!isDemo && onSave && (
                            <Button onClick={handleSave} className="w-full mt-6">
                                Save Working Capital Data
                            </Button>
                        )}
                    </div>
                </div>

                {/* Charts and Analysis */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Working Capital Trend (6 Months)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={initialData.trend}>
                                <defs>
                                    <linearGradient id="colorWC" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="wc"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorWC)"
                                    name="Working Capital"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Liquidity Analysis</h2>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">Current Ratio</span>
                                    <span className={`text-sm font-bold ${getStatusColor(getRatioStatus(currentRatio, 'current'))}`}>
                                        {currentRatio.toFixed(2)}x
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${currentRatio >= 1.5 ? 'bg-success' : currentRatio >= 1.0 ? 'bg-accent' : 'bg-warning'}`}
                                        style={{ width: `${Math.min((currentRatio / 2.5) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Measures ability to pay short-term obligations. A ratio above 1.5 is ideal.
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">Quick Ratio</span>
                                    <span className={`text-sm font-bold ${getStatusColor(getRatioStatus(quickRatio, 'quick'))}`}>
                                        {quickRatio.toFixed(2)}x
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${quickRatio >= 1.0 ? 'bg-success' : quickRatio >= 0.8 ? 'bg-accent' : 'bg-warning'}`}
                                        style={{ width: `${Math.min((quickRatio / 2.0) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Measures ability to pay short-term obligations with most liquid assets (excluding inventory).
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/30 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                                <Icon name="TrendingUp" size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Working Capital Health</h3>
                                <p className="text-sm text-muted-foreground">
                                    {workingCapital > 0
                                        ? "Your business maintains a positive working capital position, indicating good short-term financial health and the ability to cover upcoming liabilities."
                                        : "Your working capital position requires attention. Consider optimizing inventory levels or reviewing payment terms with suppliers to improve liquidity."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkingCapitalView;
