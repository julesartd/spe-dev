import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    define: {
        'process.env.API_URL': JSON.stringify(process.env.API_URL)
    },
    root: ".",
    server: {
        port: 3000
    },
});