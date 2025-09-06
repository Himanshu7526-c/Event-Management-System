require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  credentials: true
}));


// 🔹 Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
