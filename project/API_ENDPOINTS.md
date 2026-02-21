# API Endpoint Inventory

Generated from current code usage in `project/src` and `project/supabase/functions`.

## Supabase Edge Functions

Base URL:

`{VITE_SUPABASE_URL}/functions/v1/{function_name}`

| Function | Path | Method | Auth | Used By |
|---|---|---|---|---|
| send-sms | `/functions/v1/send-sms` | `POST` | Bearer JWT | `project/src/services/smsService.js` |
| send-email | `/functions/v1/send-email` | `POST` | Bearer JWT | `project/src/services/emailService.js` |
| send-voice-call | `/functions/v1/send-voice-call` | `POST` | Bearer JWT | `project/src/services/voiceService.js` |
| create-stripe-payment | `/functions/v1/create-stripe-payment` | `POST` | Bearer JWT | `project/src/services/paymentService.js` |
| confirm-stripe-payment | `/functions/v1/confirm-stripe-payment` | `POST` | Bearer JWT | `project/src/services/paymentService.js` |
| ai-lead-scoring | `/functions/v1/ai-lead-scoring` | `POST` | Bearer JWT | `project/src/services/leadScoringService.js` |
| ai-personalize | `/functions/v1/ai-personalize` | `POST` | Bearer JWT | `project/src/services/aiPersonalizationService.js` |
| bill-performance-fee | `/functions/v1/bill-performance-fee` | `POST` | Bearer JWT | `project/src/services/cashBoostService.js` |
| run-ai-audit | `/functions/v1/run-ai-audit` | `POST` | Bearer JWT | Defined in backend; no direct frontend invoke found |
| voice-call-webhook | `/functions/v1/voice-call-webhook` | `POST` | Twilio signature (`x-twilio-signature`) | Provider callback endpoint |
| generate-ai-content | `/functions/v1/generate-ai-content` | `POST` | Expected Bearer JWT | Referenced in `project/src/services/cashBoostService.js`, but function folder not present |

## Supabase RPC Endpoints

Base URL:

`{VITE_SUPABASE_URL}/rest/v1/rpc/{rpc_name}`

Method: `POST`  
Auth: Bearer JWT (Supabase session token)

### RPC names used in app

- `calculate_behavioral_score`
- `calculate_calendar_metrics`
- `calculate_engagement_score`
- `calculate_fit_score`
- `calculate_overall_lead_score`
- `calculate_personalization_performance`
- `calculate_voice_analytics`
- `explain_scheduled_appointments`
- `generate_api_key`
- `generate_webhook_secret`
- `get_active_sessions_count`
- `get_crm_sync_health`
- `get_demo_auth_status`
- `get_lead_personalization_data`
- `get_lead_score_category`
- `get_recent_crm_sync_activity`
- `get_user_availability_for_date`
- `list_super_admin_users`
- `log_webhook_delivery`
- `logout_all_users`
- `send_campaign_sms`
- `send_email_notification`
- `send_voice_campaign`
- `sync_external_calendar`
- `update_sms_status`
- `update_voice_call_status`
- `verify_demo_credentials`
- `verify_demo_login_setup`

## External APIs

| Service | Endpoint | Method | Used By |
|---|---|---|---|
| Twilio SMS | `https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json` | `POST` | `project/supabase/functions/send-sms/index.ts` |
| Resend Email | `https://api.resend.com/emails` | `POST` | `project/supabase/functions/send-email/index.ts` |
| Google OAuth | `https://accounts.google.com/o/oauth2/v2/auth` | `GET` | `project/src/services/cloudStorageService.js` |
| Google Drive list | `https://www.googleapis.com/drive/v3/files` | `GET` | `project/src/services/cloudStorageService.js` |
| Google Drive download | `https://www.googleapis.com/drive/v3/files/{fileId}?alt=media` | `GET` | `project/src/services/cloudStorageService.js` |
| Dropbox OAuth | `https://www.dropbox.com/oauth2/authorize` | `GET` | `project/src/services/cloudStorageService.js` |
| Dropbox list folder | `https://api.dropboxapi.com/2/files/list_folder` | `POST` | `project/src/services/cloudStorageService.js` |
| Dropbox download | `https://content.dropboxapi.com/2/files/download` | `POST` | `project/src/services/cloudStorageService.js` |
| Voice demo webhook | `https://z6gljx4z.rsrv.host/webhook/lillian-receptionist` | `POST` | `project/src/pages/ai-voice-demo/index.jsx` |

