import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "ziggy-js": path.resolve("vendor/tightenco/ziggy"),
        },
    },
    server: {
        hmr: {
            host: "localhost",
            // clientPort: 443,
        },
    },
    plugins: [
        laravel({
            input: [
                "resources/js/app.jsx",
                "resources/js/Pages/Welcome.jsx",
                "resources/css/app.css",
            ],
            refresh: true,
        }),
        react(),
    ],
});
