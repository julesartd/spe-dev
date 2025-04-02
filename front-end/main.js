import { createRouter } from "./router.js";
import { isAuthenticated } from "./utils/auth.js";
import { loginView } from "./pages/login.js";
import { productDetailView } from "./pages/productDetail.js";
import { homeView } from "./pages/home.js";

const routes = {
    "/": { view: homeView },
    "/login": { view: loginView },
    "/product/:id": { view: productDetailView },
    "/404": { view: () => "<h1>404 - Not Found</h1>" },
};

const router = createRouter(routes, isAuthenticated);
document.addEventListener("DOMContentLoaded", router.init);