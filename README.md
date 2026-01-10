# Personal Finance & Credit Card Tracker

A modern, full-stack web application for managing personal finances, tracking credit cards, and monitoring expenses.

## 🚀 Features

- **6-Step Onboarding Wizard**: Complete user registration with personal info, employment, bank accounts, cards, and budgets
- **Interactive Dashboard**: Real-time financial overview with stat cards and visualizations
- **Credit Card Management**: Track multiple cards with utilization gauges and spending analytics
- **Transaction Tracking**: Add, view, and categorize expenses with automatic balance updates
- **Budget Planning**: Set monthly budgets with category-wise allocation and pie chart visualization
- **Analytics**: Spending insights with category breakdowns and monthly trends
- **Profile Settings**: Edit personal information and manage account

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **FastAPI** (Python)
- **MongoDB** with Motor (async driver)
- **Pydantic** for data validation

## 📦 Installation

See [SETUP.md](./SETUP.md) for detailed installation and running instructions.

**Quick Start:**
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 📱 Screenshots

- **Onboarding**: 6-step wizard with stepper component
- **Dashboard**: Financial overview with cards carousel
- **Card Details**: Transaction list with analytics
- **Add Transaction**: Modal form with category selection

## 🎯 Use Cases

- Track credit card spending and utilization
- Monitor monthly expenses by category
- Set and manage budgets
- View spending trends and analytics
- Manage multiple bank accounts and cards

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React and FastAPI**
