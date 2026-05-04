# 🚀 DevMatch (formerly DevTinder)

> **Stop sending cold emails. Start swiping.** 
> DevMatch is a premier networking platform designed exclusively for developers. Find your next co-founder, mentor, or coding partner with a simple swipe.

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-22d3ee?style=for-the-badge)](https://your-live-link-here.com)
[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)



## ✨ Key Features

* **🔥 Fluid Swipe Mechanics:** Tinder-like swipe right (Match), swipe left (Pass), and swipe down (Skip) gestures built with heavily optimized **Framer Motion** spring physics.
* **💬 Real-Time Chat:** Instant bidirectional messaging powered by **Socket.io**. Features WhatsApp-style typing indicators, real-time online/offline statuses, and read receipts.
* **🔒 Secure Authentication:** Custom JWT-based authentication using **HTTP-only cookies** to prevent XSS attacks.
* **⚡ Smart Feed Algorithm:** Highly optimized MongoDB aggregation queries using `$nin` to ensure you only see fresh, relevant developer profiles.
* **💳 Premium Tiers (Monetization):** Fully integrated **Razorpay** payment gateway with secure backend webhook signature verification (HMAC SHA256) to unlock unlimited swipes.
* **🎨 Cyberpunk Aesthetic:** A premium, dark-mode-first user interface built with **Tailwind CSS**, featuring glassmorphism, glowing neon borders, and fully responsive mobile-first layouts.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Redux Toolkit (State Management)
* Tailwind CSS + shadcn/ui (Styling)
* Framer Motion (Animations & Gestures)
* React Router DOM

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JSON Web Tokens (Auth)
* Socket.io (WebSockets)

**Integrations:**
* Razorpay (Payment Gateway)
* Canvas-Confetti (Match Celebrations)

---

## 💻 Local Setup & Installation

Follow these steps to run DevMatch locally on your machine.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Database URI
* Razorpay Account (Test credentials)