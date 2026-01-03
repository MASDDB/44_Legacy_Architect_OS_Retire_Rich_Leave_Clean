# Dropbox Configuration

To enable the Dropbox integration, you must configure your API key.

## 1. Get your App Key
1. Go to the [Dropbox App Console](https://www.dropbox.com/developers/apps).
2. Create an app or select your existing app.
3. Copy the "App key".
4. Scroll down to **"OAuth 2"** > **"Redirect URIs"**.
5. Add the following URL:
   `http://localhost:5173/exit-readiness/data-room`
6. Click **"Add"**.

## 2. Configure Environment Variable
1. Open the file `project\.env`.
2. Add the following line:

```env
VITE_DROPBOX_APP_KEY=your_app_key_here
```

3. Save the file.

## 3. Restart Server
Restart your local development server for the changes to take effect:

```bash
npm run dev
```
