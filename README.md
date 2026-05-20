# Personal Website

Config-driven academic personal website built with Next.js and TailwindCSS.

The website is already deployed at:

```text
https://chungkawai.com
```

## Edit Content

Most website content lives in:

```text
src/data/site.config.json
```

Use this file to update the profile, links, announcements, publications, projects, section order, and section visibility.

After editing, commit and push the changes to the `main` branch. The deployed site at `https://chungkawai.com` updates from this repository.

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

The custom domain is configured as `chungkawai.com` in `public/CNAME`. Do not remove this file unless the deployment domain changes.
