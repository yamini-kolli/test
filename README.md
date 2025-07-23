# 🖼️ Imagify - Text-to-Image Generator

Imagify is a full-stack AI-powered web application that allows users to generate high-quality images from text prompts using the ClipDrop API. Each user gets limited credits to generate images, and once they reach 0 credits, they see a countdown until +2 credits are added after 24 hours. This ensures continued access without forced payments.

---

## 🚀 Features

- 🔐 JWT-based user authentication
- ✨ AI image generation from any text prompt
- 💳 Credit system (5 initial credits, 1 per image)
- ⏳ Credit reset: +2 credits added every 24 hours after reaching 0
- 🔔 Countdown timer shown when user has 0 credits
- 💰 Razorpay payment integration (optional)
- 🎨 Responsive and animated frontend UI with Tailwind and Framer Motion

---

## 🛠️ Tech Stack Used

### 🌐 Frontend
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion

### 🔙 Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Dotenv
- Razorpay (optional)
- ClipDrop API

---

## 🧑‍💻 How to Run Locally

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/yamini-kolli/test.git
cd test
