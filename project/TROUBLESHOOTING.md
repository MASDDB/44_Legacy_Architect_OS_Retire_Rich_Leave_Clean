# Black Screen Troubleshooting Guide

## Problem
Application shows black screen with "your preview will appear here" message.

## Root Cause Analysis

### ✅ Issue Found: Dev Server Not Running
The Vite development server is not running on the expected port (5173).

## Solution Steps

### 1. Start the Development Server

```bash
npm start
```

The dev server should start and display:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2. Verify Server is Running

```bash
# Check if port 5173 is in use
lsof -i :5173

# Or use curl to test
curl http://localhost:5173
```

### 3. Check Browser Console

Open browser developer tools (F12) and check for:
- JavaScript errors (red messages)
- Failed network requests (in Network tab)
- React component errors

## Common Causes & Solutions

### Issue 1: Port Already in Use
**Symptom:** Error like "Port 5173 is already in use"

**Solution:**
```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
VITE_PORT=5174 npm start
```

### Issue 2: Missing Dependencies
**Symptom:** Module not found errors in console

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Build Cache Issues
**Symptom:** Old code still showing, or strange errors

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
rm -rf build dist

# Rebuild
npm run build
```

### Issue 4: Environment Variables Not Loaded
**Symptom:** "Missing Supabase environment variables" error

**Solution:**
1. Verify `.env` file exists in project root
2. Check it contains:
   ```
   VITE_SUPABASE_URL=your-url
   VITE_SUPABASE_ANON_KEY=your-key
   ```
3. Restart dev server after changing `.env`

### Issue 5: JavaScript Runtime Errors
**Symptom:** Blank page, errors in console

**Common fixes:**
- Check for syntax errors (missing brackets, semicolons)
- Verify all imports have correct paths
- Check for undefined variables
- Look for missing default exports

### Issue 6: React Component Not Mounting
**Symptom:** `#root` element exists but stays empty

**Debug Code:**
```javascript
// Add to src/index.jsx temporarily
console.log('🔍 Root element:', document.getElementById('root'));
console.log('🔍 React loaded:', typeof React !== 'undefined');
console.log('🔍 ReactDOM loaded:', typeof createRoot !== 'undefined');
```

## Quick Diagnostic Checklist

- [ ] Dev server is running (`npm start`)
- [ ] Port 5173 is accessible
- [ ] Browser console shows no errors
- [ ] Network tab shows HTML, JS, CSS loaded
- [ ] `.env` file has correct values
- [ ] `node_modules` directory exists
- [ ] `package.json` has start script
- [ ] `index.html` has `<div id="root">`

## Prevention Best Practices

1. **Use Error Boundaries**
   ```jsx
   import { ErrorBoundary } from './components/ErrorBoundary';

   <ErrorBoundary>
     <App />
   </ErrorBoundary>
   ```

2. **Add Global Error Handlers**
   ```javascript
   window.addEventListener('error', (event) => {
     console.error('Global error:', event.error);
   });

   window.addEventListener('unhandledrejection', (event) => {
     console.error('Unhandled rejection:', event.reason);
   });
   ```

3. **Validate Environment Variables Early**
   ```javascript
   // At top of index.jsx
   const requiredEnvVars = [
     'VITE_SUPABASE_URL',
     'VITE_SUPABASE_ANON_KEY'
   ];

   requiredEnvVars.forEach(key => {
     if (!import.meta.env[key]) {
       throw new Error(`Missing required env var: ${key}`);
     }
   });
   ```

4. **Use StrictMode for Development**
   ```jsx
   import { StrictMode } from 'react';

   root.render(
     <StrictMode>
       <App />
     </StrictMode>
   );
   ```

## For Your Current Issue

**The dev server is not running. Start it with:**

```bash
cd /tmp/cc-agent/59403554/project
npm start
```

Then refresh your browser preview window.
