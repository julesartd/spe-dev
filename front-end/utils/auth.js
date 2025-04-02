export const saveToken = (token) => {
    localStorage.setItem("jwt", token);
};

export const getToken = () => {
    return localStorage.getItem("jwt");
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const logout = () => {
    localStorage.removeItem("jwt");
};

window.logoutUser = () => {
    logout();
    alert("Déconnecté !");
    window.location.href = "/";
};

