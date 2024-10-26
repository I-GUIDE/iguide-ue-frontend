import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from 'vite-plugin-compression2'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
    base: "/",
    plugins: [react(), compression(), eslintPlugin({
        cache: false,
        include: ['./src//*.js', './src//*.jsx'],
        exclude: [],
    }),],
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