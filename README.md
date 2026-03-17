# 🚀 ScamShield – AI Powered Scam Detection Platform

ScamShield is a full-stack web application that detects potential scams using AI. It analyzes suspicious messages, links, or patterns and helps users stay safe online.

---

## 🌐 Live Demo

* 🔗 Frontend: https://your-frontend-url.vercel.app
* 🔗 Backend API: https://scamshield-1.onrender.com

---


## 📸 Screenshots  
## 📸 Screenshots  

<table align="center">
<tr>
<td align="center" width="50%">
<b>🏠 Home Page</b><br/>
<img src="https://res.cloudinary.com/doxsyif22/image/upload/v1773767801/Screenshot_2026-03-17_224017_xw8uev.png" />
</td>

<td align="center" width="50%">
<b>📊 Analytics Dashboard</b><br/>
<img src="https://res.cloudinary.com/doxsyif22/image/upload/v1773767801/Screenshot_2026-03-17_224110_rdaz8n.png" />
</td>
</tr>

<tr>
<td align="center" colspan="2">
<b>🤖 AI Scam Finder</b><br/>
<img src="https://res.cloudinary.com/doxsyif22/image/upload/v1773767803/Screenshot_2026-03-17_224029_iulrx8.png" width="70%"/>
</td>
</tr>
</table>
---

## 🧠 Features

* 🤖 AI-based scam detection
* 📊 Analytics dashboard
* ⚡ Real-time API responses
* 🔒 Secure backend with environment variables
* 🌐 Full-stack deployment (Vercel + Render)

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Axios
* Chart.js / Recharts (Analytics)

### Backend

* Node.js
* Express.js
* CORS
* Environment Variables

### Deployment

* Frontend → Vercel
* Backend → Render

---

## 📁 Project Structure

```
ScamShield/
│
├── frontend/
│   ├── src/
│   ├── .env
│   └── vite.config.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   └── .env
│
└── README.md
```

---

## ⚙️ Environment Variables

### 📌 Frontend (.env)

```
VITE_API_URL=https://scamshield-1.onrender.com
```

---

### 📌 Backend (.env)

```
PORT=10000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/scamshield.git
cd scamshield
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔌 API Usage

### Example Request

```
GET /api/scams
```

### Axios Example

```
axios.get(`${import.meta.env.VITE_API_URL}/api/scams`)
```

---

## 🚀 Deployment Guide

### 🔹 Backend (Render)

* Create new Web Service
* Connect GitHub repo
* Build Command:

```
npm install
```

* Start Command:

```
node server.js
```

---

### 🔹 Frontend (Vercel)

* Import GitHub repo
* Add Environment Variable:

```
VITE_API_URL=https://scamshield-1.onrender.com
```

* Deploy

---

## ⚠️ Common Issues & Fixes

### ❌ Backend not connecting

* Ensure correct API URL in frontend
* Redeploy frontend after updating `.env`
* Check CORS settings in backend

---

### ❌ CORS Error

Fix in backend:

```
app.use(cors({
  origin: '*',
  credentials: true
}));
```

---

## 📊 Future Improvements

* 🔍 Advanced AI model integration
* 📱 Mobile responsive UI improvements
* 🔐 Authentication system
* 📡 Real-time scam alerts

---

## 👨‍💻 Author

**Jilan Mansuri**

* 💼 Developer & Student
* 🚀 Passionate about AI & Web Development

---

## 📜 License

This project is open-source and available under the MIT License.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
