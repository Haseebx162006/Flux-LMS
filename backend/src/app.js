const express = require('express');
const app = express();
const cors = require('cors');

// Enable universal CORS middleware for cross-origin & preflight request handling
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Log incoming HTTP requests
app.use((req, res, next) => {
    console.log(`📡 [HTTP ${req.method}] ${req.url}`);
    next();
});

const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const courseRoutes = require("./routes/courseRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/courses', courseRoutes);

module.exports = app;