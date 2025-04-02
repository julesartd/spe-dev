const express = require('express');
const cors = require('cors');
const { sequelize, connectToDatabase } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);



connectToDatabase().then(() => {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  });
});
