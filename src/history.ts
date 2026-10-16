import type { ExerciseLog, Workout, PrescribedSet } from "./types.js"


export function recentLogs(
  history: Workout[],
  exercise: string,
  n: number
): ExerciseLog[] {
  const logs: ExerciseLog[] = []
  for (let i = history.length - 1; i >= 0 && logs.length < n; i--) {
    const log = history[i]?.logs.find((l) => l.exercise === exercise)
    if (log) logs.push(log)
  }
  return logs // most recent first
}


export const workingWeight = (log: ExerciseLog) => {
  if (!log.sets || log.sets.length === 0) return undefined;
  return Math.max(...log.sets.map(set => set.weight));
};


export const hitAll = (log: ExerciseLog, sets: number, reps: number) =>
  log.sets.length >= sets && log.sets.every((s) => s.reps >= reps)


export const roundTo = (w: number, step: number) => {
  if(w < 0 ) throw new RangeError("weight needs to be positive or 0")
  if(step <= 0 ) throw new RangeError("Cannot have a step of 0 or negative")
  return Math.round(w / step) * step
}


export const uniform = (n: number, set: PrescribedSet): PrescribedSet[] => {
  if(n < 0) throw new RangeError("n needs to be a positive number")
  return Array.from({ length: n }, () => ({ ...set }))
}
