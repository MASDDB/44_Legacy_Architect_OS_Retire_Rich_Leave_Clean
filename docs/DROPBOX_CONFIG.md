# Dropbox App Configuration Checklist

If you are getting "kicked out" or having connection errors, please verify these 3 critical settings in your [Dropbox App Console](https://www.dropbox.com/developers/apps).

## 1. OAuth 2 Settings (Critical)
*   **Redirect URIs**: Ensure this is EXACT:
    `http://localhost:5173/exit-readiness/data-room`
*   **Allow public clients (Implicit Grant & PKCE)**: Must be set to **"Allow"**.
    *   *Why?* Our app uses the "Token" flow. If this is "Disallow", it will fail immediately.

## 2. Permissions
Go to the **"Permissions"** tab and ensure these boxes are checked:
*   [x] `files.metadata.read` (To list folders)
*   [x] `files.content.read`  (To download files)
*   *Note: You must click "Submit" at the bottom of the page to save changes.*

## 3. Resetting the Connection
If the app thinks it is already connected but it's broken:
1.  Go to the **Data Room** tab in Legacy Architect OS.
2.  Click the **"Disconnect"** (trash icon) next to Dropbox.
3.  Refresh the page.
4.  Try connecting again.

## 4. Environment Check
Ensure your `.env` file matches the **App key** from the "Settings" tab:
`VITE_DROPBOX_APP_KEY=your_key_here` (No quotes!)
