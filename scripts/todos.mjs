// Lists every todo() and draft() still left in src/data/content.ts.
// Usage (PowerShell or any shell):  npm run todos
//
// Node 22.18+ can import a .ts file directly (it strips the types), which is why
// content.ts must stay free of imports.

const content = await import(new URL("../src/data/content.ts", import.meta.url).href);

/** Short, readable version of a draft's contents. */
function preview(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "title" in value) return `${value.title}: ${value.detail}`;
  return JSON.stringify(value);
}

/** Walks any value and returns [kind, path, text] for each todo() and draft() marker. */
function collect(value, path) {
  if (content.isTodo(value)) return [["todo", path, value.todo]];
  if (content.isDraft(value)) return [["draft", path, preview(value.draft)]];
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

const todos = found.filter(([kind]) => kind === "todo");
const drafts = found.filter(([kind]) => kind === "draft");

if (todos.length === 0) {
  console.log("No TODOs left in content.ts.");
} else {
  console.log(`${todos.length} TODO(s) left in src/data/content.ts (hidden on the site until filled):\n`);
  for (const [, path, what] of todos) console.log(`  - ${what}\n      at ${path}`);
}

if (drafts.length > 0) {
  console.log(
    `\n${drafts.length} draft(s) waiting for your review (highlighted in npm run dev, hidden on the live site).` +
      `\nApprove by removing the draft( ) wrapper, or delete the line:\n`,
  );
  for (const [, path, text] of drafts) console.log(`  - "${text}"\n      at ${path}`);
}

// Repo links that exist but are switched off with repoReady: false.
const parked = [...content.caseStudies, ...content.projects].filter((p) => p.links.repoReady === false);
if (parked.length > 0) {
  console.log(`\nRepo links hidden on purpose (set repoReady: true in content.ts to show):`);
  for (const p of parked) console.log(`  - ${p.title}: ${p.links.github}`);
}
