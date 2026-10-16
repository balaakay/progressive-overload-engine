import type { SetResult, ExerciseLog, PrescribedSet } from "@/src/types.js"
import { workingWeight, hitAll, roundTo, uniform } from "@/src/history.js"

const set1: SetResult = { weight: 185, reps: 6, rpe: 8 }
const set2: SetResult = { weight: 225, reps: 2, rpe: 10 }
const setArr: SetResult[] = [set1, set2]
const exerciseLog1: ExerciseLog = {exercise: "Bench Press", sets: setArr}

describe("workingWeight", () => {
  it("find the current working weight of a exerciseLog object", () => {
    expect(workingWeight(exerciseLog1)).toBe(225)
  })
}),



describe("roundTo", () => {
  it("rounds a weight to the step. Useful for finding best weight to put on the bar", () => {
    expect(roundTo(103, 5)).toBe(105)
  })
})
