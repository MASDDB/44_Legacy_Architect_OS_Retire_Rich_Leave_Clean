# Technical Troubleshooting Guide

**Solutions to common technical issues you might encounter.**

---

## Logging In

### "Invalid Credentials" Error
- **Check Caps Lock**: Passwords are case-sensitive.
- **Reset Password**: Use the "Forgot Password" link.
- **Browser Cache**: Try clearing your browser's cookies and cache.

### Two-Factor Authentication (2FA) Issues
- **Code Not Working**: Ensure your phone's time settings are set to "Automatic." A time drift of even 30 seconds can cause codes to fail.
- **Lost Phone**: Use the backup codes you saved during setup. If you lost those too, contact support to identity verification.

---

## File Uploads

### Upload Failed
1. **Check File Size**: The maximum file size for a single document is **2GB**.
2. **Check File Type**: We support PDF, DOCX, XLSX, PPTX, JPG, and PNG. Executable files (.exe, .bat) are blocked for security.
3. **Internet Connection**: A weak connection can interrupt large uploads. Try a wired connection.

### "Processing" State Stuck
If a file stays in "Processing..." for more than 10 minutes:
1. Delete the file.
2. Refresh the page.
3. Upload it again.
*Note: Large PDFs with many high-res images take longer to process.*

---

## Cloud Integrations (Dropbox / Google Drive)

### "Connection Failed"
- **Pop-up Blocker**: Ensure your browser allows pop-ups from app.legacyarchitectos.com.
- **Business Accounts**: If you use a corporate Dropbox/Google account, your IT admin may need to whitelist our application.

### Files Not Syncing
- **Re-authenticate**: Go to **Settings > Integrations** and click "Reconnect" to refresh your access token.
- **Folder Permissions**: Ensure you haven't moved or renamed the source folder in your cloud drive.

---

## Performance & Display

### Application is Slow
- **Update Browser**: We support the latest versions of Chrome, Firefox, Safari, and Edge. Internet Explorer is **not** supported.
- **Disable Extensions**: Ad-blockers or privacy extensions can sometimes interfere with our script loading.

### Visual Glitches
- **Hard Refresh**: Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac) to force a reload of the application resources.

---

## Error Codes

| Code | Meaning | Solution |
| :--- | :--- | :--- |
| **401** | Unauthorized | Your session expired. Log in again. |
| **403** | Forbidden | You do not have permission to view this resource. Ask your Admin. |
| **404** | Not Found | The page or file no longer exists. |
| **500** | Server Error | Something went wrong on our end. Try again in 5 minutes. |

---

## Still stuck?
Submit a ticket with screenshots of the error to [support@legacyarchitectos.com](mailto:support@legacyarchitectos.com).
