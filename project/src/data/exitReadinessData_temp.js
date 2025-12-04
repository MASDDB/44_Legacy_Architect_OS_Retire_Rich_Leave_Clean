// Exit Readiness Data Extensions for Demo Businesses
// This data should be added to each business object in demoDataRoomData.js

export const exitReadinessData = {
    'eightfold-hvac': {
        contracts: [
            { id: 1, contract_name: 'Maintenance Agreement - City School District', contract_type: 'Customer Agreement', counterparty: 'City School District #45', value: '$500,000', term_length: '3 years', change_of_control: true, auto_renewal: true, status: 'Active' },
            { id: 2, contract_name: 'Commercial HVAC Services - Metro Office Park', contract_type: 'Customer Agreement', counterparty: 'Metro Office Park LLC', value: '$380,000', term_length: '2 years', change_of_control: true, auto_renewal: true, status: 'Active' },
            { id: 3, contract_name: 'Parts Supplier Agreement - HVAC Supply Co', contract_type: 'Vendor Agreement', counterparty: 'HVAC Supply Company', value: '$450,000', term_length: '1 year', change_of_control: false, auto_renewal: true, status: 'Active' },
            { id: 4, contract_name: 'Equipment Supplier - Carrier Distributors', contract_type: 'Vendor Agreement', counterparty: 'Carrier Distributors Inc', value: '$320,000', term_length: '1 year', change_of_control: false, auto_renewal: true, status: 'Active' },
            { id: 5, contract_name: 'Fleet Lease - Service Trucks', contract_type: 'Lease', counterparty: 'Commercial Fleet Leasing', value: '$120,000', term_length: '5 years', change_of_control: false, auto_renewal: false, status: 'Active' },
            { id: 6, contract_name: 'Office Lease - Main Location', contract_type: 'Lease', counterparty: 'Industrial Park Properties', value: '$72,000', term_length: '5 years', change_of_control: false, auto_renewal: false, status: 'Active' },
            { id: 7, contract_name: 'Employment Agreement - Operations Manager', contract_type: 'Employment', counterparty: 'Sarah Johnson', value: '$95,000', term_length: 'At-will', change_of_control: true, auto_renewal: false, status: 'Active' },
            { id: 8, contract_name: 'Employment Agreement - Lead Technician', contract_type: 'Employment', counterparty: 'Mike Rodriguez', value: '$75,000', term_length: 'At-will', change_of_control: false, auto_renewal: false, status: 'Active' },
            { id: 9, contract_name: 'Service Agreement - Regional Hospital', contract_type: 'Customer Agreement', counterparty: 'Regional Medical Center', value: '$285,000', term_length: '2 years', change_of_control: true, auto_renewal: true, status: 'Active' },
            { id: 10, contract_name: 'Parts Warranty Agreement', contract_type: 'Vendor Agreement', counterparty: 'Trane Certified Dealer', value: '$65,000', term_length: '1 year', change_of_control: false, auto_renewal: true, status: 'Active' }
        ],
        financials: {
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
        },
        kpis: {
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
        },
        rfis: [
            { id: 1, title: 'Customer Contract Details - Top 10 Customers', category: 'Commercial', priority: 'high', status: 'completed', requestDate: '2024-11-20', dueDate: '2024-11-27', responseDate: '2024-11-25', requestedBy: 'Private Equity Buyer', assignedTo: 'Owner', documents: 2 },
            { id: 2, title: 'EPA Compliance & Refrigerant Handling', category: 'Legal', priority: 'high', status: 'completed', requestDate: '2024-11-22', dueDate: '2024-12-01', responseDate: '2024-11-28', requestedBy: 'Private Equity Buyer', assignedTo: 'Operations Manager', documents: 3 },
            { id: 3, title: 'Technician Certification Records', category: 'HR', priority: 'medium', status: 'in_progress', requestDate: '2024-11-25', dueDate: '2024-12-08', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Operations Manager', documents: 1 },
            { id: 4, title: 'Fleet Maintenance & Vehicle Records', category: 'Operations', priority: 'medium', status: 'in_progress', requestDate: '2024-11-26', dueDate: '2024-12-10', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Operations Manager', documents: 0 },
            { id: 5, title: 'Parts Supplier Concentration Analysis', category: 'Commercial', priority: 'high', status: 'pending', requestDate: '2024-11-28', dueDate: '2024-12-12', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Owner', documents: 0 },
            { id: 6, title: 'Service Territory & Customer Demographics', category: 'Commercial', priority: 'medium', status: 'pending', requestDate: '2024-11-29', dueDate: '2024-12-13', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Owner', documents: 0 },
            { id: 7, title: 'Financial Projections & Seasonality', category: 'Financial', priority: 'high', status: 'pending', requestDate: '2024-11-30', dueDate: '2024-12-14', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Owner', documents: 0 }
            ,
            { id: 8, title: 'Software Systems & CRM Platform', category: 'Technology', priority: 'low', status: 'pending', requestDate: '2024-12-01', dueDate: '2024-12-15', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Operations Manager', documents: 0 }
        ],
        workingCapital: {
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
        }
    }
};
