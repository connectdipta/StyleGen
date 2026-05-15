# StyleGen Backend - Secure API Server

[![API Docs](https://img.shields.io/badge/API-Live-blue?style=for-the-badge)](https://style-gen-backend.vercel.app/api)

The backend for StyleGen is a scalable Node.js and Express server that manages the platform's core logic, secure authentication, and database operations. It is optimized for serverless deployment on **Vercel**.

---

## ⚙️ Core Features

- **Role-Based Access Control (RBAC)**: Custom JWT middleware to distinguish between Customer and Admin privileges.
- **RESTful API Architecture**: Modular route handlers for Products, Orders, Categories, and User profiles.
- **Database Resilience**: Mongoose-based schema validation and automated relationship management.
- **Order Flow Logic**: Server-side processing for order creation, status updates, and history tracking.
- **Secure Authentication**: Bcrypt password hashing and integration with Firebase UID verification.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Security**: JSON Web Token (JWT) & Bcrypt
- **Cloud Infrastructure**: Vercel Serverless
- **Tools**: Postman/Swagger for API testing

---

## 📂 Project Structure

```text
src/
├── controllers/    # API request handlers (Business Logic)
├── models/         # Mongoose schemas (Data Structures)
├── routes/         # Express endpoint definitions
├── middleware/     # Auth, Role, and Validation logic
├── db/             # MongoDB connection setup
└── utils/          # Helper functions (Errors, Formatters)
```

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configuration
Create a `.env` file in this directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
FIREBASE_PROJECT_ID=style-gen-phi
```

### 3. Database Seeding
To quickly populate your environment with initial leather categories and products:
```bash
node seed.js
```

### 4. Running Locally
```bash
npm run dev
```

---

## 📡 Primary API Endpoints

### **Authentication**
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Secure login (returns JWT)

### **Product Catalog**
- `GET /api/products` - List all products (with filtering)
- `POST /api/products` - Create product (Admin Only)
- `DELETE /api/products/:id` - Remove product (Admin Only)

### **Order Management**
- `GET /api/orders` - View all site orders (Admin Only)
- `GET /api/orders/myorders` - View logged-in user's history
- `PUT /api/orders/:id/status` - Update order lifecycle (Admin Only)

---

## 📄 License
This project is licensed for StyleGen development. All rights reserved.
