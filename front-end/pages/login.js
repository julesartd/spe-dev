import { apiClient } from "../utils/client.js";
import { saveToken } from "../utils/auth.js";
import { CartManager } from "../utils/cartManager.js";

const createLoginForm = () => `
    <div class="auth-form-container">
        <h2>Connexion</h2>
        <form id="loginForm" class="auth-form">
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required />
            </div>

            <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" name="password" required />
            </div>

            <button type="submit">Se connecter</button>
            <p>Pas encore inscrit ? <a href="/register" data-link>Créer un compte</a></p>
        </form>
    </div>
`;

const performLogin = async (credentials) => {
    try {
        const result = await apiClient.post("auth/login", credentials);
        console.log("Résultat de la connexion :", result);
        if (!result.data.token) {
            throw new Error("Token manquant dans la réponse");
        }
        return result.data;
    } catch (error) {
        console.error("Erreur login :", error);
        throw error;
    }
};

const handleLoginSuccess = async (token) => {
    saveToken(token);
    await CartManager.synchronizeCart();
    document.dispatchEvent(new Event("login-success"));
    window.location.href = "/dashboard";
};

const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const credentials = {
        email: formData.get("email"),
        password: formData.get("password")
    };

    try {
        const result = await performLogin(credentials);
        await handleLoginSuccess(result.token);
    } catch (error) {
        alert("Email ou mot de passe incorrect.");
    }
};

const attachEventListeners = () => {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }
};

export const loginView = () => {
    setTimeout(attachEventListeners, 0);
    return createLoginForm();
};