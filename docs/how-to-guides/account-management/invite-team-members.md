# How to Invite Team Members and Assign Roles

**Collaborate with your team by granting appropriate access levels.**

*Time required: 5-10 minutes per team member*

---

## Why Invite Team Members?

Delegate tasks and collaborate effectively:
- **Accountant**: Enter financial data, track KPIs
- **Operations Manager**: Upload documents, document processes
- **Sales Manager**: Manage CRM, run campaigns
- **Legal Counsel**: Review contracts, compliance documents
- **M&A Advisor**: Access data room, view assessments

---

## Understanding Roles and Permissions

### Available Roles

#### Admin (Full Access)
**Can do everything**:
- All features and data
- Invite/remove team members
- Change business settings
- Delete data

**Use for**: Co-owners, trusted partners

**⚠️ Caution**: Admins can delete everything. Use sparingly.

#### Manager (Most Features)
**Can**:
- View all data
- Edit most content
- Upload documents
- Run campaigns
- Enter financial data

**Cannot**:
- Invite/remove team members
- Change business settings
- Delete business profile
- Access billing

**Use for**: Operations managers, key employees

#### Contributor (Add/Edit Content)
**Can**:
- Upload documents
- Enter data
- Add customers/leads
- Update their assigned areas

**Cannot**:
- Delete data
- Change settings
- View financial data (unless specifically granted)
- Run campaigns

**Use for**: Accountants, assistants, data entry staff

#### Viewer (Read-Only)
**Can**:
- View assigned data
- Download documents
- Generate reports

**Cannot**:
- Edit anything
- Upload documents
- Change any data

**Use for**: Advisors, consultants, board members

---

## Step 1: Navigate to Team Settings

1. Log in to Legacy Architect OS
2. Click **"Settings"** in left sidebar
3. Click **"Team"** tab
4. You'll see current team members (just you initially)

---

## Step 2: Click "Invite Team Member"

1. Click **"Invite Team Member"** button
2. Invitation form appears

---

## Step 3: Enter Team Member Information

### Required Fields

**Email Address**:
- Enter their work email
- They'll receive invitation here
- This becomes their login username

**Full Name**:
- First and last name
- Appears in activity logs and communications

**Role**:
- Select from dropdown: Admin, Manager, Contributor, or Viewer
- See role descriptions above

### Optional Fields

**Job Title**:
- Their role in your company
- Example: "CFO", "Operations Manager", "Legal Counsel"
- Helps you remember why they have access

**Department**:
- Which area they work in
- Example: "Finance", "Operations", "Legal"

**Custom Message** (recommended):
- Personal note in invitation email
- Explain why you're inviting them
- Example: "Hi Sarah, I'm inviting you to help with our exit preparation. You'll be able to upload financial documents and track our KPIs."

---

## Step 4: Set Specific Permissions (Optional)

### Default Permissions by Role

Each role has default permissions, but you can customize:

**For Contributor or Viewer roles**, you can specify:

**Data Room Access**:
- All folders
- Specific folders only (select which ones)
- No access

**Financial Data Access**:
- Full access
- View only
- No access

**CRM Access**:
- Full access
- View only
- No access

**Assessment Access**:
- Can view scores
- Cannot view scores

### Example Custom Permissions

**Accountant (Contributor)**:
- ✅ Full access to Financials
- ✅ Full access to Data Room Folders 2, 3 (Financial, Tax)
- ❌ No access to CRM
- ✅ Can view assessment scores

**Legal Counsel (Viewer)**:
- ✅ View access to Data Room Folders 1, 9 (Corporate, Legal)
- ❌ No access to Financials
- ❌ No access to CRM
- ❌ Cannot view assessment scores

---

## Step 5: Send Invitation

1. Review all information
2. Click **"Send Invitation"**
3. Invitation email sent immediately
4. Team member appears in list with status "Pending"

---

## What the Team Member Receives

### Invitation Email

**Subject**: "[Your Name] invited you to Legacy Architect OS"

**Content**:
- Who invited them (you)
- What company (your business)
- What role they're assigned
- Your custom message (if included)
- **"Accept Invitation"** button

### Accepting the Invitation

1. Team member clicks **"Accept Invitation"**
2. Redirected to Legacy Architect OS
3. If they don't have an account:
   - Create account with invited email
   - Set password
   - Verify email
4. If they already have an account:
   - Log in
   - Confirm joining your business
5. Access granted immediately

---

## Managing Team Members

### View Team Members

**Settings** → **Team** shows:
- Name and email
- Role
- Status (Active, Pending, Inactive)
- Last login
- Date added

### Resend Invitation

If team member didn't receive or lost invitation:

1. Find team member in list
2. Click **"Resend Invitation"**
3. New email sent

**Note**: Original invitation link still works (doesn't expire)

### Change Role or Permissions

To update a team member's access:

1. Find team member in list
2. Click **"Edit"** (pencil icon)
3. Change role or permissions
4. Click **"Save Changes"**
5. Changes take effect immediately

**Note**: Team member is notified of permission changes

### Remove Team Member

To revoke access:

1. Find team member in list
2. Click **"Remove"** (trash icon)
3. Confirm removal
4. Access revoked immediately
5. Team member is notified

**What happens**:
- They lose all access to your business data
- They keep their Legacy Architect OS account
- They can still access their own businesses (if any)

---

## Team Member Experience

### What They See After Joining

**Dashboard**:
- Your business name at top
- Their role displayed
- Features they have access to

**Navigation**:
- Only sections they have permission for
- Grayed out sections they can't access

**Activity**:
- Their actions logged
- You can see what they do

### Switching Between Businesses

If a team member works with multiple businesses:

1. Click business name (top right)
2. Select different business from dropdown
3. Switch between businesses easily

**Example**: An accountant might work with 5 different clients, each with their own Legacy Architect OS account.

---

## Best Practices

### Start with Least Privilege

**Give minimum access needed**:
- Start with Contributor or Viewer
- Upgrade to Manager if needed
- Rarely use Admin

**Why**: Easier to grant more access than revoke it

### Use Specific Permissions

**Don't give blanket access**:
- Accountant doesn't need CRM access
- Sales manager doesn't need to see financials
- Legal counsel only needs legal documents

**Why**: Reduces risk of accidental changes or data exposure

### Document Why Each Person Has Access

**Use the "Job Title" and "Department" fields**:
- Helps you remember later
- Useful during audits
- Clear for due diligence

### Review Team Access Quarterly

**Every 3 months**:
- Review who has access
- Remove people who left
- Update permissions if roles changed
- Verify access levels are still appropriate

### Communicate Changes

**When changing permissions**:
- Tell the team member why
- Explain what changed
- Answer their questions

**Why**: Prevents confusion and maintains trust

---

## Common Scenarios

### Scenario 1: Hiring an Accountant

**Goal**: Let accountant enter financial data but not see other business info

**Setup**:
- **Role**: Contributor
- **Permissions**:
  - ✅ Full access to Financials
  - ✅ Upload to Data Room Folders 2, 3
  - ❌ No CRM access
  - ❌ No assessment access

### Scenario 2: Working with M&A Advisor

**Goal**: Let advisor see everything but not change anything

**Setup**:
- **Role**: Viewer
- **Permissions**:
  - ✅ View all Data Room folders
  - ✅ View financial data
  - ✅ View assessment scores
  - ✅ Download reports

### Scenario 3: Delegating to Operations Manager

**Goal**: Manager can handle day-to-day operations

**Setup**:
- **Role**: Manager
- **Permissions**:
  - ✅ Full access to Data Room
  - ✅ Full access to Operations
  - ✅ Full access to CRM
  - ⚠️ View-only for Financials

### Scenario 4: Temporary Consultant

**Goal**: Give access for 3-month project, then remove

**Setup**:
- **Role**: Contributor or Viewer (depending on needs)
- **Permissions**: Specific to their project
- **Calendar reminder**: Remove access when project ends

---

## Security Considerations

### Email Verification Required

Team members must verify their email before accessing data:
- Prevents unauthorized access
- Ensures they control the email account

### Two-Factor Authentication

**Highly recommended** for team members with sensitive access:
- Require 2FA for Admin and Manager roles
- Optional for Contributor and Viewer

**How to require**:
- Settings → Security → Require 2FA for team

### Activity Logging

All team member actions are logged:
- Who did what
- When they did it
- What data they accessed

**View logs**:
- Settings → Team → Activity Log

### Data Access Audits

**Before sharing with buyers**:
1. Review all team members
2. Remove unnecessary access
3. Document who has access and why
4. Show buyers your access controls

---

## Troubleshooting

### Problem: Team member didn't receive invitation

**Solutions**:
1. **Check spam folder** - Invitation may be filtered
2. **Verify email address** - Make sure it's correct
3. **Resend invitation** - Click "Resend Invitation"
4. **Check email server** - Some corporate servers block automated emails

### Problem: Team member can't access certain features

**Check**:
1. **Their role** - Do they have permission?
2. **Specific permissions** - Did you restrict access?
3. **Browser cache** - Have them clear cache and refresh
4. **Recent changes** - Did you just change their permissions? (may take a minute)

### Problem: Want to change who's the owner

**Solution**:
- Contact support: support@legacyarchitectos.com
- Ownership transfer requires verification
- Both parties must confirm

### Problem: Team member left company, still has access

**Immediate action**:
1. Remove them from team (Settings → Team → Remove)
2. Change passwords for any shared accounts
3. Review what they accessed (Activity Log)
4. Notify remaining team if sensitive

---

## Next Steps

After inviting team members:

1. **[Assign Tasks](../../tutorials/first-30-days.md)**
   - Delegate document uploads
   - Assign data entry
   - Distribute workload

2. **[Set Up Workflows](../data-room/organize-folders.md)**
   - Define who does what
   - Create process documentation
   - Establish review procedures

3. **[Monitor Activity](../../tutorials/first-30-days.md)**
   - Check progress weekly
   - Review activity logs
   - Provide feedback

---

## Related Guides

- [How to Create Your Account](create-account.md)
- [How to Update Business Profile](update-business-profile.md)
- [How to Manage Notification Preferences](notifications.md)
- [How to Upload Documents](../data-room/upload-documents.md)

---

*Last updated: December 7, 2025*
