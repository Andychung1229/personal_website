type TimelineItem = {
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
  tags?: string[];
};

type TimelineSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  items: TimelineItem[];
};

export function TimelineSection({ id, eyebrow, title, items }: TimelineSectionProps) {
  return (
    <section id={id} className="py-12">
      <div className="mb-6">
        <p className="section-label">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <article key={`${item.title}-${item.period}`} className="soft-panel rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                {item.subtitle ? <p className="mt-2 text-sm font-medium text-slate-700">{item.subtitle}</p> : null}
              </div>
              {item.period ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {item.period}
                </span>
              ) : null}
            </div>
            {item.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p> : null}
            {item.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
