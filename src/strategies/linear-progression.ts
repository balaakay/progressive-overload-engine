
import type { ExerciseLog, ProgressionStrategy, SetResult, Workout } from "@/types.js"

export type LinearConfig = {
  targetSets: number
  targetReps: number
  increment: number
  startingWeight: number
  consecutiveFailsForDeload: number
  deloadFactor?: number
  roundingWeight?: number
}


export class LinearProgression implements ProgressionStrategy {
  constructor(private readonly config: LinearConfig) {}

  getRoundingWeight() {
    return this.config.roundingWeight ?? 0
  }

  next(history: Workout[], exercise: string): SetResult[] {
    const { targetSets, targetReps, increment,
            startingWeight, consecutiveFailsForDeload,
      } = this.config

    let assignedWeight: number
    const recent = this.findRecentLogs(history, exercise, consecutiveFailsForDeload)
    
    // No history start them out on starting weight with target reps/sets
    if(!recent || recent.length === 0) {
      return Array.from({ length: targetSets }, () => ({
        weight: startingWeight,
        reps: targetReps,
      }))
    }

    // check for a deload
    const deload = this.checkFailure(recent, consecutiveFailsForDeload)
    if( deload !== undefined) {
      assignedWeight = deload
    } else {
      const last: ExerciseLog | undefined = recent.at(0)
      assignedWeight = last
        ? this.nextWeight(last, targetSets, targetReps, increment)
        : startingWeight
    }
    return Array.from({ length: targetSets }, () => ({
      weight: assignedWeight,
      reps: targetReps,
    }))
  }

  private findRecentLogs(
    history: Workout[],
    exercise: string,
    n: number
  ): ExerciseLog[] {
    let counter: number = 0
    const recentLogs: ExerciseLog[] = []
    for (let i = history.length - 1; i >= 0; i--) {
      if (counter >= n) return recentLogs
      const log = history[i]?.logs.find((l) => l.exercise === exercise)
      if (log) {
        recentLogs.push(log)
        counter++
      }
    }
    return recentLogs
  }

  private checkFailure(recentLogs: ExerciseLog[], failsForDeload: number): number | undefined {
    let counter: number = 0
    for(let i = 0; i < recentLogs.length - 1; i++) {
      if( recentLogs[i]?.sets.find((l) => l.reps < this.config.targetReps) ) {
        counter++
      }
      if(counter >= failsForDeload) {
        const weight = recentLogs[i]?.sets[0]?.weight
        const deloadFactor = this.config.deloadFactor ?? 0.9
        if (weight !== undefined) return weight * deloadFactor
      }
    }
    return undefined
  }

  private nextWeight(
    log: ExerciseLog,
    targetSets: number,
    targetReps: number,
    increment: number
  ): number {
    // TODO - is this what I want? It's null coalescing might not be right.
    const weight = log.sets[0]?.weight ?? 0
    const succeeded =
      log.sets.length >= targetSets &&
      log.sets.every((s) => s.reps >= targetReps)
    return succeeded ? weight + increment : weight
  }
}
