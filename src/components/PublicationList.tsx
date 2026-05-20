type Publication = {
  title: string;
  authors: string;
  venue: string;
  status: string;
  year: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
};

const statusClass = {
  Accepted: "bg-emerald-50 text-emerald-700",
  Preprint: "bg-blue-50 text-blue-700",
  "Under Review": "bg-amber-50 text-amber-700",
  "In Progress": "bg-slate-100 text-slate-700"
};

type PublicationListProps = {
  id: string;
  eyebrow: string;
  title: string;
  items: Publication[];
};

function getStatusClass(status: string) {
  return statusClass[status as keyof typeof statusClass] ?? "bg-slate-100 text-slate-700";
}

export function PublicationList({ id, eyebrow, title, items }: PublicationListProps) {
  return (
    <section id={id} className="py-12">
      <div className="mb-6">
        <p className="section-label">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
      </div>
      <div className="grid gap-4">
        {items.map((paper) => (
          <article key={paper.title} className="soft-panel rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{paper.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{paper.authors}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(paper.status)}`}>
                {paper.status}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              {paper.venue} · {paper.year}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(paper.links ?? []).map((link) =>
                link.href ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-lg border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700 transition hover:border-blue-600/40 hover:text-blue-700"
                  >
                    {link.label}
                  </a>
                ) : null
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
