# Personal Website

Config-driven academic personal website built with Next.js and TailwindCSS.

The website is already deployed at:

```text
https://chungkawai.com
```

## Makeine Trip Guide

The interactive Traditional Chinese trip guide is available at:

```text
https://chungkawai.com/makeine-trip/
```

Its source lives in `src/app/makeine-trip/`, with locally hosted, attributed images in
`public/images/makeine-trip/`. The production build exports the page to
`out/makeine-trip/index.html`. Push the repository to `main` and the existing GitHub
Pages workflow will publish the page together with its scripts, styles, and images.

## Central Europe Autumn Guide

The independent static HTML guide is available at `/europe-trip/`.
Its editable HTML, CSS, JavaScript and original SVG icon are in `public/europe-trip/`.
The existing Next.js build copies this folder into `out/europe-trip/` for GitHub Pages.

The page contains provisional public travel dates and source-linked information,
dated accommodation price snapshots, accessible city tabs, and a browser-local
checklist. It contains no traveler names, receipts, or private booking records.
The page is public, with a `noindex` request; this is not access control. Recheck
transport, rates, availability and cancellation terms before booking.

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
