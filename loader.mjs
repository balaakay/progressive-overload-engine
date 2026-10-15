// Node loader that teaches the *compiled* JavaScript in ./dist how to resolve
// "@/..." imports (tsc does not rewrite path aliases).
//
// Run it like this:
//   npm run build
//   node --import ./loader.mjs dist/main.js
//
// Or just: npm run start:dist
//
// Note: when running TypeScript directly (npm start), tsx already understands
// the "@/..." alias from tsconfig.json, so this loader isn't needed there.

import { registerHooks } from "node:module"

// Compiled output lives in ./dist, mirroring the source tree, so "@/foo"
// means "dist/foo".
const outDir = new URL("./dist/", import.meta.url)

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(specifier.slice(2), outDir).href, context)
    }
    return nextResolve(specifier, context)
  },
})
