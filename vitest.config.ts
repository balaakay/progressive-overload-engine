import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    // Mirror the "@/*" -> "<root>/*" mapping from tsconfig.json so that
    // Vitest can resolve "@/..." imports at runtime.
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    globals: true,
  },
})
