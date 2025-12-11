# Railway Deployment Guide

## Prerequisites
- Railway.app account (https://railway.app)
- GitHub account with this repository connected

## Deployment Steps

### 1. Connect Repository to Railway
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select the `MoiseevG/Auto-app` repository
4. Click "Deploy"

### 2. Configure Environment Variables
In Railway dashboard, set these environment variables:

```
BACKEND_URL=http://localhost:8000
PORT=5000
```

### 3. Build & Start Process

Railway will automatically:
1. **Build phase** (from `railway.json`):
   - Install npm dependencies: `npm ci`
   - Build React app: `npm run build`
   - Install Python dependencies: `pip install -r backend/requirements.txt`

2. **Start phase** (from `Procfile`):
   - Start FastAPI backend on port 8000
   - Start Express frontend server on port 5000 (proxying to backend)

### 4. Access the Deployment
- Frontend: `https://your-railway-domain.railway.app`
- Backend API: `https://your-railway-domain.railway.app/api/*`

## Architecture
```
User → Railway Domain (Port 80/443)
       ↓
   Express Server (Node.js)
       ├── Serves React build files
       └── Proxies /api/* → FastAPI backend
       ↓
   FastAPI Server (Python)
       ├── Auth endpoints
       ├── Users endpoints
       ├── Services endpoints
       └── Operations endpoints
```

## Troubleshooting

### Build Fails with npm errors
- Check that `package-lock.json` is up to date: `npm install --package-lock-only`
- Ensure all dependencies in `package.json` are correct

### Backend not found (404 API errors)
- Check Railway logs for Python errors
- Verify `BACKEND_URL=http://localhost:8000` is set
- Ensure `backend/requirements.txt` has all needed packages

### Database Issues
- SQLite will be created automatically in first start
- Check Railway file system for `backend/database.db`
- If needed, reset: Delete database.db and restart

## Local Testing Before Deployment
```bash
# Build React app
npm run build

# Set backend URL
export BACKEND_URL=http://localhost:8000

# Start backend
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start frontend (in another terminal)
cd ..
node server.js
```

Then visit `http://localhost:5000`

## Test Accounts
- **Client**: `+79993334455` (code: `1234`)
- **Operator**: `+79991112233` (code: `1234`)
- **Master**: `+79992223344` (code: `1234`)
