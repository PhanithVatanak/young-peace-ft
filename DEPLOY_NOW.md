# Deploy Now - Copy & Paste Commands

## 🚀 Vercel Deployment (5 Minutes)

### Step 1: Create Accounts (2 min)

**MongoDB Atlas:**
```
1. Go to https://mongodb.com/cloud/atlas
2. Click "Sign Up Free"
3. Create account, verify email
4. Create M0 (free) cluster
5. Click "Connect" → "Drivers" 
6. Copy connection string (save for step 2)
```

**Vercel:**
```
1. Go to https://vercel.com
2. Click "Sign Up"
3. Connect your GitHub account
```

### Step 2: Get MongoDB Connection String (1 min)

In MongoDB Atlas:
```
mongodb+srv://username:password@cluster.mongodb.net/young-peace-ft
```

Replace:
- `username` with your username
- `password` with your password

### Step 3: Generate JWT Secret (30 sec)

Open terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (e.g., `a3c4f2e1b9d8...`)

### Step 4: Deploy to Vercel (1 min)

In your project directory:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

When prompted:
- Set up project? → **y**
- Project name? → Press Enter (use default)
- Production branch? → main
- Use existing project? → No
- Framework? → Next.js (it will detect Angular)

### Step 5: Set Environment Variables (1 min)

After deployment completes:

```bash
# Set MONGODB_URI
vercel env add MONGODB_URI
# Paste: mongodb+srv://username:password@cluster.mongodb.net/young-peace-ft

# Set JWT_SECRET
vercel env add JWT_SECRET
# Paste: (your generated secret from step 2)

# Redeploy with new variables
vercel --prod
```

### Done! 🎉

Your API is now live at:
```
https://your-project-name.vercel.app/api
```

---

## 🧪 Test Your Deployment

### 1. Register a User

```bash
curl -X POST https://your-project-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "name": "Admin User"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "user"
  }
}
```

### 2. Login

```bash
curl -X POST https://your-project-name.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

Save the token from response.

### 3. Get Current User

```bash
curl -X GET https://your-project-name.vercel.app/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

If you see user info → ✅ Deployment successful!

---

## 👑 Make First Admin User

### Option A: Using MongoDB Atlas Console (Recommended)

1. Go to https://mongodb.com/cloud/atlas
2. Click your cluster → Collections
3. Find `users` collection
4. Find your user
5. Edit the `role` field from `user` to `admin`
6. Click Update

### Option B: Using MongoDB Compass

1. Download MongoDB Compass (free)
2. Connect with your MongoDB URI
3. Navigate to: `young-peace-ft` → `users`
4. Edit user document, change `role` to `admin`

### Option C: Create Admin During Registration

When registering, you can manually set role to admin in MongoDB after creation.

---

## 📊 Create First Player (as Admin)

Get your auth token first (from login above), then:

```bash
curl -X POST https://your-project-name.vercel.app/api/players \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cristiano Ronaldo",
    "jerseyNumber": 7,
    "position": "Forward",
    "team": "Manchester United",
    "email": "cr7@example.com",
    "phone": "+1234567890",
    "height": 187,
    "weight": 84,
    "country": "Portugal",
    "dateOfBirth": "1985-02-05"
  }'
```

---

## ❓ Troubleshooting

### "Module not found" error?
```bash
cd your-project
npm install
vercel --prod
```

### Database connection fails?
1. Check MongoDB connection string is correct
2. In MongoDB Atlas: Network Access → Add IP → 0.0.0.0/0
3. Wait 1-2 minutes for firewall update
4. Test connection again

### JWT_SECRET not working?
```bash
# Regenerate secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update in Vercel dashboard:
# Settings → Environment Variables → JWT_SECRET → Edit → Paste new value

# Redeploy
vercel --prod
```

### Still not working?
1. Check Vercel build logs (Dashboard → Project → Deployments → Logs)
2. Check MongoDB cluster is running
3. Check environment variables are set
4. Open an issue on GitHub with error message

---

## 📱 Next: Create Admin Dashboard

Now that backend is deployed, create a UI for:
- User management
- Player management  
- Role assignments
- Statistics

Use Angular components to call `/api/` endpoints.

---

## 🔐 Security Checklist

Before going to production:

- [ ] MongoDB Atlas: Enable IP whitelist (or use 0.0.0.0/0)
- [ ] Vercel: Enable HTTPS (automatic)
- [ ] JWT_SECRET: Strong 32+ character random string
- [ ] Password minimum length: 8+ characters
- [ ] Add rate limiting on auth endpoints
- [ ] Add input validation (already done)
- [ ] Enable MongoDB backup in Atlas
- [ ] Monitor Vercel logs for errors
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Document all API changes

---

## 📞 Support Links

- MongoDB Atlas Help: https://docs.mongodb.com/atlas/
- Vercel Docs: https://vercel.com/docs
- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- JWT Auth: https://jwt.io/

---

## 🎉 Congratulations!

Your full-stack application is now deployed on Vercel with:
- ✅ MongoDB database
- ✅ User authentication
- ✅ Role-based access
- ✅ Player management
- ✅ Live API endpoints
- ✅ Free hosting

Start building your admin dashboard! 🚀
