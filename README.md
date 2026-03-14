# 🛡️ ScamShield – Community Driven Fraud Detection Platform

## 📌 Problem Statement

In today’s digital era, online fraud and scam activities are increasing rapidly through phone calls, phishing links, fake job offers, and fraudulent websites. Many individuals fall victim to financial loss and data theft because they do not have a quick and reliable way to verify whether a phone number, website, or payment ID has been previously reported as fraudulent.

Currently, there is no simple and accessible platform where users can instantly check suspicious numbers or links before interacting with them.

ScamShield aims to solve this problem by providing a centralized, community-driven platform where users can verify and report scams, helping others stay protected from digital fraud.

---

## 💡 Proposed Solution

ScamShield is a full-stack web application that allows users to search suspicious phone numbers, website URLs, or payment IDs to check if they have been reported as scams.

The platform maintains a shared database of reported scam activities. Users can also contribute by submitting new scam reports, creating a collaborative system that helps identify and prevent fraudulent activities.

By combining community reporting with efficient search and filtering features, ScamShield helps users make safer online decisions.

---

## ⚙️ Key Features

### 🔍 Scam Verification
Users can search for suspicious phone numbers, URLs, or UPI IDs to check if they have been reported as scams.

### 📝 Community Reporting
Registered users can report scam numbers or websites with details such as scam type and description.

### 📊 Scam Database
The platform stores all reported scams in a centralized MongoDB database.

### 🔎 Search with Debouncing
Search functionality is optimized using debouncing to reduce unnecessary API calls and improve performance.

### 📄 Pagination
Large datasets of scam reports are handled efficiently using backend pagination.

### 🗂 Filtering & Sorting
Users can filter reports based on scam categories such as:
- OTP Scam  
- UPI Fraud  
- Phishing Links  
- Fake Job Offers  

Reports can also be sorted by date or number of reports.

### 🔐 User Authentication
The application includes a secure authentication system allowing users to:
- Sign Up  
- Log In  
- Report Scams  

### 🎨 Responsive UI
The frontend is built using React and Tailwind CSS, ensuring a fully responsive design for mobile, tablet, and desktop devices.

### 🌙 Dark / Light Mode
Users can switch between dark and light themes for a better user experience.

---

## 🛠 Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- React Router  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

---

## 📊 Database Overview

The platform stores scam reports in a structured database that includes:

- Phone Number / URL / UPI ID  
- Scam Type  
- Description  
- Number of Reports  
- Reported By (User)

---

## 🚀 Expected Impact

ScamShield helps users verify suspicious contacts and websites before interacting with them. By enabling community reporting and real-time verification, the platform promotes digital safety and awareness while reducing the risk of online fraud.

---

## 🔮 Future Improvements

- Integration with phishing detection APIs  
- AI-based scam pattern detection  
- Real-time fraud alerts  
- Mobile application support  