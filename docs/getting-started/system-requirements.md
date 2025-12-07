# System Requirements

**Ensure your system meets these requirements for the best experience with Legacy Architect OS.**

## Browser Requirements

### Supported Browsers

Legacy Architect OS is a web-based application that works best with modern browsers.

#### ✅ Fully Supported
- **Google Chrome** 90+ (Recommended)
- **Microsoft Edge** 90+ (Chromium-based)
- **Mozilla Firefox** 88+
- **Safari** 14+ (macOS and iOS)

#### ⚠️ Limited Support
- **Opera** 76+
- **Brave** 1.24+

#### ❌ Not Supported
- Internet Explorer (all versions)
- Legacy Edge (pre-Chromium)
- Browsers older than 2 years

> **💡 Recommendation**: We strongly recommend using **Google Chrome** for the best performance and compatibility.

### Browser Settings

For optimal performance, ensure:

- **JavaScript**: Enabled (required)
- **Cookies**: Enabled (required for authentication)
- **Pop-ups**: Allowed for legacyarchitectos.com (for OAuth flows)
- **Local Storage**: Enabled (for session management)

---

## Internet Connection

### Minimum Requirements
- **Download Speed**: 5 Mbps
- **Upload Speed**: 1 Mbps (5 Mbps recommended for document uploads)
- **Latency**: < 100ms

### Recommended
- **Download Speed**: 25 Mbps or higher
- **Upload Speed**: 5 Mbps or higher
- **Connection Type**: Broadband, Cable, or Fiber

> **Note**: Slower connections will work but may experience delays when uploading large documents or loading dashboards.

---

## Screen Resolution

### Minimum
- **Desktop**: 1280 x 720 pixels
- **Tablet**: 768 x 1024 pixels
- **Mobile**: 375 x 667 pixels

### Recommended
- **Desktop**: 1920 x 1080 pixels or higher
- **Tablet**: 1024 x 768 pixels or higher

> **Note**: Some features may have limited functionality on smaller screens. We recommend using a desktop or laptop for the best experience.

---

## Device Requirements

### Desktop & Laptop

#### Minimum Specifications
- **Processor**: Dual-core 1.6 GHz or equivalent
- **RAM**: 4 GB
- **Operating System**:
  - Windows 10 or later
  - macOS 10.14 (Mojave) or later
  - Linux (Ubuntu 18.04+ or equivalent)

#### Recommended Specifications
- **Processor**: Quad-core 2.0 GHz or better
- **RAM**: 8 GB or more
- **Operating System**: Latest version of Windows, macOS, or Linux

### Tablets

#### Supported Devices
- **iPad**: iPad Air 2 or later, iPad Pro (all models), iPad (5th generation or later)
- **Android Tablets**: Android 8.0+ with 3GB+ RAM
- **Windows Tablets**: Surface Pro 4 or later

> **Note**: Some advanced features (bulk document upload, complex reporting) work best on desktop/laptop.

### Mobile Phones

#### Supported Devices
- **iPhone**: iPhone 8 or later (iOS 14+)
- **Android**: Android 8.0+ with 2GB+ RAM

#### Mobile Limitations
- Data Room: View-only (upload via desktop recommended)
- Reports: Simplified views
- Assessment: Full functionality
- Missions: View and track only

> **💡 Tip**: Use the mobile app for quick checks and notifications. Use desktop for heavy lifting like document uploads and report generation.

---

## File Upload Requirements

### Supported File Types

#### Documents
- **PDF**: .pdf (recommended for final documents)
- **Microsoft Word**: .doc, .docx
- **Microsoft Excel**: .xls, .xlsx
- **Text**: .txt, .rtf

#### Images
- **JPEG**: .jpg, .jpeg
- **PNG**: .png
- **GIF**: .gif (static only)

#### Other
- **CSV**: .csv (for data imports)
- **ZIP**: .zip (for bulk uploads)

### File Size Limits
- **Per File**: 50 MB maximum
- **Total Storage**: Varies by plan
  - Free: 1 GB
  - Professional: 10 GB
  - Enterprise: 100 GB or custom

> **Note**: For files larger than 50MB, consider compressing or splitting them. Contact support for enterprise needs.

---

## Third-Party Integrations

### Google Drive Integration

**Requirements**:
- Active Google account
- Google Drive access
- OAuth 2.0 authorization

**Permissions Needed**:
- Read access to Google Drive files
- Ability to list folders and files

### Dropbox Integration

**Requirements**:
- Active Dropbox account
- Dropbox access
- OAuth 2.0 authorization

**Permissions Needed**:
- Read access to Dropbox files
- Ability to list folders and files

---

## Security Requirements

### Authentication
- **Email Verification**: Required for all accounts
- **Password Strength**: Minimum 8 characters (12+ recommended)
- **Two-Factor Authentication**: Supported (recommended for sensitive data)

### Data Security
- **Encryption**: All data encrypted in transit (TLS 1.2+)
- **Storage**: Data encrypted at rest (AES-256)
- **Compliance**: SOC 2 Type II, GDPR compliant

### Network Security
- **Firewall**: Ensure outbound HTTPS (port 443) is allowed
- **VPN**: Compatible with most VPN solutions
- **Proxy**: May require configuration for corporate proxies

---

## Accessibility

Legacy Architect OS is designed to be accessible to users with disabilities.

### Supported Features
- **Screen Readers**: Compatible with JAWS, NVDA, VoiceOver
- **Keyboard Navigation**: Full keyboard support
- **High Contrast**: Supports OS-level high contrast modes
- **Text Scaling**: Respects browser text size settings

### WCAG Compliance
- **Level**: WCAG 2.1 AA compliant
- **Testing**: Regularly tested with accessibility tools

---

## Performance Optimization

### Browser Optimization

#### Clear Cache Regularly
1. Chrome: Settings → Privacy → Clear browsing data
2. Firefox: Options → Privacy → Clear Data
3. Safari: Preferences → Privacy → Manage Website Data

#### Disable Unnecessary Extensions
- Ad blockers may interfere with some features
- VPN extensions may slow performance
- Keep only essential extensions enabled

### Network Optimization

#### For Slow Connections
- Use wired connection instead of Wi-Fi when possible
- Close other bandwidth-heavy applications
- Upload documents during off-peak hours
- Use compressed file formats

#### For Corporate Networks
- Whitelist `*.legacyarchitectos.com`
- Allow WebSocket connections
- Enable OAuth redirect URLs

---

## Known Limitations

### Browser-Specific Issues

#### Safari
- Some animations may be less smooth
- File upload progress may not display accurately
- Workaround: Use Chrome for bulk uploads

#### Firefox
- PDF preview may require additional plugin
- Workaround: Download and open in external viewer

#### Mobile Browsers
- Limited multi-file upload support
- Some drag-and-drop features unavailable
- Workaround: Use desktop for document management

### Platform Limitations

#### Offline Access
- **Not Supported**: Legacy Architect OS requires internet connection
- **Planned**: Offline mode for mobile app (coming 2026)

#### Real-Time Collaboration
- **Limited**: Multiple users can access, but no live co-editing
- **Planned**: Real-time document collaboration (roadmap)

---

## Testing Your System

### Quick Compatibility Check

Visit our system check page: [https://legacyarchitectos.com/system-check](https://legacyarchitectos.com/system-check)

This will test:
- ✅ Browser compatibility
- ✅ JavaScript enabled
- ✅ Cookies enabled
- ✅ Connection speed
- ✅ Screen resolution
- ✅ Local storage available

### Manual Tests

#### Test 1: Login & Authentication
1. Go to legacyarchitectos.com
2. Create a test account
3. Verify email
4. Log in successfully

#### Test 2: Document Upload
1. Navigate to Data Room
2. Try uploading a small PDF (< 5MB)
3. Verify upload completes
4. Verify file appears in folder

#### Test 3: Cloud Storage (Optional)
1. Go to Data Room → Cloud Storage
2. Click "Connect Google Drive" or "Connect Dropbox"
3. Complete OAuth flow
4. Verify connection successful

---

## Troubleshooting

### Browser Issues

**Problem**: Page won't load or displays incorrectly

**Solutions**:
1. Clear browser cache and cookies
2. Disable browser extensions temporarily
3. Try incognito/private browsing mode
4. Update browser to latest version
5. Try a different browser

### Connection Issues

**Problem**: Slow performance or timeouts

**Solutions**:
1. Test internet speed at [speedtest.net](https://speedtest.net)
2. Close other applications using bandwidth
3. Restart router/modem
4. Try wired connection instead of Wi-Fi
5. Contact your ISP if issues persist

### Upload Issues

**Problem**: Files won't upload

**Solutions**:
1. Check file size (must be < 50MB)
2. Verify file type is supported
3. Check internet connection stability
4. Try uploading one file at a time
5. Compress large files before uploading

---

## Getting Help

### Support Resources
- **Email**: support@legacyarchitectos.com
- **Live Chat**: Available Mon-Fri 9am-5pm EST
- **System Status**: [status.legacyarchitectos.com](https://status.legacyarchitectos.com)
- **Community Forum**: [community.legacyarchitectos.com](https://community.legacyarchitectos.com)

### Before Contacting Support

Please have ready:
- Browser name and version
- Operating system
- Screenshot of any error messages
- Steps to reproduce the issue
- Your account email (don't share password)

---

## Future Enhancements

We're constantly improving Legacy Architect OS. Upcoming features:

- **Mobile Apps**: Native iOS and Android apps (Q2 2026)
- **Offline Mode**: Work without internet, sync later (Q3 2026)
- **Advanced Integrations**: QuickBooks, Xero, Salesforce (Q4 2026)
- **Real-Time Collaboration**: Multi-user document editing (2027)

---

*Last updated: December 7, 2025*
