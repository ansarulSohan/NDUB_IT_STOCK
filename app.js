require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./db/db');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);



// Debug declaration
const startupDebugger = require('debug')('app:startup');



//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('tiny'));
  startupDebugger('System is running on development environment');
}


//DB
connectDB();


//Routes
app.get('/', (req, res) => {
  res.send('API running');
});
app.use('/api/users', require('./routes/api/users'));




const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening to port ${port}`) });