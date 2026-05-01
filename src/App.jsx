/**
 * App.jsx — Root component. Reads the current step from context
 * and renders the appropriate wizard step. Layout only — no business logic.
 */

import React from "react";
import { useAHP } from "./context/AHPContext";
import { STEP_GOAL, STEP_CRITERIA, STEP_ALTERNATIVES, STEP_COMPARISONS, STEP_RESULTS } from "./constants";
import { Header } from "./components/Header";
import { WizardProgress } from "./components/WizardProgress";
import { GoalStep } from "./components/steps/GoalStep";
import { CriteriaStep } from "./components/steps/CriteriaStep";
import { AlternativesStep } from "./components/steps/AlternativesStep";
import { ComparisonsStep } from "./components/steps/ComparisonsStep";
import { ResultsStep } from "./components/steps/ResultsStep";

const STEP_COMPONENTS = {
  [STEP_GOAL]:         <GoalStep />,
  [STEP_CRITERIA]:     <CriteriaStep />,
  [STEP_ALTERNATIVES]: <AlternativesStep />,
  [STEP_COMPARISONS]:  <ComparisonsStep />,
  [STEP_RESULTS]:      <ResultsStep />,
};

export default function App() {
  const { currentStep } = useAHP();

  return (
    <div className="app-layout">
      <Header />

      <main>
        <div className="page-container">
          <WizardProgress />

          <div className="card-raised">
            {STEP_COMPONENTS[currentStep] ?? (
              <p style={{ color: "var(--text-muted)" }}>Unknown step.</p>
            )}
          </div>
        </div>
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          fontSize: 12,
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border)",
        }}
      >
        AHP Decision Maker — based on Saaty's Analytic Hierarchy Process
      </footer>
    </div>
  );
}
