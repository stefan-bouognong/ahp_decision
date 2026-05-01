/**
 * format.js — Display and formatting helpers.
 * Pure functions. No side effects.
 */

/**
 * Format a decimal as a percentage string.
 * @param {number} value — decimal between 0 and 1
 * @param {number} decimals
 * @returns {string}  e.g. "34.56%"
 */
export function toPercent(value, decimals = 2) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a Consistency Ratio for display.
 * @param {number} cr
 * @returns {string}  e.g. "CR = 8.3%"
 */
export function formatCR(cr) {
  return `CR = ${(cr * 100).toFixed(1)}%`;
}

/**
 * Format a matrix cell value for display on the slider label.
 * Values < 1 are shown as fractions (1/2, 1/3 …); values ≥ 1 as integers.
 *
 * @param {number|null} value
 * @returns {string}
 */
export function formatComparisonValue(value) {
  if (value === null || value === undefined) return "—";
  if (Math.abs(value - 1) < 0.001) return "1 (equal)";
  if (value > 1) {
    const rounded = Math.round(value);
    return `${rounded}`;
  }
  const rounded = Math.round(1 / value);
  return `1/${rounded}`;
}

/**
 * Convert a slider integer step (−8 to +8) to an AHP comparison value.
 * Steps map logarithmically to the 1/9 … 1 … 9 scale.
 *
 * @param {number} step — integer from −8 to +8
 * @returns {number}
 */
export function sliderStepToValue(step) {
  const SCALE = [1 / 9, 1 / 8, 1 / 7, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 1 / 2, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const index = step + 8; // map −8…+8 → 0…16
  return SCALE[Math.max(0, Math.min(16, index))];
}

/**
 * Convert an AHP comparison value back to a slider step index.
 *
 * @param {number|null} value
 * @returns {number} — integer from −8 to +8
 */
export function valueToSliderStep(value) {
  if (value === null) return 0;
  if (Math.abs(value - 1) < 0.001) return 0;
  if (value > 1) return Math.round(Math.log2(value));
  return -Math.round(Math.log2(1 / value));
}

/**
 * Generate a human-readable preference label for a comparison value.
 *
 * @param {number|null} value
 * @param {string} leftLabel — name of the left-side item
 * @param {string} rightLabel — name of the right-side item
 * @returns {string}
 */
export function preferenceLabel(value, leftLabel, rightLabel) {
  if (value === null) return "Not set";
  if (Math.abs(value - 1) < 0.001) return "Equally important";
  const LABELS = {
    2: "weakly",
    3: "moderately",
    4: "moderately–strongly",
    5: "strongly",
    6: "very strongly",
    7: "very strongly",
    8: "extremely",
    9: "extremely",
  };
  if (value > 1) {
    const rounded = Math.min(9, Math.round(value));
    return `${leftLabel} is ${LABELS[rounded] || ""} preferred`;
  }
  const rounded = Math.min(9, Math.round(1 / value));
  return `${rightLabel} is ${LABELS[rounded] || ""} preferred`;
}

/**
 * Clamp a number between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}
