# Personal Finance Tracker - Setup Guide

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start MongoDB
Ensure MongoDB is running on `localhost:27017` or update the connection string in `backend/app/database.py`.

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the App
Open your browser to: `http://localhost:5173`

---

## Project Structure

```
Semippu/
├── backend/
│   ├── app/
│   │   ├── models/          # Pydantic models
│   │   ├── routes/          # API endpoints
│   │   ├── database.py      # MongoDB connection
│   │   └── main.py          # FastAPI app
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Page components
    │   ├── hooks/           # Custom React hooks
    │   ├── utils/           # Constants and helpers
    │   └── App.jsx          # Main app with routing
    ├── package.json
    └── vite.config.js
```

---

## Environment Variables (Optional)

**Backend** (`backend/.env`):
```
MONGO_DETAILS=mongodb://localhost:27017
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:8000
```

---

## Testing the Flow

1. Complete the 6-step onboarding
2. View your dashboard
3. Click on a credit card
4. Add a transaction using the + button
5. Navigate to Settings to edit your profile

---

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `database.py`

**CORS Error:**
- Backend CORS is set to allow all origins
- If issues persist, check browser console

**Port Already in Use:**
- Backend: Change port in uvicorn command: `--port 8001`
- Frontend: Update in `vite.config.js`

---

## Features Summary

✅ User Onboarding (6 steps)
✅ Dashboard with Financial Overview
✅ Credit Card Management
✅ Transaction Tracking
✅ Budget Planning
✅ Analytics & Charts
✅ Settings & Profile

---

**Enjoy your Personal Finance Tracker!** 🎉
