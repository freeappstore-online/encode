import { useEffect, useMemo, useState } from "react";
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

type Input =
  | { kind: "epoch-s"; value: string }
  | { kind: "epoch-ms"; value: string }
  | { kind: "iso"; value: string };

function parseInput(input: Input): Date | null {
  if (input.kind === "epoch-s") {
    const n = Number(input.value);
    if (!isFinite(n)) return null;
    return new Date(n * 1000);
  }
  if (input.kind === "epoch-ms") {
    const n = Number(input.value);
    if (!isFinite(n)) return null;
    return new Date(n);
  }
  const d = new Date(input.value);
  return isNaN(d.getTime()) ? null : d;
}

function formatHuman(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function relative(d: Date): string {
  const diffMs = d.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const units: [number, string][] = [
    [1000, "second"],
    [60_000, "minute"],
    [3_600_000, "hour"],
    [86_400_000, "day"],
    [2_592_000_000, "month"],
    [31_536_000_000, "year"],
  ];
  let chosen: [number, string] = units[0]!;
  for (const u of units) {
    if (abs >= u[0]) chosen = u;
  }
  const val = Math.round(abs / chosen[0]);
  const noun = `${chosen[1]}${val === 1 ? "" : "s"}`;
  return diffMs < 0 ? `${val} ${noun} ago` : `in ${val} ${noun}`;
}

export function TimestampTool() {
  const [input, setInput] = useState<Input>({
    kind: "iso",
    value: new Date().toISOString(),
  });
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const parsed = useMemo(() => parseInput(input), [input]);

  function setKind(kind: Input["kind"]) {
    if (!parsed) {
      setInput({ kind, value: "" });
      return;
    }
    if (kind === "epoch-s") setInput({ kind, value: Math.floor(parsed.getTime() / 1000).toString() });
    else if (kind === "epoch-ms") setInput({ kind, value: parsed.getTime().toString() });
    else setInput({ kind, value: parsed.toISOString() });
  }

  return (
    <Section
      title="Timestamp"
      subtitle="Convert between epoch seconds, milliseconds, and ISO date strings."
    >
      <div style={card}>
        <FieldRow>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ ...labelStyle, marginBottom: 0 }}>Current time</span>
            <span style={{ fontSize: "0.875rem" }}>{formatHuman(now)}</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              style={buttonStyle}
              onClick={() =>
                setInput({ kind: "epoch-s", value: Math.floor(now.getTime() / 1000).toString() })
              }
            >
              Use now (s)
            </button>
            <button
              style={primaryButtonStyle}
              onClick={() => setInput({ kind: "iso", value: now.toISOString() })}
            >
              Use now (ISO)
            </button>
          </div>
        </FieldRow>
        <div
          className="mono"
          style={{
            marginTop: "0.75rem",
            fontSize: "0.75rem",
            color: "var(--color-muted)",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "0.25rem 0.75rem",
          }}
        >
          <span>epoch s</span>
          <span>{Math.floor(now.getTime() / 1000)}</span>
          <span>epoch ms</span>
          <span>{now.getTime()}</span>
          <span>ISO</span>
          <span>{now.toISOString()}</span>
        </div>
      </div>

      <div style={card}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
          {(["epoch-s", "epoch-ms", "iso"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              style={{
                ...buttonStyle,
                background:
                  input.kind === k ? "var(--color-accent)" : "var(--color-panel)",
                color: input.kind === k ? "#fff" : "var(--color-ink)",
                border: input.kind === k ? "none" : "1px solid var(--color-line)",
              }}
            >
              {k === "epoch-s" ? "Epoch seconds" : k === "epoch-ms" ? "Epoch ms" : "ISO 8601"}
            </button>
          ))}
        </div>

        <label style={labelStyle}>Input</label>
        <input
          style={inputStyle}
          value={input.value}
          onChange={(e) => setInput({ kind: input.kind, value: e.target.value })}
          spellCheck={false}
        />

        {parsed ? (
          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "0.5rem 0.75rem",
              alignItems: "center",
              fontSize: "0.8125rem",
            }}
          >
            <span style={{ color: "var(--color-muted)" }}>Epoch s</span>
            <code className="mono">{Math.floor(parsed.getTime() / 1000)}</code>
            <CopyButton text={String(Math.floor(parsed.getTime() / 1000))} small />

            <span style={{ color: "var(--color-muted)" }}>Epoch ms</span>
            <code className="mono">{parsed.getTime()}</code>
            <CopyButton text={String(parsed.getTime())} small />

            <span style={{ color: "var(--color-muted)" }}>ISO UTC</span>
            <code className="mono" style={{ wordBreak: "break-all" }}>
              {parsed.toISOString()}
            </code>
            <CopyButton text={parsed.toISOString()} small />

            <span style={{ color: "var(--color-muted)" }}>Local</span>
            <span>{formatHuman(parsed)}</span>
            <CopyButton text={formatHuman(parsed)} small />

            <span style={{ color: "var(--color-muted)" }}>Relative</span>
            <span>{relative(parsed)}</span>
            <span />
          </div>
        ) : (
          <p style={{ color: "#dc2626", fontSize: "0.8125rem", marginTop: "0.75rem" }}>
            Could not parse input.
          </p>
        )}
      </div>
    </Section>
  );
}
