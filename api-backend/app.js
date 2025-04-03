const express = require('express');
const { sequelize, connectToDatabase } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const corsMiddleware = require('./middlewares/corsMiddleware');
const csrfMiddleware = require('./middlewares/csrfMiddleware');
const cookieParser = require('cookie-parser');
const Product = require('./models/product');
const jsonErrorMiddleware = require('./middlewares/jsonErrorMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

// app.use(csrfMiddleware);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await Product.findAll({
      attributes: [
        'categorie',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
      ],
      group: 'categorie',
    });

    const formattedStats = stats.map(stat => ({
      categorie: stat.categorie,
      total: stat.dataValues.total,
    }));
  
    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(jsonErrorMiddleware);



connectToDatabase().then(() => {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  });
});
