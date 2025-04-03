export const createRouter = (routes, isAuthenticatedFn) => {
    const matchRoute = (path, routePath) => {
        const paramNames = [];
        const regexPath = routePath.replace(/:([a-zA-Z]+)/g, (_, key) => {
            paramNames.push(key);
            return "([^/]+)";
        });
        const regex = new RegExp(`^${regexPath}$`);
        const match = path.match(regex);

        if (!match) return null;

        const params = paramNames.reduce((acc, name, i) => {
            acc[name] = match[i + 1];
            return acc;
        }, {});

        return { matched: true, params };
    };

    const resolveRoute = (path) => {
        for (const routePattern in routes) {
            const match = matchRoute(path, routePattern);
            if (match) {
                const route = routes[routePattern];
                return {
                    ...route,
                    params: match.params
                };
            }
        }
        return routes["/404"];
    };

    const render = async (path) => {
        const route = resolveRoute(path);
        if (!route) return;

        const needsAuth = route.protected === true;

        if (needsAuth && !isAuthenticatedFn()) {
            history.pushState({}, "", "/login");
            const loginRoute = routes["/login"];
            const html = await loginRoute.view({});
            updateDOM("#app", html);
            if (loginRoute.afterRender) loginRoute.afterRender();
            return;
        }

        const html = await route.view(route.params || {});
        updateDOM("#app", html);

        if (typeof route.afterRender === "function") {
            route.afterRender();
        }
    };

    const navigate = (path) => {
        history.pushState({}, "", path);
        return render(path);
    };

    const init = () => {
        document.body.addEventListener("click", (e) => {
            if (e.target.matches("a[data-link]")) {
                e.preventDefault();
                const path = e.target.getAttribute("href");
                navigate(path);
            }
        });

        window.addEventListener("popstate", () => {
            render(window.location.pathname);
        });

        render(window.location.pathname);
    };

    return { init, navigate };
};

const updateDOM = (selector, content) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = content;
};
