const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/category');
const taxRoutes = require('./routes/taxes');
const Tax = require('./models/Tax');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// A simple middleware to simulate req.user for protected routes
// In a real app, this would be a proper JWT authentication middleware
app.use((req, res, next) => {
  // To test, you can manually set a user ID here
  // req.user = { id: 'some_user_id_from_your_db' }; 
  next();
});

// Database Connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_store_db';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected!');
  })
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/taxes', taxRoutes);

// Database Seeder Endpoint (Temporary)
app.get('/api/seed', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    const Tax = require('./models/Tax');
    
    // Read JSON files
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'));
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8'));
    const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf-8'));

    // Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Tax.deleteMany();

    // Hash passwords for seed users
    const hashedUsers = await Promise.all(users.map(async (u) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    }));

    // Seed collections
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

    res.status(200).json({ success: true, message: 'Database seeded with reviews successfully!' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Luxelle Server is Running!');
});

app.listen(port, () => {
  console.log(`Server is Running on Port: ${port}`);
});
