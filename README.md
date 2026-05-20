# Personal Website

Config-driven academic personal website built with Next.js and TailwindCSS.

## Edit Content

Most website content lives in:

```text
src/data/site.config.json
```

Use this file to update the profile, links, announcements, publications, projects, section order, and section visibility.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:8000`.

## Build

```bash
npm run build
```

The site is configured as a static export. The production files are generated in `out/`, which works well for GitHub Pages, Vercel, Netlify, and custom domains.

## Custom Domain

When you buy a domain, connect it through your hosting provider:

- Vercel or Netlify: add the domain in the provider dashboard, then follow their DNS records in GoDaddy.
- GitHub Pages: add the domain in repository settings, then set GoDaddy DNS records to GitHub Pages.

No domain-specific value is hardcoded in this project yet, so it is safe to connect a domain later.
