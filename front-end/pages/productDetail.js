import { apiClient } from "../utils/client.js";
import { CartManager } from "../utils/cartManager.js";

const createProductImages = (product) => `
    <div class="product-carousel">
        <button class="carousel-nav left">&#8249;</button>
        <div class="carousel-track">
            ${product.images?.length > 0
    ? product.images.map(src => `<img src="${src}" alt="${product.libelle}" />`).join("")
    : `<img src="/placeholder.jpg" alt="Image manquante" />`}
        </div>
        <button class="carousel-nav right">&#8250;</button>
    </div>
`;

const setupCarousel = () => {
    const track = document.querySelector(".carousel-track");
    const leftBtn = document.querySelector(".carousel-nav.left");
    const rightBtn = document.querySelector(".carousel-nav.right");

    if (!track || !leftBtn || !rightBtn) return;

    const scrollAmount = 320;

    leftBtn.addEventListener("click", () => {
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
};


const createProductDetail = (product) => `
    <section class="product-detail-container">
        <div class="product-images">
            ${createProductImages(product)}
        </div>

        <div class="product-info">
            <h1>${product.libelle}</h1>
            <p class="description">${product.description}</p>
            <p class="categorie"><strong>Catégorie :</strong> ${product.categorie || "Non spécifiée"}</p>
            <p class="price"><strong>Prix :</strong> ${product.prix.toFixed(2)} €</p>
            <button class="add-to-cart-btn" data-product-id="${product.id}">
                Ajouter au panier 🛒
            </button>
        </div>
    </section>
`;

const handleAddToCart = async (event, product) => {
    const button = event.target;
    if (!button.classList.contains('add-to-cart-btn')) return;

    const productId = parseInt(button.dataset.productId);
    if (productId) {
        CartManager.add(productId);
        CartManager.renderFlyout([product]);
    }
};

const attachEventListeners = (product) => {
    const container = document.querySelector('.product-detail-container');
    if (container) {
        container.addEventListener('click', (e) => handleAddToCart(e, product));
    }
};

const fetchProduct = async (productId) => {
    try {
        return await apiClient.get(`products/${productId}`);
    } catch (error) {
        console.error("Erreur lors du chargement du produit:", error);
        throw error;
    }
};

export const productDetailView = async ({ id }) => {
    try {
        const product = await fetchProduct(id);
        if (!product) {
            return `<p class="error">Produit non trouvé.</p>`;
        }

        setTimeout(() => {
            attachEventListeners(product);
            CartManager.renderFlyout([product]);
            setupCarousel(); // 🆕 activation du carrousel
        }, 0);


        return createProductDetail(product);
    } catch (error) {
        return `<p class="error">Erreur lors du chargement du produit : ${error.message}</p>`;
    }
};