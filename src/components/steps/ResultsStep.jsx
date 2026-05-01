/**
 * steps/ResultsStep.jsx — Wizard step 5: Display AHP results.
 * Shows consistency check, criteria weights, alternative scores, and recommendation.
 */

import React from "react";
import { useAHP } from "../../context/AHPContext";
import { useWizardNavigation } from "../../hooks/useWizardNavigation";
import { toPercent, formatCR } from "../../utils/format";
import { PALETTE } from "../../constants";
import { StepHeader, Alert, ProgressBar, Badge, Divider, SectionTitle } from "../ui";

export function ResultsStep() {
  const { result, criteria, alternatives, goal, reset, setStep } = useAHP();
  const { goPrev } = useWizardNavigation();

  if (!result) {
    return (
      <div>
        <p style={{ color: "var(--text-secondary)" }}>No result yet. Please complete the comparisons first.</p>
        <button className="btn" onClick={goPrev} style={{ marginTop: "1rem" }}>← Back</button>
      </div>
    );
  }

  const { criteriaAnalysis, altAnalyses, scores, ranked, allConsistent, inconsistencies, bestAlternative } = result;
  const criLabels = criteria.map((c) => c.name);
  const altLabels = alternatives.map((a) => a.name);
  const maxScore  = Math.max(...scores);

  return (
    <div>
      <StepHeader
        number={5}
        title="Results & recommendation"
        subtitle={goal}
      />

      {/* ── Consistency check ── */}
      {allConsistent ? (
        <Alert type="success" icon="✓" style={{ marginBottom: "1.25rem" }}>
          <strong>All matrices are consistent</strong> (CR &lt; 10% for every matrix).
          The AHP analysis is mathematically valid and the recommendation below is reliable.
        </Alert>
      ) : (
        <Alert type="danger" icon="✕" style={{ marginBottom: "1.25rem" }}>
          <strong>Inconsistency detected.</strong> One or more comparison matrices have a Consistency Ratio ≥ 10%.
          The recommendation may be unreliable. Please review the details below and fix the highlighted matrices.
        </Alert>
      )}

      {/* ── Inconsistency details ── */}
      {inconsistencies.length > 0 && (
        <div style={{ marginBottom: "1.25rem" }}>
          <SectionTitle>Inconsistency details</SectionTitle>
          {inconsistencies.map((inc, i) => (
            <div
              key={i}
              style={{
                background: "var(--danger-bg)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "var(--radius-md, 10px)",
                padding: "0.875rem 1rem",
                marginBottom: "0.5rem",
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 500, color: "var(--danger)", marginBottom: 4 }}>
                {inc.label} — {formatCR(inc.cr)}
              </div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <strong>Why:</strong> {inc.tip}
              </p>
              <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 12 }}>
                CI = {inc.ci.toFixed(4)} | n = {inc.n} | CR must be &lt; 10%
              </p>
            </div>
          ))}
          <button
            className="btn btn-sm"
            onClick={() => setStep(3)}
            style={{ marginTop: "0.5rem" }}
          >
            ← Fix comparisons
          </button>
        </div>
      )}

      <Divider />

      {/* ── Criteria weights ── */}
      <SectionTitle>Criteria weights</SectionTitle>
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg, 16px)",
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        {criteria.map((c, ci) => (
          <div key={ci} style={{ marginBottom: "0.875rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13 }}>{c.name}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge color={criteriaAnalysis.isConsistent ? "green" : "amber"}>
                  {formatCR(criteriaAnalysis.cr)}
                </Badge>
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  {toPercent(criteriaAnalysis.weights[ci], 1)}
                </span>
              </div>
            </div>
            <ProgressBar value={criteriaAnalysis.weights[ci]} color={PALETTE[ci % PALETTE.length]} />
          </div>
        ))}
      </div>

      {/* ── Final rankings ── */}
      <SectionTitle>Alternative ranking</SectionTitle>
      <div style={{ marginBottom: "1.25rem" }}>
        {ranked.map((item, rank) => {
          const isBest = rank === 0;
          return (
            <div
              key={item.index}
              style={{
                border: isBest ? "2px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: "var(--radius-lg, 16px)",
                padding: "1rem 1.25rem",
                marginBottom: "0.75rem",
                background: isBest ? "rgba(59,130,246,0.06)" : "var(--bg-surface)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: isBest ? "var(--accent)" : "var(--bg-raised)",
                      color: isBest ? "#fff" : "var(--text-muted)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 600, flexShrink: 0,
                    }}
                  >
                    {rank + 1}
                  </div>
                  <span style={{ fontWeight: isBest ? 500 : 400, fontSize: 15 }}>{item.name}</span>
                  {isBest && <Badge color="blue">Best choice</Badge>}
                </div>
                <span style={{ fontWeight: 600, fontSize: 16, color: isBest ? "var(--accent-light)" : "var(--text-secondary)" }}>
                  {toPercent(item.score, 2)}
                </span>
              </div>
              <ProgressBar
                value={item.score / maxScore}
                color={isBest ? "var(--accent)" : "var(--bg-hover)"}
                height={6}
              />
            </div>
          );
        })}
      </div>

      {/* ── Detailed score table ── */}
      <SectionTitle>Score breakdown by criterion</SectionTitle>
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg, 16px)",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Alternative</th>
                {criteria.map((c, ci) => (
                  <th key={ci}>
                    {c.name}
                    <div style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>
                      weight: {toPercent(criteriaAnalysis.weights[ci], 1)}
                    </div>
                  </th>
                ))}
                <th>Final score</th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map((alt, ai) => {
                const rankPos = ranked.findIndex((r) => r.index === ai);
                return (
                  <tr key={ai} className={rankPos === 0 ? "highlight" : ""}>
                    <td style={{ fontWeight: rankPos === 0 ? 500 : 400 }}>
                      {String.fromCharCode(65 + ai)}. {alt.name}
                    </td>
                    {altAnalyses.map((analysis, ci) => (
                      <td key={ci}>{toPercent(analysis.weights[ai], 1)}</td>
                    ))}
                    <td style={{ fontWeight: 600 }}>{toPercent(scores[ai], 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Final recommendation box ── */}
      {allConsistent && (
        <Alert type="success" icon="★" style={{ marginBottom: "1.5rem" }}>
          <div>
            <strong>Recommendation:</strong> Based on your pairwise judgements, <strong>{bestAlternative.name}</strong> is
            the best choice with a weighted priority score of <strong>{toPercent(bestAlternative.score, 2)}</strong>.
          </div>
        </Alert>
      )}

      {!allConsistent && (
        <Alert type="warning" icon="⚠" style={{ marginBottom: "1.5rem" }}>
          The result shown above is based on inconsistent comparisons. Fix the matrices marked above and recompute to get a reliable recommendation.
        </Alert>
      )}

      {/* ── Actions ── */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <button className="btn" onClick={goPrev}>← Adjust comparisons</button>
        <button className="btn btn-danger" onClick={reset}>Start a new analysis</button>
      </div>
    </div>
  );
}
