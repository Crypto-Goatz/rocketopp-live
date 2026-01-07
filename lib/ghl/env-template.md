# GHL Environment Variables for RocketClients

Each RocketClient deployment needs these env vars to connect to their GHL location.

## Required Variables

```env
# GHL Location Connection
GHL_LOCATION_ID=your_location_id_here
GHL_LOCATION_PIT=pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
GHL_COMPANY_ID=your_company_id_here

# GHL Agency Connection (for snapshots, company-level APIs)
GHL_AGENCY_PIT=pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## How to Get These Values

### Location ID
1. Go to your GHL sub-account
2. Settings → Business Profile
3. The Location ID is in the URL: `app.gohighlevel.com/v2/location/{LOCATION_ID}/...`

### Location PIT (Private Integration Token)
1. Go to your GHL sub-account
2. Settings → Integrations → Private Integrations
3. Create new or use existing integration
4. Copy the token (starts with `pit-`)

### Company ID
1. Go to your GHL Agency view
2. The Company ID is in the URL when viewing agency settings

### Agency PIT
1. Go to your GHL Agency view
2. Settings → Private Integrations (at agency level)
3. Create new or use existing integration
4. Copy the token (starts with `pit-`)

## Scopes Needed

The Location PIT should have these scopes:
- contacts.readonly / contacts.write
- opportunities.readonly / opportunities.write
- conversations.readonly / conversations.write
- calendars.readonly / calendars.write
- workflows.readonly
- locations.readonly
- users.readonly
- forms.readonly
- surveys.readonly

## Usage in Code

```typescript
import { ghl } from '@/lib/ghl/client'

// Get contacts
const { contacts } = await ghl.contacts.list()

// Send SMS
await ghl.conversations.sendSMS(contactId, 'Hello!')

// Get location info
const { location } = await ghl.location.get()
```

## No OAuth Needed!

This setup uses Private Integration Tokens which:
- Never expire (unless revoked)
- Don't require user login
- Give consistent access to all scopes
- Perfect for white-labeled deployments
