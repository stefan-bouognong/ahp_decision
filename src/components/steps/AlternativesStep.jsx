/**
 * steps/AlternativesStep.jsx — Wizard step 3: Define alternatives.
 */

import React from "react";
import { useAHP } from "../../context/AHPContext";
import { useWizardNavigation } from "../../hooks/useWizardNavigation";
import { validateNamedItems } from "../../utils/validation";
import { MIN_ALTERNATIVES, MAX_ALTERNATIVES } from "../../constants";
import { StepHeader, Alert, SectionTitle } from "../ui";

export function AlternativesStep() {
  const { alternatives, addAlternative, removeAlternative, updateAlternative } = useAHP();
  const { goNext, goPrev } = useWizardNavigation();

  const { valid, errors } = validateNamedItems(alternatives, MIN_ALTERNATIVES, MAX_ALTERNATIVES);

  return (
    <div>
      <StepHeader
        number={3}
        title="Define alternatives"
        subtitle={`List ${MIN_ALTERNATIVES}–${MAX_ALTERNATIVES} options you want to compare. These are the choices you are deciding between.`}
      />

      <SectionTitle
        action={
          alternatives.length < MAX_ALTERNATIVES ? (
            <button className="btn btn-sm" onClick={addAlternative}>
              + Add alternative
            </button>
          ) : null
        }
      >
        Alternatives ({alternatives.length}/{MAX_ALTERNATIVES})
      </SectionTitle>

      <div style={{ marginBottom: "1rem" }}>
        {alternatives.map((a, i) => (
          <div
            key={a.id}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "0.625rem",
            }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--accent)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, flexShrink: 0,
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
            <input
              className="input"
              type="text"
              placeholder={`Alternative ${String.fromCharCode(65 + i)} — e.g. React, Option A, Vendor X…`}
              value={a.name}
              onChange={(e) => updateAlternative(i, e.target.value)}
            />
            {alternatives.length > MIN_ALTERNATIVES && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeAlternative(i)}
                title="Remove alternative"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <Alert type="warning" icon="⚠" style={{ marginBottom: "1rem" }}>
          {errors.map((e) => <div key={e}>{e}</div>)}
        </Alert>
      )}

      <Alert type="info" style={{ marginBottom: "1.5rem" }}>
        <strong>Tip:</strong> Use clear, distinct names for each option. You will compare every pair against
        each criterion, so 3–5 alternatives gives the best balance of thoroughness and effort.
      </Alert>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn" onClick={goPrev}>← Back</button>
        <button className="btn btn-primary" onClick={goNext} disabled={!valid}>
          Next: Pairwise comparisons →
        </button>
      </div>
    </div>
  );
}
