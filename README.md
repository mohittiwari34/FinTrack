# MERN Expense Tracker

A full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) to help users keep track of their personal finances, including expenses and incomes.

## Features Currently Implemented

### 🔐 User Authentication & Authorization
- **Create Account**: Users can securely register with their name, email, and password.
- **Login/Logout**: Secure login system using JSON Web Tokens (JWT) for session management.
- **Protected Routes**: Only authenticated users can access the dashboard and their financial data.
- **Security Check**: Passwords are cryptographically hashed using `bcryptjs` before being stored in the database.




## Recently Completed Features
- ✅ **Transaction Management**: Edit or delete existing expenses and incomes.
- ✅ **Dashboard Filtering**: Filter analytics by specific date ranges.
- ✅ **User Profile**: Update profile details and change password.

### 🛠️ Tech Stack Details
- **Frontend**: Built with React (Vite setup), React Router for navigation, Redux Toolkit for state management, and Recharts for analytics.
- **Backend**: Node.js and Express.js RESTful API.
- **Database**: MongoDB Atlas via Mongoose.
