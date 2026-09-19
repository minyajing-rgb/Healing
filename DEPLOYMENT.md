# Earth Healing Static Website Deployment / 官网部署说明

This repository now contains a **plain static HTML/CSS/JS website at repository root**.

## Production entry files

- `index.html` — homepage
- `map.html` — dynamic time-driven world map
- `story-provence.html` — story-mode page
- `atlas-lavender.html` — botanical atlas page
- `styles.css` — shared visual system
- `app.js` — bilingual / timeline / story interactions
- `assets/reference/` — website image/video assets

The site uses **relative URLs**, so it can be deployed under:
- GitHub Pages project path;
- a custom root domain;
- a subdomain such as `healing.example.com`;
- Cloudflare Pages / Vercel / Netlify / any static host.

## Custom domain later

When the final domain is known:

1. Point the deployment provider to this GitHub repository.
2. Use repository root as the static site root.
3. Add the domain in the provider's domain settings.
4. If using GitHub Pages, create a root `CNAME` file containing only the final domain name.
5. Update DNS according to the selected host.
6. Keep all site asset links relative; no code rewrite should be required.

## GitHub Pages note

The connected GitHub App can write repository files but does not have the repository-administration permission required to enable a Pages site for the first time. This does **not** affect the website code. The website is already host-ready.

## Content workflow

The website and database are intentionally decoupled:

`data → QA → story objects → map/timeline bindings → published HTML/UI`

New database content can continue to be researched and structured while verified, visually strong content is progressively surfaced on the live site.
