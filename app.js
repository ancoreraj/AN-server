const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config({ path: './config/.env' })

const connectDB = require('./config/db');
connectDB();
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/dashboardRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
