/**
 * steps/ComparisonsStep.jsx — Wizard step 4: Fill all pairwise comparison matrices.
 */

import React, { useState } from "react";
import { useAHP } from "../../context/AHPContext";
import { useWizardNavigation } from "../../hooks/useWizardNavigation";
import { useAHPCompute } from "../../hooks/useAHPCompute";
import { isMatrixComplete } from "../../utils/ahp";
import { StepHeader, Alert } from "../ui";
import { PairwiseMatrix } from "../PairwiseMatrix";

export function ComparisonsStep() {
  const {
    criteria, alternatives,
    criteriaMatrix, altMatrices,
    setCriteriaCell, setAltCell,
  } = useAHP();
  const { goPrev } = useWizardNavigation();
  const { compute, canCompute } = useAHPCompute();

  const [activeTab, setActiveTab] = useState("criteria");

  const criLabels = criteria.map((c) => c.name);
  const altLabels = alternatives.map((a) => a.name);

  const criComplete = isMatrixComplete(criteriaMatrix);
  const altStatuses = criteria.map((_, ci) => isMatrixComplete(altMatrices[ci]));
  const allAltComplete = altStatuses.every(Boolean);

  const tabs = [
    { id: "criteria", label: "Criteria weights", done: criComplete },
    ...criteria.map((c, ci) => ({
      id: `alt-${ci}`,
      label: c.name,
      done: altStatuses[ci],
    })),
  ];

  return (
    <div>
      <StepHeader
        number={4}
        title="Pairwise comparisons"
        subtitle="Compare each pair using the sliders. A value of 1 means equal importance; 9 means extreme preference for the left item."
      />

      <Alert type="info" icon="📖" style={{ marginBottom: "1.25rem" }}>
        <strong>Saaty scale:</strong> 1 = equal · 3 = moderate · 5 = strong · 7 = very strong · 9 = extreme.
        Intermediate values (2, 4, 6, 8) represent shades between. Moving the slider left favours the right item.
      </Alert>

      {/* Tab navigation */}
      <div
        style={{
          display: "flex", gap: "6px", flexWrap: "wrap",
          marginBottom: "1.25rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "0.75rem",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn btn-sm"
            style={{
              background: activeTab === tab.id ? "var(--accent)" : "var(--bg-raised)",
              color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
              borderColor: activeTab === tab.id ? "var(--accent)" : "var(--border)",
              gap: "6px",
            }}
          >
            {tab.done && <span style={{ color: activeTab === tab.id ? "#fff" : "var(--success)" }}>✓</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Criteria matrix */}
      {activeTab === "criteria" && (
        <PairwiseMatrix
          title="Which criterion is more important?"
          description="Compare each pair of criteria relative to your overall goal."
          labels={criLabels}
          matrix={criteriaMatrix}
          onChange={(i, j, val) => setCriteriaCell(i, j, val)}
        />
      )}

      {/* Alternative matrices per criterion */}
      {criteria.map((c, ci) =>
        activeTab === `alt-${ci}` ? (
          <PairwiseMatrix
            key={ci}
            title={`Which alternative performs better for: "${c.name}"?`}
            description="Compare alternatives based only on this criterion, ignoring all others."
            labels={altLabels}
            matrix={altMatrices[ci]}
            onChange={(i, j, val) => setAltCell(ci, i, j, val)}
          />
        ) : null
      )}

      {/* Progress summary */}
      <div
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md, 10px)",
          padding: "0.75rem 1rem",
          marginBottom: "1.25rem",
          fontSize: 13, color: "var(--text-secondary)",
        }}
      >
        Progress: {[criComplete, ...altStatuses].filter(Boolean).length} / {1 + criteria.length} matrices complete
        {canCompute() && (
          <span style={{ color: "var(--success)", marginLeft: 8 }}>— ready to compute!</span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn" onClick={goPrev}>← Back</button>
        <button
          className="btn btn-success"
          onClick={compute}
          disabled={!canCompute()}
        >
          Compute best alternative →
        </button>
      </div>
    </div>
  );
}
