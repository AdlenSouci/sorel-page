import "dotenv/config";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { localDbPlugin } from "./vite-local-db";

export default defineConfig({
  plugins: [react(), tailwindcss(), localDbPlugin()],
  // Alias utilisé par les composants shadcn (`@/components/ui/...`).
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
});
