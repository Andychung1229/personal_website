type Project = {
  title: string;
  description: string;
  tags?: string[];
  links?: Array<{
    label: string;
    href: string;
  }>;
};

type ProjectGridProps = {
  id: string;
  eyebrow: string;
  title: string;
  items: Project[];
};

export function ProjectGrid({ id, eyebrow, title, items }: ProjectGridProps) {
  return (
    <section id={id} className="py-12">
      <div className="mb-6">
        <p className="section-label">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((project) => (
          <article key={project.title} className="soft-panel rounded-2xl p-5">
            <div className="mb-5 h-28 rounded-xl border border-slate-900/10 bg-gradient-to-br from-slate-100 via-white to-teal-50" />
            <h3 className="text-lg font-semibold text-slate-950">{project.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(project.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
            {project.links?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-lg border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700 transition hover:border-blue-600/40 hover:text-blue-700"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
