import {apiClient} from "../utils/client.js";

const getErrorMessage = (validatorKey) => {
    const messages = {
        is_null: "Ce champ est requis",
        notEmpty: "Ce champ est requis",
        min: "La valeur doit être supérieure à 0",
        isInt: "Le prix doit être un nombre",
        len: "Le texte est trop court il doit contenir entre 3 et 50 caractères",
        default: "Ce champ n'est pas valide"
    };
    return messages[validatorKey] || messages.default;
};

const clearErrors = () => {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
};

const displayErrors = (error) => {
    console.log("Erreur reçue:", error);

    const details = error?.error?.details?.product;

    if (!details) {
        console.log("Structure d'erreur invalide");
        return;
    }

    Object.entries(details).forEach(([field, validationErrors]) => {
        const errorElement = document.querySelector(`[data-field="${field}"]`);
        if (errorElement) {
            const messages = validationErrors.map(err => {
                console.log("Validation error:", err);
                return getErrorMessage(err.validatorKey);
            });
            errorElement.textContent = messages.join(', ');
            errorElement.parentElement.classList.add('has-error');
        }
    });
};

const createFormData = (form, files) => {
    const formData = new FormData();

    // Ajout des champs du formulaire
    formData.append('libelle', form.libelle.value);
    formData.append('prix', form.prix.value);
    formData.append('description', form.description.value);
    formData.append('categorie', form.categorie.value);

    // Ajout des fichiers
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    return formData;
};

const resetForm = (form) => {
    form.reset();
    const preview = document.getElementById('preview');
    if (preview) {
        preview.innerHTML = '';
    }
    clearErrors();
};

const handleSubmit = async (event, fileInput) => {
    event.preventDefault();
    clearErrors();

    const form = event.target;
    const files = fileInput.files;

    if (files.length > 5) {
        alert("Maximum 5 images autorisées");
        return;
    }

    try {
        const formData = createFormData(form, files);
        const response = await apiClient.post("products", formData);

        if (response?.status === 422) {
            console.log("Erreur validation:", response.data);
            displayErrors(response.data);
            return;
        }

        if (response?.status === 200 || response?.status === 201) {
            alert("Produit ajouté !");
            window.location = '/dashboard';
            resetForm(form);
        }
    } catch (error) {
        console.error("Erreur:", error);
        displayErrors(error);
    }
};

const initializeEventListeners = () => {
    const form = document.getElementById('addProductForm');
    const fileInput = document.getElementById('images');

    if (form && fileInput) {
        form.addEventListener('submit', (e) => handleSubmit(e, fileInput));

        // Gestion de la prévisualisation des images
        fileInput.addEventListener('change', () => {
            const preview = document.getElementById('preview');
            preview.innerHTML = '';

            [...fileInput.files].forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
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
                <span class="error-message" data-field="libelle"></span>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="4"></textarea>
                <span class="error-message" data-field="description"></span>
            </div>

            <div class="form-group">
                <label for="prix">Prix*</label>
                <input type="number" id="prix" name="prix" step="0.01" min="0" required />
                <span class="error-message" data-field="prix"></span>
            </div>
            <div class="form-group">
                <label for="categorie">Catégorie</label>
                <input type="text" id="categorie" name="categorie" required />
                <span class="error-message" data-field="categorie"></span>
            </div>

            <div class="form-group">
                <label for="images">Images (max 5)*</label>
                <input type="file" id="images" name="images" accept="image/*" multiple required />
                <span class="error-message" data-field="images"></span>
                <div class="file-info">Formats acceptés : JPG, PNG, GIF</div>
                <div id="preview" class="preview-container"></div>
            </div>

            <button type="submit" class="submit-btn">Ajouter le produit</button>
        </form>
    </div>
    `;
};