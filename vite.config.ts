import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    // Otimizações de performance
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
        },
      },
    },
    // Aumenta o limite de warning para chunks grandes
    chunkSizeWarningLimit: 1000,
    // Otimizações adicionais
    minify: "esbuild",
    target: "es2020",
    cssMinify: true,
    reportCompressedSize: true,
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  // Otimização de imagens
  assetsInlineLimit: 4096, // Inline assets < 4kb
}));
