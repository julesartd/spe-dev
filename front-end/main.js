import { createRouter } from "./router.js";
import { isAuthenticated } from "./utils/auth.js";
import { loginView } from "./pages/login.js";
import { productDetailView } from "./pages/productDetail.js";
import { homeView } from "./pages/home.js";
import {addProductView} from "./pages/addProduct.js";
import {registerView} from "./pages/register.js";
import {dashbordView} from "./pages/dashboard.js";

const routes = {
    "/": { view: homeView },
    "/login": { view: loginView },
    "/register": { view: registerView },
    "/product/:id": { view: productDetailView },
    "/404": { view: () => "<h1>404 - Not Found</h1>" },
    "/dashboard": { view: dashbordView },
    "/add-product": {
        view: addProductView,
    },
};

const router = createRouter(routes, isAuthenticated);
document.addEventListener("DOMContentLoaded", router.init);