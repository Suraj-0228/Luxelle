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
    const createdUsers = await User.insertMany(hashedUsers);

    // Get non-admin users for reviews
    const reviewUsers = createdUsers.filter(u => !u.isAdmin);
    
    const reviewTemplates = [
      { comment: "Absolutely stunning quality and fits perfectly! Very happy.", rating: 5 },
      { comment: "The material is extremely premium. Highly recommend!", rating: 5 },
      { comment: "Excellent design and attention to detail. Worth every rupee.", rating: 4 },
      { comment: "A beautiful addition to my luxury wardrobe.", rating: 5 },
      { comment: "Comfortable, stylish, and very chic. Will buy again!", rating: 4 },
      { comment: "Beautiful color representation and fast shipping.", rating: 5 }
    ];

    const productsWithReviews = products.map(product => {
      // Pick 3-4 random reviews
      const numReviews = Math.floor(Math.random() * 2) + 3; // generates 3 or 4
      const shuffled = [...reviewTemplates].sort(() => 0.5 - Math.random());
      const selectedTemplates = shuffled.slice(0, numReviews);
      
      const reviewsList = selectedTemplates.map((template, index) => {
        const user = reviewUsers[index % reviewUsers.length] || createdUsers[0];
        return {
          user: user._id,
          name: user.fullname,
          rating: template.rating,
          comment: template.comment,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
        };
      });

      const avgRating = reviewsList.reduce((acc, item) => item.rating + acc, 0) / reviewsList.length;

      return {
        ...product,
        reviews: reviewsList,
        numReviews: reviewsList.length,
        rating: avgRating
      };
    });

    await Product.insertMany(productsWithReviews);
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
