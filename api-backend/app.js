const express = require('express');
const { sequelize, connectToDatabase } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const corsMiddleware = require('./middlewares/corsMiddleware');
const csrfMiddleware = require('./middlewares/csrfMiddleware');
const cookieParser = require('cookie-parser');
const multer = require('multer'); 
const jsonErrorMiddleware = require('./middlewares/jsonErrorMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({
  type: ['application/json', 'application/csp-report'],
}));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use(csrfMiddleware);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return next(err);
  }
  next(err);
});


app.use(jsonErrorMiddleware);

if (require.main === module) {
  connectToDatabase().then(() => {
    sequelize.sync().then(() => {
      app.listen(PORT, () => {
        console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
      });
    });
  });
}

module.exports = app;