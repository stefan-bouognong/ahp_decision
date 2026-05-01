/**
 * validation.js — Input validation helpers for AHP form steps.
 * Pure functions, no side effects.
 */

/**
 * Validate a list of named items (criteria or alternatives).
 *
 * @param {Array<{name: string}>} items
 * @param {number} min — minimum count required
 * @param {number} max — maximum count allowed
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateNamedItems(items, min = 2, max = 9) {
  const errors = [];

  if (items.length < min) {
    errors.push(`At least ${min} items are required.`);
  }
  if (items.length > max) {
    errors.push(`No more than ${max} items are allowed.`);
  }

  const emptyCount = items.filter((it) => !it.name.trim()).length;
  if (emptyCount > 0) {
    errors.push(`${emptyCount} item(s) have empty names. Please fill them in.`);
  }

  const names = items.map((it) => it.name.trim().toLowerCase());
  const uniqueNames = new Set(names);
  if (uniqueNames.size !== names.length) {
    errors.push("All names must be unique.");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate that a goal string is non-empty.
 *
 * @param {string} goal
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateGoal(goal) {
  const trimmed = goal.trim();
  if (!trimmed) return { valid: false, error: "Please define a decision goal." };
  if (trimmed.length < 5) return { valid: false, error: "Goal is too short. Be more descriptive." };
  return { valid: true, error: null };
}

/**
 * Check that a matrix has no null values (all comparisons filled).
 *
 * @param {(number|null)[][]} matrix
 * @returns {boolean}
 */
export function isMatrixFilled(matrix) {
  return matrix.every((row) => row.every((v) => v !== null));
}

/**
 * Check that all alternative matrices across criteria are filled.
 *
 * @param {(number|null)[][][]} matrices — array of matrices, one per criterion
 * @returns {boolean}
 */
export function areAllAltMatricesFilled(matrices) {
  return matrices.every((m) => isMatrixFilled(m));
}
