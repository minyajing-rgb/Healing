# Earth Healing Website / 官网

## Current status

The interactive static site is live in the repository root and mirrored under `/site`.

### Temporary no-Pages preview
Use a GitHub HTML Preview service on:
`https://github.com/minyajing-rgb/Healing/blob/main/index.html`

This is only for design review. Final production hosting should use GitHub Pages, Vercel, Cloudflare Pages or the user's custom domain.

## Current design lock

- higher saturation than V1;
- cleaner version of the supplied Provence / botanical-estate references;
- ivory + vivid rose + lavender + Mediterranean blue + botanical green + warm gold;
- irregular floral corners, hanging medallions, curved ornaments and decorative frames;
- future layer through luminous map nodes, dynamic time controls and glassy UI;
- beginner / older-user friendly progressive disclosure;
- bilingual zh/en.

## Current interaction loop

**Pick a place → Move through time → Map changes → Open a Story → Expand media → Go deeper only if desired.**

## Data relationship

The website does not replace the database.

`GitHub research → canonical data → reviewed beginner story → featured website content`

See:
- `docs/WEBSITE_CONTENT_PIPELINE.md`
- `data/site_featured_content_v1.json`
- `data/site_publication_queue_v1.json`

## Files

- `index.html` — production root entry
- `styles.css`
- `app.js`
- `site/index.html` — mirrored source
- `site/preview_bundle.html` — self-contained review bundle
