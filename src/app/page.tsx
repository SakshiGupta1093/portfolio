/*
 * ROUND 1 PREVIEW (temporary).
 * A style check for the palette, fonts, and card style, plus a dev-only list of
 * content TODOs. Round 2 replaces this page with the real home page.
 */
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import * as content from "@/data/content";
import { collectTodos } from "@/lib/todos";

const swatches = [
  { name: "canvas", className: "bg-canvas" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-2", className: "bg-surface-2" },
  { name: "primary", className: "bg-primary" },
  { name: "primary-soft", className: "bg-primary-soft" },
  { name: "secondary", className: "bg-secondary" },
  { name: "secondary-soft", className: "bg-secondary-soft" },
  { name: "ink", className: "bg-ink" },
];

export default function Round1Preview() {
  const { profile, tracks, caseStudies, projects, tools } = content;
  const todos =
    process.env.NODE_ENV === "development"
      ? collectTodos({
          site: content.site,
          caseStudies,
          projects,
          experience: content.experience,
          publications: content.publications,
        })
      : [];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-secondary uppercase">
            Round 1 preview: design tokens
          </p>
          <h1 className="mt-2 text-4xl text-ink sm:text-5xl">{profile.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-muted">{tracks.all.tagline}</p>
        </div>
        <ThemeToggle />
      </header>

      <section aria-labelledby="palette" className="rounded-card border border-line bg-surface p-6 shadow-soft sm:p-8">
        <h2 id="palette" className="text-2xl">Warm palette</h2>
        <p className="mt-1 text-ink-muted">Terracotta main accent, sage secondary, cream background. Toggle the theme to check dark mode.</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <li key={s.name} className="flex items-center gap-3">
              <span className={`size-10 shrink-0 rounded-2xl border border-line ${s.className}`} />
              <code className="text-sm text-ink-muted">{s.name}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sample" className="grid gap-6 sm:grid-cols-2">
        <h2 id="sample" className="sr-only">Sample components</h2>
        {caseStudies.slice(0, 2).map((cs) => (
          <article
            key={cs.slug}
            className="group rounded-card border border-line bg-surface p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex flex-wrap gap-2">
              {cs.badges.map((b) => (
                <span key={b} className="rounded-pill bg-primary-soft px-3 py-1 text-xs font-semibold text-on-primary-soft">
                  {b}
                </span>
              ))}
            </div>
            <h3 className="mt-4 text-xl transition-colors group-hover:text-primary">{cs.title}</h3>
            <p className="mt-2 text-ink-muted">{cs.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cs.stack.slice(0, 5).map((t) => (
                <li key={t} className="rounded-pill bg-secondary-soft px-3 py-1 text-xs font-medium text-on-secondary-soft">
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <a
            href={tracks.all.resume.href}
            download={tracks.all.resume.downloadName}
            className="rounded-pill bg-primary px-5 py-2.5 font-semibold text-on-primary shadow-soft transition-colors hover:bg-primary-hover"
          >
            Resume (primary button)
          </a>
          <a
            href={profile.links.github}
            className="rounded-pill border border-line bg-surface px-5 py-2.5 font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            GitHub (secondary button)
          </a>
        </div>
      </section>

      <section aria-labelledby="loaded" className="rounded-card bg-surface-2 p-6 sm:p-8">
        <h2 id="loaded" className="text-2xl">content.ts loaded</h2>
        <p className="mt-2 text-ink-muted">
          {caseStudies.length} case studies, {projects.length} more projects, {Object.keys(tools).length} tools,{" "}
          {content.experience.length} roles, {content.publications.length} publications.
        </p>
      </section>

      {todos.length > 0 && (
        <section aria-labelledby="todos" className="rounded-card border-2 border-dashed border-primary/50 p-6 sm:p-8">
          <h2 id="todos" className="text-2xl">
            Content TODOs <span className="text-primary">({todos.length})</span>
          </h2>
          <p className="mt-1 text-sm text-ink-muted">Only visible in development. Fill these in src/data/content.ts.</p>
          <ol className="mt-4 space-y-2 text-sm">
            {todos.map((t) => (
              <li key={t.path} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <code className="shrink-0 text-ink-muted sm:w-80">{t.path}</code>
                <span>{t.todo}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
