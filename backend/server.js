const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for both your local computer and your live Vercel website
app.use(cors({
  origin: ['http://localhost:5173', 'https://fullstack-job-saas.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse incoming JSON data
app.use(express.json());

// Import your existing authentication routes
const authRoutes = require('./routes/auth'); 
app.use('/api/auth', authRoutes);

// Base test route to verify the server is running
app.get('/api', (req, res) => {
  res.json({ message: "Backend server is running successfully!" });
});

// Database Connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error: ", err);
  });