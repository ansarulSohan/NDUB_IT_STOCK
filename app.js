require('dotenv').config();
const express = require('express');
const app = express();
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./db/db');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


//DB
connectDB();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

// Debug declaration
const startupDebugger = require('debug')('app:startup');
startupDebugger(`App is running on ${process.env.NODE_ENV || 'development'} environment`);



//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('tiny'));
}




//Routes
app.get('/', (req, res) => {
  res.send('API running');
});
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/categories', require('./routes/api/categories'));




const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening to port ${port}`) });