import {apiClient} from "../utils/client.js";
import {decodeJWT, getToken} from "../utils/auth.js";
import {renderCategorySelect} from "../components/categorySelect.js";

export const addProductView = async () => {
    setTimeout(() => {
        const form = document.getElementById("addProductForm");
        const fileInput = document.getElementById("images");

        if (form) {
            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                const formData = new FormData();
                const files = fileInput.files;

                if (files.length > 5) {
                    alert("Maximum 5 images autorisées");
                    return;
                }

                formData.append("libelle", form.libelle.value);
                formData.append("description", form.description.value);
                formData.append("prix", form.prix.value);
                formData.append("categorie", form.categorie.value);
                formData.append("userId", decodeJWT(getToken()).id);

                Array.from(files).forEach((file) => {
                    formData.append("images", file);
                });

                for (let [key, val] of formData.entries()) {
                    console.log(`${key} =`, val);
                }
                try {
                    const result = await apiClient.post("products", formData);
                    console.log("Réponse serveur :", result);
                    alert("Produit ajouté !");
                    form.reset();
                    document.getElementById("preview").innerHTML = "";
                } catch (error) {
                    console.error("Erreur:", error);
                    alert("Erreur lors de l'ajout du produit");
                }
            });
        }

        if (fileInput) {
            fileInput.addEventListener("change", (event) => {
                const preview = document.getElementById("preview");
                preview.innerHTML = "";

                const files = event.target.files;
                if (files.length > 5) {
                    alert("Maximum 5 images autorisées");
                    event.target.value = "";
                    return;
                }

                Array.from(files).forEach((file) => {
                    if (!file.type.startsWith("image/")) return;

                    const reader = new FileReader();
                    const container = document.createElement("div");
                    container.className = "preview-item";

                    reader.onload = (e) => {
                        container.innerHTML = `<img src="${e.target.result}" alt="Aperçu" />`;
                    };

                    reader.readAsDataURL(file);
                    preview.appendChild(container);
                });
            });
        }
    }, 0); // petit timeout pour attendre l'injection du HTML

    console.log()

    return `
    <div class="add-product-container">
      <h2>Ajouter un nouveau produit</h2>
      <form id="addProductForm" class="product-form">
        <div class="form-group">
          <label for="libelle">Nom du produit*</label>
          <input type="text" id="libelle" name="libelle" required />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label for="prix">Prix*</label>
          <input type="number" id="prix" name="prix" step="0.01" min="0" required />
        </div>

        
          <div class="form-group">
              <label for="categorie">Catégorie</label>
              ${renderCategorySelect()}
          </div>

        <div class="form-group">
          <label for="images">Images (max 5)*</label>
          <input type="file" id="images" name="images" accept="image/*" multiple required />
          <div class="file-info">Formats acceptés : JPG, PNG, GIF</div>
          <div id="preview" class="preview-container"></div>
        </div>

        <button type="submit" class="submit-btn">Ajouter le produit</button>
      </form>
    </div>
  `;
};
