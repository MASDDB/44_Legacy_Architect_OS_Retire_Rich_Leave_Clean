import React from 'react';
import Icon from '../../AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KPIsView = ({ kpiData = null, onUpdate, isDemo = false }) => {
    const defaultKPIData = {
        metrics: [
            {
                category: 'Revenue Metrics', kpis: [
                    { name: 'Revenue Growth Rate', value: '18%', benchmark: '10-15%', status: 'excellent', trend: 'up' },
                    { name: 'Customer Retention Rate', value: '85%', benchmark: '80-85%', status: 'good', trend: 'stable' },
                    { name: 'Service Contract Renewals', value: '92%', benchmark: '85-90%', status: 'excellent', trend: 'up' }
                ]
            },
            {
                category: 'Profitability', kpis: [
                    { name: 'Gross Profit Margin', value: '55%', benchmark: '45-55%', status: 'excellent', trend: 'stable' },
                    { name: 'Net Profit Margin', value: '12%', benchmark: '8-12%', status: 'good', trend: 'up' },
                    { name: 'EBITDA Margin', value: '15%', benchmark: '12-15%', status: 'good', trend: 'up' }
                ]
            },
            {
                category: 'Operational Efficiency', kpis: [
                    { name: 'Technician Utilization', value: '75%', benchmark: '70-75%', status: 'excellent', trend: 'stable' },
                    { name: 'Average Response Time', value: '2.5 hrs', benchmark: '3-4 hrs', status: 'excellent', trend: 'down' },
                    { name: 'First-Time Fix Rate', value: '82%', benchmark: '75-80%', status: 'excellent', trend: 'up' }
                ]
            },
            {
                category: 'Growth Indicators', kpis: [
                    { name: 'New Customer Acquisition', value: '+28', benchmark: '+15-20', status: 'excellent', trend: 'up' },
                    { name: 'Service Ticket Volume', value: '+22%', benchmark: '+10-15%', status: 'excellent', trend: 'up' },
                    { name: 'Commercial Contract Growth', value: '15%', benchmark: '10-12%', status: 'excellent', trend: 'up' }
                ]
            }
        ],
        trends: {
            revenue: [
                { month: 'Jul', growth: 12 },
                { month: 'Aug', growth: 14 },
                { month: 'Sep', growth: 16 },
                { month: 'Oct', growth: 17 },
                { month: 'Nov', growth: 18 },
                { month: 'Dec', growth: 18 }
            ],
            profitability: [
                { month: 'Jul', gross: 53, net: 10, ebitda: 13 },
                { month: 'Aug', gross: 54, net: 11, ebitda: 14 },
                { month: 'Sep', gross: 54, net: 11, ebitda: 14 },
                { month: 'Oct', gross: 55, net: 12, ebitda: 15 },
                { month: 'Nov', gross: 55, net: 12, ebitda: 15 },
                { month: 'Dec', gross: 55, net: 12, ebitda: 15 }
            ]
        }
    };

    const data = kpiData || defaultKPIData;

    const getStatusColor = (status) => {
        switch (status) {
            case 'excellent':
                return 'text-success bg-success/10 border-success/30';
            case 'good':
                return 'text-accent bg-accent/10 border-accent/30';
            case 'warning':
                return 'text-warning bg-warning/10 border-warning/30';
            case 'poor':
                return 'text-destructive bg-destructive/10 border-destructive/30';
            default:
                return 'text-muted-foreground bg-muted border-border';
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return <Icon name="TrendingUp" size={16} className="text-success" />;
            case 'down':
                return <Icon name="TrendingDown" size={16} className="text-destructive" />;
            case 'stable':
                return <Icon name="Minus" size={16} className="text-muted-foreground" />;
            default:
                return null;
        }
    };

    const totalKPIs = data.metrics.reduce((sum, cat) => sum + cat.kpis.length, 0);
    const excellentKPIs = data.metrics.reduce((sum, cat) => sum + cat.kpis.filter(kpi => kpi.status === 'excellent').length, 0);
    const goodKPIs = data.metrics.reduce((sum, cat) => sum + cat.kpis.filter(kpi => kpi.status === 'good').length, 0);

    return (
        <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total KPIs Tracked</span>
                        <Icon name="BarChart2" size={18} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{totalKPIs}</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Exceeding Benchmarks</span>
                        <Icon name="TrendingUp" size={18} className="text-success" />
                    </div>
                    <div className="text-2xl font-bold text-success">{excellentKPIs}</div>
                    <div className="text-xs text-muted-foreground mt-1">{Math.round((excellentKPIs / totalKPIs) * 100)}% of KPIs</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Meeting Benchmarks</span>
                        <Icon name="CheckCircle" size={18} className="text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-accent">{goodKPIs}</div>
                    <div className="text-xs text-muted-foreground mt-1">{Math.round((goodKPIs / totalKPIs) * 100)}% of KPIs</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Below Benchmarks</span>
                        <Icon name="AlertTriangle" size={18} className="text-warning" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">0</div>
                    <div className="text-xs text-muted-foreground mt-1">0% of KPIs</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Growth Trend</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data.trends.revenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="month" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="growth"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="text-xs text-muted-foreground mt-4 text-center">
                        6-month revenue growth percentage trend
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Profitability Margins</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.trends.profitability}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="month" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="gross" fill="#10b981" name="Gross Margin" />
                            <Bar dataKey="net" fill="#3b82f6" name="Net Margin" />
                            <Bar dataKey="ebitda" fill="#8b5cf6" name="EBITDA Margin" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="text-xs text-muted-foreground mt-4 text-center">
                        Monthly profitability margin trends (%)
                    </div>
                </div>
            </div>

            {/* KPI Categories */}
            <div className="space-y-6">
                {data.metrics.map((category, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">{category.category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {category.kpis.map((kpi, kpiIdx) => (
                                <div
                                    key={kpiIdx}
                                    className={`p-4 rounded-lg border ${getStatusColor(kpi.status)}`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-sm font-medium text-foreground flex-1">{kpi.name}</h3>
                                        {getTrendIcon(kpi.trend)}
                                    </div>
                                    <div className="text-2xl font-bold text-foreground mb-1">{kpi.value}</div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Benchmark: {kpi.benchmark}</span>
                                        <span className="capitalize">{kpi.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Summary */}
            <div className="mt-6 bg-gradient-to-r from-success/10 via-accent/10 to-success/5 border border-success/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full flex-shrink-0">
                        <Icon name="Award" size={24} className="text-success" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Excellent Performance</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Your business is performing above industry benchmarks in {Math.round((excellentKPIs / totalKPIs) * 100)}% of tracked metrics. This strong
                            operational performance will be attractive to potential buyers and can support a premium valuation.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>✓ Strong revenue growth</span>
                            <span>✓ Healthy profit margins</span>
                            <span>✓ Efficient operations</span>
                            <span>✓ Positive growth indicators</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPIsView;
