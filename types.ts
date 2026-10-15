
export enum Cadence {
  // This is not all, find out all the values I want
  Explosive = "EXPLOSIVE",
  Normal = "NORMAL",
  Pace_1_Second = "1_SECOND",
  Pace_2_Second = "2_SECOND",
  Pace_3_Second = "3_SECOND",
  Pace_4_Second = "4_SECOND",
}

export type Tempo = {
  // Squeeze and Stretch might not be the best way to explain the top and bottom of a lift. Think about this more.
  eccentric: Cadence,
  squeeze: Cadence,
  concentric: Cadence,
  stretch: Cadence
}

export type SetResult = { weight: number; reps: number; rpe?: number; rir?: number; tempo?: Tempo }
export type ExerciseLog = { exercise: string; sets: SetResult[] }
export type Workout = { date: Date; logs: ExerciseLog[] }

export type PrescribedSet = {
  weight: number,
  reps: number,
  targetRPE?: number,
  amrap?: boolean,
  targetRIR?: number
}

export interface ProgressionStrategy {
  next(history: Workout[], exercise: string): SetResult[] 
}
