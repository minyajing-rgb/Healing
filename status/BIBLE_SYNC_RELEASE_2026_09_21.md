# Earth Healing — Bible-style deployment sync

Date: 2026-09-21
Production: http://healing.saga1001.com/
Source commit: 318f024ec698ec367cb36ff42f57f35b444da6e6
Workflow run: https://github.com/minyajing-rgb/Healing/actions/runs/35569447030
Status: LIVE_VERIFIED

## What was copied from the prior Bible / Dharma deployment pattern

- GitHub remains the canonical source repository.
- Static website is built from source data and media.
- Browser smoke tests run before publication.
- GitHub Pages serves the public site.
- CNAME keeps the custom subdomain independent from the GitHub project path.
- Public deployment is verified after publishing.
- Map does not require Google Maps API credentials.

## Map architecture

- Branded Earth Healing atlas: self-hosted MapLibre + Natural Earth geography.
- Cloud detail: keyless OpenFreeMap Positron.
- Street-level fallback: OpenStreetMap raster if OpenFreeMap is unavailable.
- Timeline, region filters and story points share one dataset.
- Cloud map is modern geographic context, not a historical-border reconstruction.
- Google Maps API key: NOT REQUIRED / NOT USED.

## Media verification

- Five user concept videos are present in the production media manifest.
- Browser QA decoded all five video previews successfully.
- Production uses the validated high-resolution garden hero.
- Media and visual layers remain separate from evidence/source claims.

## Release QA

- Published stories: 19
- Research index records: 500
- Video previews: 5
- MapLibre engine: verified
- Timeline filter: verified
- Region/theme filtering: verified
- Story dialog/source links: verified
- Desktop/mobile overflow: verified
- Custom-domain resources: HTTP 200 verified
