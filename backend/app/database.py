import os
from motor.motor_asyncio import AsyncIOMotorClient

# Default to localhost if not provided
MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_DETAILS)

# Database Name
database = client.personal_finance_tracker

# Collections
user_collection = database.get_collection("users")
bank_collection = database.get_collection("bank_accounts")
card_collection = database.get_collection("cards")
transaction_collection = database.get_collection("transactions")
budget_collection = database.get_collection("budgets")
goal_collection = database.get_collection("goals")
