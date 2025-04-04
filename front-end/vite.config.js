import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    console.log("ENV VITE_API_URL:", env.VITE_API_URL);
    return {
        define: {
            __API__: JSON.stringify(env.VITE_API_URL),
        },
        server: {
            port: 3000,
            headers: {
                'Content-Security-Policy': `
                    default-src 'self';
                    script-src 'self' 'unsafe-inline' 'unsafe-eval';
                    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                    img-src 'self' data: blob: http://localhost:5000/uploads https://loremflickr.com https://picsum.photos https://fastly.picsum.photos;
                    connect-src 'self' http://localhost:5000 http://localhost:5000/api/stats;
                    font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
                    object-src 'none';
                    media-src 'self';
                    frame-src 'self';
                    form-action 'self';
                    report-uri http://localhost:5000/api/csp-violation-report;
                `.replace(/\n/g, ''),
            },
        },
    };
});