const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    for (const { id: productId, quantity } of products) {
      let cartProduct = await CartProduct.findOne({
        where: { cartId: cart.id, productId },
      });

      if (cartProduct) {
        await cartProduct.update({ quantity: cartProduct.quantity + quantity });
      } else {
        await CartProduct.create({ cartId: cart.id, productId, quantity });
      }
    }

    res.status(201).json({ message: 'Produits ajoutés au panier' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
