require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Tax = require('./models/Tax');

// Connect to DB
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_store_db';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Read JSON files
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf-8'));

// Import data into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Tax.deleteMany();

    const bcrypt = require('bcryptjs');
    const hashedUsers = await Promise.all(users.map(async (u) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    }));
    await User.insertMany(hashedUsers);
    await Product.insertMany(products);
    await Category.insertMany(categories);
    await Tax.insertMany([
      { name: 'GST Tax', rate: 0.18, type: 'percentage', code: 'gst' },
      { name: 'Import Duty', rate: 0.05, type: 'percentage', code: 'import_duty' },
      { name: 'Processing Fee', rate: 150, type: 'flat', code: 'processing_fee' }
    ]);

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
    await Category.deleteMany();
    await Tax.deleteMany();

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
