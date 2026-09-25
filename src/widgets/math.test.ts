import { describe, expect, it } from 'vitest';
import { withTemperature, accuracyAt, neuronFires, simulatedAccuracy, sample } from './math';

describe('temperature', () => {
  const base = [0.5, 0.3, 0.2];
  it('T=1 leaves probabilities unchanged', () => {
    withTemperature(base, 1).forEach((p, i) => expect(p).toBeCloseTo(base[i]));
  });
  it('low T sharpens toward the top choice, high T flattens', () => {
    expect(withTemperature(base, 0.2)[0]).toBeGreaterThan(0.9);
    const hot = withTemperature(base, 3);
    expect(hot[0] - hot[2]).toBeLessThan(base[0] - base[2]);
  });
  it('always sums to 1', () => {
    for (const t of [0.1, 0.7, 1.5, 2]) expect(withTemperature(base, t).reduce((a, b) => a + b)).toBeCloseTo(1);
  });
  it('sample picks by cumulative probability', () => {
    expect(sample([0.2, 0.5, 0.3], 0.1)).toBe(0);
    expect(sample([0.2, 0.5, 0.3], 0.5)).toBe(1);
    expect(sample([0.2, 0.5, 0.3], 0.99)).toBe(2);
  });
});

describe('threshold classifier', () => {
  const pts = [
    { x: 1, cls: 'a' as const },
    { x: 3, cls: 'a' as const },
    { x: 5, cls: 'b' as const },
    { x: 7, cls: 'b' as const },
  ];
  it('counts points on the correct side (a below, b at/above)', () => {
    expect(accuracyAt(pts, 4)).toBe(4);
    expect(accuracyAt(pts, 6)).toBe(3);
    expect(accuracyAt(pts, 0)).toBe(2);
  });
});

describe('neuron', () => {
  it('fires when weighted sum + bias > 0', () => {
    expect(neuronFires([1, 1], [1, 1], -1.5)).toBe(true);
    expect(neuronFires([1, 0], [1, 1], -1.5)).toBe(false);
  });
});

describe('bias simulation', () => {
  it('under-represented group accuracy rises as its share grows', () => {
    const low = simulatedAccuracy(5);
    const even = simulatedAccuracy(50);
    expect(low.b).toBeLessThan(low.a - 20);
    expect(Math.abs(even.a - even.b)).toBeLessThanOrEqual(2);
  });
});
