const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sanitizeHtml = require('sanitize-html');

const uri = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;

if (!uri) {
  throw new Error('MONGO_URI must be set in backend/.env');
}
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set in backend/.env');
}

// CRITICAL FIX 1: Trust proxy is required on Render/Vercel for secure cookies
app.set('trust proxy', 1);

// CRITICAL FIX 2: Allow both your local Vite frontend and your live Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://react-express-login-system-7nxk.vercel.app' // Add your exact Vercel URL here (no trailing slash)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// CRITICAL FIX 3: Configure session cookies for cross-site HTTPS (Render + Vercel)
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  proxy: true, // Trust the reverse proxy
  cookie: {
    secure: true, // Required for HTTPS (Vercel & Render)
    sameSite: 'none', // Required for cross-site cookies between Vercel and Render
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(express.static(path.join(__dirname, '/dist')));

const client = new MongoClient(uri);
const usersCollection = () => client.db('login-system').collection('users');

// ... (keep your existing routes: /, /profile, /login, /register, /logout exactly as they are)