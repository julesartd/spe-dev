import { apiClient } from "../utils/client.js";
import { saveToken } from "../utils/auth.js";
import {CartManager} from "../utils/cartManager.js";

export const loginView = () => {
    setTimeout(() => {
        const form = document.getElementById("loginForm");
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = form.email.value;
            const password = form.password.value;

            try {
                const result = await apiClient.post("auth/login", { email, password });
                if (result.token) {
                    saveToken(result.token);
                    await CartManager.synchronizeCart(); // Synchroniser avant la redirection
                    document.dispatchEvent(new Event("login-success"));
                    window.location.href = "/dashboard";
                } else {
                    alert("Email ou mot de passe incorrect.");
                }
            } catch (err) {
                console.error("Erreur login :", err);
                alert("Erreur lors de la connexion");
            }
        });
    }, 0);

    return `
   <div class="auth-form-container">
      <h2>Connexion</h2>
      <form id="loginForm" class="auth-form">
        <label>Email</label>
        <input type="email" name="email" required />
        
        <label>Mot de passe</label>
        <input type="password" name="password" required />
        
        <button type="submit">Se connecter</button>
        <p>Pas encore inscrit ? <a href="/register" data-link>Créer un compte</a></p>
      </form>
    </div>

  `;
};
