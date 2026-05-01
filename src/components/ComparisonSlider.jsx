/**
 * ComparisonSlider.jsx — A single pairwise comparison row.
 * Shows two item labels, a slider (1/9 … 1 … 9), and a preference label.
 * Pure display component; calls onChange with the numeric AHP value.
 */

import React from "react";
import { sliderStepToValue, valueToSliderStep, preferenceLabel, formatComparisonValue } from "../utils/format";

export function ComparisonSlider({ leftLabel, rightLabel, value, onChange }) {
  const step = valueToSliderStep(value);

  const handleSlider = (e) => {
    const sv = parseInt(e.target.value, 10);
    onChange(sliderStepToValue(sv));
  };

  const displayVal = formatComparisonValue(value);
  const prefLabel  = preferenceLabel(value, leftLabel, rightLabel);

  // Colour the slider track dynamically
  const pct = ((step + 8) / 16) * 100;

  return (
    <div
      style={{
        background: "var(--bg-page)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md, 10px)",
        padding: "1rem 1.25rem",
        marginBottom: "0.75rem",
      }}
    >
      {/* Labels row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: 13, fontWeight: 500,
            color: step > 0 ? "var(--accent-light)" : "var(--text-secondary)",
            maxWidth: "40%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}
        >
          {leftLabel}
        </span>

        <span
          style={{
            fontSize: 12,
            background: value === null ? "var(--bg-raised)" : "rgba(59,130,246,0.12)",
            color: value === null ? "var(--text-muted)" : "var(--accent-light)",
            padding: "2px 10px", borderRadius: 99,
            fontWeight: 500, flexShrink: 0,
          }}
        >
          {value === null ? "Move slider" : displayVal}
        </span>

        <span
          style={{
            fontSize: 13, fontWeight: 500,
            color: step < 0 ? "var(--accent-light)" : "var(--text-secondary)",
            maxWidth: "40%", overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", textAlign: "right",
          }}
        >
          {rightLabel}
        </span>
      </div>

      {/* Slider */}
      <div style={{ position: "relative" }}>
        <input
          type="range"
          min="-8"
          max="8"
          step="1"
          value={step}
          onChange={handleSlider}
          aria-label={`Compare ${leftLabel} vs ${rightLabel}`}
          style={{
            background: `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`,
          }}
        />
      </div>

      {/* Scale ticks */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2px",
          fontSize: 10,
          color: "var(--text-muted)",
          userSelect: "none",
        }}
      >
        {["1/9","1/7","1/5","1/3","1","3","5","7","9"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      {/* Preference description */}
      <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", marginTop: "0.5rem" }}>
        {prefLabel}
      </p>
    </div>
  );
}
