import { apiClient } from "../utils/client.js";
import { CartManager } from "../utils/cartManager.js";

const createProductCard = (product) => `
    <div class="product-card" data-id="${product.id}">
        <div class="product-image">
            <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.libelle}">
        </div>
        <div class="product-info">
            <h3>${product.libelle}</h3>
            <p class="description">${product.description}</p>
            <div class="price-row">
                <span class="price">${product.prix}€</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" data-product-id="${product.id}">
                    Ajouter
                </button>
                <button class="details" data-product-id="${product.id}">
                    Détails
                </button>
            </div>
        </div>
    </div>
`;

const filterProducts = (products, searchTerm) =>
    products.filter(product =>
        product.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

const sortProducts = (products, sortType) => {
    switch (sortType) {
        case 'price-asc':
            return [...products].sort((a, b) => a.prix - b.prix);
        case 'price-desc':
            return [...products].sort((a, b) => b.prix - a.prix);
        default:
            return products;
    }
};

const updateProductsGrid = (products) => {
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = products.map(createProductCard).join('');
    }
};

const handleProductSearch = (products, searchTerm, sortType) => {
    const filteredProducts = filterProducts(products, searchTerm);
    const sortedProducts = sortProducts(filteredProducts, sortType);
    updateProductsGrid(sortedProducts);
};

const handleProductClick = (event, products) => {
    const button = event.target;
    if (!button.dataset.productId) return;

    if (button.classList.contains('add-to-cart')) {
        CartManager.add(parseInt(button.dataset.productId));
        CartManager.renderFlyout(products);
    } else if (button.classList.contains('details')) {
        window.location.href = `/product/${button.dataset.productId}`;
    }
};

const attachEventListeners = (products) => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('products-grid');

    if (searchInput && sortSelect) {
        const handleSearchAndSort = () =>
            handleProductSearch(products, searchInput.value, sortSelect.value);

        searchInput.addEventListener('input', handleSearchAndSort);
        sortSelect.addEventListener('change', handleSearchAndSort);
    }

    if (productsGrid) {
        productsGrid.addEventListener('click', (e) => handleProductClick(e, products));
    }
};

const fetchProducts = async () => {
    try {
        return await apiClient.get("products") || [];
    } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        return [];
    }
};

export const homeView = async () => {
    const products = await fetchProducts();

    setTimeout(() => {
        attachEventListeners(products);
        CartManager.renderFlyout(products);
    }, 0);

    return `
        <div class="hero-banner">
            <div class="hero-content">
                <h1>Bienvenue sur notre boutique</h1>
                <p>Des produits pour tous les besoins, au meilleur prix !</p>
            </div>
        </div>

        <div class="controls-bar">
            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="🔍 Rechercher un produit...">
            </div>
            <div class="sort-bar">
                <select id="sortSelect">
                    <option value="">Trier par</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                </select>
            </div>
        </div>

        <section class="product-section">
            <h2 class="section-title">Nos produits</h2>
            <div id="products-grid" class="products-grid">
                ${products.map(createProductCard).join('')}
            </div>
        </section>
    `;
};