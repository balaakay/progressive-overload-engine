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


export const workingWeight = (log: ExerciseLog) => log.sets[0]?.weight


export const hitAll = (log: ExerciseLog, sets: number, reps: number) =>
  log.sets.length >= sets && log.sets.every((s) => s.reps >= reps)


export const roundTo = (w: number, step: number) =>
  Math.round(w / step) * step


export const uniform = (n: number, set: PrescribedSet): PrescribedSet[] =>
  Array.from({ length: n }, () => ({ ...set }))
