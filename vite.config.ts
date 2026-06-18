import "dotenv/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { localDbPlugin } from "./vite-local-db";

export default defineConfig({
  plugins: [react(), tailwindcss(), localDbPlugin()],
});
