const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('MONGO_URI не задан в .env — маршруты /api/mongo недоступны, пока не добавите строку Atlas');
    return false;
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
  return true;
}

module.exports = { connectMongo };
