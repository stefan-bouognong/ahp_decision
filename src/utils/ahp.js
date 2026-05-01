/**
 * ahp.js — Core Analytic Hierarchy Process computation engine
 * All functions are pure (no side effects, no UI coupling).
 */

/**
 * Saaty's Random Consistency Index table.
 * Keys are matrix sizes (n), values are the RI for that size.
 */
export const RANDOM_INDEX = {
  1: 0.00,
  2: 0.00,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

/**
 * Saaty's 1–9 scale labels.
 */
export const SCALE_LABELS = {
  1: "Equal importance",
  2: "Weak",
  3: "Moderate importance",
  4: "Moderate+",
  5: "Strong importance",
  6: "Strong+",
  7: "Very strong importance",
  8: "Very+",
  9: "Extreme importance",
};

/**
 * Build a fresh n×n identity-like matrix filled with null off-diagonal.
 * Diagonal is always 1 (an item is equally important to itself).
 *
 * @param {number} n — matrix dimension
 * @returns {(number|null)[][]}
 */
export function buildEmptyMatrix(n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : null))
  );
}

/**
 * Check whether every cell in a matrix has been filled (no nulls).
 *
 * @param {(number|null)[][]} matrix
 * @returns {boolean}
 */
export function isMatrixComplete(matrix) {
  return matrix.every((row) => row.every((v) => v !== null));
}

/**
 * Set a value in the comparison matrix and automatically fill in
 * the reciprocal position. Returns a new matrix (immutable update).
 *
 * @param {(number|null)[][]} matrix
 * @param {number} i — row index
 * @param {number} j — column index
 * @param {number} value — comparison value (1–9 or their reciprocals)
 * @returns {(number|null)[][]}
 */
export function setMatrixValue(matrix, i, j, value) {
  const next = matrix.map((row) => [...row]);
  next[i][j] = value;
  next[j][i] = 1 / value;
  return next;
}

/**
 * Normalize a pairwise comparison matrix column-wise and derive
 * priority weights as row averages of the normalized matrix.
 *
 * @param {number[][]} matrix — fully filled n×n matrix
 * @returns {number[]} — priority weights summing to 1
 */
export function computePriorityWeights(matrix) {
  const n = matrix.length;

  // Sum each column
  const colSums = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      colSums[j] += matrix[i][j];
    }
  }

  // Normalize each element by its column sum
  const normalized = matrix.map((row, i) =>
    row.map((val, j) => val / colSums[j])
  );

  // Row averages become the weights
  return normalized.map(
    (row) => row.reduce((sum, v) => sum + v, 0) / n
  );
}

/**
 * Compute the principal eigenvalue (λ_max) for consistency checking.
 *
 * @param {number[][]} matrix — fully filled n×n matrix
 * @param {number[]} weights — priority weights from computePriorityWeights
 * @returns {number}
 */
export function computeLambdaMax(matrix, weights) {
  const n = matrix.length;
  let lambdaMax = 0;
  for (let j = 0; j < n; j++) {
    let colSum = 0;
    for (let i = 0; i < n; i++) colSum += matrix[i][j];
    lambdaMax += colSum * weights[j];
  }
  return lambdaMax;
}

/**
 * Compute the Consistency Index (CI).
 * CI = (λ_max − n) / (n − 1)
 *
 * @param {number} lambdaMax
 * @param {number} n — matrix size
 * @returns {number}
 */
export function computeConsistencyIndex(lambdaMax, n) {
  if (n <= 1) return 0;
  return (lambdaMax - n) / (n - 1);
}

/**
 * Compute the Consistency Ratio (CR).
 * CR = CI / RI  —  acceptable when CR < 0.10 (10 %)
 *
 * @param {number} ci — Consistency Index
 * @param {number} n — matrix size
 * @returns {number}
 */
export function computeConsistencyRatio(ci, n) {
  const ri = RANDOM_INDEX[n] ?? 1.49;
  if (ri === 0) return 0; // n ≤ 2 is always consistent
  return ci / ri;
}

/**
 * Full consistency analysis for a single pairwise matrix.
 *
 * @param {number[][]} matrix — fully filled n×n matrix
 * @returns {{ weights, lambdaMax, ci, cr, isConsistent }}
 */
export function analyzeMatrix(matrix) {
  const n = matrix.length;
  const weights = computePriorityWeights(matrix);
  const lambdaMax = computeLambdaMax(matrix, weights);
  const ci = computeConsistencyIndex(lambdaMax, n);
  const cr = computeConsistencyRatio(ci, n);
  return {
    weights,
    lambdaMax,
    ci,
    cr,
    isConsistent: cr < 0.10,
  };
}

/**
 * Run the full AHP analysis across criteria and alternatives.
 *
 * @param {object} params
 * @param {string[]} params.criteriaNames
 * @param {string[]} params.alternativeNames
 * @param {number[][]} params.criteriaMatrix — criteria pairwise matrix
 * @param {number[][][]} params.altMatrices — one matrix per criterion
 * @returns {object} Full result object
 */
export function runAHP({ criteriaNames, alternativeNames, criteriaMatrix, altMatrices }) {
  // 1. Analyze criteria matrix
  const criteriaAnalysis = analyzeMatrix(criteriaMatrix);

  // 2. Analyze each alternative matrix (one per criterion)
  const altAnalyses = altMatrices.map((m) => analyzeMatrix(m));

  // 3. Compute final weighted scores for each alternative
  const nAlts = alternativeNames.length;
  const scores = Array(nAlts).fill(0);
  for (let ai = 0; ai < nAlts; ai++) {
    for (let ci = 0; ci < criteriaNames.length; ci++) {
      scores[ai] += criteriaAnalysis.weights[ci] * altAnalyses[ci].weights[ai];
    }
  }

  // 4. Rank alternatives by score
  const ranked = alternativeNames
    .map((name, i) => ({ name, score: scores[i], index: i }))
    .sort((a, b) => b.score - a.score);

  // 5. Overall consistency
  const allConsistent =
    criteriaAnalysis.isConsistent && altAnalyses.every((a) => a.isConsistent);

  // 6. Collect inconsistency details for user feedback
  const inconsistencies = [];
  if (!criteriaAnalysis.isConsistent) {
    inconsistencies.push({
      label: "Criteria importance matrix",
      cr: criteriaAnalysis.cr,
      ci: criteriaAnalysis.ci,
      n: criteriaNames.length,
      tip: "Your criteria preferences form a contradictory cycle (e.g. A > B > C but C > A). Revisit and align them.",
    });
  }
  altAnalyses.forEach((a, ci) => {
    if (!a.isConsistent) {
      inconsistencies.push({
        label: `Alternatives vs "${criteriaNames[ci]}"`,
        cr: a.cr,
        ci: a.ci,
        n: alternativeNames.length,
        tip: `Your alternative preferences for criterion "${criteriaNames[ci]}" are cyclically contradictory. Revise this matrix.`,
      });
    }
  });

  return {
    criteriaAnalysis,
    altAnalyses,
    scores,
    ranked,
    allConsistent,
    inconsistencies,
    bestAlternative: ranked[0],
  };
}
