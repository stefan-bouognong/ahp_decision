# AHP Decision Maker

A production-grade React web application implementing the **Analytic Hierarchy Process (AHP)** — a structured mathematical method for multi-criteria decision analysis, developed by Thomas Saaty.

## Live Demo

> Deploy via GitHub Pages or Vercel — see [Deployment](#deployment) below.

---

## What is AHP?

The **Analytic Hierarchy Process** helps you make complex decisions involving multiple criteria and alternatives by:

1. Breaking the decision into a hierarchy: **Goal → Criteria → Alternatives**
2. Comparing each pair of criteria to derive their relative weights
3. Comparing each pair of alternatives for every criterion
4. Computing a weighted priority score for each alternative
5. **Verifying the logical consistency** of your judgements (Consistency Ratio < 10%)

---

## Features

- **5-step guided wizard** — Goal → Criteria → Alternatives → Comparisons → Results
- **Interactive pairwise comparison sliders** using Saaty's 1–9 scale
- **Automatic reciprocal filling** — setting A vs B automatically sets B vs A
- **Consistency check** — computes CI, CR, and λ_max for every matrix
- **Detailed inconsistency explanations** — tells you exactly which matrix is inconsistent and why
- **Weighted score table** — shows each alternative's score per criterion
- **Best alternative recommendation** (only shown when all matrices are consistent)
- Dark-themed, responsive UI

---

## Project Structure

```
src/
├── constants/
│   └── index.js          # App-wide constants (steps, limits, palette)
│
├── context/
│   └── AHPContext.jsx    # Global state (useReducer) + actions
│
├── hooks/
│   ├── useAHPCompute.js  # Triggers AHP computation, writes result to context
│   └── useWizardNavigation.js  # Step navigation helpers
│
├── utils/
│   ├── ahp.js            # Pure AHP math: weights, λ_max, CI, CR, full analysis
│   ├── format.js         # Display helpers: toPercent, formatCR, slider ↔ value
│   └── validation.js     # Input validation: goal, criteria, alternatives
│
├── components/
│   ├── ui/
│   │   └── index.jsx     # Shared primitives: Alert, Badge, ProgressBar, etc.
│   ├── steps/
│   │   ├── GoalStep.jsx         # Step 1: Define goal
│   │   ├── CriteriaStep.jsx     # Step 2: Add criteria
│   │   ├── AlternativesStep.jsx # Step 3: Add alternatives
│   │   ├── ComparisonsStep.jsx  # Step 4: Fill matrices
│   │   └── ResultsStep.jsx      # Step 5: View results
│   ├── ComparisonSlider.jsx  # Single pairwise slider row
│   ├── PairwiseMatrix.jsx    # All pairs for one matrix
│   ├── WizardProgress.jsx    # Top step indicator
│   └── Header.jsx            # App header
│
├── styles/
│   └── index.css         # Design tokens + global styles
│
├── App.jsx               # Root layout component
└── index.jsx             # Entry point + Provider wrapper
```

**Separation of concerns:**
- `utils/ahp.js` — pure math, zero React
- `context/AHPContext.jsx` — state management, zero UI
- `hooks/` — business logic bridges
- `components/` — UI only, call hooks/context

---

## How to Use

### Step 1 — Goal
Enter the decision you need to make (e.g. "Choose the best cloud provider for our startup").

### Step 2 — Criteria
Add 2–9 evaluation criteria (e.g. Cost, Performance, Support). Use the quick-add suggestions or type your own.

### Step 3 — Alternatives
Add 2–9 options you want to compare (e.g. AWS, Azure, GCP).

### Step 4 — Pairwise Comparisons
Two sets of matrices appear:

- **Criteria matrix** — How important is each criterion relative to each other?
- **Alternative matrices** — For each criterion, how does each alternative compare?

Use the sliders:
- Center (1) = equally important
- Right (3, 5, 7, 9) = left item is moderately / strongly / very strongly / extremely preferred
- Left (1/3, 1/5 …) = right item is preferred

### Step 5 — Results
- **Green banner** → all matrices consistent → recommendation is reliable
- **Red banner** → inconsistency detected → explanation provided per matrix
- Score breakdown table shows contribution of each criterion per alternative
- The best alternative is highlighted with its final weighted score

---

## Consistency Check Explained

After computing priority weights, the app calculates:

| Metric | Formula | Meaning |
|--------|---------|---------|
| λ_max | Weighted column sum average | Principal eigenvalue |
| CI | (λ_max − n) / (n − 1) | Consistency Index |
| CR | CI / RI | Consistency Ratio |

**CR < 0.10 (10%)** → matrix is consistent ✓  
**CR ≥ 0.10** → matrix is inconsistent ✗ — revisit your comparisons

Random Index (RI) values used (Saaty):

| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| RI | 0 | 0 | 0.58 | 0.90 | 1.12 | 1.24 | 1.32 | 1.41 | 1.45 |

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ahp-decision-maker.git
cd ahp-decision-maker

# Install dependencies
npm install

# Start the development server
npm start
# → Opens at http://localhost:3000
```

## Deployment

### GitHub Pages

```bash
# Install gh-pages helper
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"
# And add: "homepage": "https://YOUR_USERNAME.github.io/ahp-decision-maker"

npm run deploy
```

### Vercel (recommended — zero config)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the /build folder to netlify.com/drop
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| State | useReducer + Context API |
| Styling | Plain CSS with custom properties |
| Math | Pure JS (no external AHP library) |
| Fonts | DM Serif Display + DM Sans (Google Fonts) |
| Build | Create React App |

---

## References

- Saaty, T.L. (1980). *The Analytic Hierarchy Process*. McGraw-Hill.
- Saaty, T.L. (1990). "How to make a decision: The Analytic Hierarchy Process." *European Journal of Operational Research*, 48(1), 9–26.
# ahp_decision
