# Production Deployment Troubleshooting

## Current Setup
- **Domain**: opstools.com/gacc
- **Base Path**: /gacc
- **Port**: 3000

## DNS Error: "DNS_PROBE_FINISHED_NXDOMAIN"

This error means the domain `opstools.com` cannot be resolved. Here's how to fix it:

### 1. Verify Domain Configuration

Check if your domain is properly configured:

```bash
# Check if domain resolves
nslookup opstools.com

# Or
dig opstools.com

# Should return an A record pointing to your server's IP
```

### 2. Configure DNS Records

You need to add an A record in your domain registrar/DNS provider:

```
Type: A
Name: @ (or opstools.com)
Value: YOUR_SERVER_IP_ADDRESS
TTL: 300 (or default)
```

### 3. Verify Deployment on Server

SSH into your production server and check:

```bash
# Check containers are running
docker ps

# Check app container specifically
docker-compose ps

# View logs
docker-compose logs -f app

# Test locally on server
curl http://localhost:3000/gacc/api/health

# Should return:
# {
#   "status": "ok",
#   "timestamp": "...",
#   "environment": "production",
#   "basePath": "/gacc",
#   "publicUrl": "https://opstools.com/gacc"
# }
```

### 4. Reverse Proxy Configuration (If Using nginx/Caddy)

If you're using a reverse proxy, you need to configure it:

#### For nginx:

```nginx
server {
    listen 80;
    server_name opstools.com;

    location /gacc/ {
        proxy_pass http://localhost:3000/gacc/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### For Caddy:

```
opstools.com {
    handle /gacc/* {
        reverse_proxy localhost:3000
    }
}
```

### 5. Firewall Configuration

Make sure your firewall allows traffic:

```bash
# If using ufw (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp  # If accessing directly

# If using firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 6. SSL/HTTPS Setup (Recommended for Production)

For production, you should use HTTPS:

#### Using Certbot (Let's Encrypt):

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d opstools.com

# Auto-renewal is usually set up automatically
```

## Common Issues

### Issue: "Site can't be reached"
**Cause**: Domain not pointing to server, or server not accessible
**Solution**: 
- Verify DNS records with `nslookup opstools.com`
- Check firewall rules
- Verify server is running

### Issue: "502 Bad Gateway"
**Cause**: Reverse proxy can't reach the app
**Solution**:
- Check if Docker containers are running: `docker-compose ps`
- Check app logs: `docker-compose logs app`
- Verify app is listening on port 3000

### Issue: "404 Not Found"
**Cause**: BASE_PATH not configured correctly
**Solution**:
- Ensure BASE_PATH=/gacc in environment variables
- Check reverse proxy passes the path correctly
- Test: `curl http://localhost:3000/gacc/api/health`

## Testing Checklist

- [ ] Domain resolves to correct IP: `nslookup opstools.com`
- [ ] Server is accessible: `ping YOUR_SERVER_IP`
- [ ] Docker containers running: `docker-compose ps`
- [ ] App responds locally: `curl http://localhost:3000/gacc/api/health`
- [ ] Port 80/443 open: `sudo netstat -tulpn | grep ':80\|:443'`
- [ ] Reverse proxy configured (if using)
- [ ] SSL certificate installed (for HTTPS)
- [ ] Environment variables set correctly

## Access Methods

### Development/Testing (Local Server):
```
http://localhost:3000/gacc
http://SERVER_IP:3000/gacc
```

### Production (with Domain):
```
http://opstools.com/gacc   (HTTP)
https://opstools.com/gacc  (HTTPS - recommended)
```

## Need Help?

If you're still seeing issues:

1. **What platform are you deploying to?**
   - AWS, DigitalOcean, Azure, Custom VPS?

2. **Do you have SSH access?**
   - Can you run commands on the server?

3. **Is there a reverse proxy?**
   - nginx, Caddy, Apache, Load Balancer?

4. **Can you access by IP?**
   - Try: `http://YOUR_SERVER_IP:3000/gacc/api/health`

## Next Steps

1. Configure DNS to point opstools.com to your server
2. Wait 5-15 minutes for DNS propagation
3. Test with: `curl https://opstools.com/gacc/api/health`
4. Set up SSL certificate with Let's Encrypt
5. Update OAuth redirect URI in Google Console once domain works

