const mongoose = require("mongoose");

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};

module.exports = connectDB;
