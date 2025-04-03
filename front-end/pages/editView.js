import { apiClient } from "../utils/client.js";
import { getToken } from "../utils/auth.js";
import {renderCategorySelect} from "../components/categorySelect.js";

export const editView = async (id) => {
    console.log(id)
    let product;

    try {
        product = await apiClient.get(`products/${id.id}`);
    } catch (error) {
        console.error("Erreur lors du chargement du produit :", error);
        return `<p>Erreur lors du chargement du produit.</p>`;
    }

    // Retourné au routeur
    const html = `
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

    // Après injection, attacher les événements (via mutation async du routeur)
    setTimeout(() => {
        const form = document.getElementById('editProductForm');
        const cancelBtn = document.getElementById('cancelEdit');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());

                try {
                    await apiClient.put(`products/${product.id}`, data, {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        }
                    });

                    alert("Produit mis à jour !");
                    window.history.pushState({}, "", "/dashboard");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                } catch (error) {
                    console.error("Erreur lors de la mise à jour :", error);
                    alert("Échec de la mise à jour.");
                }
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                window.history.pushState({}, "", "/dashboard");
                window.dispatchEvent(new PopStateEvent("popstate"));
            });
        }
    }, 0);

    return html;
};
