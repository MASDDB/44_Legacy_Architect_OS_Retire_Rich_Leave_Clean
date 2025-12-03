# CRM System - React + Supabase

A comprehensive Customer Relationship Management system built with React and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
# Copy .env file and add your Supabase credentials
cp .env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run database migrations**
```bash
# Apply all migrations to your Supabase database
supabase db push
```

4. **Create demo users (Important for demo login)**

The demo login requires users to exist in Supabase Auth. Choose one option:

**Option A: Use Sign Up Form (Recommended)**
- Start the app: `npm run dev`
- Go to authentication page
- Click "Create one now" 
- Sign up with any email/password
- Test all CRM features immediately

**Option B: Create Demo Users via Supabase Dashboard**
1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add user"
4. Create user:
   - Email: `admin@crm-demo.com`
   - Password: `demo123456`
   - Auto-confirm: Yes
5. Repeat for `sales@crm-demo.com`

**Option C: Use Supabase CLI**
```bash
# After running migrations, check demo user status
supabase db inspect
```

5. **Start the application**
```bash
npm run dev
```

## 🔐 Authentication

### Demo Login Status
- **Demo Users**: Available in database (`admin@crm-demo.com`, `sales@crm-demo.com`)
- **Auth Setup**: Requires manual creation in Supabase Auth
- **Recommendation**: Use sign-up form to create test accounts

### Sign Up vs Demo Login
- **Sign Up** ✅: Creates both Auth user + CRM profile automatically
- **Demo Login** ⚠️: Requires pre-existing Auth users

### Current Auth Flow
1. **User signs up** → Creates `auth.users` entry + `user_profiles` entry
2. **User signs in** → Validates against `auth.users` 
3. **Profile data** → Retrieved from `user_profiles` table
4. **Session management** → Handled by Supabase Auth

## 📊 Features

- **Lead Management**: Track and manage leads through sales pipeline
- **Campaign Builder**: Create and manage marketing campaigns
- **Analytics Dashboard**: Comprehensive reporting and metrics
- **Calendar Integration**: Appointment scheduling and management
- **Compliance Center**: Ensure regulatory compliance
- **SMS/Email Marketing**: Automated communication workflows
- **Lead Scoring**: AI-powered lead qualification

## 🛠 Database Schema

### Core Tables
- `user_profiles`: CRM user data and roles
- `leads`: Customer lead information
- `campaigns`: Marketing campaign data
- `appointments`: Scheduled meetings
- `companies`: Organization data

### Authentication Integration
- Supabase Auth handles user authentication
- `user_profiles` table syncs with `auth.users`
- RLS policies secure data access by user

## 🔧 Troubleshooting

### "Invalid email or password" Error
**Cause**: Demo user exists in CRM database but not in Supabase Auth

**Solutions**:
1. **Use Sign Up**: Create new account via registration form
2. **Create Demo User**: Add `admin@crm-demo.com` in Supabase dashboard
3. **Check Status**: Run SQL: `SELECT * FROM check_demo_users_auth_status();`

### Environment Issues
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Check Supabase project status
- Ensure RLS policies are properly configured

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages/screens
├── contexts/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # External service configurations
├── services/          # API service functions
└── utils/             # Utility functions
```

## 🚀 Deployment

1. Build the application: `npm run build`
2. Deploy to your preferred hosting platform
3. Ensure environment variables are set in production
4. Run database migrations: `supabase db push --linked`

## 📝 Development Notes

- **Authentication**: Uses Supabase Auth + custom profiles
- **Database**: PostgreSQL with Row Level Security
- **State Management**: React Context + custom hooks
- **Styling**: Tailwind CSS for consistent design
- **Forms**: React Hook Form for validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass and authentication works
5. Submit a pull request

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.