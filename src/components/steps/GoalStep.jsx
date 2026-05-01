/**
 * steps/GoalStep.jsx — Wizard step 1: Define the decision goal.
 */

import React from "react";
import { useAHP } from "../../context/AHPContext";
import { useWizardNavigation } from "../../hooks/useWizardNavigation";
import { validateGoal } from "../../utils/validation";
import { StepHeader, Alert } from "../ui";

export function GoalStep() {
  const { goal, setGoal } = useAHP();
  const { goNext } = useWizardNavigation();

  const { valid, error } = validateGoal(goal);

  const examples = [
    "Choose the best software framework for our project",
    "Select the most suitable vendor for procurement",
    "Decide which city to open our next office in",
    "Pick the best candidate for a management position",
  ];

  return (
    <div>
      <StepHeader
        number={1}
        title="Define your decision goal"
        subtitle="Describe the decision you need to make. Be specific — this frames all the comparisons that follow."
      />

      <div style={{ marginBottom: "1.5rem" }}>
        <label
          htmlFor="goal-input"
          style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}
        >
          Decision goal
        </label>
        <textarea
          id="goal-input"
          className="input"
          rows={3}
          placeholder="e.g. Choose the best programming language for our web application..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{ resize: "vertical", lineHeight: 1.6 }}
        />
        {goal.length > 0 && !valid && (
          <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 4 }}>{error}</p>
        )}
      </div>

      <Alert type="info" icon="💡" style={{ marginBottom: "1.5rem" }}>
        <strong style={{ display: "block", marginBottom: 4 }}>What is AHP?</strong>
        The Analytic Hierarchy Process (AHP) is a structured decision-making method developed by Thomas Saaty.
        It breaks a complex decision into pairwise comparisons, computes priority weights, and recommends
        the best alternative while verifying the logical consistency of your judgements.
      </Alert>

      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          Example goals:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {examples.map((ex) => (
            <button
              key={ex}
              className="btn btn-ghost btn-sm"
              onClick={() => setGoal(ex)}
              style={{ fontSize: 12, textAlign: "left" }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary" onClick={goNext} disabled={!valid}>
          Next: Define criteria →
        </button>
      </div>
    </div>
  );
}
