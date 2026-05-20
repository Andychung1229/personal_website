# Agent Notes

This repository contains Chung Ka Wai's personal academic website. It is a static Next.js site using TailwindCSS and is deployed at:

```text
https://chungkawai.com
```

## How The Site Works

- The app source lives under `src/`.
- Most editable website content is in `src/data/site.config.json`.
- Shared typed access to that config is in `src/data/site.ts`.
- Page layout and sections are rendered by components in `src/components/`.
- App metadata, including the browser icon, is configured in `src/app/layout.tsx`.
- Public static assets live in `public/`.
- The custom domain is set by `public/CNAME`.

The project uses Next.js static export:

```bash
npm run build
```

The generated static site is written to `out/`.

## Deployment

The `main` branch is the live branch for the website. After editing content or code, commit and push to `main`; the deployed site at `https://chungkawai.com` will update from those changes.

## Common Edits

- Update profile, links, announcements, education, honors, teaching, and about text in `src/data/site.config.json`.
- Use `Chung Ka Wai` as the full personal name on the website. Use `Kawai Chung` only where referring to paper authorship or publication records.
- Add images or icons under `public/images/`, then reference them with paths like `/images/site-icon.png`.
- Run `npm run build` before committing to verify the static export still works.

## Notes For Future Agents

- Keep changes focused and avoid unrelated redesigns.
- Do not remove `public/CNAME`; it is required for the custom domain.
- If changing images used by the browser icon, update `src/app/layout.tsx` and make sure the referenced file exists in `public/`.
