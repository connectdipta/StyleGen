## 1. Project Overview

**Project Name:** StyleGen

**Type:** Full-stack eCommerce Platform (Leather Goods)

**Tech Stack:** MERN (MongoDB, Express.js, React.js / Next.js, Node.js)

### Objective

A premium leather product eCommerce platform with:

- Customer-facing store
- Secure authentication system
- Admin dashboard (inventory, orders)
- User dashboard (orders, profile,)

## 2. User Roles

### 2.1 Guest User

- Browse products
- View product details
- Search & filter
- Cannot purchase

### 2.2 Customer (Authenticated User)

- Add to cart & checkout
- Manage profile & addresses

### 2.3 Admin (Artisan Manager)

- Manage products, categories
- Manage orders
- Manage customers

## 3. Functional Requirements

---

## 3.1 Home Page

### Features:

- Hero banner (promo leather items)
- Categories section (Shoes, Wallet, Belt, Bags, T-Shirts)
- Featured products
- Discounts (Save %)

### Functionalities:

- Product listing (API)
- Category filtering
- Responsive UI

## 3.2  Authentication System

### Pages:

- Login
- Register

### Features:

- JWT Authentication
- Role-based access (Admin/User)
- Password encryption (bcrypt)

## 3.3 Product Module

### Product List Page:

- Grid/List view
- Filters:
    - Category
    - Price
    - Stock

### Product Details Page:

- Image gallery
- Size selection
- Quantity selector
- Add to cart / Buy now


## 3.4 Cart & Checkout

### Features:

- Add/remove items
- Update quantity
- Price calculation
- Checkout:
    - Shipping address
- Order confirmation

## 3.5 User Dashboard

### Sections:

### Order History

- View past orders
- Status (Delivered, Pending, Cancelled)

### Profile Settings

- Personal info update
- Password change
- Address management


## 3.6 Admin Dashboard

---

### Overview

- Total products
- Active inventory
- Low stock alert
- New submissions

---

### Products Management

- Create / Update / Delete product
- Upload images
- Manage stock
- Category assign


### Categories Management

- Create category
- Edit category
- Assign products

---

### Orders Management

- View all orders
- Update status:
    - Pending
    - Shipped
    - Delivered

---

### Customers Management

- View customers
- Active / Inactive / Banned
- Order volume tracking


## 4. Database Design (MongoDB)

### Collections:

### Users

```
{
name,
email,
password,
role:"user"|"admin",
addresses: [],
createdAt
}
```

### Products

```
{
name,
price,
discount,
category,
stock,
images: [],
sizes: [],
description
}

name:
price:
discountPrice:
images:
description:
stock:
```

### Orders

```
{
userId,
items: [{ productId, quantity, size }],
totalPrice,
status,
shippingAddress,
createdAt
}
```

### Categories

```
{
name,
description,
image
}
```

## 5.  API Structure

### Auth

- POST /api/auth/register
- POST /api/auth/login

### Products

- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)

### Orders

- POST /api/orders

- GET /api/orders/user
- GET /api/orders (admin)

### Users

- GET /api/users
- PUT /api/users/profile

## 6. Security Requirements

- JWT authentication
- Password hashing (bcrypt)
- Role-based authorization
- Rate limiting

---

## 7. Non-Functional Requirements

### Performance

- Lazy loading images

### Responsiveness

- Mobile-first UI

## 8. UI/UX Requirements

- Clean luxury leather theme
- Orange accent colour (#FF5A1F type)
- Smooth hover effects
- Consistent spacing & typography

---

---

## 10. Suggested Folder Structure (MERN)

### Backend

```
/src
  /controllers
  /models
  /routes
  /middlewares
  /utils
```

### Frontend (Next.js)

```
/app
/components
/hooks
/services (API)
/store (Redux/Zustand)
```

```jsx
https://www.npmjs.com/package/jsonwebtoken
https://www.npmjs.com/package/cors
https://www.npmjs.com/package/bcrypt

```