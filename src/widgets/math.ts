/** Re-weight a probability distribution by "temperature" (p^(1/T), renormalized). */
export function withTemperature(probs: number[], t: number): number[] {
  const T = Math.max(0.05, t);
  const w = probs.map((p) => Math.pow(Math.max(p, 1e-9), 1 / T));
  const sum = w.reduce((a, b) => a + b, 0);
  return w.map((x) => x / sum);
}

/** Pick an index given a uniform random number r in [0, 1). */
export function sample(probs: number[], r: number): number {
  let acc = 0;
  for (let i = 0; i < probs.length; i++) {
    acc += probs[i];
    if (r < acc) return i;
  }
  return probs.length - 1;
}

/** Rule: predict "a" if x < threshold, else "b". Returns number correct. */
export function accuracyAt(points: { x: number; cls: 'a' | 'b' }[], threshold: number): number {
  return points.filter((p) => (p.x < threshold ? 'a' : 'b') === p.cls).length;
}

export function neuronFires(inputs: number[], weights: number[], bias: number): boolean {
  return inputs.reduce((s, x, i) => s + x * weights[i], bias) > 0;
}

/**
 * Illustrative (simulated) face-recognition accuracy for two groups when group B
 * makes up `shareB` percent of the training photos. Models the documented pattern:
 * the under-represented group gets worse results.
 */
export function simulatedAccuracy(shareB: number): { a: number; b: number } {
  const s = Math.max(5, Math.min(50, shareB));
  const k = (s - 5) / 45; // 0 at 5%, 1 at 50%
  const a = Math.round(97 - 2 * k);
  const b = Math.round(64 + 31 * Math.sqrt(k));
  return { a, b };
}
