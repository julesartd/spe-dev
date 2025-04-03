import { apiClient } from "../utils/client.js";
import { getToken } from "../utils/auth.js";
import { renderCategorySelect } from "../components/categorySelect.js";

const createEditForm = (product) => `
    <section class="edit-product-section">
        <h2>Modifier le produit : ${product.libelle}</h2>
        <form id="editProductForm">
            <div class="form-group">
                <label>Libellé</label>
                <input type="text" name="libelle" value="${product.libelle}" required />
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description">${product.description}</textarea>
            </div>
            <div class="form-group">
                <label>Prix (€)</label>
                <input type="number" name="prix" step="0.01" value="${product.prix}" required />
            </div>
            <div class="form-group">
                <label>Catégorie</label>
                ${renderCategorySelect(product.categorie)}
            </div>

            <button type="submit">✅ Enregistrer</button>
            <button type="button" id="cancelEdit">❌ Annuler</button>
        </form>
    </section>
`;

const redirectToDashboard = () => {
    window.history.pushState({}, "", "/dashboard");
    window.dispatchEvent(new PopStateEvent("popstate"));
};

const handleSubmit = async (event, productId) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        await updateProduct(productId, data);
        alert("Produit mis à jour !");
        redirectToDashboard();
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Échec de la mise à jour.");
    }
};

const updateProduct = async (productId, data) => {
    return apiClient.put(`products/${productId}`, data, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

const fetchProduct = async (productId) => {
    try {
        return await apiClient.get(`products/${productId}`);
    } catch (error) {
        console.error("Erreur lors du chargement du produit :", error);
        throw error;
    }
};

const attachEventListeners = (productId) => {
    const form = document.getElementById('editProductForm');
    const cancelBtn = document.getElementById('cancelEdit');

    if (form) {
        form.addEventListener('submit', (e) => handleSubmit(e, productId));
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', redirectToDashboard);
    }
};

export const editView = async (id) => {
    try {
        const product = await fetchProduct(id.id);
        const html = createEditForm(product);

        setTimeout(() => attachEventListeners(product.id), 0);

        return html;
    } catch (error) {
        return `<p>Erreur lors du chargement du produit.</p>`;
    }
};