// core dependencies 
const express = require('express');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
// middleware for security and logging
const { apiLimiter } = require('./middlewares');

const app = express();

// use json body parser
app.use(express.json());
app.use(morgan('dev'));
// limit api requests for security 
app.use(apiLimiter);

// for home 
app.get('/', (req, res) => {
  res.json({ message: 'Finance Data Processing API is running' });
});

// all routes are mounted under /api 
app.use('/api', routes);

// global error handler 
app.use(errorHandler);

module.exports = app;