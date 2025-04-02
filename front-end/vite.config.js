// vite.config.js
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    console.log("ENV VITE_API_URL:", env.VITE_API_URL);
    return {
        define: {
            __API__: JSON.stringify(env.VITE_API_URL),
        },
        server: {
            port: 3000
        },
    }
});
