# Speech-to-Speech AI App

This is a full-stack speech-to-speech app powered by FastAPI (Python backend) and React (Vite frontend), designed for Railway hosting.

## 🚀 Project Structure

```
.
├── backend/   # FastAPI server with Whisper + OpenAI + Edge TTS
├── frontend/  # React + Vite frontend
```

---

## 📦 Deployment on Railway (Monorepo)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/speech-to-speech-app.git
git push -u origin main
```

### 2. Go to [https://railway.app](https://railway.app)

- Create a **New Project**
- Click **Deploy from GitHub Repo**
- Select this monorepo

### 3. Set Up Two Services:

#### 🔹 Backend Service
- Add a **New Service**
- Select `backend/` as the root
- Add Environment Variable:
  - `OPENAI_API_KEY = your-openai-key`

#### 🔹 Frontend Service
- Add another **New Service**
- Select `frontend/` as the root
- Build Command: `npm install && npm run build`
- Output Directory: `dist`
- Railway will auto-detect and host your frontend

---

Now you have:
✅ Live API (FastAPI)  
✅ Live frontend (React)  
✅ Supports Odia, Hindi, Telugu, and English

