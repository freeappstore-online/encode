import { useEffect, useState } from "react";
import { md5 } from "../lib/md5";
import {
  CopyButton,
  FieldRow,
  Section,
  card,
  labelStyle,
  textareaStyle,
} from "../lib/ui";

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

function bytesToHex(buf: ArrayBuffer): string {
  const view = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < view.length; i++) {
    const b = view[i]!;
    out += (b >>> 4).toString(16);
    out += (b & 0x0f).toString(16);
  }
  return out;
}

async function hash(algo: Algo, input: string): Promise<string> {
  if (algo === "MD5") return md5(input);
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest(algo, data);
  return bytesToHex(buf);
}

export function HashTool() {
  const [input, setInput] = useState("The quick brown fox jumps over the lazy dog");
  const [results, setResults] = useState<Record<Algo, string>>({
    MD5: "",
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = { ...results };
      for (const algo of ALGOS) {
        try {
          next[algo] = await hash(algo, input);
        } catch {
          next[algo] = "";
        }
      }
      if (!cancelled) setResults(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <Section
      title="Hash"
      subtitle="Compute cryptographic hashes of text input. MD5 is shipped client-side for legacy use; SHA family uses SubtleCrypto."
    >
      <div>
        <label style={labelStyle}>Input</label>
        <textarea
          style={textareaStyle}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {ALGOS.map((algo) => (
          <div key={algo} style={card}>
            <FieldRow>
              <strong style={{ fontSize: "0.875rem" }}>{algo}</strong>
              <CopyButton text={results[algo]} small />
            </FieldRow>
            <div
              className="mono"
              style={{
                marginTop: "0.5rem",
                wordBreak: "break-all",
                fontSize: "0.8125rem",
                color: results[algo] ? "var(--color-ink)" : "var(--color-muted)",
              }}
            >
              {results[algo] || "—"}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
