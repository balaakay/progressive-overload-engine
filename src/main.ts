// This file is just a demo that "@/..." imports work from anywhere.
// Replace it with your own code whenever you're ready.

// Type-only import from a root file:
import type { Workout } from "@/types.js"

// Import from a subdirectory:
import { LinearProgression } from "@/strategies/linear-progression.js"

const strategy = new LinearProgression({
  targetSets: 3,
  targetReps: 5,
  startingWeight: 100,
  increment: 5,
  consecutiveFailsForDeload: 3,
  roundingWeight: 5
})

const history: Workout[] = []
const prescribed = strategy.next(history, "squat")

console.log("prescribed sets  =", prescribed)
