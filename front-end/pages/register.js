import { apiClient } from "../utils/client.js";

export const registerView = () => {
    setTimeout(() => {
        const form = document.getElementById("registerForm");
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                email: form.email.value,
                password: form.password.value,
                firstName: form.firstName.value,
                lastName: form.lastName.value,
            };

            try {
                const result = await apiClient.post("auth/register", data);
                alert("Compte créé ! Connectez-vous maintenant.");
                window.location.href = "/login";
            } catch (err) {
                console.error("Erreur register :", err);
                alert("Erreur lors de la création du compte");
            }
        });
    }, 0);

    return `
    <div class="auth-form-container">
      <h2>Créer un compte</h2>
      <form id="registerForm" class="auth-form">
        <label>Prénom</label>
        <input type="text" name="firstName" required />
        <label>Nom</label>
        <input type="text" name="lastName" required />
        <label>Email</label>
        <input type="email" name="email" required />
        <label>Mot de passe</label>
        <input type="password" name="password" required />
        <button type="submit">S'inscrire</button>
        <p>Déjà inscrit ? <a href="/login" data-link>Se connecter</a></p>
      </form>
    </div>
  `;
};
