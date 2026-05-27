import { useState } from "react";
import {
  DEFAULT_UNITS,
  UNIT_CATEGORIES,
  UNITS,
  convertUnit,
  formatUnitResult,
  type UnitCategory,
} from "../lib/units";
import {
  CopyButton,
  FieldRow,
  Section,
  buttonStyle,
  inputStyle,
  labelStyle,
  selectStyle,
} from "../lib/ui";

export function UnitTool() {
  const [category, setCategory] = useState<UnitCategory>("Length");
  const [from, setFrom] = useState<string>(DEFAULT_UNITS.Length[0]);
  const [to, setTo] = useState<string>(DEFAULT_UNITS.Length[1]);
  const [value, setValue] = useState<string>("1");

  function setCat(c: UnitCategory) {
    setCategory(c);
    setFrom(DEFAULT_UNITS[c][0]);
    setTo(DEFAULT_UNITS[c][1]);
    setValue("1");
  }

  const num = parseFloat(value);
  const primary = isNaN(num) ? "—" : formatUnitResult(convertUnit(category, from, to, num));
  const all = isNaN(num)
    ? []
    : UNITS[category]
        .filter((u) => u !== from)
        .map((u) => ({
          unit: u,
          result: formatUnitResult(convertUnit(category, from, u, num)),
        }));

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <Section title="Unit converter" subtitle="Convert across length, weight, time, digital, area, volume, and speed.">
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {UNIT_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              ...buttonStyle,
              background: c === category ? "var(--color-accent)" : "var(--color-panel)",
              color: c === category ? "#fff" : "var(--color-ink)",
              border: c === category ? "none" : "1px solid var(--color-line)",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div>
        <label style={labelStyle}>Value</label>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ ...inputStyle, fontFamily: "var(--font-mono)", fontSize: "1.125rem" }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
          {UNITS[category].map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <button onClick={swap} style={buttonStyle} aria-label="Swap units">
          ⇄
        </button>
        <select value={to} onChange={(e) => setTo(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
          {UNITS[category].map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          border: "1px solid var(--color-line)",
          borderRadius: "var(--radius-card)",
          background: "var(--color-panel)",
        }}
      >
        <FieldRow>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "2rem",
                fontWeight: 700,
                wordBreak: "break-all",
              }}
            >
              {primary}
            </div>
            <div style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>{to}</div>
          </div>
          <CopyButton text={primary} small />
        </FieldRow>
      </div>

      <div>
        <label style={labelStyle}>All conversions</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
            gap: "0.5rem",
          }}
        >
          {all.map(({ unit, result }) => (
            <button
              key={unit}
              onClick={() => setTo(unit)}
              style={{
                padding: "0.625rem 0.75rem",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius-btn)",
                background: unit === to ? "var(--color-accent)" : "var(--color-panel)",
                color: unit === to ? "#fff" : "var(--color-ink)",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  wordBreak: "break-all",
                }}
              >
                {result}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: unit === to ? "rgba(255,255,255,0.75)" : "var(--color-muted)",
                }}
              >
                {unit}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
