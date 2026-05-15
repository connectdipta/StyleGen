# StyleGen - Premium Leather Goods E-Commerce

[![Live Demo](https://img.shields.io/badge/Live-Demo-FF4D1C?style=for-the-badge&logo=vercel)](https://style-gen-phi.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Documentation-blue?style=for-the-badge)](https://style-gen-backend.vercel.app/api)

StyleGen is a sophisticated, full-stack MERN e-commerce platform dedicated to high-end leather craftsmanship. It features a stunning, mobile-responsive interface, secure role-based authentication, and a powerful administrative suite for managing a growing retail business.

---

## 🔗 Quick Links
- **Live Website:** [https://style-gen-phi.vercel.app](https://style-gen-phi.vercel.app)
- **Backend API Base:** [https://style-gen-backend.vercel.app/api](https://style-gen-backend.vercel.app/api)
- **Admin Portal:** [https://style-gen-phi.vercel.app/admin](https://style-gen-phi.vercel.app/admin) (Requires Admin Access)

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Premium Catalog:** Browse artisanal leather products with high-resolution image galleries.
- **Dynamic Search & Filtering:** Instantly find products by name, category, price range, or stock status.
- **Personalized Dashboard:** Track order history, manage shipping addresses, and update profiles.
- **Seamless Checkout:** A streamlined purchase flow with instant order confirmation.
- **Wishlist & Cart:** Save favorites and manage your shopping bag with persistent state.

### 🛡️ Administrative Suite
- **Comprehensive Analytics:** Dashboard overview of total customers, products, sales, and pending orders.
- **Inventory Management:** Full CRUD operations for products with multi-image cloud uploads.
- **Category Control:** Organize your catalog into logical collections with custom imagery.
- **Order Fulfilment:** Real-time order status management (Pending, Shipped, Delivered, Cancelled).
- **User Management:** Monitor registered customers and manage administrative privileges.

---

## 🛠️ Technical Deep Dive

### **Frontend Architecture**
- **Vite 8 & React 18:** Leverages the latest build tools for near-instant HMR and optimized production bundles.
- **Responsive Layout System:** A custom-built CSS framework in `index.css` that provides a seamless experience from mobile devices to ultrawide monitors.
- **State Management:** Efficient use of React hooks and context for global state like authentication and cart data.
- **Security:** Firebase SDK integration for robust Google and Email/Password authentication.

### **Backend Infrastructure**
- **Node.js & Express:** A scalable RESTful API designed for high performance and reliability.
- **MongoDB & Mongoose:** Optimized schema design for products, orders, and users with automated timestamps.
- **JWT Security:** Custom middleware for role-based access control (RBAC), ensuring sensitive routes are protected.
- **Image Processing:** Integrated with ImgBB API for reliable cloud storage of product and category assets.

---

## 📂 Repository Structure

```text
StyleGen/
├── StyleGenFrontend/       # React (Vite) Frontend Application
│   ├── src/
│   │   ├── api/            # API communication layer (Axios)
│   │   ├── components/     # Reusable UI components (Modals, Headers)
│   │   ├── pages/          # Full page views (Admin, User, Shop)
│   │   └── utils/          # Image processing and formatting helpers
│   └── index.css           # Global design system & responsive layout
├── StyleGenBackend/        # Node.js & Express.js API Server
│   ├── src/
│   │   ├── controllers/    # Request handling & business logic
│   │   ├── models/         # Mongoose database schemas
│   │   ├── routes/         # API endpoint definitions
│   │   └── middleware/     # Auth and validation logic
│   └── seed.js             # Initial database population script
└── README.md               # Main project documentation
```

---

## 🚦 Getting Started

### **1. Backend Setup**
1. Navigate to `/StyleGenBackend` and run `npm install`.
2. Configure `.env` with your `MONGO_URI`, `JWT_SECRET`, and `FIREBASE_PROJECT_ID`.
3. (Optional) Run `node seed.js` to populate your database with sample products.
4. Start development: `npm run dev`.

### **2. Frontend Setup**
1. Navigate to `/StyleGenFrontend` and run `npm install`.
2. Configure `.env` with your `VITE_API_URL`, `VITE_FIREBASE_API_KEY`, and `VITE_IMGBB_API_KEY`.
3. Start development: `npm run dev`.

---

## 📈 Recent Updates
- **v2.0.0**: Migrated to Vite 8 for improved build performance.
- **v1.5.0**: Implemented the new responsive Admin Dashboard with centralized CSS.
- **v1.2.0**: Added support for multi-image product uploads and high-res previews.

---

## 📄 License
This project is for educational and portfolio demonstration. All rights reserved. Crafted with ❤️ by the StyleGen Team.
