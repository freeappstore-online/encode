import { useState } from "react";
import {
  CopyButton,
  FieldRow,
  Section,
  buttonStyle,
  card,
  inputStyle,
  labelStyle,
  primaryButtonStyle,
} from "../lib/ui";

function generate(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(crypto.randomUUID());
  return out;
}

export function UuidTool() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => generate(5));

  function regenerate(n: number) {
    const safe = Math.max(1, Math.min(100, Math.floor(n) || 1));
    setCount(safe);
    setUuids(generate(safe));
  }

  return (
    <Section
      title="UUID generator"
      subtitle="Generate v4 UUIDs via crypto.randomUUID(). Bulk-generate up to 100 at a time."
    >
      <div style={card}>
        <FieldRow>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Count</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => regenerate(parseInt(e.target.value, 10) || 1)}
              style={{ ...inputStyle, width: "5rem", fontFamily: "var(--font-body)" }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button style={primaryButtonStyle} onClick={() => regenerate(count)}>
              Generate
            </button>
            <CopyButton text={uuids.join("\n")} label="Copy all" />
          </div>
        </FieldRow>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {uuids.map((u, i) => (
          <div
            key={`${u}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              padding: "0.625rem 0.875rem",
              border: "1px solid var(--color-line)",
              borderRadius: "var(--radius-btn)",
              background: "var(--color-panel)",
            }}
          >
            <code
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                wordBreak: "break-all",
              }}
            >
              {u}
            </code>
            <CopyButton text={u} small />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {[1, 5, 10, 25, 100].map((n) => (
          <button key={n} style={buttonStyle} onClick={() => regenerate(n)}>
            × {n}
          </button>
        ))}
      </div>
    </Section>
  );
}
