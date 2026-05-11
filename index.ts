import { html } from "./src/template.ts";
import { negotiate, apiOne } from "./src/api.ts";
import { respond } from "./src/http.ts";
import { PORT, CACHE_DYNAMIC, CACHE_STATIC, CONTENT_TYPES, SECURITY_HEADERS } from "./src/config.ts";

const staticDir = `${import.meta.dir}/static`;
const staticHeaders = { ...SECURITY_HEADERS, "cache-control": CACHE_STATIC };
const staticFile = (name: string, contentType: string) =>
  new Response(Bun.file(`${staticDir}/${name}`), {
    headers: { ...staticHeaders, "content-type": contentType },
  });

const page = html();

const server = Bun.serve({
  port: PORT,

  routes: {
    "/": (req) => {
      const accept = req.headers.get("accept") ?? "";
      return negotiate(accept) ?? respond(page, CONTENT_TYPES.html, CACHE_DYNAMIC, { vary: "Accept" });
    },
    "/:type": (req) => apiOne(req.params.type),
    "/client.js": staticFile("client.js", CONTENT_TYPES.js),
    "/styles.css": staticFile("styles.css", CONTENT_TYPES.css),
    "/robots.txt": staticFile("robots.txt", CONTENT_TYPES.text),
    "/llms.txt": staticFile("llms.txt", CONTENT_TYPES.markdown),
  },

  fetch: () => respond("Not Found", CONTENT_TYPES.text, CACHE_DYNAMIC, undefined, 404),

  error(err) {
    console.error("Server error:", err);
    return respond("Internal Server Error", CONTENT_TYPES.text, CACHE_DYNAMIC, undefined, 500);
  },
});

console.log(`Listening on ${server.url}`);
