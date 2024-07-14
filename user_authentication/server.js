const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('src'));  
app.use(cors());  

mongoose.connect('mongodb://localhost:27017/user_auth')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Email transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,  // Your email
    pass: process.env.EMAIL_PASSWORD  // Your email password
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log('Received registration data:', req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    console.log('User saved:', user);

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Welcome ${firstName}, please verify your email by clicking the following link: http://localhost:5500/home.html`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send({ message: err.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login data:', req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token generated');

    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Protected route
app.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
