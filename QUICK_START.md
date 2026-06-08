# Quick Start Guide

## ✅ What's Been Done

Your Angular app now has a complete backend with:

### 🗄️ MongoDB Database
- User management with roles (User, Admin, Super Admin)
- Player data storage with full stats (jersey, position, team, etc.)
- Secure password hashing with bcryptjs

### 🔐 Authentication System
- User registration & login with JWT tokens
- 7-day token expiration
- Role-based access control (RBAC)
- Protected API endpoints

### 📡 REST API (9 endpoints)
- **Auth**: Register, Login, Get Current User
- **Players**: List (admin), Get, Create (admin), Update (admin), Delete (super admin)
- **Users**: List (super admin), Get, Update Role (super admin), Delete (super admin)

### 📦 Production Ready
- ✅ Fully built and tested (no TypeScript errors)
- ✅ Ready for Vercel deployment
- ✅ Environment variables configured
- ✅ Comprehensive documentation included

---

## 🚀 Quick Deploy to Vercel

### 1. Prepare MongoDB
```bash
# Go to https://mongodb.com/cloud/atlas
# Create free account → Create M0 cluster
# Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/young-peace-ft
```

### 2. Deploy to Vercel
```bash
# Option A: CLI (recommended)
npm install -g vercel
vercel login
vercel
# Follow prompts and add environment variables

# Option B: Use Vercel Dashboard
# Go to https://vercel.com
# Import your GitHub repo
# Add environment variables:
#   MONGODB_URI = your-mongodb-connection-string
#   JWT_SECRET = generate-random-32-char-string
```

### 3. Test Your API
```bash
# Register user
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "name": "Admin User"
  }'

# Login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

---

## 📚 Documentation Files

Create these in your project root (already created):

1. **`BACKEND_SETUP.md`** - Backend architecture overview
2. **`API_DOCUMENTATION.md`** - Complete API reference with examples
3. **`DEPLOYMENT.md`** - Step-by-step Vercel deployment guide

---

## 🔧 Local Development

```bash
# 1. Create .env.local
MONGODB_URI=mongodb://localhost:27017/young-peace-ft
JWT_SECRET=dev-secret-key

# 2. Install MongoDB locally or use cloud

# 3. Run development server
npm run dev

# 4. Access at http://localhost:3000
```

---

## 📋 File Structure

```
src/server/
├── db/connect.ts           # MongoDB connection
├── models/
│   ├── User.ts            # User schema + roles
│   └── Player.ts          # Player schema
├── routes/
│   ├── auth.ts            # Login/Register endpoints
│   ├── players.ts         # Player CRUD endpoints
│   └── users.ts           # User management endpoints
└── middleware/
    └── auth.ts            # JWT verification + RBAC
```

---

## 🎯 User Roles & Permissions

### User Role
- ✓ Register account
- ✓ Login
- ✓ View own profile
- ✓ View player details (limited)

### Admin Role
- ✓ All User permissions
- ✓ View all players
- ✓ Create new players
- ✓ Update player info
- ✗ Delete players
- ✗ Manage users

### Super Admin Role
- ✓ All Admin permissions
- ✓ Delete players
- ✓ View all users
- ✓ Change user roles
- ✓ Delete user accounts

---

## 🔑 Environment Variables

**Required for production:**
```
MONGODB_URI = Your MongoDB Atlas connection string
JWT_SECRET = Random 32+ character string for token signing
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing the API

### 1. Register Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!",
    "name": "Admin User"
  }'
```

### 2. Login to Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'

# Save the returned "token" value
```

### 3. Make Admin (via MongoDB)
```javascript
// In MongoDB Atlas console
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

### 4. Create a Player (as Admin)
```bash
curl -X POST http://localhost:3000/api/players \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cristiano Ronaldo",
    "jerseyNumber": 7,
    "position": "Forward",
    "team": "Manchester United",
    "email": "cr7@example.com",
    "country": "Portugal",
    "height": 187,
    "weight": 84
  }'
```

---

## ❓ Common Questions

**Q: Is it really free?**
- A: Yes! MongoDB Atlas free tier + Vercel free tier = completely free hosting

**Q: How do I make someone an admin?**
- A: Use MongoDB Atlas console or create an admin panel (coming next)

**Q: What if I want to change the JWT expiration?**
- A: Edit `src/server/routes/auth.ts` line with `expiresIn: '7d'`

**Q: Can I add more player fields?**
- A: Yes, edit `src/server/models/Player.ts` and add new fields

**Q: How do I reset a user's password?**
- A: Currently not implemented - add a reset endpoint for production

---

## 📞 Next Steps

1. ✅ **Deploy to Vercel** (follow DEPLOYMENT.md)
2. 🎨 **Create Admin Dashboard** - UI for managing users/players
3. 📊 **Add Player Stats** - Track performance, goals, assists
4. 📸 **File Uploads** - Player profile photos
5. 📧 **Email Notifications** - Send alerts to users
6. 🔔 **Rate Limiting** - Protect API from abuse
7. 📝 **Logging** - Track API usage

---

## 🆘 Troubleshooting

**Build fails?**
- Check `npm run build` output
- Ensure all files in `src/server/` are present
- Delete `node_modules` and run `npm install`

**Can't connect to MongoDB?**
- Verify connection string is correct
- Check MongoDB cluster is running
- Allow 0.0.0.0/0 in MongoDB Atlas firewall

**Login not working?**
- Check environment variables are set
- Verify database has users collection
- Check browser console for errors

**Deployment stuck?**
- Check Vercel build logs
- Ensure `package.json` has all dependencies
- Verify `vercel.json` configuration

---

## 📖 Read These Files

1. `BACKEND_SETUP.md` - Full backend overview
2. `API_DOCUMENTATION.md` - API reference
3. `DEPLOYMENT.md` - Vercel setup

---

**Your app is ready to deploy! 🎉**

Start with DEPLOYMENT.md for step-by-step Vercel setup.
