import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
    base: "/",
    plugins: [react(), compression()],
    preview: {
        port: 80,
        strictPort: true,
    },
    build: {
        target: 'esnext' //browsers can handle the latest ES features
    },
    server: {
        port: 80,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:80",
    },
    define: {
        "global": {}
    }
});