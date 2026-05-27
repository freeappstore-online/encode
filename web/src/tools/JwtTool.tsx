import { useMemo, useState } from "react";
import {
  CopyButton,
  FieldRow,
  Pill,
  Section,
  labelStyle,
  textareaStyle,
} from "../lib/ui";

function b64urlDecodeToString(b64url: string): string {
  let s = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4 !== 0) s += "=";
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

type Decoded =
  | {
      ok: true;
      header: unknown;
      payload: unknown;
      signature: string;
      expired: boolean | null;
      expiresAt: string | null;
    }
  | { ok: false; error: string };

function decodeJwt(token: string): Decoded {
  const t = token.trim();
  if (!t) return { ok: false, error: "Paste a JWT to decode." };
  const parts = t.split(".");
  if (parts.length !== 3) {
    return { ok: false, error: "JWT must have 3 parts separated by dots." };
  }
  try {
    const header = JSON.parse(b64urlDecodeToString(parts[0]!));
    const payload = JSON.parse(b64urlDecodeToString(parts[1]!));
    const signature = parts[2]!;

    let expired: boolean | null = null;
    let expiresAt: string | null = null;
    if (
      payload &&
      typeof payload === "object" &&
      "exp" in payload &&
      typeof (payload as { exp: unknown }).exp === "number"
    ) {
      const exp = (payload as { exp: number }).exp;
      const expMs = exp * 1000;
      expired = Date.now() > expMs;
      expiresAt = new Date(expMs).toISOString();
    }

    return { ok: true, header, payload, signature, expired, expiresAt };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to decode" };
  }
}

export function JwtTool() {
  const [token, setToken] = useState(
    // Sample token (HS256, signed with 'secret') — payload only used for demo.
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  );
  const decoded = useMemo(() => decodeJwt(token), [token]);

  return (
    <Section
      title="JWT decoder"
      subtitle="Paste a JWT to inspect its header and payload. The signature is shown but NOT verified."
    >
      <div>
        <label style={labelStyle}>Token</label>
        <textarea
          style={textareaStyle}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          spellCheck={false}
          placeholder="eyJ…"
        />
      </div>

      {!decoded.ok && (
        <p style={{ color: "#dc2626", fontSize: "0.8125rem" }}>{decoded.error}</p>
      )}

      {decoded.ok && (
        <>
          <div>
            <FieldRow>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Header</label>
              <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
            </FieldRow>
            <textarea
              style={{ ...textareaStyle, marginTop: "0.5rem", minHeight: "5rem" }}
              value={JSON.stringify(decoded.header, null, 2)}
              readOnly
              spellCheck={false}
            />
          </div>

          <div>
            <FieldRow>
              <label
                style={{
                  ...labelStyle,
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Payload
                {decoded.expired === true && <Pill tone="warn">Expired</Pill>}
                {decoded.expired === false && <Pill tone="accent">Valid window</Pill>}
              </label>
              <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
            </FieldRow>
            <textarea
              style={{ ...textareaStyle, marginTop: "0.5rem" }}
              value={JSON.stringify(decoded.payload, null, 2)}
              readOnly
              spellCheck={false}
            />
            {decoded.expiresAt && (
              <p
                style={{
                  color: "var(--color-muted)",
                  fontSize: "0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                exp claim: {decoded.expiresAt}
              </p>
            )}
          </div>

          <div>
            <FieldRow>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Signature</label>
              <CopyButton text={decoded.signature} />
            </FieldRow>
            <textarea
              style={{ ...textareaStyle, marginTop: "0.5rem", minHeight: "4rem" }}
              value={decoded.signature}
              readOnly
              spellCheck={false}
            />
            <p
              style={{
                color: "var(--color-muted)",
                fontSize: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              Signature shown for inspection only. This tool does not verify it — verification
              requires the issuer's secret or public key.
            </p>
          </div>
        </>
      )}
    </Section>
  );
}
