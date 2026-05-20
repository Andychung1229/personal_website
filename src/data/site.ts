import rawConfig from "./site.config.json";

export type ProfileLink = {
  label: string;
  href: string;
  icon?: string;
};

export type AnnouncementItem = {
  date: string;
  text: string;
  link?: string;
  tag?: string;
};

export type LinkItem = {
  label: string;
  href: string;
};

export type PublicationItem = {
  title: string;
  authors: string;
  venue: string;
  status: string;
  year: string;
  links?: LinkItem[];
};

export type ProjectItem = {
  title: string;
  description: string;
  tags?: string[];
  links?: LinkItem[];
};

type BaseSection = {
  id: string;
  enabled: boolean;
  navLabel?: string;
  eyebrow: string;
  title: string;
};

export type AnnouncementSection = BaseSection & {
  type: "announcements";
  description?: string;
  items: AnnouncementItem[];
};

export type PublicationSection = BaseSection & {
  type: "publications";
  items: PublicationItem[];
};

export type ProjectSection = BaseSection & {
  type: "projects";
  items: ProjectItem[];
};

export type AboutSectionConfig = BaseSection & {
  type: "about";
  body?: string;
  sideTitle?: string;
  sideItems?: string[];
};

export type SiteSection = AnnouncementSection | PublicationSection | ProjectSection | AboutSectionConfig;

export type SiteConfig = {
  site: {
    navTitle: string;
    title: string;
    description: string;
    footer: string;
  };
  profile: {
    name: string;
    title: string;
    affiliation: string;
    location: string;
    email: string;
    photo: {
      src: string;
      alt: string;
    };
    summary: string;
    interests: string[];
    links: ProfileLink[];
  };
  sections: SiteSection[];
};

export const siteConfig = rawConfig as SiteConfig;

export const enabledSections = siteConfig.sections.filter((section) => section.enabled);

export const navItems = enabledSections
  .filter((section) => section.navLabel)
  .map((section) => ({
    href: `#${section.id}`,
    label: section.navLabel
  }));
