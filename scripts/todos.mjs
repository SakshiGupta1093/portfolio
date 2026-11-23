// Lists every todo() still left in src/data/content.ts.
// Usage (PowerShell or any shell):  npm run todos
//
// Node 22.18+ can import a .ts file directly (it strips the types), which is why
// content.ts must stay free of imports.

const content = await import(new URL("../src/data/content.ts", import.meta.url).href);

/** Walks any value and returns [path, description] for each todo() marker. */
function collect(value, path) {
  if (content.isTodo(value)) return [[path, value.todo]];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) =>
      collect(item, `${path}[${item && typeof item === "object" && "slug" in item ? item.slug : i}]`),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, v]) => collect(v, path ? `${path}.${key}` : key));
  }
  return [];
}

const found = Object.entries(content)
  .filter(([, v]) => typeof v !== "function")
  .flatMap(([name, v]) => collect(v, name));

if (found.length === 0) {
  console.log("No TODOs left in content.ts.");
} else {
  console.log(`${found.length} TODO(s) left in src/data/content.ts (hidden on the site until filled):\n`);
  for (const [path, what] of found) console.log(`  - ${what}\n      at ${path}`);
}

// Repo links that exist but are switched off with repoReady: false.
const parked = [...content.caseStudies, ...content.projects].filter((p) => p.links.repoReady === false);
if (parked.length > 0) {
  console.log(`\nRepo links hidden on purpose (set repoReady: true in content.ts to show):`);
  for (const p of parked) console.log(`  - ${p.title}: ${p.links.github}`);
}
