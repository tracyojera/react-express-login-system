# **Login and Registration System**

A simple and efficient full-stack login and registration system built with **React**, **Express.js**, and **MongoDB**.

## Live Demo  
https://react-express-login-system-w27q.vercel.app


---

## **Table of Contents**
1. [About the Project](#about-the-project)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
5. [Usage](#usage)
6. [License](#license)
7. [Contact](#contact)

---

## **About the Project**

This project provides a secure authentication system:
- A React-based frontend for user interaction.
- An Express.js backend with all routes defined in `server.js`.
- MongoDB for data storage, ensuring scalability.
- Security features like password encryption with `bcrypt` and input sanitization using `sanitize-html`.

---

## **Features**

- 🔒 Password encryption with `bcrypt`
- 🛡️ Input sanitization to prevent XSS attacks
- 📂 Session management with `express-sessions`
- 🌐 RESTful API for authentication
- 📊 MongoDB for data storage

---

## **Tech Stack**

### Frontend:
- React.js
- Axios (for HTTP requests)

### Backend:
- Node.js
- Express.js
- MongoDB (native driver)
- bcrypt (for password hashing)
- sanitize-html (for input sanitization)
- express-sessions (for session management)

---

## **Getting Started**

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (running locally or via a cloud service like MongoDB Atlas)

### Installation

1. Clone the repository:
git clone https://github.com/owpji/react-express-login-system.git  
cd react-express-login-system


2. Install frontend and backend dependencies from the repository root:
   ```
   npm install
   cd backend
   npm install
   cd ..
   ```

3. Configure environment variables:
- Create a `.env` file in the backend folder with the following variables:
  ```
  PORT=3001
  MONGO_URI=YOUR-MONGODB-URL  
  SESSION_SECRET=YOUR-SESSION-SECRET
  ```
  `PORT` is optional; the backend and frontend proxy both default to 3001 and use this value if set.

4. Start the backend and frontend together from the repository root (either command):
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```

5. Open `http://localhost:5173`. The frontend uses port 5173 and proxies authentication requests to the backend. The backend must be able to connect to MongoDB before it starts accepting requests.

---

## **Usage**

### Registration:
1. Access the registration page.
2. Enter your details (name, email, password).
3. Submit the form to create an account.

### Login:
1. Access the login page.
2. Enter your credentials.
3. Upon successful login, access protected routes or features.

## **Deployment**

### Vercel frontend

- Set the project root directory to the repository root.
- Select **Vite** as the framework.
- Use `npm install` as the install command, `npm run build` as the build command, and `dist` as the output directory.
- Keep `vercel.json` at the repository root. It forwards `/login`, `/register`, `/profile`, and `/logout` to the Render backend.

### Render backend

- Create a Web Service using `backend` as the root directory.
- Use `npm install` as the build command and `npm start` as the start command.
- Set these environment variables in Render:
  - `MONGO_URI`: MongoDB connection string.
  - `SESSION_SECRET`: a long, random secret.
  - `NODE_ENV`: `production`.
  - `FRONTEND_URL`: `https://react-express-login-system-w27q.vercel.app`.
- Let Render provide `PORT`; do not set it manually.

If the Vercel domain changes, update `FRONTEND_URL` in Render. If the Render service URL changes, update the destination URLs in the root `vercel.json`.

---

## **License**

This project is licensed under the MIT License.

---

## **Contact**

For questions or feedback, feel free to reach out:

**Peter Isaac**  
- Linkedin: [https://www.linkedin.com/in/peter-joseph-isaac](https://www.linkedin.com/in/peter-joseph-isaac)
- GitHub: [https://github.com/peter-joseph-isaac](https://github.com/peter-joseph-isaac)
