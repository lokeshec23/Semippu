# Deployment Guide for Semippu

This guide helps you deploy the Semippu application to Render (Backend) and Netlify (Frontend).

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
2.  **MongoDB Atlas**: You need a MongoDB connection string (URI). If you haven't, create a cluster on MongoDB Atlas.

## 1. Backend Deployment (Render)

Render is excellent for hosting Python FastAPI applications.

1.  **Sign up/Login** to [Render](https://render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Configuration**:
    *   **Name**: `semippu-backend` (or similar)
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5.  **Environment Variables** (Scroll down to "Advanced" or "Environment"):
    *   Key: `MONGO_DETAILS`
    *   Value: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/personal_finance_tracker?retryWrites=true&w=majority` (Your actual MongoDB URI)
    *   Key: `PYTHON_VERSION`
    *   Value: `3.11.9` (Recommended to match your local env)
6.  Click **Create Web Service**.
7.  Wait for deployment to finish. **Copy the URL** (e.g., `https://semippu-backend.onrender.com`). You will need this for the frontend.

## 2. Frontend Deployment (Netlify)

Netlify is perfect for Vite/React apps.

1.  **Sign up/Login** to [Netlify](https://www.netlify.com/).
2.  Click **Add new site** -> **Import an existing project**.
3.  Connect to GitHub and select your repository.
4.  **Configuration**:
    *   **Base directory**: `frontend`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
5.  **Environment Variables**:
    *   Click on **Show advanced** or go to **Site settings > Environment variables** after creation.
    *   Key: `VITE_API_URL`
    *   Value: The URL from Render (e.g., `https://semippu-backend.onrender.com`) **WITHOUT the trailing slash**.
6.  Click **Deploy site**.

## 3. Important: Incomplete Refactoring

> [!WARNING]
> The codebase currently contains some hardcoded `http://localhost:8000` URLs in the following files. **You must refactor these files to use `API_BASE_URL` before deploying the features they control, otherwise they will fail in production.**

### Files needing update:
*   `frontend/src/pages/Analytics.jsx`
*   `frontend/src/pages/BankAccounts.jsx`
*   `frontend/src/pages/EditTransaction.jsx`
*   `frontend/src/pages/Settings.jsx`
*   `frontend/src/pages/TransactionsList.jsx`
*   `frontend/src/components/CreditCardTracker/CardDetailView.jsx`
*   `frontend/src/components/Onboarding/PersonalInfo.jsx`
*   `frontend/src/components/Dashboard/CreditCardsSummary.jsx`
*   `frontend/src/components/Dashboard/FinancialOverview.jsx`
*   `frontend/src/components/Dashboard/RecentTransactions.jsx`

### How to fix:
1.  Import the constant: `import { API_BASE_URL } from '../utils/constants';` (adjust path as needed).
2.  Replace `http://localhost:8000` with `${API_BASE_URL}`.

## 4. Verification

Once deployed:
1.  Open your Netlify URL.
2.  Navigate to **Login/Register**.
3.  Create a new account (this tests the backend connection).
4.  Check the **Dashboard** (tests data fetching).
5.  Try **Adding a Transaction**.

If you see "Network Error", check the Console (F12) to ensure it's trying to connect to the Render URL, not localhost.
