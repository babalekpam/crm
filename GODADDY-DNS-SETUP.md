# GoDaddy DNS Configuration Guide

## Updated SendGrid Records (Use These New Values)

The SendGrid values have changed. Use these EXACT records in GoDaddy:

### Step-by-Step GoDaddy Setup:

1. **Log into GoDaddy**
2. **Go to DNS Management** for argilette.org
3. **Add these EXACT records:**

```
Record 1:
Type: CNAME
Host: url3739
Points to: sendgrid.net
TTL: Custom 600

Record 2:
Type: CNAME  
Host: 55351682
Points to: sendgrid.net
TTL: Custom 600

Record 3:
Type: CNAME
Host: em910
Points to: u55351682.wl183.sendgrid.net
TTL: Custom 600

Record 4:
Type: CNAME
Host: s1._domainkey
Points to: s1.domainkey.u55351682.wl183.sendgrid.net
TTL: Custom 600

Record 5:
Type: CNAME
Host: s2._domainkey  
Points to: s2.domainkey.u55351682.wl183.sendgrid.net
TTL: Custom 600

Record 6:
Type: TXT
Host: _dmarc
TXT Value: v=DMARC1; p=none; rua=mailto:abel@argilette.com
TTL: Custom 600
```

## Important GoDaddy Notes:

**Host Field Format:**
- Use ONLY the subdomain part (url3739, NOT url3739.argilette.org)
- GoDaddy automatically adds .argilette.org

**Common Mistakes:**
- Don't include the full domain in Host field
- Don't use quotes around TXT values
- Make sure TTL is set to Custom 600
- Ensure records are "Active" not "Parked"

**After Adding:**
- Wait 10-30 minutes with TTL 600
- Check that all records show as "Active" in GoDaddy
- SendGrid should start showing green checkmarks

## Verification Steps:

1. In GoDaddy, verify all 6 records are listed
2. Each record should show TTL: 600
3. Status should be "Active" 
4. Wait 15-30 minutes, then check SendGrid dashboard