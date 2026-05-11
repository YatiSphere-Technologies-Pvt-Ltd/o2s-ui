"use client";

/**
 * Tamper-evident hashing for audit rows.
 * SHA-256 over JSON(row) + previous-row hash. Async because Web Crypto is async.
 * Server can verify later with the same routine.
 */
export async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Computes a Merkle-style hash chain over the entries (in order). */
export async function hashChain(rows: { id: string; whenISO: string; body: string }[]): Promise<{ rowHash: string; prevHash: string | null }[]> {
  const out: { rowHash: string; prevHash: string | null }[] = [];
  let prev: string | null = null;
  for (const r of rows) {
    const payload = `${prev ?? ""}|${r.id}|${r.whenISO}|${r.body}`;
    const rowHash = await sha256(payload);
    out.push({ rowHash, prevHash: prev });
    prev = rowHash;
  }
  return out;
}
