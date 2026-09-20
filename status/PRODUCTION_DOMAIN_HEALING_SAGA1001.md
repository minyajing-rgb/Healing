# Earth Healing — Production Domain Launch

- Production domain: https://healing.saga1001.com/
- Hosting: GitHub Pages
- DNS provider: Alibaba Cloud (configured by site owner)
- Publishing source: gh-pages /
- Source repository: minyajing-rgb/Healing
- Root CNAME: healing.saga1001.com
- Canonical/OG metadata: configured for production domain
- robots.txt + sitemap.xml: configured for production domain
- Visual direction: approved botanical garden / ivory / saturated florals / deep plum / gold ornaments / asymmetric cards
- Interactive atlas: MapLibre garden atlas + optional geographic detail, time slider, region/theme filters, bilingual story expansion
- Deployment workflow: .github/workflows/publish-site.yml

The build workflow copies the root CNAME into the public site and preserves it on gh-pages.
