const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:dbDebugger')

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/ndub-it-stock', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true }, () => { dbDebugger('Connected to DB') });
  } catch (error) {
    dbDebugger(error.message);
    process.exit(1);
  }
}


module.exports = connectDB;