import { apiClient } from "../utils/client.js";

const createRegisterForm = () => `
    <div class="auth-form-container">
        <h2>Créer un compte</h2>
        <form id="registerForm" class="auth-form">
            <div class="form-group">
                <label>Prénom</label>
                <input type="text" name="firstName" required />
                <span class="error-message" data-field="firstName"></span>
            </div>

            <div class="form-group">
                <label>Nom</label>
                <input type="text" name="lastName" required />
                <span class="error-message" data-field="lastName"></span>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required />
                <span class="error-message" data-field="email"></span>
            </div>

            <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" name="password" autocomplete="new-password" required />
                <div id="passwordFeedback" class="password-feedback"></div>
                <span class="error-message" data-field="password"></span>
            </div>

            <button type="submit">S'inscrire</button>
            <p>Déjà inscrit ? <a href="/login" data-link>Se connecter</a></p>
        </form>
    </div>
`;

const validatePassword = (password) => ({
    length: password.length >= 12,
});

const createPasswordFeedback = (checks) => `
    <ul class="password-checklist">
        <li class="${checks.length ? 'valid' : 'invalid'}">12 caractères minimum</li>
    </ul>
`;

const clearErrors = () => {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
};

const getErrorMessage = (validatorKey) => {
    const messages = {
        strongPassword: "Le mot de passe doit contenir au moins : une majuscule, une minuscule, un chiffre et un caractère spécial",
        len: `La longueur doit être entre 12 caractères`,
        isEmail: "L'adresse email n'est pas valide",
        notEmpty: "Ce champ est requis",
        isString: "Ce champ doit être une chaîne de caractères",
        default: "Ce champ n'est pas valide"
    };
    return messages[validatorKey] || messages.default;
};

const displayErrors = (error) => {
    if (!error?.details?.user) return;

    Object.entries(error.details.user).forEach(([field, validationErrors]) => {
        const errorElement = document.querySelector(`[data-field="${field}"]`);
        if (errorElement) {
            const messages = validationErrors.map(err =>
                getErrorMessage(err.validatorKey, err.validatorArgs)
            );
            errorElement.textContent = messages.join(', ');
            errorElement.parentElement.classList.add('has-error');
        }
    });
};

const updatePasswordFeedback = (password) => {
    const passwordFeedback = document.getElementById("passwordFeedback");
    if (passwordFeedback) {
        const checks = validatePassword(password);
        passwordFeedback.innerHTML = createPasswordFeedback(checks);
    }
};

const createUserData = (form) => ({
    email: form.email.value,
    password: form.password.value,
    firstName: form.firstName.value,
    lastName: form.lastName.value
});

const registerUser = async (userData) => {
    try{
        const response = await apiClient.post("auth/register", userData);
        if (response?.status === 422) {
            displayErrors(response.data);
            return;
        }
        if (response?.status === 200) {
            window.location.href = "/login";
        }
    }catch(e){
        console.log("Erreur register :", e);
        displayErrors(e);
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();
    clearErrors();

    const form = event.target;
    const password = form.password.value;
    const checks = validatePassword(password);

    if (!Object.values(checks).every(Boolean)) {
        displayErrors({
            details: {
                user: {
                    password: [{
                        validatorKey: "strongPassword",
                        validatorArgs: []
                    }]
                }
            }
        });
        return;
    }
    const userData = createUserData(form);
    await registerUser(userData);

};

const attachEventListeners = () => {
    const form = document.getElementById("registerForm");
    const passwordInput = form?.password;

    if (passwordInput) {
        passwordInput.addEventListener("input", (e) => updatePasswordFeedback(e.target.value));
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }
};

export const registerView = () => {
    setTimeout(attachEventListeners, 0);
    return createRegisterForm();
};