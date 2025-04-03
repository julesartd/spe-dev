const helmet = require('helmet');
const crypto = require('crypto');

const cspMiddleware = (req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64'); 
    const cspDirectives = {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:",
            "http://localhost:5000/uploads",
            // "https://loremflickr.com" // images de faker
        ],
        objectSrc: ["'none'"],
        scriptSrc: [
            (req, res) => `'nonce-${res.locals.cspNonce}'`,
            "'unsafe-inline'", // Compatibilité avec les anciens navigateurs
        ],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: [
            "'self'",
            "https://localhost:3000",
            "https://localhost:5000/api/stats",
        ],
        reportUri: "/api/csp-violation-report",
        requireTrustedTypesFor: ["'script'"],
    };

    helmet.contentSecurityPolicy({
        directives: cspDirectives,
        reportOnly: false,
    })(req, res, next);
};

module.exports = cspMiddleware;