function AuthManager() {
    if (AuthManager.instance) {
        return AuthManager.instance;
    }
    AuthManager.instance = this;
}

AuthManager.prototype.saveToken = function(token) {
    localStorage.setItem("jwt", token);
};

AuthManager.prototype.getToken = function() {
    return localStorage.getItem("jwt");
};

AuthManager.prototype.checkTokenExpired = function() {
    const payload = this.decodeJWT(this.getToken());
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

AuthManager.prototype.isAuthenticated = function() {
    return !!this.getToken();
};

AuthManager.prototype.decodeJWT = function(token) {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("JWT invalide :", err);
        return null;
    }
};

AuthManager.prototype.logout = function() {
    localStorage.removeItem("jwt");
};

AuthManager.prototype.logoutUser = function() {
    this.logout();
    alert("Déconnecté !");
    window.location.href = "/";
};

const auth = new AuthManager();

export const saveToken = (token) => auth.saveToken(token);
export const getToken = () => auth.getToken();
export const checkTokenExpired = () => auth.checkTokenExpired();
export const isAuthenticated = () => auth.isAuthenticated();
export const decodeJWT = (token) => auth.decodeJWT(token);
export const logout = () => auth.logout();

window.logoutUser = () => auth.logoutUser();