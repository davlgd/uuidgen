# uuidgen

Generate UUID v4, UUID v7, ULID and Nano ID instantly. One-click copy — no tracking, no dependencies.

Requires [Bun](https://bun.com) ≥ 1.2.3.

## Install

```shell
bun install
```

## Run

```shell
bun run dev    # hot-reload dev server (default :8080)
bun run start  # production
```

Override port and canonical URL through env vars:

```shell
PORT=3000 SITE_URL=https://example.com bun run start
```

## CLI usage

```shell
curl -H "Accept: application/json" http://localhost:8080/   # all four as JSON
curl -H "Accept: text/yaml"        http://localhost:8080/   # all four as YAML
curl http://localhost:8080/uuidv7                           # one type (uuidv4|uuidv7|ulid|nanoid)
```

## Develop

```shell
bun test            # generator tests
bun run typecheck   # TypeScript 7 (tsgo)
```

## License

Apache 2.0 — see [LICENSE](./LICENSE).
