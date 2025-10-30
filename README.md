# 🎉 ToriLynq - Where Stories Connect

![ToriLynq Banner](docs/banner.png)

> A modern social media platform blending storytelling, connection, and creativity - built with the MERN stack.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

---

## 📖 Overview

ToriLynq is a full-stack social media platform that combines the best features from leading platforms like Instagram, WhatsApp, Twitter, and TikTok. Built as a capstone project for the PLP MERN Stack Development Program.

**"Tori"** (Nigerian Pidgin for "story") + **"Lynq"** (connection) = **Where Stories Connect**

---

## ✨ Features

### Current (MVP - v1.0.0)
- ✅ User authentication (JWT + Google OAuth)
- ✅ Create posts with images
- ✅ Like and comment on posts
- ✅ 24-hour disappearing stories
- ✅ Real-time 1-on-1 chat with Socket.io
- ✅ Real-time notifications
- ✅ User profiles with follow/unfollow
- ✅ Explore feed with hashtags
- ✅ Responsive design (mobile-first)

### Coming Soon (v1.1.0)
- 🔜 Video posts and reels
- 🔜 Group chats
- 🔜 Advanced explore algorithm
- 🔜 Push notifications

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **Socket.io Client** - Real-time features
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Cloudinary** - Media storage

### DevOps
- **GitHub Actions** - CI/CD
- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Database hosting

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/torilynq.git
   cd torilynq
```

2. **Setup Backend**
```bash
   cd backend
   pnpm install
   cp .env.example .env
   # Edit .env with your credentials
   pnpm run dev
```

3. **Setup Frontend** (in a new terminal)
```bash
   cd frontend
   pnpm install
   cp .env.example .env
   # Edit .env with your API URL
   pnpm start
```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pnpm test                    # Run all tests
pnpm run test:watch          # Watch mode
pnpm run test:integration    # Integration tests only
```

### Frontend Tests
```bash
cd frontend
pnpm test                    # Unit tests
pnpm run cypress             # E2E tests (interactive)
pnpm run cypress:headless    # E2E tests (headless)
```

---

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [User Guide](docs/USER_GUIDE.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

---

## 🎥 Demo

🔗 **Live Application**: [https://torilynq.vercel.app](https://torilynq.vercel.app)  
📹 **Video Demo**: [Watch on YouTube](#)

---

## 📸 Screenshots

![Home Feed](docs/screenshots/home.png)
![Stories](docs/screenshots/stories.png)
![Chat](docs/screenshots/chat.png)

---

## 👨‍💻 Author

**Your Name**  
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Power Learn Project for the amazing MERN bootcamp
- Open source community for incredible tools
- All contributors and testers

---

**⭐ Star this repo if you find it helpful!**