/**
 * PairwiseMatrix.jsx — Renders all upper-triangle pairwise comparisons
 * for a given matrix using ComparisonSlider components.
 */

import React from "react";
import { ComparisonSlider } from "./ComparisonSlider";
import { isMatrixComplete } from "../utils/ahp";
import { Badge } from "./ui";

export function PairwiseMatrix({ title, description, labels, matrix, onChange }) {
  const n = labels.length;

  // Build all (i, j) pairs where j > i
  const pairs = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push([i, j]);
    }
  }

  const filled = pairs.filter(([i, j]) => matrix[i][j] !== null).length;
  const total  = pairs.length;
  const complete = isMatrixComplete(matrix);

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg, 16px)",
        overflow: "hidden",
        marginBottom: "1.5rem",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-raised)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{title}</div>
          {description && (
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{description}</p>
          )}
        </div>
        <Badge color={complete ? "green" : "amber"}>
          {filled}/{total} filled
        </Badge>
      </div>

      {/* Sliders */}
      <div style={{ padding: "1rem 1.25rem" }}>
        {pairs.map(([i, j]) => (
          <ComparisonSlider
            key={`${i}-${j}`}
            leftLabel={labels[i]}
            rightLabel={labels[j]}
            value={matrix[i][j]}
            onChange={(val) => onChange(i, j, val)}
          />
        ))}
      </div>
    </div>
  );
}
