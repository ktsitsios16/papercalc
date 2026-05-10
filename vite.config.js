import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // επιτρέπει πρόσβαση από κινητό
    port: 5173,          // σταθερή πόρτα
    strictPort: true,    // δεν αλλάζει ποτέ πόρτα
  }
});