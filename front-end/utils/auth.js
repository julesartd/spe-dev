export const saveToken = (token) => {
    localStorage.setItem("jwt", token);
};

export const getToken = () => {
    return localStorage.getItem("jwt");
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const decodeJWT = (token) => {
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

export const logout = () => {
    localStorage.removeItem("jwt");
};

window.logoutUser = () => {
    logout();
    alert("Déconnecté !");
    window.location.href = "/";
};

