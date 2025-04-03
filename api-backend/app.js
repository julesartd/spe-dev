const express = require('express');
const { sequelize, connectToDatabase } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const corsMiddleware = require('./middlewares/corsMiddleware');
const csrfMiddleware = require('./middlewares/csrfMiddleware');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const Product = require('./models/product');
const CspReport = require('./models/cspReport');
const jsonErrorMiddleware = require('./middlewares/jsonErrorMiddleware');
const cspMiddleware = require('./middlewares/cspMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cspMiddleware);
app.use(corsMiddleware);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(jsonErrorMiddleware);


app.use('/uploads', express.static('uploads'));

app.use(csrfMiddleware);

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

app.get('/test-csp', (req, res) => {
  res.send('CSP test page');
}
);


app.post('/api/csp-violation-report', express.json(), async (req, res) => {
  const report = req.body['csp-report'];
  console.log('CSP Violation Report:', JSON.stringify(report, null, 2));

  if (!report) {
    return res.status(400).json({ error: 'Invalid CSP report format' });
  }

  try {
    await CspReport.create({ report });
    console.log('CSP Violation Report enregistré:', JSON.stringify(report, null, 2));
    res.status(204).end();
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du rapport CSP:', error);
    res.status(500).json({ error: 'Failed to store CSP report' });
  }
});



connectToDatabase().then(() => {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  });
});
