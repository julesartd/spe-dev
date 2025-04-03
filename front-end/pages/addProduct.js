import { apiClient } from "../utils/client.js";
import { decodeJWT, getToken } from "../utils/auth.js";
import { renderCategorySelect } from "../components/categorySelect.js";

const handleSubmit = async (event, fileInput) => {
    event.preventDefault();
    const form = event.target;
    const files = fileInput.files;

    if (files.length > 5) {
        alert("Maximum 5 images autorisées");
        return;
    }

    try {
        const formData = createFormData(form, files);
        await saveProduct(formData);
        resetForm(form);
    } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'ajout du produit");
    }
};

const createFormData = (form, files) => {
    const formData = new FormData();
    const userId = decodeJWT(getToken()).id;

    formData.append("libelle", form.libelle.value);
    formData.append("description", form.description.value);
    formData.append("prix", form.prix.value);
    formData.append("categorie", form.categorie.value);
    formData.append("userId", userId);

    Array.from(files).forEach(file => {
        formData.append("images", file);
    });

    return formData;
};

const saveProduct = async (formData) => {
    const result = await apiClient.post("products", formData);
    console.log("Réponse serveur :", result);
    alert("Produit ajouté !");
};

const resetForm = (form) => {
    form.reset();
    document.getElementById("preview").innerHTML = "";
};

const handleFileChange = (event) => {
    const files = event.target.files;
    const preview = document.getElementById("preview");

    if (files.length > 5) {
        alert("Maximum 5 images autorisées");
        event.target.value = "";
        return;
    }

    preview.innerHTML = "";
    Array.from(files)
        .filter(file => file.type.startsWith("image/"))
        .forEach(file => previewImage(file, preview));
};

const previewImage = (file, previewContainer) => {
    const reader = new FileReader();
    const container = document.createElement("div");
    container.className = "preview-item";

    reader.onload = (e) => {
        container.innerHTML = `<img src="${e.target.result}" alt="Aperçu" />`;
    };

    reader.readAsDataURL(file);
    previewContainer.appendChild(container);
};

const initializeEventListeners = () => {
    const form = document.getElementById("addProductForm");
    const fileInput = document.getElementById("images");

    if (form) {
        form.addEventListener("submit", (e) => handleSubmit(e, fileInput));
    }

    if (fileInput) {
        fileInput.addEventListener("change", handleFileChange);
    }
};

export const addProductView = async () => {
    setTimeout(initializeEventListeners, 0);

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