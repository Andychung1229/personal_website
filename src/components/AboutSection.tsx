type AboutSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  sideTitle?: string;
  sideItems?: string[];
};

export function AboutSection({ id, eyebrow, title, body, sideTitle, sideItems = [] }: AboutSectionProps) {
  return (
    <section id={id} className="py-12">
      <div className="soft-panel rounded-2xl p-6 md:p-8">
        <p className="section-label">{eyebrow}</p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
            {body ? <p className="mt-4 leading-8 text-slate-600">{body}</p> : null}
          </div>
          {sideItems.length ? (
            <div className="rounded-xl border border-slate-900/10 bg-white/55 p-5">
              {sideTitle ? (
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{sideTitle}</h3>
              ) : null}
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {sideItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
