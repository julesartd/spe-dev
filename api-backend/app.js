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

// Middlewares globaux
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({
  type: ['application/json', 'application/csp-report'],
}));
app.use(express.urlencoded({ extended: true }));

// Routes statiques et API
app.use('/uploads', express.static('uploads'));
app.use(csrfMiddleware);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

// Gestion des erreurs Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return next(err);
  }
  next(err);
});

// Middleware global pour les erreurs

app.use(jsonErrorMiddleware);

// Démarrage du serveur uniquement si ce fichier est exécuté directement
if (require.main === module) {
  connectToDatabase().then(() => {
    sequelize.sync().then(() => {
      app.listen(PORT, () => {
        console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
      });
    });
  });
}

// Exporter l'application pour les tests
module.exports = app;