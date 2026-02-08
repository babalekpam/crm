# Gmail SMTP Setup Steps

## Quick Gmail Fix for Immediate Email Sending

To get emails working right now while DNS propagates:

### Step 1: Gmail Account Setup
1. Log into info@argilette.com Gmail account
2. Go to "Manage your Google Account"
3. Click "Security" in the left menu
4. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. In Security settings, find "2-Step Verification"
2. Scroll down to "App passwords"
3. Click "App passwords"
4. Select "Mail" as the app
5. Select "Other (custom name)" as device
6. Type "NODE CRM" as the name
7. Click "Generate"
8. Copy the 16-character password (like: abcd efgh ijkl mnop)

### Step 3: Update Secret
Use the generated password to update GMAIL_APP_PASSWORD secret in Replit.

### Step 4: Test
Register a new test user to verify emails are sending.

## Alternative: Use Different Email
If info@argilette.com doesn't exist or has issues:
1. Create a new Gmail account: nodecrm.system@gmail.com
2. Set it up with 2FA and app password
3. Update GMAIL_USER to nodecrm.system@gmail.com
4. Update email templates to use this address

This will get emails working immediately while DNS records propagate.