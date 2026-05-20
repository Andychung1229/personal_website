import { FileText, Github, GraduationCap, Linkedin, Mail, MapPin } from "lucide-react";
import { siteConfig, type ProfileLink } from "@/data/site";

const profile = siteConfig.profile;

const iconMap = {
  file: FileText,
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  scholar: GraduationCap
};

function getIcon(link: ProfileLink) {
  return iconMap[(link.icon ?? "file") as keyof typeof iconMap] ?? FileText;
}

export function ProfileHero() {
  return (
    <section className="grid gap-8 py-14 md:grid-cols-[0.9fr_1.5fr] md:items-center md:py-20">
      <div className="flex justify-center md:justify-start">
        <div className="soft-panel relative flex aspect-square w-52 items-center justify-center rounded-2xl md:w-64">
          {profile.photo.src ? (
            <img
              src={profile.photo.src}
              alt={profile.photo.alt}
              className="h-40 w-40 rounded-full border border-slate-900/10 object-cover md:h-48 md:w-48"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full border border-slate-900/10 bg-gradient-to-br from-blue-100 via-white to-teal-100 text-center text-sm font-semibold text-slate-500 md:h-48 md:w-48">
              Photo
              <br />
              Coming Soon
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/60 px-3 py-1">
            <MapPin size={15} />
            {profile.location}
          </span>
          <span className="rounded-full border border-slate-900/10 bg-white/60 px-3 py-1">
            {profile.affiliation}
          </span>
        </div>

        <h1 className="text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">
          {profile.name}
        </h1>
        <p className="mt-4 max-w-2xl text-xl leading-8 text-slate-700">{profile.title}</p>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{profile.summary}</p>

        <div className="mt-7 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span key={interest} className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
              {interest}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {profile.links.map((link) => {
            const Icon = getIcon(link);
            return (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-900/12 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-600/40 hover:text-blue-700"
              >
                <Icon size={16} />
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
