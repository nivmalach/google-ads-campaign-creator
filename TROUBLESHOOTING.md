# Troubleshooting: No Google Ads Accounts Found

You're getting "Successfully connected to Google Ads!" but "No Google Ads accounts found."

## Most Likely Causes

### 1. **Developer Token Not Approved for Production**
Your developer token might be in **test mode**. In test mode, you can only access test accounts (MCC accounts you manage).

**Solution:**
- Go to [Google Ads API Center](https://ads.google.com/aw/apicenter)
- Check your Developer Token status
- If it says "Test", you can only access accounts under an MCC that you own
- Apply for production access if you need to access real client accounts

### 2. **OAuth Scopes Issue**
The refresh token might not have the right Google Ads scope.

**Current scopes in your app:**
- `https://www.googleapis.com/auth/adwords`
- `https://www.googleapis.com/auth/userinfo.profile`  
- `https://www.googleapis.com/auth/userinfo.email`

**Solution:**
Try revoking access and re-authorizing:
1. Go to [Google Account Permissions](https://myaccount.google.com/permissions)
2. Find "Opso Tools" and remove access
3. Go back to your app and connect again

### 3. **Account Access Issue**
The Google account you're using might not have access to Google Ads accounts.

**Solution:**
- Make sure the Gmail account you're authorizing with actually has access to Google Ads
- Check at [ads.google.com](https://ads.google.com) if you can see accounts there
- If using a test account, make sure it's set up correctly

### 4. **MCC vs Individual Account**
If you have an MCC (Manager) account, you might need to use it differently.

## Check the Logs

After redeploying, check the Docker logs to see the actual error:

```bash
docker logs gacc --tail=100 -f
```

Look for lines that say:
- "Fetching accessible customers with refresh token..."
- "API Response: ..."
- "Error fetching customer IDs:"

The logs will show the actual API response and help diagnose the issue.

## Quick Test

Try this to verify your setup:

1. **Check Developer Token:**
   ```
   Visit: https://ads.google.com/aw/apicenter
   Status should show: Basic access or Standard access
   ```

2. **Check Account Access:**
   ```
   Visit: https://ads.google.com
   Can you see your accounts? Note down the customer IDs
   ```

3. **Try with MCC Account:**
   If you have an MCC account, try authenticating with that account instead

## Common Solutions

### If Developer Token is in Test Mode:
- You can only access test MCC accounts
- Create a test MCC account if needed
- Or apply for production access

### If Scopes are Wrong:
- Revoke app access
- Re-authenticate
- Make sure to approve all permissions

### If Still Not Working:
Check the container logs and share the error message for more specific help.

