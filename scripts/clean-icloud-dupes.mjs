/**
 * Removes the "… 2" copies iCloud Desktop sync makes inside this project.
 *
 *   npm run clean:icloud          one pass (also runs before dev and build)
 *   npm run clean:icloud -- --watch   keep checking every 30 seconds
 *
 * iCloud duplicates files it is syncing while something else writes them,
 * naming the copy "name 2.ext". In .next that corrupts Turbopack's cache and
 * kills the dev server.
 *
 * Careful by design — not every "… 2" file is junk:
 *   • In generated folders (.next, node_modules) a copy is deleted whenever
 *     its original sits next to it.
 *   • Everywhere else a copy is deleted only if it is byte-for-byte the same
 *     as its original. iCloud also makes "… 2" files when it resolves a sync
 *     CONFLICT, and those can hold real edits — so a copy that differs is
 *     left in place and reported, never deleted.
 *   • A "… 2" with no original beside it (e.g. images/project 4) is a real
 *     name and is never touched.
 */

import { existsSync, lstatSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED = new Set([".next", "node_modules"]);
const DUPE = /^(.+) ([2-9]|[1-9]\d+)(\.[^./ ]+)?$/;
const WATCH_MS = 30_000;

function sameContent(a, b) {
  const sa = lstatSync(a);
  const sb = lstatSync(b);
  if (sa.isDirectory() || sb.isDirectory()) return false; // never assume
  if (sa.size !== sb.size) return false;
  return readFileSync(a).equals(readFileSync(b));
}

function sweep() {
  const removed = [];
  const conflicts = [];

  const walk = (dir, generated) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // vanished mid-sweep (the dev server rewrites .next constantly)
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) continue;
      const m = DUPE.exec(entry.name);
      if (m) {
        const original = path.join(dir, m[1] + (m[3] ?? ""));
        if (existsSync(original)) {
          try {
            if (generated || sameContent(full, original)) {
              rmSync(full, { recursive: true, force: true });
              removed.push(path.relative(root, full));
            } else {
              conflicts.push(path.relative(root, full));
            }
          } catch {}
          continue;
        }
      }
      if (entry.isDirectory() && entry.name !== ".git") {
        walk(full, generated || GENERATED.has(entry.name));
      }
    }
  };

  walk(root, false);
  return { removed, conflicts };
}

function report({ removed, conflicts }, quietIfClean) {
  const stamp = new Date().toLocaleTimeString("en-GB");
  if (removed.length) {
    const sample = removed.slice(0, 5).join(", ");
    console.log(
      `[icloud] ${stamp} removed ${removed.length} duplicate(s): ${sample}${removed.length > 5 ? ", …" : ""}`,
    );
  } else if (!quietIfClean) {
    console.log(`[icloud] ${stamp} no iCloud duplicates`);
  }
  for (const c of conflicts) {
    console.log(`[icloud] ${stamp} KEPT ${c} — differs from its original (possible sync conflict); review it by hand`);
  }
}

const watch = process.argv.includes("--watch");
report(sweep(), false);
if (watch) {
  console.log(`[icloud] watching every ${WATCH_MS / 1000}s — Ctrl-C to stop`);
  const seen = new Set();
  setInterval(() => {
    const result = sweep();
    // Report each conflict once, not every 30 seconds.
    result.conflicts = result.conflicts.filter((c) => !seen.has(c) && seen.add(c));
    report(result, true);
  }, WATCH_MS);
}
