/**
 * A tiny naive Bayes text classifier, the same basic idea early spam
 * filters used. It runs entirely in the browser on the labels the student chose.
 */
const STOP = new Set(['the', 'and', 'you', 'your', 'can', 'for', 'are', 'from', 'with', 'has', 'have', 'this', 'that', 'here', 'now', 'at', 'to', 'me', 'my', 'is', 'it', 'of', 'on', 'in', 'a', 'an', 'i']);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]+/g) ?? []).filter((w) => w.length > 2 && !STOP.has(w));
}

export interface SpamModel {
  logPrior: number; // log P(spam) - log P(ham)
  weights: Map<string, number>; // log P(w|spam) - log P(w|ham)
  topSpam: string[];
  topHam: string[];
  trainedOn: number;
}

export function trainModel(examples: { text: string; spam: boolean }[]): SpamModel {
  const spamCounts = new Map<string, number>();
  const hamCounts = new Map<string, number>();
  let spamDocs = 0;
  let hamDocs = 0;
  let spamTotal = 0;
  let hamTotal = 0;
  for (const ex of examples) {
    const words = tokenize(ex.text);
    const target = ex.spam ? spamCounts : hamCounts;
    if (ex.spam) {
      spamDocs++;
      spamTotal += words.length;
    } else {
      hamDocs++;
      hamTotal += words.length;
    }
    for (const w of words) target.set(w, (target.get(w) ?? 0) + 1);
  }
  const vocab = new Set([...spamCounts.keys(), ...hamCounts.keys()]);
  const V = vocab.size || 1;
  const weights = new Map<string, number>();
  for (const w of vocab) {
    const ps = ((spamCounts.get(w) ?? 0) + 1) / (spamTotal + V);
    const ph = ((hamCounts.get(w) ?? 0) + 1) / (hamTotal + V);
    weights.set(w, Math.log(ps) - Math.log(ph));
  }
  const sorted = [...weights.entries()].sort((a, b) => b[1] - a[1]);
  return {
    logPrior: Math.log((spamDocs + 1) / (hamDocs + 1)),
    weights,
    topSpam: sorted.filter(([, v]) => v > 0).slice(0, 5).map(([w]) => w),
    topHam: sorted.filter(([, v]) => v < 0).reverse().slice(0, 5).map(([w]) => w),
    trainedOn: examples.length,
  };
}

export function predict(model: SpamModel, text: string): { spam: boolean; confidence: number } {
  let score = model.logPrior;
  for (const w of tokenize(text)) score += model.weights.get(w) ?? 0;
  const p = 1 / (1 + Math.exp(-score));
  return { spam: p >= 0.5, confidence: p >= 0.5 ? p : 1 - p };
}
