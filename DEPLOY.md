# RentSpace – Free Deployment Guide

Stack (all free): MongoDB Atlas (M0) + Cloudinary (images) + Render (backend) + Vercel (frontend)

## 1. Push to GitHub
Put this whole folder in one GitHub repo (`backend/` and `frontend/` inside). `.env` and `node_modules` are git-ignored.

## 2. MongoDB Atlas
1. mongodb.com/atlas -> sign up -> create a free **M0** cluster.
2. Database Access -> add a user + password.
3. Network Access -> Add IP `0.0.0.0/0`.
4. Connect -> Drivers -> copy the connection string, add `/rentspace` before the `?`.

## 3. Cloudinary
cloudinary.com -> free signup -> Dashboard: copy Cloud name, API Key, API Secret.

## 4. Render (backend)
New -> Web Service -> pick your repo.
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Instance type: Free
Environment variables:
MONGO_URI, JWT_SECRET (long random string), NODE_ENV=production,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
CLIENT_URL=https://<your-vercel-app>.vercel.app (set after step 5)
Deploy, then open `https://<app>.onrender.com/health` -> should show {"ok":true}.

## 5. Vercel (frontend)
1. Edit `frontend/vercel.json`: replace `YOUR-RENDER-APP.onrender.com` with your Render host. Commit and push.
2. vercel.com -> Add New Project -> pick the repo.
3. Root Directory: `frontend` (framework Vite is auto-detected). Deploy.
4. Put the Vercel URL in Render's `CLIENT_URL` and redeploy.

## Notes
- Render free sleeps after ~15 min idle; first request then takes ~30-60 s.
- Old images in your local `uploads/` are not migrated; re-upload listings after deploy.
