# Best Practices: Security & Operations

**Protocols to protect your business value and run a smooth exit process.**

---

## 🔒 Security Best Practices

### The Principle of Least Privilege
**Rule**: Give users only the access they absolutely need, and nothing more.
- **Buyers**: Should never have "Edit" access.
- **Employees**: Should only see folders relevant to their department.
- **Default State**: Set new folders to "Restricted" first, then open them up.

### Watermarking Hygiene
**Rule**: Enable Dynamic Watermarking for ALL external users.
- This is your only defense against leaks.
- Ensure the watermark includes the user's email address.

### Password Management
**Rule**: Enforce 2FA and strong passwords.
- Do not share login credentials. Create a separate account for every individual.
- Review "Active Sessions" in Security Settings monthly to ensure no unauthorized devices are logged in.

---

## ⚙️ Operational Cadence

### Monthly Maintenance
- **Financials**: Upload P&L and Balance Sheet by the 15th of the following month.
- **KPIs**: Update your key metrics dashboard.
- **User Audit**: Revoke access for any advisors or employees who have left the company.

### Quarterly Assessment
- **Retake Assessment**: Update your Exit Readiness Score every 90 days.
- **Folder Review**: Scan your Data Room to ensure no files are misfiled or outdated.

---

## 🚀 "Deal Mode" Protocols

When you have an active LOI (Letter of Intent) and are in deep diligence:

### Response Time
**Goal**: < 24 Hours.
- Buyers get nervous when silence stretches on.
- If you don't have the answer, reply with: "Received. We are working on pulling this data."

### Transparency
**Rule**: Bad news, delivered early, is a problem. Bad news, delivered late, is a deal-killer.
- If you find an error in your past financials, disclose it immediately with a correction.

### Staging Area
**Rule**: Never upload directly to a live folder during a deal.
- Upload to `_Staging` first.
- Review the file to ensure no sensitive customer names (or SSNs) are visible if they shouldn't be.
- Move to the live folder only when ready.

---

## 📂 Naming Conventions

**Standard**: `YYYY-MM-DD_Description_vX`
- **Good**: `2024-12-01_Employee_Handbook_v2.pdf`
- **Bad**: `scan001.pdf` or `Final Handbook (Old).doc`

**Why**: In a folder with 50 files, sorting by name should automatically order them chronologically.

---

## 🚫 What NOT To Do

1. **Don't use email for documents.**
   - Once you email a file, you lose control of it forever. Use the Data Room links.
2. **Don't delete old files indiscriminately.**
   - If you replace a policy, archive the old one in an `_Archive` folder. Buyers may need to see what the policy was *last year*.
3. **Don't mix personal and business.**
   - Keep your family trust documents separate from corporate governance unless specifically requested.
