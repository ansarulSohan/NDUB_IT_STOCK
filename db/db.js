const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:dbDebugger')

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true}, () => {dbDebugger('Connected to DB')});
  } catch (error) {
    dbDebugger(error.message);
    process.exit(1);
  }
}


module.exports = connectDB;