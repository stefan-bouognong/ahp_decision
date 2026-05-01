/**
 * steps/CriteriaStep.jsx — Wizard step 2: Define evaluation criteria.
 */

import React from "react";
import { useAHP } from "../../context/AHPContext";
import { useWizardNavigation } from "../../hooks/useWizardNavigation";
import { validateNamedItems } from "../../utils/validation";
import { MIN_CRITERIA, MAX_CRITERIA } from "../../constants";
import { StepHeader, Alert, SectionTitle } from "../ui";

export function CriteriaStep() {
  const { criteria, addCriterion, removeCriterion, updateCriterion } = useAHP();
  const { goNext, goPrev } = useWizardNavigation();

  const { valid, errors } = validateNamedItems(criteria, MIN_CRITERIA, MAX_CRITERIA);

  const suggestions = ["Cost", "Quality", "Performance", "Reliability", "Usability", "Scalability", "Security", "Support"];

  return (
    <div>
      <StepHeader
        number={2}
        title="Define evaluation criteria"
        subtitle={`Add ${MIN_CRITERIA}–${MAX_CRITERIA} criteria that matter for your decision. You will compare them pairwise next.`}
      />

      <SectionTitle
        action={
          criteria.length < MAX_CRITERIA ? (
            <button className="btn btn-sm" onClick={addCriterion}>
              + Add criterion
            </button>
          ) : null
        }
      >
        Criteria ({criteria.length}/{MAX_CRITERIA})
      </SectionTitle>

      <div style={{ marginBottom: "1rem" }}>
        {criteria.map((c, i) => (
          <div
            key={c.id}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "0.625rem",
            }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--bg-raised)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "var(--text-muted)", flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <input
              className="input"
              type="text"
              placeholder={`Criterion ${i + 1} — e.g. Cost, Performance…`}
              value={c.name}
              onChange={(e) => updateCriterion(i, e.target.value)}
            />
            {criteria.length > MIN_CRITERIA && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeCriterion(i)}
                title="Remove criterion"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Quick-add suggestions */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: "6px" }}>Quick add:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {suggestions
            .filter((s) => !criteria.some((c) => c.name.toLowerCase() === s.toLowerCase()))
            .map((s) => (
              <button
                key={s}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 12 }}
                onClick={() => {
                  if (criteria.length < MAX_CRITERIA) {
                    // Fill first empty slot, or add new
                    const emptyIdx = criteria.findIndex((c) => !c.name.trim());
                    if (emptyIdx !== -1) updateCriterion(emptyIdx, s);
                    else addCriterion() || setTimeout(() => updateCriterion(criteria.length, s), 0);
                  }
                }}
              >
                {s}
              </button>
            ))}
        </div>
      </div>

      {errors.length > 0 && (
        <Alert type="warning" icon="⚠" style={{ marginBottom: "1rem" }}>
          {errors.map((e) => <div key={e}>{e}</div>)}
        </Alert>
      )}

      <Alert type="info" style={{ marginBottom: "1.5rem" }}>
        <strong>Tip:</strong> Aim for 3–7 criteria. Too many make comparisons harder and may reduce accuracy.
      </Alert>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn" onClick={goPrev}>← Back</button>
        <button className="btn btn-primary" onClick={goNext} disabled={!valid}>
          Next: Add alternatives →
        </button>
      </div>
    </div>
  );
}
