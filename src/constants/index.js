/**
 * constants/index.js — App-wide constants and configuration.
 */

/** Wizard step definitions */
export const STEPS = [
  { id: "goal",         label: "Goal",         description: "Define your decision objective" },
  { id: "criteria",     label: "Criteria",     description: "Add evaluation criteria" },
  { id: "alternatives", label: "Alternatives", description: "List the options to compare" },
  { id: "comparisons",  label: "Comparisons",  description: "Fill pairwise comparison matrices" },
  { id: "results",      label: "Results",      description: "View recommendation" },
];

export const STEP_GOAL         = 0;
export const STEP_CRITERIA     = 1;
export const STEP_ALTERNATIVES = 2;
export const STEP_COMPARISONS  = 3;
export const STEP_RESULTS      = 4;

/** AHP constraints */
export const MIN_CRITERIA     = 2;
export const MAX_CRITERIA     = 9;
export const MIN_ALTERNATIVES = 2;
export const MAX_ALTERNATIVES = 9;

/** Consistency threshold */
export const CR_THRESHOLD = 0.10;

/** Color palette for charts and bars */
export const PALETTE = [
  "#1d4ed8", // blue-700
  "#0f766e", // teal-700
  "#b45309", // amber-700
  "#9333ea", // purple-600
  "#dc2626", // red-600
  "#059669", // emerald-600
  "#db2777", // pink-600
  "#7c3aed", // violet-600
  "#0369a1", // sky-700
];
