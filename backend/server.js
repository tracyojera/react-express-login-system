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

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, '/dist')));

const client = new MongoClient(uri);
const usersCollection = () => client.db('login-system').collection('users');

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/profile', (req, res) => {
  if (!req.session.email) {
    return res.status(200).send({ message: 'Not logged in' });
  } else {
    return res.send({ email: req.session.email, name: req.session.name });
  }
});

function sanitizeInput(input) {
  return sanitizeHtml(input, {
    allowedTags: [],  
    allowedAttributes: {},  
  });
}

app.post('/login', async (req, res) => {
  const { email: submittedEmail, password } = req.body || {};
  if (typeof submittedEmail !== 'string' || !submittedEmail.trim() ||
      typeof password !== 'string' || !password) {
    return res.status(400).send({ success: false, message: 'Email and password are required.' });
  }

  try {
    const email = submittedEmail.trim().toLowerCase();
    const user = await usersCollection().findOne(
      { email },
      { collation: { locale: 'en', strength: 2 } }
    );

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        req.session.name = user.name;
        req.session.email = user.email;
        return res.send({
          success: true,
          user: { name: user.name, email: user.email }
        });
      } else {
        return res.status(400).send({ success: false, message: 'Incorrect email or password.' });
      }
    } else {
      return res.status(400).send({ success: false, message: 'Incorrect email or password.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error during the login process' });
  }
});

app.post('/register', async (req, res) => {
  const { name: submittedName, email: submittedEmail, password, confirmPassword } = req.body || {};

  if (typeof submittedName !== 'string' || typeof submittedEmail !== 'string' ||
      typeof password !== 'string' || typeof confirmPassword !== 'string') {
    return res.status(400).send({ success: false, message: 'All fields are required.' });
  }

  const name = sanitizeInput(submittedName).trim();
  const email = submittedEmail.trim().toLowerCase();
  if (!name || !email || !password) {
    return res.status(400).send({ success: false, message: 'All fields are required.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).send({ success: false, message: 'Passwords do not match.' });
  }

  try {
    const users = usersCollection();
    const userExists = await users.findOne(
      { email },
      { collation: { locale: 'en', strength: 2 } }
    );

    if (userExists) {
      return res.status(400).send({ success: false, message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { name, email, password: hashedPassword };
    await users.insertOne(newUser);

    req.session.name = name;
    req.session.email = email;

    return res.status(201).send({
      success: true,
      message: 'Registration successful!',
      user: { name, email }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error during the registration.' });
  }
});

app.post('/logout', (req, res) => {
  if (!req.session) {
    return res.send({ success: true });
  }

  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: 'Error during logout.' });
    }

    res.clearCookie('connect.sid');
    return res.send({ success: true });
  });
});

async function startServer() {
  await client.connect();
  console.log('Connected to MongoDB');
  const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Another backend is already running; stop it with Ctrl+C before starting another, or choose a different PORT.`
      );
    } else {
      console.error('Failed to start the HTTP server:', error);
    }

    client.close().catch((closeError) => {
      console.error('Failed to close the MongoDB connection:', closeError);
    });
    process.exitCode = 1;
  });
}

startServer().catch(async (error) => {
  console.error('Failed to start the server or connect to MongoDB:', error);
  await client.close().catch((closeError) => {
    console.error('Failed to close the MongoDB connection:', closeError);
  });
  process.exitCode = 1;
});