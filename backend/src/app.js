const express = require('express');
const app = express();

const cors = require('cors')

const allowedOrigins = [
	'http://localhost:3000',
	'http://localhost:4173',
	'http://localhost:5173',
	process.env.FRONTEND_URL,
].filter(Boolean);


app.use(
    cors()
)
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/enrollments', enrollmentRoutes);

module.exports = app;