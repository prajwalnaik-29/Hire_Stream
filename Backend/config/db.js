import mongoose from 'mongoose';

async function db() {
  try {
    const connection = await mongoose.connect(process.env.DB_URL);
    console.log('DB connected');
  } catch (err) {
    console.log('error in connecting to db', err);
  }
}

export default db;
