# Vercel Deployment Guide

## Prerequisites
- GitHub account (for connecting your repo)
- Vercel account (free at https://vercel.com)
- MongoDB Atlas account (free at https://mongodb.com/cloud/atlas)

## Step 1: Set Up MongoDB Atlas

1. Go to https://mongodb.com/cloud/atlas and create a free account
2. Click "Create a Deployment"
3. Choose the M0 (free) cluster tier
4. Select a region (e.g., us-east-1)
5. After cluster is created:
   - Click "Connect"
   - Choose "Drivers"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/myapp`)
   - Replace `<password>` with your actual password
   - Replace `myapp` with `young-peace-ft`

## Step 2: Prepare Your GitHub Repository

1. Ensure all code is committed to GitHub
2. The repository should have this structure:
   ```
   - src/server/ (with our new backend files)
   - package.json
   - vercel.json (already created)
   - .env.example
   ```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended for first deploy)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow prompts and set environment variables when asked

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. In Project Settings:
   - Framework: Angular
   - Build Command: `npm run build`
   - Output Directory: `dist/app`
   - Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong random string (e.g., use `openssl rand -hex 32`)

5. Click "Deploy"

## Step 4: Set Environment Variables

After deployment, set these in Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add:
   - **MONGODB_URI**: `mongodb+srv://username:password@cluster.mongodb.net/young-peace-ft`
   - **JWT_SECRET**: Generate a secure key (at least 32 characters)

## Step 5: Verify Deployment

1. Your app will be live at: `https://your-project-name.vercel.app`
2. Test the API:
   ```bash
   # Register a user
   curl -X POST https://your-project-name.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "name": "Test User"
     }'
   ```

## Step 6: Create First Super Admin (Optional)

1. Register a user through the API
2. Connect to MongoDB Atlas and manually update the user's role to `super_admin`:
   ```javascript
   // In MongoDB Atlas console
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "super_admin" } }
   )
   ```

## Troubleshooting

### Build Fails
- Check that all files in `src/server/` are created
- Ensure `package.json` has mongoose, bcryptjs, and jsonwebtoken
- Check build logs in Vercel dashboard

### Database Connection Fails
- Verify MongoDB URI is correct
- Check MongoDB Atlas firewall: add `0.0.0.0/0` to allow all IPs
- Ensure database cluster is running

### API Endpoints Not Working
- Check environment variables are set in Vercel
- Verify `vercel.json` configuration
- Check Vercel logs for server errors

## Performance Tips

1. **Cold Starts**: First request after deployment may be slow
2. **Database Indexes**: MongoDB Atlas adds indexes for common queries
3. **Caching**: Consider adding Redis later for session management

## Production Best Practices

1. ✅ Use strong JWT_SECRET (at least 32 random characters)
2. ✅ Enable MongoDB IP whitelist in Atlas (currently: 0.0.0.0/0)
3. ✅ Use HTTPS (Vercel provides this automatically)
4. ✅ Set secure cookies for sessions
5. ✅ Implement rate limiting
6. ✅ Add request validation
7. ✅ Monitor error logs

## Custom Domain (Optional)

1. Go to Vercel Project → Settings → Domains
2. Add your custom domain
3. Update DNS records according to Vercel's instructions
4. SSL certificate is automatic with Vercel

## Next Steps

1. Create an admin dashboard to manage users and players
2. Add player statistics and performance tracking
3. Implement email notifications
4. Add file upload for player photos
5. Set up automated backups for MongoDB
