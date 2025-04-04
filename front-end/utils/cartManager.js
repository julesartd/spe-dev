import {apiClient} from "./client.js";
import {isAuthenticated} from "./auth.js";

function CartManager() {
    if (CartManager.instance) {
        return CartManager.instance;
    }
    CartManager.instance = this;
}

CartManager.prototype.synchronizeCart = async function () {
    if (!isAuthenticated()) return;

    try {
        const localCart = this.getCart();

        if (localCart.products.length > 0) {
            for (const product of localCart.products) {
                try {
                    await apiClient.post("cart", {
                        productId: product.productId,
                        quantity: product.quantity
                    });
                } catch (error) {
                    console.error("Erreur lors de la synchronisation d'un produit:", error);
                }
            }
        }

        const updatedServerCart = await apiClient.get("cart");
        const mergedCart = {
            products: updatedServerCart.map(item => ({
                productId: parseInt(item.productId),
                quantity: item.quantity,
            }))
        };
        this.save(mergedCart);
        this.updateCartBadge();
    } catch (error) {
        console.error("Erreur lors de la synchronisation du panier:", error);
    }
};

CartManager.prototype.initialize = async function () {
    if (isAuthenticated()) {
        await this.synchronizeCart();
    } else if (!localStorage.getItem("cart")) {
        this.save({products: []});
    }
    this.updateCartBadge();
};

CartManager.prototype.updateCartBadge = function () {
    const cart = this.getCart();
    const badge = document.getElementById("cart-badge");

    const totalItems = cart.products.reduce((acc, p) => acc + p.quantity, 0);

    if (badge) {
        badge.textContent = totalItems;
        badge.classList.toggle("hidden", totalItems === 0);
    }
};

CartManager.prototype.add = async function (productId) {
    const cart = this.getCart();
    const item = cart.products.find(p => p.productId === productId);
    const newQuantity = item ? item.quantity + 1 : 1;

    if (item) {
        item.quantity = newQuantity;
    } else {
        cart.products.push({productId, quantity: newQuantity});
    }

    this.save(cart);
    this.updateCartBadge();

    if (isAuthenticated()) {
        try {
            await apiClient.post("cart", {
                productId,
                quantity: newQuantity
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout au panier:", error);
            await this.synchronizeCart();
        }
    }
};

CartManager.prototype.getCart = function () {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : {products: []};
};

CartManager.prototype.save = function (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
};

CartManager.prototype.updateQuantity = async function (productId, quantity) {
    const cart = this.getCart();
    const item = cart.products.find(p => p.productId === productId);

    if (item) {
        item.quantity = Math.max(1, quantity);
        this.save(cart);
        this.updateCartBadge();

        if (isAuthenticated()) {
            try {
                await apiClient.post("cart", {
                    productId,
                    quantity: item.quantity
                });
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la quantité:", error);
                await this.synchronizeCart();
            }
        }
    }
};

CartManager.prototype.remove = async function (productId) {
    const cart = this.getCart();
    cart.products = cart.products.filter(p => p.productId !== productId);
    this.save(cart);
    this.updateCartBadge();

    if (isAuthenticated()) {
        try {
            await apiClient.delete(`cart/${productId}`);
        } catch (error) {
            console.error("Erreur lors de la suppression du produit:", error);
            await this.synchronizeCart();
        }
    }
};

CartManager.prototype.getTotal = function (products) {
    const cart = this.getCart();
    return cart.products.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        return total + (product ? product.prix * item.quantity : 0);
    }, 0);
};

CartManager.prototype.renderFlyout = async function () {
    const cartElement = document.getElementById("cart-items-list");
    const totalElement = document.getElementById("cart-total-price");
    const cart = this.getCart();

    if (!cartElement || !totalElement) return;

    cartElement.innerHTML = "";
    let total = 0;

    for (const item of cart.products) {
        const product = await apiClient.get(`products/${item.productId}`);
        if (!product) continue;

        const itemTotal = product.prix * item.quantity;
        total += itemTotal;

        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
            <img src="${product.images?.[0] || 'placeholder.jpg'}" alt="${product.libelle}">
            <div class="cart-info">
                <p class="title">${product.libelle}</p>
                <div class="qty">
                    <button class="qty-btn" data-id="${product.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-id="${product.id}" data-action="increase">+</button>
                    <button class="delete-btn" data-id="${product.id}" title="Supprimer">🗑️</button>
                </div>
                <p class="price">${itemTotal.toFixed(2)}€</p>
            </div>
        `;
        cartElement.appendChild(el);
    }

    totalElement.textContent = `${total.toFixed(2)}€`;
    this.bindQtyButtons();
};

CartManager.prototype.bindQtyButtons = function () {
    document.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const productId = parseInt(btn.dataset.id);
            const action = btn.dataset.action;
            const cart = this.getCart();
            const item = cart.products.find(p => p.productId === productId);

            if (!item) return;

            if (action === "increase") {
                await this.updateQuantity(productId, item.quantity + 1);
            } else if (action === "decrease" && item.quantity > 1) {
                await this.updateQuantity(productId, item.quantity - 1);
            }

            await this.renderFlyout();
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const productId = parseInt(btn.dataset.id);
            await this.remove(productId);
            await this.renderFlyout();
        });
    });
};

const cartManager = new CartManager();

export {cartManager as CartManager};