import { apiClient } from "../utils/client.js";

const API_URL = import.meta.env.VITE_API_URL


const productTemplate = (product) => `
    <div class="product-card" data-id="${product.id}">
        <div class="product-image">
            <img src="${API_URL}${product.images[0] || 'placeholder.jpg'}" alt="${product.libelle}">
        </div>
        <div class="product-info">
            <h3>${product.libelle}</h3>
            <p class="description">${product.description}</p>
            <div class="price-row">
                <span class="price">${product.prix}€</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="window.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    Ajouter
                </button>
                <button class="details" onclick="window.location.href='/product/${product.id}'">
                    Détails
                </button>
            </div>
        </div>
    </div>
`;

const updateProductsDisplay = (products, container) => {
    container.innerHTML = products.map(productTemplate).join('');
};

const setupControls = (products) => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('products-grid');
    let currentProducts = [...products];

    const filterAndSort = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const sortValue = sortSelect.value;

        let filtered = products.filter(product =>
            product.libelle.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );

        switch (sortValue) {
            case 'price-asc':
                filtered.sort((a, b) => a.prix - b.prix);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.prix - a.prix);
                break;
        }

        currentProducts = filtered;
        updateProductsDisplay(filtered, productsGrid);
    };

    searchInput.addEventListener('input', filterAndSort);
    sortSelect.addEventListener('change', filterAndSort);
};

export const homeView = async () => {
    let products = [];
    try {
        products = await apiClient.get("products") || [];
    } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
    }

    setTimeout(() => setupControls(products), 0);

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
                ${products.map(productTemplate).join('')}
            </div>
        </section>

        <script>
            window.addToCart = function(product) {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Produit ajouté au panier');
            }
        </script>
    `;
};