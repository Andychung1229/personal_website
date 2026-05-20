type Announcement = {
  date: string;
  text: string;
  link?: string;
  tag?: string;
};

type AnnouncementListProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  items: Announcement[];
};

export function AnnouncementList({ id, eyebrow, title, description, items }: AnnouncementListProps) {
  return (
    <section id={id} className="py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="section-label">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
        </div>
        {description ? (
          <p className="hidden max-w-sm text-right text-sm text-slate-500 md:block">{description}</p>
        ) : null}
      </div>
      <div className="soft-panel overflow-hidden rounded-2xl">
        {items.map((item, index) => (
          <div
            key={`${item.date}-${item.text}`}
            className={`grid gap-3 px-5 py-4 md:grid-cols-[9rem_1fr_auto] md:items-center ${
              index !== items.length - 1 ? "border-b border-slate-900/10" : ""
            }`}
          >
            <time className="text-sm font-semibold text-slate-500">{item.date}</time>
            <p className="text-slate-800">
              {item.link ? (
                <a href={item.link} className="hover:text-blue-700">
                  {item.text}
                </a>
              ) : (
                item.text
              )}
            </p>
            {item.tag ? (
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {item.tag}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
