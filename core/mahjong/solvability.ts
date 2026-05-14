// ============================================
// Mahjoom — Seeded PRNG (Pseudo-Random Number Generator)
// Deterministic random for reproducible boards
// ============================================

/**
 * Simple seeded PRNG using mulberry32 algorithm.
 * Generates deterministic random numbers from a seed.
 */
export class SeededRandom {
  private state: number;

  constructor(seed: string | number) {
    this.state = typeof seed === 'string' ? this.hashString(seed) : seed;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }
    return Math.abs(hash) || 1;
  }

  /** Generate a random float [0, 1) */
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Generate a random integer in [min, max] inclusive */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Shuffle an array in place using Fisher-Yates */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /** Pick a random element from an array */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

/**
 * Generate a daily seed from a date string.
 * Same date always produces the same seed.
 */
export function getDailySeed(date?: Date): string {
  const d = date || new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return `mahjoom-daily-${dateStr}`;
}
