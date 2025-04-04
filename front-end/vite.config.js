import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import crypto from 'crypto';
import cspMiddleware from './middlewares/csp';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    console.log("ENV VITE_API_URL:", env.VITE_API_URL);
    var NONCE = crypto.randomBytes(16).toString('base64');

    return {
        define: {
            __API__: JSON.stringify(env.VITE_API_URL),
        },
        server: {
            port: 3000,
        },
        plugins: [
            cspMiddleware(),
        ],
    };
});

