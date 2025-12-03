// Demo data for three example businesses at different completion stages
export const demoBusiness = [
    {
        id: 'eightfold-hvac',
        name: 'EightFold HVAC',
        completion: 37,
        folders: [
            {
                id: 1,
                folder_number: 0,
                folder_name: 'Executive Summary',
                folder_description: 'High-level overview and CIM',
                document_count: 1,
                required_document_count: 1,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 1, document_name: 'Confidential Information Memorandum.pdf', document_type: 'Report', file_size: 2450000, uploaded_at: '2024-11-15' }
                ]
            },
            {
                id: 2,
                folder_number: 1,
                folder_name: 'Corporate Structure',
                folder_description: 'Articles, bylaws, cap table, ownership',
                document_count: 2,
                required_document_count: 3,
                completion_percentage: 67,
                is_complete: false,
                documents: [
                    { id: 2, document_name: 'Articles of Incorporation.pdf', document_type: 'Legal Document', file_size: 850000, uploaded_at: '2024-11-16' },
                    { id: 3, document_name: 'Cap Table - Current.xlsx', document_type: 'Financial Statement', file_size: 125000, uploaded_at: '2024-11-16' }
                ]
            },
            {
                id: 3,
                folder_number: 2,
                folder_name: 'Financial Information',
                folder_description: 'Financial statements, tax returns, audits',
                document_count: 0,
                required_document_count: 3,
                completion_percentage: 0,
                is_complete: false,
                documents: []
            },
            {
                id: 4,
                folder_number: 3,
                folder_name: 'Customer Contracts',
                folder_description: 'Customer agreements and contracts',
                document_count: 1,
                required_document_count: 3,
                completion_percentage: 33,
                is_complete: false,
                documents: [
                    { id: 4, document_name: 'Master Service Agreement Template.pdf', document_type: 'Contract', file_size: 450000, uploaded_at: '2024-11-14' }
                ]
            },
            // Remaining folders with no documents
            ...[4, 5, 6, 7, 8, 9, 10].map(num => ({
                id: num + 4,
                folder_number: num,
                folder_name: ['Vendor & Suppliers', 'Employee Information', 'Intellectual Property', 'Real Estate & Facilities', 'Legal & Compliance', 'Operations & Technology', 'Marketing & Sales'][num - 4],
                folder_description: ['Vendor agreements and supplier contracts', 'Org chart, employment agreements, compensation', 'Trademarks, patents, copyrights, domain names', 'Leases, property documents', 'Litigation, compliance records, permits', 'Process docs, IT systems, software licenses', 'Marketing materials, sales pipeline, customer lists'][num - 4],
                document_count: 0,
                required_document_count: 3,
                completion_percentage: 0,
                is_complete: false,
                documents: []
            }))
        ]
    },
    {
        id: 'skyhawk-electrical',
        name: 'SkyHawk Electrical Contractors',
        completion: 71,
        folders: [
            {
                id: 1,
                folder_number: 0,
                folder_name: 'Executive Summary',
                folder_description: 'High-level overview and CIM',
                document_count: 1,
                required_document_count: 1,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 1, document_name: 'CIM - SkyHawk Electrical.pdf', document_type: 'Report', file_size: 3200000, uploaded_at: '2024-10-20' }
                ]
            },
            {
                id: 2,
                folder_number: 1,
                folder_name: 'Corporate Structure',
                folder_description: 'Articles, bylaws, cap table, ownership',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 2, document_name: 'Articles of Incorporation.pdf', document_type: 'Legal Document', file_size: 920000, uploaded_at: '2024-10-21' },
                    { id: 3, document_name: 'Bylaws.pdf', document_type: 'Legal Document', file_size: 650000, uploaded_at: '2024-10-21' },
                    { id: 4, document_name: 'Capitalization Table.xlsx', document_type: 'Financial Statement', file_size: 180000, uploaded_at: '2024-10-21' }
                ]
            },
            {
                id: 3,
                folder_number: 2,
                folder_name: 'Financial Information',
                folder_description: 'Financial statements, tax returns, audits',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 5, document_name: '2023 Financial Statements.pdf', document_type: 'Financial Statement', file_size: 1200000, uploaded_at: '2024-10-22' },
                    { id: 6, document_name: '2023 Tax Return.pdf', document_type: 'Tax Return', file_size: 890000, uploaded_at: '2024-10-22' },
                    { id: 7, document_name: '2024 Q1-Q3 Financials.xlsx', document_type: 'Financial Statement', file_size: 340000, uploaded_at: '2024-10-25' }
                ]
            },
            {
                id: 4,
                folder_number: 3,
                folder_name: 'Customer Contracts',
                folder_description: 'Customer agreements and contracts',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 8, document_name: 'Master Service Agreement.pdf', document_type: 'Contract', file_size: 520000, uploaded_at: '2024-10-23' },
                    { id: 9, document_name: 'Top 10 Customer Contracts.pdf', document_type: 'Contract', file_size: 2100000, uploaded_at: '2024-10-24' },
                    { id: 10, document_name: 'Recurring Revenue Summary.xlsx', document_type: 'Report', file_size: 220000, uploaded_at: '2024-10-24' }
                ]
            },
            {
                id: 5,
                folder_number: 4,
                folder_name: 'Vendor & Suppliers',
                folder_description: 'Vendor agreements and supplier contracts',
                document_count: 2,
                required_document_count: 3,
                completion_percentage: 67,
                is_complete: false,
                documents: [
                    { id: 11, document_name: 'Major Supplier Agreements.pdf', document_type: 'Contract', file_size: 780000, uploaded_at: '2024-10-26' },
                    { id: 12, document_name: 'Vendor List.xlsx', document_type: 'Other', file_size: 145000, uploaded_at: '2024-10-26' }
                ]
            },
            {
                id: 6,
                folder_number: 5,
                folder_name: 'Employee Information',
                folder_description: 'Org chart, employment agreements, compensation',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 13, document_name: 'Organization Chart.pdf', document_type: 'Report', file_size: 320000, uploaded_at: '2024-10-27' },
                    { id: 14, document_name: 'Key Employee Agreements.pdf', document_type: 'Agreement', file_size: 950000, uploaded_at: '2024-10-27' },
                    { id: 15, document_name: 'Compensation Summary.xlsx', document_type: 'Other', file_size: 180000, uploaded_at: '2024-10-27' }
                ]
            },
            {
                id: 7,
                folder_number: 6,
                folder_name: 'Intellectual Property',
                folder_description: 'Trademarks, patents, copyrights, domain names',
                document_count: 1,
                required_document_count: 3,
                completion_percentage: 33,
                is_complete: false,
                documents: [
                    { id: 16, document_name: 'Trademark Registrations.pdf', document_type: 'License', file_size: 420000, uploaded_at: '2024-10-28' }
                ]
            },
            // Remaining folders
            ...[7, 8, 9, 10].map(num => ({
                id: num + 7,
                folder_number: num,
                folder_name: ['Real Estate & Facilities', 'Legal & Compliance', 'Operations & Technology', 'Marketing & Sales'][num - 7],
                folder_description: ['Leases, property documents', 'Litigation, compliance records, permits', 'Process docs, IT systems, software licenses', 'Marketing materials, sales pipeline, customer lists'][num - 7],
                document_count: 0,
                required_document_count: 3,
                completion_percentage: 0,
                is_complete: false,
                documents: []
            }))
        ]
    },
    {
        id: 'probridge-medical',
        name: 'ProBridge Medical Services',
        completion: 91,
        folders: [
            {
                id: 1,
                folder_number: 0,
                folder_name: 'Executive Summary',
                folder_description: 'High-level overview and CIM',
                document_count: 1,
                required_document_count: 1,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 1, document_name: 'Confidential Information Memorandum.pdf', document_type: 'Report', file_size: 4100000, uploaded_at: '2024-09-10' }
                ]
            },
            {
                id: 2,
                folder_number: 1,
                folder_name: 'Corporate Structure',
                folder_description: 'Articles, bylaws, cap table, ownership',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 2, document_name: 'Certificate of Incorporation.pdf', document_type: 'Legal Document', file_size: 1100000, uploaded_at: '2024-09-11' },
                    { id: 3, document_name: 'Corporate Bylaws.pdf', document_type: 'Legal Document', file_size: 820000, uploaded_at: '2024-09-11' },
                    { id: 4, document_name: 'Cap Table Final.xlsx', document_type: 'Financial Statement', file_size: 195000, uploaded_at: '2024-09-11' }
                ]
            },
            {
                id: 3,
                folder_number: 2,
                folder_name: 'Financial Information',
                folder_description: 'Financial statements, tax returns, audits',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 5, document_name: 'Audited Financials 2021-2023.pdf', document_type: 'Financial Statement', file_size: 2800000, uploaded_at: '2024-09-12' },
                    { id: 6, document_name: 'Tax Returns 2021-2023.pdf', document_type: 'Tax Return', file_size: 1900000, uploaded_at: '2024-09-12' },
                    { id: 7, document_name: 'Monthly P&L 2024.xlsx', document_type: 'Financial Statement', file_size: 450000, uploaded_at: '2024-09-15' }
                ]
            },
            {
                id: 4,
                folder_number: 3,
                folder_name: 'Customer Contracts',
                folder_description: 'Customer agreements and contracts',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 8, document_name: 'Hospital Service Agreements.pdf', document_type: 'Contract', file_size: 3200000, uploaded_at: '2024-09-13' },
                    { id: 9, document_name: 'Insurance Contracts.pdf', document_type: 'Contract', file_size: 1500000, uploaded_at: '2024-09-13' },
                    { id: 10, document_name: 'Customer Concentration Analysis.xlsx', document_type: 'Report', file_size: 280000, uploaded_at: '2024-09-14' }
                ]
            },
            {
                id: 5,
                folder_number: 4,
                folder_name: 'Vendor & Suppliers',
                folder_description: 'Vendor agreements and supplier contracts',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 11, document_name: 'Medical Supply Agreements.pdf', document_type: 'Contract', file_size: 1800000, uploaded_at: '2024-09-16' },
                    { id: 12, document_name: 'Equipment Lease Agreements.pdf', document_type: 'Agreement', file_size: 920000, uploaded_at: '2024-09-16' },
                    { id: 13, document_name: 'Vendor Payment Terms.xlsx', document_type: 'Other', file_size: 165000, uploaded_at: '2024-09-16' }
                ]
            },
            {
                id: 6,
                folder_number: 5,
                folder_name: 'Employee Information',
                folder_description: 'Org chart, employment agreements, compensation',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 14, document_name: 'Organizational Chart.pdf', document_type: 'Report', file_size: 420000, uploaded_at: '2024-09-17' },
                    { id: 15, document_name: 'Employment Agreements - Key Personnel.pdf', document_type: 'Agreement', file_size: 1300000, uploaded_at: '2024-09-17' },
                    { id: 16, document_name: 'Benefits and Compensation Overview.xlsx', document_type: 'Report', file_size: 245000, uploaded_at: '2024-09-17' }
                ]
            },
            {
                id: 7,
                folder_number: 6,
                folder_name: 'Intellectual Property',
                folder_description: 'Trademarks, patents, copyrights, domain names',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 17, document_name: 'Trademark Portfolio.pdf', document_type: 'License', file_size: 680000, uploaded_at: '2024-09-18' },
                    { id: 18, document_name: 'Software Licenses.pdf', document_type: 'License', file_size: 520000, uploaded_at: '2024-09-18' },
                    { id: 19, document_name: 'Domain Registrations.pdf', document_type: 'Certificate', file_size: 145000, uploaded_at: '2024-09-18' }
                ]
            },
            {
                id: 8,
                folder_number: 7,
                folder_name: 'Real Estate & Facilities',
                folder_description: 'Leases, property documents',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 20, document_name: 'Commercial Lease Agreements.pdf', document_type: 'Agreement', file_size: 1200000, uploaded_at: '2024-09-19' },
                    { id: 21, document_name: 'Property Insurance.pdf', document_type: 'Other', file_size: 380000, uploaded_at: '2024-09-19' },
                    { id: 22, document_name: 'Facility Maintenance Records.pdf', document_type: 'Other', file_size: 550000, uploaded_at: '2024-09-19' }
                ]
            },
            {
                id: 9,
                folder_number: 8,
                folder_name: 'Legal & Compliance',
                folder_description: 'Litigation, compliance records, permits',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 23, document_name: 'Medical Licenses and Certifications.pdf', document_type: 'Certificate', file_size: 920000, uploaded_at: '2024-09-20' },
                    { id: 24, document_name: 'HIPAA Compliance Documentation.pdf', document_type: 'Legal Document', file_size: 750000, uploaded_at: '2024-09-20' },
                    { id: 25, document_name: 'Litigation History.pdf', document_type: 'Legal Document', file_size: 280000, uploaded_at: '2024-09-20' }
                ]
            },
            {
                id: 10,
                folder_number: 9,
                folder_name: 'Operations & Technology',
                folder_description: 'Process docs, IT systems, software licenses',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 26, document_name: 'Standard Operating Procedures.pdf', document_type: 'Report', file_size: 1800000, uploaded_at: '2024-09-21' },
                    { id: 27, document_name: 'IT Infrastructure Overview.pdf', document_type: 'Report', file_size: 680000, uploaded_at: '2024-09-21' },
                    { id: 28, document_name: 'Software Inventory.xlsx', document_type: 'Other', file_size: 195000, uploaded_at: '2024-09-21' }
                ]
            },
            {
                id: 11,
                folder_number: 10,
                folder_name: 'Marketing & Sales',
                folder_description: 'Marketing materials, sales pipeline, customer lists',
                document_count: 3,
                required_document_count: 3,
                completion_percentage: 100,
                is_complete: true,
                documents: [
                    { id: 29, document_name: 'Marketing Strategy.pdf', document_type: 'Report', file_size: 920000, uploaded_at: '2024-09-22' },
                    { id: 30, document_name: 'Customer Database Export.xlsx', document_type: 'Other', file_size: 580000, uploaded_at: '2024-09-22' },
                    { id: 31, document_name: 'Sales Pipeline Analysis.xlsx', document_type: 'Report', file_size: 320000, uploaded_at: '2024-09-22' }
                ]
            }
        ]
    }
];
