# 📚 BookVerse - Modern Book E-commerce Platform

Welcome to **BookVerse**, a full-featured book e-commerce platform built using the **MERN stack**, with advanced filtering, cart functionality, OTP-based login, and a smooth checkout flow. This project integrates core computer science concepts like **sliding window** and **two-pointer algorithms** with modern web development practices.

---

### 🛒 Customer Side
- 🔍 Search and Filter Books by:
  - Price (range slider)
  - Rating (range slider)
  - Discount (range slider)
- 📚 View All Books by Category
- 📦 Add to Cart & Checkout Flow
  - Order Summary
  - Address Form
  - Payment Mode Selection
  - Order Receipt
- 🔁 Sliding Window & Two-Pointer Algorithms used for optimized search and filtering

---

## 🧑‍💻 Tech Stack

### Frontend
- **React + Vite**
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management (Books module)
- **Axios** for API calls

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT** for authentication
- **Nodemailer** (for OTP handling)

---

## 📂 Folder Structure

```
BookVerse/
│
├── client/               # React + Vite Frontend
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── App.jsx
│   └── main.jsx
│
└── server/               # Node.js Backend
    ├── controllers/
    ├── models/
    ├── routes/
    ├── config/
    └── server.js
```

---


## 🧠 Algorithms Implemented

- **Sliding Window Algorithm** – Used for filtering books based on thresholds like rating and price.
- **Two Pointer Technique** – Applied in optimized discount search and cart-level operations.

---

## 📦 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/nitenkumawat/BookVerse.git
cd BookVerse

# Start backend
cd server
npm install
npm run dev

# Start frontend
cd ../client
npm install
npm run dev
```

> ⚠️ Make sure MongoDB is running locally or use your MongoDB Atlas URI in the `.env` file.

---

## 🛠️ Environment Variables

Create a `.env` file in the `server/` directory:

```
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```





---

## 📬 Contact

Made with ❤️ by [Niten Kumawat](https://github.com/nitenkumawat)  
Feel free to reach out for collaboration or questions!

---

## ⭐️ Star This Repo

If you liked this project, please consider starring it on GitHub! 🌟
