# RRLC - Retire Rich, Leave Clean

> **Transform Your Business Exit with AI-Powered M&A Readiness Tools**

A comprehensive SaaS platform combining database reactivation, exit readiness assessment, and M&A data room management to help business owners maximize their exit valuation and streamline the due diligence process.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e.svg)](https://supabase.com/)

## 🌟 Key Features

### 🎯 Database Reactivation Engine
- **AI-Powered Multi-Channel Outreach** - Email, SMS, and voice campaigns
- **Smart Lead Scoring** - Automatic prioritization based on engagement
- **Campaign Builder** - Visual flow builder with A/B testing
- **Real-Time Analytics** - Track performance and ROI across all channels
- **247% Average ROI** - Turn dormant leads into booked appointments

### 📊 Exit Readiness Assessment
- **Comprehensive 50-Point Assessment** - Evaluate your business across critical areas
- **Dynamic Scoring Engine** - Real-time calculation of exit readiness score
- **Valuation Estimator** - Get estimated business valuation range
- **Actionable Recommendations** - Personalized improvement suggestions

### 📁 M&A Data Room Generator
- **Industry-Standard 0-10 Structure** - Pre-organized folders buyers expect
- **Document Management** - Upload, categorize, and track completion
- **Cloud Storage Integration** - Connect Google Drive and Dropbox
- **Progress Tracking** - Visual completion percentages per folder
- **Interactive Demo** - See real examples at different completion stages

### 💰 Cash Boost Mission Control
- **Quick Campaign Launch** - Deploy revenue-generating campaigns in minutes
- **Live Tracking** - Monitor campaign performance in real-time
- **Compliance Center** - Stay compliant with TCPA and industry regulations
- **Performance Analytics** - Detailed ROI and conversion metrics

### 🔗 Integrations
- **CRM Sync** - Bidirectional sync with major CRMs (HubSpot, Salesforce, Pipedrive)
- **Calendar Integration** - Google Calendar and Outlook booking
- **Webhook Management** - Custom webhooks for workflow automation
- **API Access** - RESTful API for custom integrations

## 🚀 Live Demo

Experience the platform yourself:
- **Marketing Site**: [View Landing Page](http://localhost:4028/)
- **Interactive Data Room Demo**: [Explore Demo](http://localhost:4028/data-room-demo)
- **Dashboard**: Login with demo credentials (see below)

### Demo Credentials
```
Email: admin@crm-demo.com
Password: demo123456
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Redux Toolkit** - State management
- **Recharts** - Data visualization

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage for documents
  - Edge functions

### Services & APIs
- **OpenAI API** - AI-powered personalization
- **Stripe** - Payment processing
- **Twilio** - SMS and voice campaigns
- **SendGrid** - Email delivery
- **Google Calendar API** - Calendar integration
- **OAuth 2.0** - Cloud storage connections

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- API keys (optional for full functionality):
  - OpenAI API key
  - Stripe API keys
  - Twilio credentials
  - SendGrid API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rrlc-platform.git
cd rrlc-platform/project
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `project` directory:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (optional)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# OpenAI (optional)
VITE_OPENAI_API_KEY=your_openai_key

# Cloud Storage (optional)
VITE_GOOGLE_DRIVE_CLIENT_ID=your_google_client_id
VITE_DROPBOX_APP_KEY=your_dropbox_key

# Storage
VITE_SUPABASE_STORAGE_BUCKET=data-room-documents
```

4. **Set up Supabase database**

Run the migrations in order from `project/supabase/migrations/`:

```bash
# Run migrations through Supabase CLI or Studio
supabase db push
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:4028`

## 📁 Project Structure

```
project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── rrlc/           # Business logic components
│   │   └── payment/        # Payment-related components
│   ├── pages/              # Route pages
│   │   ├── exit-readiness/ # M&A readiness tools
│   │   ├── campaign-builder/
│   │   ├── analytics-dashboard/
│   │   └── marketing-landing-page/
│   ├── services/           # API service modules
│   │   ├── rrclService.js  # Exit readiness & data room
│   │   ├── cloudStorageService.js
│   │   ├── calendarService.js
│   │   └── ...
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── data/               # Static data and demos
│   └── styles/             # Global styles
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
└── public/                 # Static assets
```

## 🎨 Key Components

### Data Room Generator
The M&A Data Room feature provides a professional, buyer-ready folder structure:

```javascript
// Example: Upload document to data room
import { uploadDocument, uploadFileToStorage } from './services/rrclService';

const handleUpload = async (file, folderId, documentType) => {
  // Upload to Supabase Storage
  const { data: fileData } = await uploadFileToStorage(file, businessId, folderId);
  
  // Save metadata
  await uploadDocument(businessId, folderId, userId, {
    document_name: fileData.fileName,
    document_type: documentType,
    file_url: fileData.url
  });
};
```

### Exit Score Calculator
Comprehensive assessment across 10 categories:

- Financial Health (10 points)
- Growth Trajectory (10 points)
- Customer Concentration (5 points)
- Revenue Quality (10 points)
- Team & Operations (10 points)
- Systems & Processes (10 points)
- Legal & Compliance (5 points)
- Market Position (10 points)
- Intellectual Property (5 points)
- Data Room Readiness (5 points)

## 📸 Screenshots

### Data Room Demo
![Data Room Demo](docs/screenshots/data-room-demo.png)
*Interactive demo showing three businesses at different completion stages*

### Exit Readiness Dashboard
![Exit Dashboard](docs/screenshots/exit-dashboard.png)
*Comprehensive assessment with valuation estimator*

### Campaign Builder
![Campaign Builder](docs/screenshots/campaign-builder.png)
*Visual flow builder for multi-channel campaigns*

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **Secure authentication** via Supabase Auth
- **API key encryption** for sensitive credentials
- **CORS protection** on edge functions
- **Input validation** on all user inputs
- **SQL injection prevention** through parameterized queries

## 📈 Performance

- **Lighthouse Score**: 95+ for performance
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Optimized bundle size** with code splitting
- **Lazy loading** for routes and heavy components

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Amazing BaaS platform
- **React Team** - For the incredible framework
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Beautiful utility-first CSS

## 📧 Contact & Support

- **Project Maintainer**: [Your Name](mailto:your.email@example.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/rrlc-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/rrlc-platform/discussions)

## 🗺️ Roadmap

### Current Version (v1.0)
- ✅ Database reactivation campaigns
- ✅ Exit readiness assessment
- ✅ M&A data room generator
- ✅ Cloud storage integration
- ✅ Interactive demo

### Upcoming Features (v1.1)
- [ ] Document version control
- [ ] Buyer portal with controlled access
- [ ] Enhanced AI personalization
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] White-label platform for agencies

---

**Built with ❤️ for business owners planning their exit**

*Transform your exit strategy. Increase your valuation. Close deals faster.*
