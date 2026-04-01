const express = require('express');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(apiLimiter);

// for home 
app.get('/', (req, res) => {
  res.json({ message: 'Finance Data Processing API is running' });
});

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;