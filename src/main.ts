// Synthetic, hand-crafted training history.
//
// This file exists so there is a realistic body of input data to run every
// progression strategy against while they are being built out. It is meant to
// be extended/replaced freely — it is a playground, not production data.
//
// The dataset deliberately covers the whole `SetResult` shape:
//   - weight / reps        (every set)
//   - rpe and rir          (used on different lifts so both fields get exercised)
//   - tempo                (all six `Cadence` values, via four tempo presets)
//   - partials             (on deadlifts and isolation work)
//
// It also contains a few deliberate "storylines" so strategies have something
// interesting to chew on:
//   - a lift that adds weight cleanly every session      (Back Squat)
//   - a lift that stalls and misses reps, then deloads    (Overhead Press)
//   - a movement that has only ever been logged once      (Front Squat)
//   - an exercise that has never been logged at all       (Leg Press)

import { Cadence } from "@/src/types.js"
import type { ExerciseLog, ProgressionStrategy, SetResult, Tempo, Workout } from "@/src/types.js"
import { LinearProgression } from "@/src/strategies/linear-progression.js"

// ── Tempo presets ───────────────────────────────────────────────────────────
// A tempo reads eccentric -> squeeze (top) -> concentric -> stretch (bottom).
// Between them these four presets use every Cadence value exactly for what it
// is good at: explosive concentrics, controlled eccentrics, pauses, grinds.

const tempo = (
  eccentric: Cadence,
  squeeze: Cadence,
  concentric: Cadence,
  stretch: Cadence,
): Tempo => ({ eccentric, squeeze, concentric, stretch })

// Drive up fast, lower under control.
const EXPLOSIVE = tempo(
  Cadence.Pace_3_Second,
  Cadence.Normal,
  Cadence.Explosive,
  Cadence.Normal,
)

// Standard hypertrophy/strength tempo with a brief top squeeze.
const CONTROLLED = tempo(
  Cadence.Pace_2_Second,
  Cadence.Pace_1_Second,
  Cadence.Normal,
  Cadence.Pace_1_Second,
)

// Paused variant: a long stretch hold at the bottom, then explode.
const PAUSED = tempo(
  Cadence.Pace_3_Second,
  Cadence.Pace_1_Second,
  Cadence.Explosive,
  Cadence.Pace_4_Second,
)

// Slow grind for small isolation muscles.
const SLOW_GRIND = tempo(
  Cadence.Pace_4_Second,
  Cadence.Pace_2_Second,
  Cadence.Pace_2_Second,
  Cadence.Pace_2_Second,
)

// ── Tiny builders ───────────────────────────────────────────────────────────
// Keep the raw data below readable without hiding the values being set.

const set = (
  weight: number,
  reps: number,
  details: Omit<SetResult, "weight" | "reps"> = {},
): SetResult => ({ weight, reps, ...details })

const log = (exercise: string, sets: SetResult[]): ExerciseLog => ({ exercise, sets })

const workout = (date: Date, logs: ExerciseLog[]): Workout => ({ date, logs })

// ── Exercise names ──────────────────────────────────────────────────────────
// Kept as constants so the history and the generation loop can never drift.

const BACK_SQUAT = "Back Squat"
const BENCH_PRESS = "Bench Press"
const BARBELL_ROW = "Barbell Row"
const DEADLIFT = "Deadlift"
const OVERHEAD_PRESS = "Overhead Press"
const LATERAL_RAISE = "Lateral Raise"
const PAUSED_SQUAT = "Paused Squat"
const INCLINE_DB_PRESS = "Incline DB Press"
const LAT_PULLDOWN = "Lat Pulldown"
const FRONT_SQUAT = "Front Squat"
const LEG_PRESS = "Leg Press" // intentionally never logged

// ── The history ─────────────────────────────────────────────────────────────
// Four weeks, three sessions a week (Mon / Wed / Fri).
//   Mon: Back Squat, Bench Press, Barbell Row
//   Wed: Deadlift, Overhead Press, Lateral Raise
//   Fri: Paused Squat, Incline DB Press, Lat Pulldown

export const history: Workout[] = [
  // ── Week 1 ────────────────────────────────────────────────────────────────
  workout(new Date("2026-01-05"), [
    log(BACK_SQUAT, [
      set(185, 5, { rpe: 7, tempo: EXPLOSIVE }),
      set(185, 5, { rpe: 8, tempo: EXPLOSIVE }),
      set(185, 5, { rpe: 8.5, tempo: EXPLOSIVE }),
    ]),
    log(BENCH_PRESS, [
      set(135, 5, { rpe: 7 }),
      set(135, 5, { rpe: 8 }),
      set(135, 5, { rpe: 9 }),
    ]),
    log(BARBELL_ROW, [
      set(95, 8, { rpe: 7, tempo: CONTROLLED }),
      set(95, 8, { rpe: 7.5, tempo: CONTROLLED }),
      set(95, 8, { rpe: 8, tempo: CONTROLLED }),
    ]),
  ]),

  workout(new Date("2026-01-07"), [
    log(DEADLIFT, [
      set(225, 5, { rpe: 7, tempo: CONTROLLED }),
      set(225, 5, { rpe: 8, tempo: CONTROLLED }),
      set(225, 5, { rpe: 9, tempo: CONTROLLED, partials: 2 }),
    ]),
    log(OVERHEAD_PRESS, [
      set(85, 5, { rir: 3 }),
      set(85, 5, { rir: 2 }),
      set(85, 5, { rir: 1 }),
    ]),
    log(LATERAL_RAISE, [
      set(15, 15, { rir: 3, tempo: SLOW_GRIND }),
      set(15, 15, { rir: 2, tempo: SLOW_GRIND }),
      set(15, 15, { rir: 1, tempo: SLOW_GRIND, partials: 5 }),
    ]),
  ]),

  workout(new Date("2026-01-09"), [
    log(PAUSED_SQUAT, [
      set(165, 3, { rpe: 7, tempo: PAUSED }),
      set(165, 3, { rpe: 7.5, tempo: PAUSED }),
      set(165, 3, { rpe: 8, tempo: PAUSED }),
    ]),
    log(INCLINE_DB_PRESS, [
      set(45, 8, { rpe: 7, tempo: CONTROLLED }),
      set(45, 8, { rpe: 8, tempo: CONTROLLED }),
      set(45, 8, { rpe: 8, tempo: CONTROLLED }),
    ]),
    log(LAT_PULLDOWN, [
      set(120, 10, { rpe: 7, tempo: CONTROLLED }),
      set(120, 10, { rpe: 8, tempo: CONTROLLED }),
      set(120, 10, { rpe: 8, tempo: CONTROLLED }),
    ]),
  ]),

  // ── Week 2 ────────────────────────────────────────────────────────────────
  workout(new Date("2026-01-12"), [
    log(BACK_SQUAT, [
      set(190, 5, { rpe: 7.5, tempo: EXPLOSIVE }),
      set(190, 5, { rpe: 8, tempo: EXPLOSIVE }),
      set(190, 5, { rpe: 8.5, tempo: EXPLOSIVE }),
    ]),
    log(BENCH_PRESS, [
      set(140, 5, { rpe: 7 }),
      set(140, 5, { rpe: 8 }),
      set(140, 5, { rpe: 9 }),
    ]),
    log(BARBELL_ROW, [
      set(100, 8, { rpe: 7, tempo: CONTROLLED }),
      set(100, 8, { rpe: 8, tempo: CONTROLLED }),
      set(100, 8, { rpe: 8.5, tempo: CONTROLLED }),
    ]),
  ]),

  // Overhead Press starts missing reps here — the stall storyline.
  workout(new Date("2026-01-14"), [
    log(DEADLIFT, [
      set(235, 5, { rpe: 7, tempo: CONTROLLED }),
      set(235, 5, { rpe: 8.5, tempo: CONTROLLED }),
      set(235, 5, { rpe: 9.5, tempo: CONTROLLED, partials: 2 }),
    ]),
    log(OVERHEAD_PRESS, [
      set(90, 5, { rpe: 9 }),
      set(90, 4, { rpe: 9.5 }),
      set(90, 3, { rpe: 10 }),
    ]),
    log(LATERAL_RAISE, [
      set(15, 15, { rir: 3, tempo: SLOW_GRIND }),
      set(15, 15, { rir: 2, tempo: SLOW_GRIND }),
      set(15, 15, { rir: 1, tempo: SLOW_GRIND, partials: 6 }),
    ]),
  ]),

  workout(new Date("2026-01-16"), [
    log(PAUSED_SQUAT, [
      set(175, 3, { rpe: 7, tempo: PAUSED }),
      set(175, 3, { rpe: 8, tempo: PAUSED }),
      set(175, 3, { rpe: 8.5, tempo: PAUSED }),
    ]),
    log(INCLINE_DB_PRESS, [
      set(50, 8, { rpe: 8, tempo: CONTROLLED }),
      set(50, 8, { rpe: 8.5, tempo: CONTROLLED }),
      set(50, 8, { rpe: 9, tempo: CONTROLLED }),
    ]),
    log(LAT_PULLDOWN, [
      set(130, 10, { rpe: 7, tempo: CONTROLLED }),
      set(130, 10, { rpe: 8, tempo: CONTROLLED }),
      set(130, 10, { rpe: 8.5, tempo: CONTROLLED }),
    ]),
  ]),

  // ── Week 3 ────────────────────────────────────────────────────────────────
  workout(new Date("2026-01-19"), [
    log(BACK_SQUAT, [
      set(195, 5, { rpe: 8, tempo: EXPLOSIVE }),
      set(195, 5, { rpe: 8.5, tempo: EXPLOSIVE }),
      set(195, 5, { rpe: 9, tempo: EXPLOSIVE }),
    ]),
    log(BENCH_PRESS, [
      set(145, 5, { rpe: 8 }),
      set(145, 5, { rpe: 8.5 }),
      set(145, 5, { rpe: 9 }),
    ]),
    log(BARBELL_ROW, [
      set(105, 8, { rpe: 8, tempo: CONTROLLED }),
      set(105, 8, { rpe: 8.5, tempo: CONTROLLED }),
      set(105, 8, { rpe: 9, tempo: CONTROLLED }),
    ]),
  ]),

  // Second straight Overhead Press miss — a candidate for the deload.
  workout(new Date("2026-01-21"), [
    log(DEADLIFT, [
      set(245, 5, { rpe: 8, tempo: CONTROLLED }),
      set(245, 5, { rpe: 9, tempo: CONTROLLED }),
      set(245, 4, { rpe: 9.5, tempo: CONTROLLED, partials: 3 }),
    ]),
    log(OVERHEAD_PRESS, [
      set(90, 5, { rpe: 9.5 }),
      set(90, 4, { rpe: 10 }),
      set(90, 4, { rpe: 10 }),
    ]),
    log(LATERAL_RAISE, [
      set(20, 12, { rpe: 8, tempo: SLOW_GRIND }),
      set(20, 12, { rpe: 9, tempo: SLOW_GRIND }),
      set(20, 12, { rpe: 9.5, tempo: SLOW_GRIND, partials: 6 }),
    ]),
  ]),

  workout(new Date("2026-01-23"), [
    log(PAUSED_SQUAT, [
      set(185, 3, { rpe: 7.5, tempo: PAUSED }),
      set(185, 3, { rpe: 8, tempo: PAUSED }),
      set(185, 3, { rpe: 8.5, tempo: PAUSED }),
    ]),
    log(INCLINE_DB_PRESS, [
      set(55, 8, { rpe: 8, tempo: CONTROLLED }),
      set(55, 8, { rpe: 8.5, tempo: CONTROLLED }),
      set(55, 8, { rpe: 9, tempo: CONTROLLED }),
    ]),
    log(LAT_PULLDOWN, [
      set(140, 10, { rpe: 8, tempo: CONTROLLED }),
      set(140, 10, { rpe: 8.5, tempo: CONTROLLED }),
      set(140, 10, { rpe: 9, tempo: CONTROLLED }),
    ]),
  ]),

  // ── Week 4 ────────────────────────────────────────────────────────────────
  workout(new Date("2026-01-26"), [
    log(BACK_SQUAT, [
      set(200, 5, { rpe: 8, tempo: EXPLOSIVE }),
      set(200, 5, { rpe: 9, tempo: EXPLOSIVE }),
      set(200, 5, { rpe: 9.5, tempo: EXPLOSIVE }),
    ]),
    log(BENCH_PRESS, [
      set(150, 5, { rpe: 8.5 }),
      set(150, 5, { rpe: 9 }),
      set(150, 5, { rpe: 9.5 }),
    ]),
    log(BARBELL_ROW, [
      set(110, 8, { rpe: 8, tempo: CONTROLLED }),
      set(110, 8, { rpe: 9, tempo: CONTROLLED }),
      set(110, 8, { rpe: 9.5, tempo: CONTROLLED }),
    ]),
  ]),

  // Overhead Press resets to 85 after the stall — a hand-applied deload.
  workout(new Date("2026-01-28"), [
    log(DEADLIFT, [
      set(255, 5, { rpe: 8.5, tempo: CONTROLLED }),
      set(255, 5, { rpe: 9, tempo: CONTROLLED }),
      set(255, 5, { rpe: 9.5, tempo: CONTROLLED, partials: 2 }),
    ]),
    log(OVERHEAD_PRESS, [
      set(85, 5, { rir: 2 }),
      set(85, 5, { rir: 1 }),
      set(85, 5, { rir: 0 }),
    ]),
    log(LATERAL_RAISE, [
      set(20, 15, { rir: 2, tempo: SLOW_GRIND }),
      set(20, 15, { rir: 1, tempo: SLOW_GRIND }),
      set(20, 15, { rir: 0, tempo: SLOW_GRIND, partials: 8 }),
    ]),
  ]),

  // Front Squat shows up for the first time here (single-session movement).
  workout(new Date("2026-01-30"), [
    log(PAUSED_SQUAT, [
      set(195, 3, { rpe: 8, tempo: PAUSED }),
      set(195, 3, { rpe: 8.5, tempo: PAUSED }),
      set(195, 3, { rpe: 9, tempo: PAUSED }),
    ]),
    log(INCLINE_DB_PRESS, [
      set(60, 8, { rpe: 8.5, tempo: CONTROLLED }),
      set(60, 8, { rpe: 9, tempo: CONTROLLED }),
      set(60, 7, { rpe: 9.5, tempo: CONTROLLED }),
    ]),
    log(LAT_PULLDOWN, [
      set(150, 10, { rpe: 8.5, tempo: CONTROLLED }),
      set(150, 10, { rpe: 9, tempo: CONTROLLED }),
      set(150, 10, { rpe: 9.5, tempo: CONTROLLED }),
    ]),
    log(FRONT_SQUAT, [
      set(135, 5, { rpe: 7, tempo: CONTROLLED }),
      set(135, 5, { rpe: 8, tempo: CONTROLLED }),
      set(135, 5, { rpe: 8, tempo: CONTROLLED }),
    ]),
  ]),
]

// ── Generation harness ──────────────────────────────────────────────────────
// Point a strategy at the history and ask it what to prescribe for each
// exercise. As more strategies land, add them here and compare their output.

const strategy: ProgressionStrategy = new LinearProgression({
  targetSets: 3,
  targetReps: 5,
  startingWeight: 100,
  increment: 5,
  consecutiveFailsForDeload: 3,
  deloadFactor: 0.9,
  roundingWeight: 5,
})

const exercises = [
  BACK_SQUAT,       // steady linear progress
  BENCH_PRESS,      // rpe-driven progress
  DEADLIFT,         // partials in the mix
  OVERHEAD_PRESS,   // stalled + deloaded
  BARBELL_ROW,      // tempo work, higher reps
  PAUSED_SQUAT,     // paused tempo
  LATERAL_RAISE,    // isolation, partials
  FRONT_SQUAT,      // logged a single time
  LEG_PRESS,        // never logged
]

const loggedExercises = new Set(history.flatMap((w) => w.logs.map((l) => l.exercise)))
const dates = history.map((w) => w.date).sort((a, b) => a.getTime() - b.getTime())

console.log("Synthetic history")
console.log(`  workouts: ${history.length}`)
console.log(`  exercises logged: ${loggedExercises.size} (${[...loggedExercises].join(", ")})`)
console.log(`  range: ${dates.at(0)?.toISOString().slice(0, 10)} -> ${dates.at(-1)?.toISOString().slice(0, 10)}`)
console.log(`  total sets: ${history.reduce((n, w) => n + w.logs.reduce((m, l) => m + l.sets.length, 0), 0)}`)

console.log("Linear Progression Strategy: ")
for (const exercise of exercises) {
  console.log(`\n${exercise} ->`)
  console.table(strategy.next(history, exercise))
}
