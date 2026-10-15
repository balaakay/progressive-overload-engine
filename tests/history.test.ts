import type { ExerciseLog, PrescribedSet } from "@/types.js"
import { workingWeight, hitAll, roundTo, uniform } from "@/history.js"


describe("roundTo", () => {
  it("rounds a weight to the step. Useful for finding best weight to put on the bar", () => {
    expect(roundTo(103, 5)).toBe(105)
  })
})
