# How to Connect Google Drive

**Import documents from Google Drive to your Data Room.**

*Time required: 10 minutes*

---

## Prerequisites

- Active Google account
- Documents stored in Google Drive
- Business profile set up in Legacy Architect OS

---

## Step 1: Navigate to Cloud Storage

1. Log in to Legacy Architect OS
2. Click **"Data Room"** in left sidebar
3. Click **"Cloud Storage"** tab (top of page)

---

## Step 2: Initiate Google Drive Connection

1. Click **"Connect Google Drive"** button
2. A popup window opens with Google sign-in

**Note**: If popup is blocked:
- Allow popups for legacyarchitectos.com
- Click "Connect Google Drive" again

---

## Step 3: Sign In to Google

1. Enter your Google email address
2. Click **"Next"**
3. Enter your password
4. Click **"Sign In"**

**If you have multiple Google accounts**:
- Select the account with your business documents
- Usually your business email account

---

## Step 4: Grant Permissions

Google will ask for permissions to:

**Read access to your Google Drive files**
- Legacy Architect OS needs to see your files to import them
- We only read files you explicitly import
- We never modify or delete files in your Google Drive

**View your email address**
- Used to verify your identity
- Links your Google account to your Legacy Architect OS account

### Review and Accept

1. Review the permissions requested
2. Click **"Allow"** or **"Grant Access"**

**Security Note**: You can revoke access anytime from your Google Account settings

---

## Step 5: Connection Confirmed

After granting permissions:

1. Popup window closes automatically
2. You're redirected back to Legacy Architect OS
3. You'll see: "Google Drive connected successfully"
4. Your Google Drive appears in the Cloud Storage section

---

## Step 6: Browse Your Google Drive

1. Click **"Browse Google Drive"** button
2. You'll see your Google Drive folder structure
3. Navigate folders just like in Google Drive

**What you'll see**:
- All folders in your Google Drive
- All files in each folder
- File names, types, and sizes

---

## Step 7: Select Files to Import

### Import Individual Files

1. Navigate to folder containing files
2. Check the box next to each file you want to import
3. Click **"Import Selected"** button

### Import Entire Folders

1. Check the box next to folder name
2. All files in folder are selected
3. Click **"Import Selected"** button

**Tip**: Start with one folder to test the process

---

## Step 8: Map to Data Room Folders

After selecting files, you'll be prompted to map them to Data Room folders:

1. **Source**: Shows Google Drive folder/files selected
2. **Destination**: Select Data Room folder
   - Example: Map "Financial Statements" → "Folder 2: Financial Information"
3. Click **"Next"**

### Mapping Multiple Folders

If importing from multiple Google Drive folders:
- Map each source folder to appropriate Data Room folder
- Can map multiple sources to same destination
- Can skip folders you don't want to import

---

## Step 9: Confirm and Import

1. Review the import summary:
   - Number of files to import
   - Source → Destination mappings
   - Total file size
2. Click **"Start Import"**

### Import Progress

- Progress bar shows overall completion
- Individual file progress shown
- Can continue working while importing
- Notification when complete

---

## Step 10: Verify Import

After import completes:

1. Navigate to Data Room folders
2. Verify files appear in correct folders
3. Click files to preview/download
4. Check file names and dates

---

## Managing Your Connection

### View Connection Status

**Settings** → **Integrations** → **Google Drive**

Shows:
- Connection status (Active/Disconnected)
- Connected account email
- Last sync date
- Number of files imported

### Disconnect Google Drive

If you need to disconnect:

1. Go to **Settings** → **Integrations**
2. Find **Google Drive** section
3. Click **"Disconnect"**
4. Confirm disconnection

**Note**: Disconnecting doesn't delete imported files from Data Room

### Reconnect Google Drive

To reconnect (same or different account):

1. Follow connection steps above
2. Sign in to Google account
3. Grant permissions again

---

## Import vs. Sync

### Current: Import Only

**What it does**:
- Copies files from Google Drive to Legacy Architect OS
- One-time transfer
- Files are independent after import

**What it doesn't do**:
- Doesn't sync changes automatically
- Doesn't update files when Google Drive changes
- Doesn't delete files if removed from Google Drive

### To Update Imported Files

1. Delete old version from Data Room
2. Re-import updated file from Google Drive

**Or**:
1. Use "Replace" feature in Data Room
2. Upload new version directly

### Future: Real-Time Sync (Coming 2026)

Planned features:
- Automatic sync when files change
- Two-way sync option
- Selective folder sync
- Conflict resolution

---

## Best Practices

### Before Connecting

1. **Organize Google Drive first**
   - Create clear folder structure
   - Remove personal files
   - Rename files descriptively

2. **Decide what to import**
   - Don't import everything
   - Focus on business-critical documents
   - Leave personal files in Google Drive

### During Import

1. **Start small**
   - Import one folder first
   - Verify it works correctly
   - Then import more

2. **Map carefully**
   - Match Google Drive folders to correct Data Room folders
   - Use consistent mapping logic

3. **Monitor progress**
   - Don't close browser during import
   - Check for errors
   - Verify completion

### After Import

1. **Review imported files**
   - Check all files imported correctly
   - Verify file names and dates
   - Test file opening/preview

2. **Organize if needed**
   - Move files to correct folders
   - Create subfolders
   - Rename files for clarity

3. **Document your mapping**
   - Note which Google Drive folders map to which Data Room folders
   - Makes future imports easier

---

## Troubleshooting

### Problem: "Connection failed"

**Solutions**:
1. **Check popup blocker** - Allow popups for legacyarchitectos.com
2. **Try different browser** - Chrome recommended
3. **Clear browser cache** - Then try again
4. **Check Google account** - Make sure you can log in to Google Drive directly

### Problem: "Permission denied"

**Solutions**:
1. **Grant all permissions** - Don't skip any permission requests
2. **Check Google account settings** - Ensure third-party apps are allowed
3. **Try incognito/private mode** - Sometimes helps with permission issues

### Problem: Can't see my files

**Solutions**:
1. **Check correct Google account** - May have connected wrong account
2. **Refresh the view** - Click refresh button
3. **Check file permissions** - Files must be owned by or shared with connected account

### Problem: Import fails or times out

**Solutions**:
1. **Import fewer files** - Try 10-20 at a time instead of 100+
2. **Check file sizes** - Very large files may timeout
3. **Check internet connection** - Stable connection required
4. **Try again later** - May be temporary issue

### Problem: Files imported to wrong folder

**Solutions**:
1. **Move files** - Use Data Room move feature
2. **Delete and re-import** - With correct mapping
3. **Check mapping** - Review before clicking "Start Import"

---

## Security & Privacy

### What We Access

**We can see**:
- File names in your Google Drive
- Folder structure
- File sizes and types
- Files you explicitly import

**We cannot**:
- Modify files in your Google Drive
- Delete files from your Google Drive
- Access files you don't import
- Share your Google Drive with others

### Data Protection

- Connection uses OAuth 2.0 (industry standard)
- Encrypted transmission (HTTPS)
- No password stored (Google handles authentication)
- You can revoke access anytime

### Revoking Access

To revoke Legacy Architect OS access to Google Drive:

1. Go to [Google Account](https://myaccount.google.com)
2. Click **"Security"**
3. Click **"Third-party apps with account access"**
4. Find **"Legacy Architect OS"**
5. Click **"Remove Access"**

---

## Comparison: Google Drive vs. Dropbox

| Feature | Google Drive | Dropbox |
|---------|--------------|---------|
| **Setup** | Similar process | Similar process |
| **File types** | All types | All types |
| **Import speed** | Fast | Fast |
| **Folder mapping** | Yes | Yes |
| **Sync** | Not yet | Not yet |

**Choose based on where your files are currently stored**

---

## Next Steps

After connecting Google Drive:

1. **[Upload Additional Documents](upload-documents.md)**
   - Add files not in Google Drive
   - Fill remaining gaps

2. **[Organize Your Data Room](organize-folders.md)**
   - Create logical structure
   - Use subfolders effectively

3. **[Track Completion](../../tutorials/building-data-room.md)**
   - Monitor progress
   - Identify missing documents

---

## Related Guides

- [How to Upload Documents](upload-documents.md)
- [How to Connect Dropbox](connect-dropbox.md)
- [How to Organize Folders](organize-folders.md)
- [Building Your First Data Room](../../tutorials/building-data-room.md)

---

*Last updated: December 7, 2025*
