import { chmodSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line of escalation theatre: the support agent has no fix to offer,
// so the only upgrade on the table is a senior voice reading the same
// restart script with more confidence. The joke skips the stock
// "turn it off and on again" line entirely and lands on the theatre
// around it — help is coming, and it will change nothing.
//
// Gate (from the kit's RULES.txt): /output/entry.txt must be UTF-8 text
// of 1 to 199 characters, not only whitespace. This program enforces a
// stricter single-line reading of that gate before writing anything:
// one line, no line breaks of any kind, no padding, no invisible bytes.
const text =
  "I can transfer you to a senior agent who will tell you to restart it with more confidence.";

const MIN_CHARS = 1;
const MAX_CHARS = 199;

function gate(line: string): void {
  const chars = [...line].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // \n and \r are the obvious line breaks; U+2028/U+2029 read as breaks
  // to a human but slip past a naive newline check, so reject all four.
  if (/[\n\r\u2028\u2029]/.test(line)) {
    throw new Error("entry must be a single line with no line separators");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  // Control characters, BOM and zero-width marks are invisible in the
  // file yet real in its byte count — the judge reads bytes, so a line
  // carrying them would not be the line that was gated here.
  if (/[\u0000-\u001f\u007f\ufeff\u200b-\u200d]/.test(line)) {
    throw new Error("entry must not contain control or invisible characters");
  }
}

gate(text);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

// Write to a temp file beside the target, then rename into place: a
// crash mid-write can never leave a partial entry.txt for the grader,
// and entry.txt is always the whole line or nothing.
const tmpPath = join(outDir, ".entry.txt.tmp");
const outPath = join(outDir, "entry.txt");
writeFileSync(tmpPath, text, { encoding: "utf8", mode: 0o644 });
// The grader collects outputs as another user, so the file must stay
// world-readable or the run fails as "not readable".
chmodSync(tmpPath, 0o644);
renameSync(tmpPath, outPath);

// Read back what actually landed on disk and prove it is the gated
// line, byte for byte: a silent truncation, re-encode or padding
// would otherwise ship different text to the judge than was checked.
const written = readFileSync(outPath, "utf8");
if (written !== text) {
  throw new Error("entry file does not match the gated line");
}
// Re-run the gate on the bytes that came back, not just the string we
// meant to write: if the file on disk somehow carries a trailing line
// break or padding, it must fail here rather than reach the judge as
// a two-line or padded entry.
gate(written);
if (written.endsWith("\n") || written.endsWith("\r")) {
  throw new Error("entry file must not end with a line break");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(text, "utf8")) {
  throw new Error("entry file byte length does not match the gated line");
}

console.log(`entry.txt written: ${[...text].length} chars`);
