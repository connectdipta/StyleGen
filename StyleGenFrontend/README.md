# StyleGen Frontend - Luxury E-Commerce UI

[![Live Demo](https://img.shields.io/badge/Live-Demo-FF4D1C?style=for-the-badge&logo=vercel)](https://style-gen-phi.vercel.app)

The frontend for StyleGen is a high-performance, mobile-responsive React application built with **Vite 8**. It is designed with a "Luxury Leather" aesthetic, focusing on clean typography, smooth transitions, and a premium user experience.

---

## ✨ Features

### 🛒 Shopping Experience
- **Interactive Home Page**: Dynamic hero banners and curated category showcases.
- **Advanced Product Filtering**: Instantly filter artisanal goods by category and search terms.
- **Product Details**: High-resolution image galleries with multi-image support and zoom capabilities.
- **Persistent Cart**: Global state management for the shopping bag and wishlist.

### 🔐 User & Admin Dashboards
- **Centralized Responsive Layout**: A custom CSS-based system (`index.css`) ensures dashboards are perfectly usable on tablets and mobile devices.
- **Admin Management**: Full-featured tables for orders, customers, products, and categories.
- **Real-time Updates**: Instant UI feedback via `react-toastify` and `sweetalert2` for all administrative actions.
- **Secure Authentication**: Integration with Firebase for Google and Email login.

---

## 🛠️ Technology Stack

- **Core Framework**: React 18
- **Build Engine**: Vite 8.0.13 (ESBuild for CSS minification)
- **Icons & Visuals**: Lucide React
- **Notifications**: React-Toastify & SweetAlert2
- **Network Layer**: Axios with custom interceptors
- **Styling**: Vanilla CSS (Premium Custom Design System)

---

## 📂 Architecture

```text
src/
├── api/             # API services and Axios configuration
├── assets/          # Static images and local resources
├── components/      # UI components (AdminHeader, Sidebar, Navbar)
├── pages/           # High-level views (AdminDashboard, Products, Login)
├── utils/           # Image processing and formatting helpers
└── index.css        # The main design system and responsive grid
```

---

## 🚦 Getting Started

### 1. Prerequisites
Ensure you have **Node.js v18+** installed.

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of this folder:
```env
VITE_API_URL=https://style-gen-backend.vercel.app/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_IMGBB_API_KEY=your_imgbb_key
```

### 4. Running Locally
```bash
npm run dev
```

---

## 📱 Responsive Utility System

The project uses a set of specialized CSS classes for layout control:
- `.dashboard-sidebar`: Fixed sidebar that toggles to a mobile menu on small screens.
- `.dashboard-main`: Main content area that automatically adjusts margins.
- `.hide-tablet`: Hides secondary elements on medium screens to prevent clumping.
- `.hide-mobile`: Hides non-essential elements on phones for a cleaner UI.

---

## 📄 License
All rights reserved. Developed for StyleGen.