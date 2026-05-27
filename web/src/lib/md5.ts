// MD5 implementation in TypeScript.
// Based on RFC 1321. Implemented from scratch for this app.
// Note: MD5 is NOT cryptographically secure — provided here for legacy
// developer-tool use cases (checksums, debugging fingerprints).

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]!;
    out += (b >>> 4).toString(16);
    out += (b & 0x0f).toString(16);
  }
  return out;
}

function rotl(x: number, n: number): number {
  return (x << n) | (x >>> (32 - n));
}

function add32(a: number, b: number): number {
  return (a + b) | 0;
}

const K = new Int32Array([
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
  0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
  0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
  0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
  0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
]);

const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

export function md5(input: string | Uint8Array): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  const origLen = bytes.length;
  const bitLen = origLen * 8;

  // Append 0x80 then pad with zeros to make length % 64 === 56, then 8-byte length.
  const padLen = (56 - ((origLen + 1) % 64) + 64) % 64;
  const total = origLen + 1 + padLen + 8;
  const msg = new Uint8Array(total);
  msg.set(bytes);
  msg[origLen] = 0x80;
  // Write 64-bit little-endian length in bits.
  const low = bitLen >>> 0;
  const high = Math.floor(bitLen / 0x100000000) >>> 0;
  msg[total - 8] = low & 0xff;
  msg[total - 7] = (low >>> 8) & 0xff;
  msg[total - 6] = (low >>> 16) & 0xff;
  msg[total - 5] = (low >>> 24) & 0xff;
  msg[total - 4] = high & 0xff;
  msg[total - 3] = (high >>> 8) & 0xff;
  msg[total - 2] = (high >>> 16) & 0xff;
  msg[total - 1] = (high >>> 24) & 0xff;

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const M = new Int32Array(16);

  for (let chunk = 0; chunk < total; chunk += 64) {
    for (let j = 0; j < 16; j++) {
      const o = chunk + j * 4;
      M[j] =
        (msg[o]! |
          (msg[o + 1]! << 8) |
          (msg[o + 2]! << 16) |
          (msg[o + 3]! << 24)) |
        0;
    }

    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }

      const temp = D;
      D = C;
      C = B;
      B = add32(B, rotl(add32(add32(A, F), add32(K[i]!, M[g]!)), S[i]!));
      A = temp;
    }

    a0 = add32(a0, A);
    b0 = add32(b0, B);
    c0 = add32(c0, C);
    d0 = add32(d0, D);
  }

  const out = new Uint8Array(16);
  const words = [a0, b0, c0, d0];
  for (let i = 0; i < 4; i++) {
    const w = words[i]!;
    out[i * 4] = w & 0xff;
    out[i * 4 + 1] = (w >>> 8) & 0xff;
    out[i * 4 + 2] = (w >>> 16) & 0xff;
    out[i * 4 + 3] = (w >>> 24) & 0xff;
  }
  return toHex(out);
}
