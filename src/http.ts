import { SECURITY_HEADERS } from "./config.ts";

export function respond(
  body: string,
  contentType: string,
  cache: string,
  extraHeaders?: Record<string, string>,
  status = 200,
): Response {
  return new Response(body, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...extraHeaders,
      "content-type": contentType,
      "cache-control": cache,
    },
  });
}
