import { test, expect, describe } from "bun:test";
import { generateAll, generateOne, isGeneratorName, GENERATORS_META } from "../src/generators.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const NANOID_RE = /^[0-9A-Za-z_-]{21}$/;
const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const SAMPLES = 100;
const UNIQUE_SAMPLES = 1000;

describe("isGeneratorName", () => {
  test("accepts every declared type", () => {
    for (const meta of GENERATORS_META) expect(isGeneratorName(meta.type)).toBe(true);
  });
  test("rejects unknown names and Object.prototype keys", () => {
    for (const bad of ["", "uuid", "uuidv5", "__proto__", "constructor", "toString"]) {
      expect(isGeneratorName(bad)).toBe(false);
    }
  });
});

describe("UUID v4", () => {
  test(`${SAMPLES} samples: RFC 9562 shape, version 4, variant 10xx`, () => {
    for (let i = 0; i < SAMPLES; i++) {
      const v = generateOne("uuidv4");
      expect(v).toMatch(UUID_RE);
      expect(v.charAt(14)).toBe("4");
      expect("89ab").toContain(v.charAt(19));
    }
  });
});

describe("UUID v7", () => {
  test(`${SAMPLES} samples: RFC 9562 shape, version 7, variant 10xx, timestamp within ±60s`, () => {
    for (let i = 0; i < SAMPLES; i++) {
      const v = generateOne("uuidv7");
      expect(v).toMatch(UUID_RE);
      expect(v.charAt(14)).toBe("7");
      expect("89ab").toContain(v.charAt(19));
      const ts = parseInt(v.slice(0, 8) + v.slice(9, 13), 16);
      expect(Math.abs(ts - Date.now())).toBeLessThan(60_000);
    }
  });
  test(`${SAMPLES} sequential samples are strictly monotonic`, () => {
    let prev = generateOne("uuidv7");
    for (let i = 1; i < SAMPLES; i++) {
      const next = generateOne("uuidv7");
      expect(prev < next).toBe(true);
      prev = next;
    }
  });
});

describe("ULID", () => {
  test(`${SAMPLES} samples: Crockford Base32 shape, 26 chars, no I/L/O/U`, () => {
    for (let i = 0; i < SAMPLES; i++) {
      expect(generateOne("ulid")).toMatch(ULID_RE);
    }
  });
  test("timestamp prefix decodes to a recent ms time", () => {
    const prefix = generateOne("ulid").slice(0, 10);
    let ts = 0;
    for (const c of prefix) ts = ts * 32 + ULID_ALPHABET.indexOf(c);
    expect(Math.abs(ts - Date.now())).toBeLessThan(60_000);
  });
});

describe("Nano ID", () => {
  test(`${SAMPLES} samples: URL-safe shape, 21 chars, A-Za-z0-9_-`, () => {
    for (let i = 0; i < SAMPLES; i++) {
      expect(generateOne("nanoid")).toMatch(NANOID_RE);
    }
  });
});

describe("generateAll", () => {
  test("returns one of each shape in a single call", () => {
    const all = generateAll();
    expect(all.uuidv4).toMatch(UUID_RE);
    expect(all.uuidv7).toMatch(UUID_RE);
    expect(all.ulid).toMatch(ULID_RE);
    expect(all.nanoid).toMatch(NANOID_RE);
  });
});

describe(`uniqueness across ${UNIQUE_SAMPLES} samples`, () => {
  for (const meta of GENERATORS_META) {
    test(meta.label, () => {
      const s = new Set<string>();
      for (let i = 0; i < UNIQUE_SAMPLES; i++) s.add(generateOne(meta.type));
      expect(s.size).toBe(UNIQUE_SAMPLES);
    });
  }
});
