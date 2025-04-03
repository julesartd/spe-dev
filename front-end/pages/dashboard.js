import { apiClient } from "../utils/client.js";
import {decodeJWT, getToken} from "../utils/auth.js";

const API_URL = import.meta.env.VITE_API_URL


const productTemplate = (product) => `
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
                <button class="add-to-cart" onclick="window.addToCart(${JSON.stringify({id : product.id}).replace(/"/g, '&quot;')})">
                    Ajouter
                </button>
                <button class="details" onclick="window.location.href='/product/${product.id}'">
                    Détails
                </button>
                <button class="edit-product" data-id="${product.id}">✏️ Modifier</button>
                <button class="delete-product" data-id="${product.id}">🗑️ Supprimer</button>
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

    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
                try {
                    await apiClient.delete(`products/${id}`);
                    const index = currentProducts.findIndex(p => p.id == id);
                    if (index !== -1) currentProducts.splice(index, 1);
                    updateProductsDisplay(currentProducts, productsGrid);
                    setupControls(currentProducts);
                } catch (err) {
                    console.error("Erreur lors de la suppression :", err);
                    alert("Échec de la suppression du produit.");
                }
            }
        });
    });

    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            window.location.href = `/edit/${id}`; // redirige vers une page de modification
        });
    });


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

export const dashbordView = async () => {
    let products = [];
    try {
        products = await apiClient.get(`products/byUser/${decodeJWT(getToken()).id}`) || [];
    } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
    }

    setTimeout(() => {
        setupControls(products);

        const addBtn = document.getElementById("addProductBtn");
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                window.location.href = "/add-product";
            });
        }
    }, 0);


    setTimeout(() => setupControls(products), 0);

    return `
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
            <h2 class="section-title">Vos produits</h2>
            <div class="add-product-btn-bar">
                <button id="addProductBtn" class="add-product-btn">➕ Ajouter un produit</button>
            </div>

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
