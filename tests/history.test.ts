import type { SetResult, ExerciseLog, PrescribedSet } from "@/src/types.js"
import { workingWeight, hitAll, roundTo, uniform } from "@/src/history.js"

const set1: SetResult = { weight: 185, reps: 6, rpe: 8 }
const set2: SetResult = { weight: 225, reps: 2, rpe: 10 }
const setArr: SetResult[] = [set1, set2]
const exerciseLog1: ExerciseLog = {exercise: "Bench Press", sets: setArr}

const set3: SetResult = { weight: 225, reps: 2, rpe: 10 }
const set4: SetResult = { weight: 185, reps: 6, rpe: 8 }
const setArr2: SetResult[] = [set3, set4]
const exerciseLog2: ExerciseLog = {exercise: "Bench Press", sets: setArr2}

const set5: SetResult = { weight: -185, reps: 6, rpe: 8 }


// tests to write
// errors on exercise log that has no sets, no working weight that's negative??
describe("workingWeight", () => {
  it("find the current working weight of a exerciseLog object", () => {
    expect(workingWeight(exerciseLog1)).toBe(225)
    expect(workingWeight(exerciseLog2)).toBe(225)
  })

})

describe("hitAll", () => {
  it("returns true if all sets in exercise log meet or exeed expectations of sets and reps", () => {
  })
})


describe("roundTo", () => {
  it("rounds a weight to the step. Useful for finding best weight to put on the bar", () => {
    expect(roundTo(103, 5)).toBe(105)
    expect(roundTo(set1.weight, 5)).toBe(185)
  })

  it("errors out on negative weights", () => {
    expect(() => roundTo(set5.weight, 5)).toThrow(RangeError)
  })

  it("errors out on negative step", () => {
    expect(() => roundTo(set2.weight, -1)).toThrow(RangeError)
  })

  it("errors out on step of 0", () => {
    expect(() => roundTo(set2.weight, 0)).toThrow(RangeError)
  })
})

describe("uniform", () => {
  const set: PrescribedSet = { reps: 5, weight: 100 }; // adjust to your type

  it("returns n sets", () => {
    expect(uniform(3, set)).toHaveLength(3);
  });

  it("returns an empty array when n is 0", () => {
    expect(uniform(0, set)).toEqual([]);
  });

  it("fills every entry with the same values", () => {
    expect(uniform(3, set)).toEqual([set, set, set]);
  });

  it("returns new objects, not references to the input", () => {
    const result = uniform(3, set);
    result.forEach((s) => expect(s).not.toBe(set));
  });

  it("does not share references between entries", () => {
    const result = uniform(2, set);
    const [a, b] = result;
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    if (!a || !b) throw new Error("expected 2 sets"); // narrows the types

    a.reps = 99;
    expect(b.reps).toBe(5);
  });

  it("throws a RangeError for negative n", () => {
    expect(() => uniform(-1, set)).toThrow(RangeError);
  });
});
