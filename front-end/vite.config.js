import { defineConfig, loadEnv } from 'vite';
import crypto from 'crypto';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        define: {
            __API__: JSON.stringify(env.VITE_API_URL),
        },
        server: {
            port: 3000,
        },
        plugins: [
            {
                name: 'html-transform',
                transformIndexHtml(html) {
                    const NONCE = crypto.randomBytes(16).toString('base64');
                    const scriptTag = '<script type="module" src="/main.js"></script>';
                    const newScriptTag = `<script type="module" nonce="${NONCE}" src="/main.js"></script>`;

                    const transformedHtml = html.replace(scriptTag, newScriptTag);

                    return transformedHtml.replace(
                        '</head>',
                        `<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-${NONCE}'"></head>`
                    );
                }
            },
            {
                name: 'dynamic-csp',
                configureServer(server) {
                    server.middlewares.use((req, res, next) => {
                        if (req.headers.accept?.includes('text/html')) {
                            const NONCE = crypto.randomBytes(16).toString('base64');
                            res.setHeader('Content-Security-Policy', `
                                default-src 'self';
                                script-src 'self' 'unsafe-inline' 'nonce-${NONCE}';
                                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                                img-src 'self' data: blob: http://localhost:5000 https://loremflickr.com https://picsum.photos https://fastly.picsum.photos;
                                connect-src 'self' http://localhost:5000 http://localhost:5000/api/stats;
                                font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
                                object-src 'none';
                                media-src 'self';
                                frame-src 'self';
                                form-action 'self';
                            `.replace(/\n/g, ''));
                        }
                        next();
                    });
                }
            }
        ]
    };
});