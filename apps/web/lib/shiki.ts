import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubDark from "shiki/themes/github-dark.mjs";
// Different langs supported by the sync engine:
import javascript from "shiki/langs/javascript.mjs";
import typescript from "shiki/langs/typescript.mjs";
import tsx from "shiki/langs/tsx.mjs";
import json from "shiki/langs/json.mjs";

/**
 * Shiki has the issue of using a WASM engine which is by nature async, and makes SSR impossible.
 * 
 * This is a workaround to use the sync pure JS engine, which allows for sync rendering.
 * 
 * It could bring some very minimal differences in very specific cases, so in practice it is fine.
 */
const highlighter = createHighlighterCoreSync({
  themes: [githubDark],
  langs: [javascript, typescript, tsx, json],
  engine: createJavaScriptRegexEngine(),
});

export default highlighter;
