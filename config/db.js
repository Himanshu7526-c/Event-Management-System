const mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inc_events',
    );
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
