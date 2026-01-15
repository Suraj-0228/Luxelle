const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Product = require('./models/Product');

// Connect to DB
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_store_db';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Read JSON files
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8'));

// Import data into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    await User.insertMany(users);
    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
