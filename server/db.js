const mongoose = require("mongoose");

// Cache the connection so serverless invocations reuse it.
let connection = null;

async function connectDB() {
  if (!connection) {
    connection = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connection = null;
      throw err;
    });
  }
  await connection;
}

module.exports = connectDB;
