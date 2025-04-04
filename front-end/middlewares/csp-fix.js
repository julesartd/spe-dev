
export default function cspMiddleware(nonce) {
    return {
        name: 'csp-middleware',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.headers.accept?.includes('text/html')) {
                    res.setHeader('Content-Security-Policy', `
                        default-src 'self';
                        script-src 'self' 'unsafe-inline' 'nonce-${nonce}';
                        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                        img-src 'self' data: blob: http://localhost:5000/uploads https://loremflickr.com https://picsum.photos https://fastly.picsum.photos;
                        connect-src 'self' http://localhost:5000 http://localhost:5000/api/stats;
                        font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
                        object-src 'none';
                        media-src 'self';
                        frame-src 'self';
                        form-action 'self';
                        report-uri http://localhost:5000/api/csp-violation-report;
                    `.replace(/\n/g, ''));
                }
                next();
            });
        }
    };
}