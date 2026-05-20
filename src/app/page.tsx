import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AboutSection } from "@/components/AboutSection";
import { AnnouncementList } from "@/components/AnnouncementList";
import { NavBar } from "@/components/NavBar";
import { ProfileHero } from "@/components/ProfileHero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { PublicationList } from "@/components/PublicationList";
import { TimelineSection } from "@/components/TimelineSection";
import { enabledSections, siteConfig } from "@/data/site";

function renderSection(section: (typeof enabledSections)[number]) {
  if (section.type === "announcements") {
    return (
      <AnnouncementList
        key={section.id}
        id={section.id}
        eyebrow={section.eyebrow}
        title={section.title}
        description={"description" in section ? section.description : undefined}
        items={"items" in section ? section.items : []}
      />
    );
  }

  if (section.type === "publications") {
    return (
      <PublicationList
        key={section.id}
        id={section.id}
        eyebrow={section.eyebrow}
        title={section.title}
        items={"items" in section ? section.items : []}
      />
    );
  }

  if (section.type === "projects") {
    return (
      <ProjectGrid
        key={section.id}
        id={section.id}
        eyebrow={section.eyebrow}
        title={section.title}
        items={"items" in section ? section.items : []}
      />
    );
  }

  if (section.type === "timeline") {
    return (
      <TimelineSection
        key={section.id}
        id={section.id}
        eyebrow={section.eyebrow}
        title={section.title}
        items={section.items}
      />
    );
  }

  if (section.type === "about") {
    return (
      <AboutSection
        key={section.id}
        id={section.id}
        eyebrow={section.eyebrow}
        title={section.title}
        body={"body" in section ? section.body : undefined}
        sideTitle={"sideTitle" in section ? section.sideTitle : undefined}
        sideItems={"sideItems" in section ? section.sideItems : []}
      />
    );
  }

  return null;
}

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <NavBar />
      <main className="relative z-10 mx-auto max-w-6xl px-5">
        <ProfileHero />
        {enabledSections.map(renderSection)}
      </main>
      <footer className="relative z-10 mx-auto max-w-6xl px-5 py-10 text-sm text-slate-500">
        <div className="border-t border-slate-900/10 pt-6">{siteConfig.site.footer}</div>
      </footer>
    </>
  );
}
