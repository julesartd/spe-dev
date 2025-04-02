const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('../config/multer');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/byUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const products = await Product.findAll({ where: { userId } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', authenticate, multer.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucune image téléchargée' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    console.log(baseUrl);
    const imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);

    const productData = {
      ...req.body,
      images: imageUrls,
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});


router.put('/:id', authenticate, async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send('Produit supprimé');
    } else {
      res.status(404).json({ error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
