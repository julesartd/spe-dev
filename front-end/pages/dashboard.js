import { apiClient } from "../utils/client.js";
import { decodeJWT, getToken } from "../utils/auth.js";

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
                <button class="details-btn" data-id="${product.id}">
                    Détails
                </button>
                <button class="edit-product" data-id="${product.id}">✏️ Modifier</button>
                <button class="delete-product" data-id="${product.id}">🗑️ Supprimer</button>
            </div>
        </div>
    </div>
`;

const getFilteredAndSortedProducts = (products, searchTerm, sortType) => {
    const filtered = products.filter(product =>
        product.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return sortProducts(filtered, sortType);
};

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

const handleDeleteProduct = async (id, products, updateUI) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        try {
            await apiClient.delete(`products/${id}`);
            const updatedProducts = products.filter(p => p.id !== id);
            updateUI(updatedProducts);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Échec de la suppression du produit.");
        }
    }
};

const attachEventListeners = (products, updateUI) => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const addProductBtn = document.getElementById('addProductBtn');
    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            window.location.href = `/product/${productId}`;
        });
    });

    const handleFilterSort = () => {
        const filteredProducts = getFilteredAndSortedProducts(
            products,
            searchInput.value,
            sortSelect.value
        );
        updateUI(filteredProducts);
    };

    searchInput?.addEventListener('input', handleFilterSort);
    sortSelect?.addEventListener('change', handleFilterSort);

    addProductBtn?.addEventListener('click', () => {
        window.location.href = '/add-product';
    });

    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', (e) => {
            handleDeleteProduct(e.target.dataset.id, products, updateUI);
        });
    });

    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', (e) => {
            window.location.href = `/edit/${e.target.dataset.id}`;
        });
    });
};

const initializeCart = () => {
    window.addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Produit ajouté au panier');
    };
};

export const dashbordView = async () => {
    const userId = decodeJWT(getToken()).id;
    let products = [];

    try {
        products = await apiClient.get(`products/byUser/${userId}`) || [];
    } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
    }

    const updateUI = (filteredProducts) => {
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = filteredProducts.map(createProductCard).join('');
            attachEventListeners(products, updateUI);
        }
    };

    setTimeout(() => {
        initializeCart();
        attachEventListeners(products, updateUI);
        updateUI(products);
    }, 0);

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
                ${products.map(createProductCard).join('')}
            </div>
        </section>
    `;
};