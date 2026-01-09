# Personal Finance & Credit Card Tracker

A comprehensive full-stack personal finance management application built with React and FastAPI.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

### 💳 Financial Management
- **Transaction Tracking** - Add, edit, delete, and categorize transactions
- **Bank Accounts** - Manage multiple bank accounts with real-time balances
- **Credit Cards** - Track credit cards with utilization monitoring
- **Budget Management** - Set and monitor monthly budgets by category

### 📊 Analytics & Insights
- **Dashboard** - Real-time financial overview with key metrics
- **Analytics** - Comprehensive charts and spending insights
- **Category Breakdown** - Visual representation of spending patterns
- **Trends** - Income vs expense trends over time

### 🎨 User Experience
- **Beautiful UI** - Modern, clean interface with smooth animations
- **Toast Notifications** - Real-time feedback for all actions
- **Responsive Design** - Works perfectly on all devices
- **Smart Navigation** - Context-aware routing and clickable cards

### 🔐 Security
- **Authentication** - Secure login/registration system
- **Password Hashing** - SHA256 encryption
- **User Isolation** - Complete data privacy per user
- **Session Management** - Secure localStorage-based sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── app/
│   │   ├── models/          # Pydantic models
│   │   │   ├── user.py
│   │   │   ├── transaction.py
│   │   │   ├── bank.py
│   │   │   ├── card.py
│   │   │   └── budget.py
│   │   ├── routes/          # API endpoints
│   │   │   ├── user.py
│   │   │   ├── transaction.py
│   │   │   ├── bank.py
│   │   │   ├── card.py
│   │   │   └── budget.py
│   │   └── database.py      # MongoDB connection
│   └── main.py              # FastAPI app
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Dashboard/
│   │   │   ├── Onboarding/
│   │   │   └── CreditCardTracker/
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions*.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── BankAccounts.jsx
│   │   │   └── Settings.jsx
│   │   ├── context/         # React context
│   │   │   └── ToastContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/user/{id}` - Get user details
- `PUT /api/user/{id}` - Update user profile

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/{user_id}` - Get all transactions
- `GET /api/transactions/{user_id}/recent` - Get recent transactions
- `GET /api/transactions/card/{card_id}` - Get card transactions
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Bank Accounts
- `POST /api/bank-accounts` - Add bank account
- `GET /api/bank-accounts/{user_id}` - Get all accounts

### Cards
- `POST /api/cards` - Add credit/debit card
- `GET /api/cards/{user_id}` - Get all cards

### Budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/{user_id}/{month}` - Get monthly budget

## 🎯 Key Technologies

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  personal_info: {
    full_name: String,
    phone_number: String,
    gender: String,
    date_of_birth: Date,
    profile_photo: String
  },
  employment_info: {
    status: String,
    company_name: String,
    designation: String,
    monthly_salary: Number,
    salary_date: Number,
    work_email: String
  },
  onboarding_completed: Boolean
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  transactionType: String, // income/expense
  amount: Number,
  category: String,
  merchant: String,
  description: String,
  date: Date,
  paymentMethod: String, // cash/card/upi/bank_transfer
  cardId: ObjectId,
  bankAccountId: ObjectId,
  status: String,
  created_at: Date
}
```

## 🎨 Features Showcase

### Dashboard
- Financial overview cards (clickable)
- Credit cards summary with utilization
- Recent transactions
- Quick navigation

### Transactions
- Add/Edit/Delete transactions
- Filter by category and type
- Search functionality
- Grouped by date display

### Analytics
- Income vs Expense trends
- Category-wise spending breakdown
- Payment method analysis
- Top spending categories

### Bank Accounts
- Add multiple accounts
- View total balance
- Balance visibility toggle
- Account details

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=finance_tracker
```

**Frontend**
```
VITE_API_URL=http://localhost:8000
```

## 🚦 Usage

### First Time Setup
1. Register a new account
2. Complete the 7-step onboarding process
3. Start adding transactions

### Daily Usage
1. Login to your account
2. View dashboard for financial overview
3. Add transactions as they occur
4. Check analytics for insights

## 🎯 Roadmap

- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Export to PDF/CSV
- [ ] Email notifications
- [ ] Dark mode
- [ ] Multi-currency support
- [ ] Mobile app
- [ ] Investment tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for better financial management

## 🙏 Acknowledgments

- React team for the amazing framework
- FastAPI for the excellent Python framework
- Tailwind CSS for beautiful styling
- Recharts for data visualization

---

**Note**: This is a personal finance management tool. Always ensure your data is backed up and secure.
