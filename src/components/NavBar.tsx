import Link from "next/link";
import { navItems, siteConfig } from "@/data/site";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-[#fbfaf6]/82 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-sm font-semibold tracking-wide text-slate-900">
          {siteConfig.site.navTitle}
        </Link>
        <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
