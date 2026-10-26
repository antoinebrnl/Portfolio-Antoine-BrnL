import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const origin = "http://127.0.0.1:5000";
const config = JSON.parse(await readFile(new URL("../firebase.json", import.meta.url), "utf8"));

test("publishing always validates and rebuilds the current source", () => {
  assert.equal(config.hosting.public, "dist");
  assert.deepEqual(config.hosting.predeploy, ["pnpm run verifier", "pnpm run build"]);
});

test("the site and its app paths serve the app with revalidation headers", async () => {
  for (const path of ["/", "/portfolio"] ) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(response.headers.get("cache-control"), /max-age=0.*must-revalidate/);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.match(await response.text(), /Antoine BrnL/);
  }
});

test("JavaScript, the wallpaper, chime and localized content serve as actual assets", async () => {
  const html = await (await fetch(origin)).text();
  const script = html.match(/src="([^"]+\.js)"/);
  assert.ok(script, "the production module must be present");
  const response = await fetch(origin + script[1]);
  assert.match(response.headers.get("content-type"), /javascript/);
  const bundle = await response.text();
  assert.ok(!bundle.includes("hosting-private-key-sentinel"), "local private keys must not enter the bundle");
  for (const [path, type] of [
    ["/wallpapers/pro-black-terracotta.png", /image\/png/],
    ["/music/mac-startup.mp3", /audio\//],
    ["/markdown/about-me.md", /text\//],
    ["/markdown/en/about-me.md", /text\//],
    ["/img/icons/finder.png", /image\/png/],
  ]) {
    const asset = await fetch(origin + path);
    assert.equal(asset.status, 200, path);
    assert.match(asset.headers.get("content-type"), type, path);
    assert.ok((await asset.arrayBuffer()).byteLength > 0, path);
  }
});
