<h1 align="center">🛒 E-Commerce ShoeStore</h1>

<p align="center">
  <img src="./frontend/src/assets/Shoea-Logo.svg" alt="ShoeStore Logo" width="200" />
</p>

---

## 📖 Introduction

Welcome to **E-Commerce ShoeStore**, a modern, secure, and user-friendly online platform for shopping shoes. Whether you're browsing the latest sneaker drops or managing your inventory, ShoeStore makes the experience seamless for both customers and administrators.

---

## 🚀 Technologies

<p align="center">
  <!-- Backend -->
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Badge" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js Badge" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT Badge" />
  <img src="https://img.shields.io/badge/VNPAY-002e5b?style=for-the-badge&logo=vnpay&logoColor=white" alt="VNPAY Badge" />

  <!-- Frontend -->

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind Badge" />

  <!-- Database -->

  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase Badge" />

  <!-- Storage -->

  <img src="https://img.shields.io/badge/Cloudinary-002C5F?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary Badge" />
</p>

---

## 🔎 Core Features

🔷 **User Registration:** Create a secure account with email and password.

🔷 **Login:** Authenticate via email/password or Google OAuth.

🔷 **Search Products:** Quickly find products by name, category, or price range.

🔷 **Admin Dashboard:** Only admins can create, update, or delete categories & products.

🔷 **Add Product:** Admins upload product details; images are stored on Cloudinary.

🔷 **Product Details:** View comprehensive product info and add to cart.

🔷 **Shopping Cart:** Review items in your cart with dynamic total calculation.

🔷 **Checkout:** Enter shipping details and complete payment via VNPAY.

🔷 **Order History:** View past orders and their statuses in your profile.

---

## 📸 Screenshots

<p align="center">
  <img src="./frontend/src/assets/showReadme/homePage.png" alt="Home Page" width="400" height="240" />
  <img src="./frontend/src/assets/showReadme/productDetail.png" alt="Product Detail" width="400" height="240" />
</p>
<p align="center">
  <img src="./frontend/src/assets/showReadme/cart.png" alt="Cart" width="400" height="240" />
  <img src="./frontend/src/assets/showReadme/checkout.png" alt="Checkout" width="400" height="240" />
</p>
<p align="center">
  <img src="./frontend/src/assets/showReadme/vnpayCheckout.png" alt="VNPAY Checkout" width="400" height="240" />
  <img src="./frontend/src/assets/showReadme/sucessCheckout.png" alt="Success Checkout" width="400" height="240" />
</p>
<p align="center">
  <img src="./frontend/src/assets/showReadme/orderHistory.png" alt="Order History" width="400" height="240" />
</p>


---

## 🛠️ Setup & Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mrDanh11/Ecommerce_ShoeStore.git
   cd Ecommerce_ShoeStore
   ```

2. **Environment variables** (backend `.env` and frontend `.env`):

   ```bash
   # Backend (.env)
   PORT=
   WEB_URL=

   SUPABASE_URL=
   SUPABASE_SERVICE_ROLE_KEY=
   SUPABASE_BUCKET=

   VNPAY_SECRET=your_secret
   VNPAY_TMN=your_tmn_code

   TOKEN_SECRET_KEY=your_jwt_secret
   RESET_PASSWORD_SECRET=your_reset_token_secret_here

   EMAIL_USER=
   EMAIL_PASS=

   # Frontend (.env)
   REACT_APP_API_URL=your_api_url
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Install & Run**:

   ```bash
   # Backend
   cd backend
   npm install
   npm start

   # Frontend
   cd ../frontend
   npm install
   npm run dev
   ```

Visit `http://localhost:5173` in your browser.

---

## 📐 Project Architecture

```
frontend (React + Tailwind)
  ├── /src
  │   ├── components   # UI components
  │   ├── pages        # Page views
  │   └── services     # API calls

backend (Express + JWT)
  ├── /controllers     # Request handlers
  ├── /models          # Database schemas
  ├── /routes          # API endpoints
  └── /middlewares     # Auth & permissions

database (PostgreSQL + Supabase Realtime)
  ├── users
  ├── products
  ├── categories
  └── orders
```

---

## 💡 Future Enhancements

* Real-time customer support chat
* Product reviews & ratings
* Push notifications for promotions
* AI-powered product recommendations

---

## 📞 Contact

* **Authors:** Nguyen Chi Danh | Le Thanh Dat | Tran Trong Nghia | Ngo Gia Long | Dinh Le Gia Nhu

Thank you for checking out ShoeStore! ❤️
