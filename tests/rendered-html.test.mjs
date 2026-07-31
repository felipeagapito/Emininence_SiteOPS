import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function render(worker, pathname) {
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  return response.text();
}

test("renders development preview metadata", async () => {
  const worker = await loadWorker();
  assert.match(await render(worker, "/"), developmentPreviewMeta);
});

test("renders the experience system routes", async () => {
  const worker = await loadWorker();
  const routes = [
    ["/", /Sites não precisam/],
    ["/studio", /Direction Studio/],
    ["/modelos/prime-calhas", /A chuva mostra o problema/],
    ["/modelos/vetro", /A luz entra/],
    ["/money", /Calhas Silva/],
    ["/money/manual", /Entrada manual/],
  ];
  for (const [pathname, expected] of routes) {
    assert.match(await render(worker, pathname), expected);
  }
});

test("renders the Lighthouse clamp note on the manual entry", async () => {
  const worker = await loadWorker();
  const html = await render(worker, "/money/manual");
  assert.match(html, /Valores fora de 0-100 sao ajustados para o limite/);
});
