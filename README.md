# 🍽️ MealPoint Backend 🍕  

A **Node.js + TypeScript + Express + MongoDB** backend powering the **MealPoint Restaurant Management System** — designed to streamline the entire restaurant workflow, from menu browsing and order placement to payment, analytics, and notifications.

---

## 📖 Table of Contents

- [🧩 How the Application Works](#🧩-how-the-application-works)
- [🚀 Features](#🚀-features)
- [📂 Project Structure](#📂-project-structure)
- [🛠️ Tech Stack](#🛠️-tech-stack)
- [⚙️ Installation & Setup](#⚙️-installation--setup)
  - [1️⃣ Clone the repo](#1️⃣-clone-the-repo)
  - [2️⃣ Create a `.env` file and provide the values](#2️⃣-create-a-env-file-and-provide-the-values)
  - [3️⃣ Install and Run the server](#3️⃣-install-and-run-the-server)
- [🔗 API Endpoints](#🔗-api-endpoints)
  - [🔑 Authentication Module](#🔑-authentication-module)
  - [🍔 Menu & Category Modules](#🍔-menu--category-modules)
  - [🥗 Combo & Discount Modules](#🥗-combo--discount-modules)
  - [🛒 Order & Payment Modules](#🛒-order--payment-modules)
  - [💬 Review & Notification Modules](#💬-review--notification-modules)
  - [👑 Admin & Settings Modules](#👑-admin--settings-modules)
- [💡 Configuration & Limits](#💡-configuration--limits)
- [📊 Feature Analysis](#📊-feature-analysis)
- [📋 Requirements Implementation Status](#📋-requirements-implementation-status)

---

## 🧩 How the Application Works

The **MealPoint Backend** is the powerhouse of a restaurant ecosystem — enabling both **customers** and **restaurant owners** to interact seamlessly.

1. **Users browse menus & combos** by category with search and filter options.  
2. **Orders can be placed** for dine-in, takeaway, or delivery.  
3. **Secure payments** are processed through **Stripe integration**.  
4. **Admins manage the dashboard** — monitoring orders, sales, customers, and revenue analytics.  
5. **Notifications** and **AI-driven feedback insights** keep the customer experience dynamic.  
6. **Discounts, promo codes, and loyalty logic** improve customer engagement.  

Everything is built around a **modular, scalable architecture** with **robust security**, **Zod validation**, and **centralized error handling**.

---

## 🚀 Features

### 🍴 Core Functional Features
- Menu browsing, filtering, and search  
- Create and manage combos  
- Add to cart and checkout  
- Multi-mode orders (dine-in, delivery, takeaway)  
- Online payments with **Stripe**  
- Email/SMS order confirmation  
- Role-based access control (Admin, Customer)  

### 💡 Customer Experience Enhancements
- Promo codes, loyalty points, and rewards  
- Ratings & reviews  
- Real-time notifications  
- Order tracking  
- User profiles and saved addresses  

### 🧠 Admin & Restaurant Management
- Dashboard with real-time analytics  
- Sales and profit reporting  
- Menu, discount, and tax management  
- Customer and order overview  
- Configurable settings and staff roles  

### 🔐 Security & Performance
- Global rate limiter and speed limiter  
- Helmet for HTTP header protection  
- MongoDB sanitization to prevent injection  
- CORS and OAuth integrations  
- Centralized error handling and request validation (Zod)  

---

## 📂 Project Structure

```bash
mealpoint-backend/
├── src/
│   ├── app/
│   │   ├── middlewares/
│   │   │   ├── auth.ts
│   │   │   ├── mongo-sanitize.ts
│   │   │   ├── error-middleware.ts
│   │   │   └── ...
│   │   ├── modules/
│   │   │   ├── admins/ 
│   │   │   ├── auth/
│   │   │   │  ├── auth.routes.ts
│   │   │   │  ├── auth.controller.ts
│   │   │   │  ├── auth.services.ts
│   │   │   │  ├──auth.interfaces.ts
│   │   │   │  └── ...
│   │   │   ├── combos/
│   │   │   ├── discounts/
│   │   │   ├── menus/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   └── users/
│   │   │   └── ...
│   │   └── routes/
│   │       └── index.ts
│   ├── helpers/
│   ├── interfaces/
│   ├── enums/
│   ├── constants/
│   ├── app.ts
│   └── server.ts
│   └── ...
├── package.json
├── .env
└── tsconfig.json
└── ...
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Language** | TypeScript |
| **Runtime** | Node.js + Express |
| **Database** | MongoDB with Mongoose |
| **Validation** | Zod schemas |
| **Auth** | JWT + OAuth |
| **Upload** | Multer (for image & file handling) |
| **Payment** | Stripe API integration |
| **Security** | Helmet, Rate Limiter, Mongo Sanitize, CORS |
| **Architecture** | Modular + Layered |
| **Testing** | Jest |
| **Environment** | `.env` config variables |
| **Logging** | Morgan (optional) |

> Server Live on: [👆 Click Here](https://mealpoint-server.onrender.com)

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/RiyaadHossain/MealPoint.git
cd MealPoint
```

### 2️⃣ Create a .env file and provide the values
```bash
# Environment
NODE_ENV=development

# Logging
LOG_LEVEL=info

# Server
PORT=5000

# Database
MONGO_URI= "mongo uri"

# JWT Authentication
JWT_SECRET= "secret"
JWT_EXPIRATION=20d

# Salt rounds for password hashing
SALT_ROUNDS=10

# Stripe API Key
STRIPE_API_KEY = "stripe_key"

# Client URL
CLIENT_URL = "client url"

# Social Login
SOCIAL_LOGIN_PASSWORD = "...password"
```

### 3️⃣ Install and Run the server
```bash
npm install
npm run dev
```

> Server runs at: http://localhost:5000
---

## 🔗 API Endpoints

All routes are prefixed with /api/v1
🔒 Protected routes require Authorization: Bearer <token>

> Full Postman API collection is available here: [MealPoint API Docs (Postman)](https://documenter.getpostman.com/view/20922615/2sB3QGuXYC)

### 🔑 Authentication Module

- `POST /auth/register` – Register a user
- `POST /auth/login` – Login with credentials
- `POST /auth/social-login` – OAuth login (Google, etc.)
- `GET /auth/profile` – Get user profile
- `PATCH /auth/profile` – Update profile info

### 🍔 Menu & Category Modules

- `GET /categories` – Fetch all categories
- `POST /categories` – Create new category (Admin)
- `PATCH /categories/:id` – Update a category (Admin)
- `DELETE /categories/:id` – Delete a category (Admin)
- `GET /menus` – Fetch all menus with filters
- `GET /menus/id/:id` – Get a single menu by ID
- `GET /menus/:slug` – Get menu by slug
- `POST /menus` – Add new menu (Admin)
- `PATCH /menus/:id` – Update menu (Admin)
- `DELETE /menus/:id` – Delete menu (Admin)

### 🥗 Combo & Discount Modules

- `GET /combos` – Fetch combos
- `POST /combos` – Create new combo (Admin)
- `PATCH /combos/:id` – Update combo (Admin)
- `DELETE /combos/:id` – Delete combo (Admin)
- `GET /discounts` – Get all discounts (Admin)
- `GET /discounts/available` – Get available user discounts
- `POST /discounts` – Create discount (Admin)
- `PATCH /discounts/:id` – Update discount (Admin)
- `DELETE /discounts/:id` – Delete discount (Admin)

### 🛒 Order & Payment Modules

- `POST /orders` – Create a new order
- `GET /orders` – View all orders (Admin)
- `GET /orders/:id` – Get specific order summary (Admin)
- `GET /orders/customer/:customerId` – Get user order history
- `PATCH /orders/:id` – Update order status (Admin)
- `POST /payments/initiate` – Initialize Stripe payment
- `PATCH /payments/:id/status` – Update payment status
- `GET /payments` – List all payments (Admin)
- `GET /payments/user/:userId` – Get user payment history

### 💬 Review & Notification Modules

- `GET /reviews` – Get all reviews
- `POST /reviews` – Create review for order
- `GET /notifications` – Get user notifications
- `PATCH /notifications/:id/read` – Mark single notification as read
- `PATCH /notifications/read-all` – Mark all notifications as read

### 👑 Admin & Settings Modules

- `GET /admins/statistics` – Get dashboard stats
- `GET /admins/statistics/sales-orders` – Get sales and order summary
- `GET /admins/analytics/sales-summary` – Sales analytics report
- `GET /settings` – Get settings
- `POST /settings` – Create setting (Admin)
- `PATCH /settings` – Update setting (Admin)


## 💡 Configuration & Limits
| Setting                | Description                  |
| ---------------------- | ---------------------------- |
| **Rate Limiting**      | 100 requests / 10 minutes    |
| **Authentication**     | JWT tokens (Bearer schema)   |
| **Request Validation** | Enforced with Zod schemas    |
| **Security**           | Helmet, CORS, Mongo Sanitize |
| **Error Handling**     | Centralized middleware       |


## 📊 Feature Analysis
| Category           | Feature                                                | Status     |
| ------------------ | ------------------------------------------------------ | ---------- |
| **Core**           | Menu browsing, order placement, payment, notifications | ✅          |
| **Admin**          | Dashboard, analytics, settings                         | ✅          |
| **Customer UX**    | Loyalty, promo codes, order tracking                   | ✅          |
| **Security**       | JWT, helmet, sanitizer, limiter                        | ✅          |
| **Validation**     | Zod schema validation                                  | ✅          |
| **Error Handling** | Global middleware                                      | ✅          |
| **Architecture**   | Modular structure                                      | ✅          |
| **AI Feedback**    | Future enhancement                                     | 🧠 Planned |

## 📋 Requirements Implementation Status
| Requirement                                         | Implemented |
| --------------------------------------------------- | ----------- |
| **Language:** TypeScript                            | ✅           |
| **Framework:** Express.js                           | ✅           |
| **Database:** MongoDB (Mongoose)                    | ✅           |
| **Auth:** JWT + OAuth                               | ✅           |
| **Payment Gateway:** Stripe                         | ✅           |
| **Validation:** Zod                                 | ✅           |
| **Testing:** Jest                                   | ✅           |
| **Error Handling:** Centralized                     | ✅           |
| **Rate Limiting & Security:** Helmet, CORS, Limiter | ✅           |
| **Architecture:** Modular                           | ✅           |
| **Postman Collection:** Provided                    | ✅           |
| **Admin Dashboard:** Implemented                    | ✅           |
| **Analytics & Insights:** Implemented               | ✅           |
| **AI Feedback:** Partial / Planned                  | 🧠          |
| **Code Quality:** High, well-structured             | ✅           |


.
---
**💾 Author:** [Riyad Hossain](https://www.linkedin.com/in/riyaad-hossain/)

**🧩 Postman Collection:** [MealPoint API Docs](https://documenter.getpostman.com/view/20922615/2sB3QGuXYC)

**🚀 Version:** 1.0.0

**📅 Last Updated:** October 2025
