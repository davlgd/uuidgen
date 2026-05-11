import { generateAll, generateOne, isGeneratorName } from "./generators.ts";
import { respond } from "./http.ts";
import { CACHE_DYNAMIC, CONTENT_TYPES } from "./config.ts";

const VARY_ACCEPT = { vary: "Accept" };

export function negotiate(accept: string): Response | null {
  if (accept.includes("yaml")) {
    return respond(Bun.YAML.stringify(generateAll(), null, 2), CONTENT_TYPES.yaml, CACHE_DYNAMIC, VARY_ACCEPT);
  }
  if (accept.includes("application/json")) {
    return respond(JSON.stringify(generateAll()), CONTENT_TYPES.json, CACHE_DYNAMIC, VARY_ACCEPT);
  }
  return null;
}

export function apiOne(type: string): Response {
  if (!isGeneratorName(type)) {
    return respond(JSON.stringify({ error: "unknown generator" }), CONTENT_TYPES.json, CACHE_DYNAMIC, undefined, 404);
  }
  return respond(JSON.stringify({ [type]: generateOne(type) }), CONTENT_TYPES.json, CACHE_DYNAMIC);
}
