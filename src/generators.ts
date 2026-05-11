export type GeneratorName = "uuidv4" | "uuidv7" | "ulid" | "nanoid";

export interface GeneratorMeta {
  type: GeneratorName;
  label: string;
  description: string;
  detail: string;
  placeholder: string;
}

// Placeholders use middle-dot (·) sized to match the final ID, reserving layout space pre-hydration.
const UUID_PLACEHOLDER = "········-····-····-····-············";

export const GENERATORS_META: readonly GeneratorMeta[] = [
  { type: "uuidv4", label: "UUID v4", description: "Random, 122 bits of entropy", placeholder: UUID_PLACEHOLDER, detail: "UUID v4 is a 128-bit identifier generated from 122 bits of cryptographically secure randomness. Defined in RFC 9562, it is the most widely used UUID version. Ideal when you need a unique identifier with no embedded metadata." },
  { type: "uuidv7", label: "UUID v7", description: "Timestamp + random, monotonic, sortable", placeholder: UUID_PLACEHOLDER, detail: "UUID v7 encodes a Unix timestamp in its first 48 bits, followed by random data. This makes it lexicographically sortable by creation time — perfect for database primary keys, as it preserves insertion order and improves index locality." },
  { type: "ulid", label: "ULID", description: "Timestamp + random, Crockford Base32", placeholder: "··························", detail: "ULID (Universally Unique Lexicographically Sortable Identifier) combines a 48-bit millisecond timestamp with 80 bits of randomness, encoded in Crockford Base32. At 26 characters, it is shorter than a UUID and case-insensitive." },
  { type: "nanoid", label: "Nano ID", description: "URL-safe, 21 chars, 126 bits", placeholder: "·····················", detail: "Nano ID is a compact, URL-safe identifier using a 64-character alphabet (A-Z, a-z, 0-9, _ and -). At 21 characters it provides 126 bits of entropy — comparable to UUID v4 — in a shorter, URL-friendly format." },
] as const;

function uuidV4(): string {
  return crypto.randomUUID();
}

function uuidV7(): string {
  return Bun.randomUUIDv7();
}

function ulid(): string {
  // Crockford Base32 uppercase, no I/L/O/U. Both halves below encode 5 bits per char,
  // so no modulo bias: timestamp is base-32 of the integer, randomness reads exact 5-bit chunks.
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const chars: string[] = new Array(26);

  // Timestamp: 10 chars MSB-first (48 bits)
  let ts = Date.now();
  for (let i = 9; i >= 0; i--) {
    chars[i] = alphabet[ts % 32]!;
    ts = Math.floor(ts / 32);
  }

  // Randomness: 80 bits encoded as 16 chars, reading 5-bit groups from a 10-byte buffer
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);
  let bitBuffer = 0;
  let bitsLeft = 0;
  let pos = 10;
  for (let i = 0; i < 10; i++) {
    bitBuffer = (bitBuffer << 8) | rand[i]!;
    bitsLeft += 8;
    while (bitsLeft >= 5) {
      bitsLeft -= 5;
      chars[pos++] = alphabet[(bitBuffer >> bitsLeft) & 0x1f]!;
    }
  }

  return chars.join("");
}

function nanoId(): string {
  // Official Nano ID urlAlphabet (A-Za-z0-9_-, order tuned for gzip/brotli).
  // 64-char alphabet, byte & 63 takes the low 6 bits — unbiased over [0, 63].
  const alphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  const bytes = new Uint8Array(21);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b & 63]).join("");
}

const generators: Record<GeneratorName, () => string> = {
  uuidv4: uuidV4,
  uuidv7: uuidV7,
  ulid,
  nanoid: nanoId,
};

export function isGeneratorName(name: string): name is GeneratorName {
  return Object.hasOwn(generators, name);
}

export function generateOne(name: GeneratorName): string {
  return generators[name]();
}

export function generateAll(): Record<GeneratorName, string> {
  return Object.fromEntries(
    Object.entries(generators).map(([k, fn]) => [k, fn()])
  ) as Record<GeneratorName, string>;
}
