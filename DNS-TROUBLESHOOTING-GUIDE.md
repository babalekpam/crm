# DNS Troubleshooting Guide - SendGrid Email Setup

## Current Status
- ✅ CNAME records added to GoDaddy
- ❌ Records not propagating/working yet
- ❌ SendGrid domain authentication failing

## Common Issues & Solutions

### 1. DNS Propagation Delay
DNS changes can take 24-48 hours to propagate globally. However, there are ways to speed this up:

**Check Propagation Status:**
- Use online tools like whatsmydns.net to check if records are visible globally
- Test specific DNS servers: `nslookup url8150.argilette.org 8.8.8.8`

### 2. GoDaddy DNS Configuration Issues

**Common GoDaddy Problems:**
- **TTL Settings**: Make sure TTL is set to lowest value (600 seconds) for faster propagation
- **Proxy Status**: Ensure records are NOT proxied (gray cloud, not orange)
- **Host Format**: Use exact host names without the domain suffix

**Correct GoDaddy Format:**
```
Type: CNAME, Host: url8150, Points to: sendgrid.net, TTL: 600
Type: CNAME, Host: 55351682, Points to: sendgrid.net, TTL: 600
Type: CNAME, Host: em783, Points to: u55351682.wl183.sendgrid.net, TTL: 600
Type: CNAME, Host: s1._domainkey, Points to: s1.domainkey.u55351682.wl183.sendgrid.net, TTL: 600
Type: CNAME, Host: s2._domainkey, Points to: s2.domainkey.u55351682.wl183.sendgrid.net, TTL: 600
Type: TXT, Host: _dmarc, Value: v=DMARC1; p=none; rua=mailto:abel@argilette.com, TTL: 600
```

### 3. Alternative Solutions

**Option A: Use Different Domain**
If argilette.org is having issues, try:
- Use argilette.com instead
- Create new SendGrid domain authentication for argilette.com

**Option B: Subdomain Approach**
- Set up email.argilette.org as subdomain
- Configure SendGrid for the subdomain
- Send from info@email.argilette.org

**Option C: Gmail Workaround (Immediate)**
Fix Gmail authentication:
1. Go to Gmail account settings
2. Enable 2-Factor Authentication
3. Generate new App Password specifically for "Mail"
4. Update GMAIL_APP_PASSWORD secret with new password

### 4. Testing Commands

Test DNS records:
```bash
# Test each CNAME record
nslookup url8150.argilette.org
nslookup 55351682.argilette.org
nslookup em783.argilette.org
nslookup s1._domainkey.argilette.org
nslookup s2._domainkey.argilette.org

# Test with Google DNS
nslookup url8150.argilette.org 8.8.8.8
```

## Immediate Actions

1. **Check GoDaddy Settings**: Verify all records are entered correctly
2. **Lower TTL**: Set TTL to 600 seconds for faster propagation
3. **Wait 2-4 hours**: Check again after some propagation time
4. **Alternative**: Set up Gmail properly as backup

## Expected Timeline
- **Immediate**: DNS changes visible in GoDaddy panel
- **2-4 hours**: Records start propagating globally  
- **24-48 hours**: Full global propagation complete
- **After verification**: SendGrid domain authentication passes