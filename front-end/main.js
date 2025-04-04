import { createRouter } from "./router.js";
import { checkTokenExpired, getToken, isAuthenticated } from "./utils/auth.js";
import { loginView } from "./pages/login.js";
import { productDetailView } from "./pages/productDetail.js";
import { homeView } from "./pages/home.js";
import { addProductView } from "./pages/addProduct.js";
import { registerView } from "./pages/register.js";
import { dashbordView } from "./pages/dashboard.js";
import { editView } from "./pages/editView.js";
import { CartManager } from "./utils/cartManager.js";

const routes = {
    "/": { view: homeView },
    "/login": { view: loginView },
    "/register": { view: registerView },
    "/product/:id": { view: productDetailView },
    "/404": { view: () => "<h1>404 - Not Found</h1>" },
    "/dashboard": { view: dashbordView, protected: true },
    "/add-product": { view: addProductView, protected: true },
    "/edit/:id": { view: editView, protected: true }
};


const updateNavigation = () => {
    const loginLink = document.getElementById("nav-login");
    const logoutBtn = document.getElementById("logoutBtn");
    const dashboardBtn = document.getElementById("nav-dashboard");

    if (isAuthenticated()) {
        loginLink?.classList.add("hidden");
        logoutBtn?.classList.remove("hidden");
        dashboardBtn?.classList.remove("hidden");
    } else {
        loginLink?.classList.remove("hidden");
        logoutBtn?.classList.add("hidden");
        dashboardBtn?.classList.add("hidden");
    }
};

const toggleCart = async () => {
    const flyout = document.getElementById("cart-flyout");
    if (flyout.classList.contains("hidden")) {
        CartManager.renderFlyout();
        flyout.classList.remove("hidden");
    } else {
        flyout.classList.add("hidden");
    }
};

const handleClickOutsideCart = (event) => {
    const cart = document.getElementById("cart-flyout");
    const toggleBtn = document.getElementById("toggle-cart-btn");


    if (!cart || cart.classList.contains("hidden")) return;

    const clickedInsideCart = cart.contains(event.target);
    const clickedToggleBtn = toggleBtn?.contains(event.target);


    if (!clickedInsideCart && !clickedToggleBtn) {
        cart.classList.add("hidden");
    }
};

const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || '{"products": []}');
    const badge = document.getElementById("cart-badge");

    const totalItems = cart.products.reduce((acc, p) => acc + p.quantity, 0);

    if (badge) {
        badge.textContent = totalItems;
        badge.classList.toggle("hidden", totalItems === 0);
    }
};

const checkTokenValidity = () => {
    const token = getToken();
    if (token && checkTokenExpired()) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
};

const initializeEventListeners = () => {
    document.addEventListener("DOMContentLoaded", () => {
        updateNavigation();
        CartManager.initialize();
    });

    document.getElementById("toggle-cart-btn")?.addEventListener("click", toggleCart);
    document.addEventListener("mousedown", handleClickOutsideCart);
    document.addEventListener("login-success", CartManager.synchronizeCart);
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        logoutUser()
    });

}

const initializeApp = () => {
    const router = createRouter(routes, isAuthenticated);

    initializeEventListeners();
    updateCartBadge();

    setInterval(checkTokenValidity, 60000);

    document.addEventListener("DOMContentLoaded", router.init);
};

initializeApp();