const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;
  

      let cart = await Cart.findOne({ where: { userId } });
      if (!cart) {
        cart = await Cart.create({ userId });
      }
  
      let cartProduct = await CartProduct.findOne({
        where: { cartId: cart.id, productId },
      });
  
      if (cartProduct) {
        await cartProduct.update({ quantity });
      } else {
        await CartProduct.create({ cartId: cart.id, productId, quantity });
      }
  
      res.status(201).json({ message: 'Produit ajouté au panier' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ where: { userId } });

      if (!cart) {
        return res.status(404).json({ message: 'Panier non trouvé' });
      }

      const cartProducts = await CartProduct.findAll({
        where: { cartId: cart.id },
        include: ['product'],
      });

      res.status(200).json(cartProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.delete('/:productId', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;

      const cart = await Cart.findOne({ where: { userId } });

      if (!cart) {
        return res.status(404).json({ message: 'Panier non trouvé' });
      }

      const cartProduct = await CartProduct.findOne({
        where: { cartId: cart.id, productId },
      });

      if (!cartProduct) {
        return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
      }

      await cartProduct.destroy();

      res.status(200).json({ message: 'Produit supprimé du panier' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
