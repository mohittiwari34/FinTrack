# MERN Expense Tracker

A full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) to help users keep track of their personal finances, including expenses and incomes.

## Features Currently Implemented

### 🔐 User Authentication & Authorization
- **Create Account**: Users can securely register with their name, email, and password.
- **Login/Logout**: Secure login system using JSON Web Tokens (JWT) for session management.
- **Protected Routes**: Only authenticated users can access the dashboard and their financial data.
- **Security Check**: Passwords are cryptographically hashed using `bcryptjs` before being stored in the database.

### 💰 Finance Management
- **Add Expenses**: Users can log new expenses, specifying the title, amount, category, and date.
- **Add Incomes**: Users can log new income sources with title, amount, source/category, and date.
- **Transaction History**: A dedicated list showing all past transactions so the user can review their spending and earnings.

### 📊 Dashboard & Analytics
- **Summary Cards**: Quick glance cards that instantly show the user's Total Balance, Total Income, and Total Expenses.
- **Visual Charts**: 
  - **Monthly Expense Chart**: A bar chart visualizing the trend of expenses over time.
  - **Category Breakdown**: A pie chart showing exactly what percentage of expenses goes to specific categories (e.g., Food, Rent, Entertainment).
- **Real-time Updates**: The dashboard figures and charts instantly update upon adding a new transaction.

### 🛠️ Tech Stack Details
- **Frontend**: Built with React (Vite setup), React Router for navigation, Context API for global state management, and Recharts for the beautiful analytic graphs.
- **Backend**: Built with Node.js and Express.js, providing a robust RESTful API.
- **Database**: Connected to MongoDB Atlas via Mongoose for schema-based data modeling.

## Features Left To Build (Pending)
- Editing or deleting existing transactions.
- Filtering transactions by specific date ranges on the dashboard.
- User profile management.
