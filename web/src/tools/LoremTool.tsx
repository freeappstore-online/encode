import { useState } from "react";
import {
  generateLoremParagraphs,
  generateLoremSentences,
  generateLoremWords,
} from "../lib/lorem";
import {
  CopyButton,
  FieldRow,
  Section,
  buttonStyle,
  card,
  inputStyle,
  labelStyle,
  primaryButtonStyle,
  textareaStyle,
} from "../lib/ui";

type Unit = "paragraphs" | "sentences" | "words";

function generate(unit: Unit, count: number): string {
  if (unit === "paragraphs") return generateLoremParagraphs(count);
  if (unit === "sentences") return generateLoremSentences(count);
  return generateLoremWords(count);
}

export function LoremTool() {
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState(() => generate("paragraphs", 3));

  function regen(u: Unit, n: number) {
    const safe = Math.max(1, Math.min(500, Math.floor(n) || 1));
    setUnit(u);
    setCount(safe);
    setOutput(generate(u, safe));
  }

  return (
    <Section title="Lorem Ipsum" subtitle="Generate filler text by paragraphs, sentences, or words.">
      <div style={card}>
        <FieldRow>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["paragraphs", "sentences", "words"] as const).map((u) => (
              <button
                key={u}
                onClick={() => regen(u, count)}
                style={{
                  ...buttonStyle,
                  background: unit === u ? "var(--color-accent)" : "var(--color-panel)",
                  color: unit === u ? "#fff" : "var(--color-ink)",
                  border: unit === u ? "none" : "1px solid var(--color-line)",
                  textTransform: "capitalize",
                }}
              >
                {u}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Count</label>
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => regen(unit, parseInt(e.target.value, 10) || 1)}
              style={{ ...inputStyle, width: "5rem", fontFamily: "var(--font-body)" }}
            />
            <button style={primaryButtonStyle} onClick={() => regen(unit, count)}>
              Generate
            </button>
          </div>
        </FieldRow>
      </div>

      <div>
        <FieldRow>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Output</label>
          <CopyButton text={output} />
        </FieldRow>
        <textarea
          style={{
            ...textareaStyle,
            marginTop: "0.5rem",
            minHeight: "16rem",
            fontFamily: "var(--font-body)",
            cursor: "text",
          }}
          value={output}
          readOnly
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(output);
            } catch {
              // ignore
            }
          }}
          spellCheck={false}
        />
        <p style={{ color: "var(--color-muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          Click the output to copy.
        </p>
      </div>
    </Section>
  );
}
