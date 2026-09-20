# Earth Healing / 官网发布

## Live endpoint

https://minyajing-rgb.github.io/Healing/

The Pages site is enabled. Verified configuration: legacy branch publishing, source `gh-pages`, directory `/`. The earlier first-time enablement problem no longer describes the current repository state.

## Canonical source and output

- `web/index.html` — real HTML interface
- `web/site.css` — responsive botanical visual system
- `web/site.js` — geographic map, time slider/playback, filters, bilingual stories, local bookmarks and sharing
- `web/assets/` — validated web artwork and original UI ornaments
- `data/published-stories.json` — source-linked, bilingual cultural/historical stories eligible for publication
- `data/canonical_entries_wave1_500.jsonl` — research index; not automatically treated as verified content
- `scripts/build_site.py` — validation and static build
- `scripts/test_site.py` — real-browser functional checks and desktop/mobile screenshots
- `.github/workflows/publish-site.yml` — build, test, update `gh-pages`, request Pages build, verify live release

`main` contains research and editable source. `_site` is the build artifact. The `gh-pages` branch contains generated public output. Earlier root HTML files and the old `site/` folder are historical prototypes, not the canonical production source.

## Delivery states

An uploaded source file, a successful build and a verified live release are distinct states. Check the latest **Publish Earth Healing** run and the public `release.json`; a source commit is live only when it matches `source_commit` in that file.

Initial editorial release: 19 actual bilingual story introductions and 500 separately labelled research-index records. The previous 500 generic story shells are not counted as finished stories. Structural graph relations are not claims of historical transmission.

## Update loop

1. Research and edit a story, attaching its primary sources.
2. Distinguish origin, historical documentation, institutional dates and heritage-recognition dates.
3. Use approximate regional coordinates where appropriate and explain precision.
4. Set eligible content to `published` after editorial review.
5. Commit to `main`. The workflow validates the data and media, tests the actual UI and publishes the static result.

This is automatic publication after a repository update, not unsupervised research or medical review.

## Media integrity

The earlier four WebP proxies and two MP4 proxies failed decoding. They remain in source history but are excluded from the live build. Three existing 160×90, 10-second concept video proxies decode completely and are labelled as low-resolution previews. They are not high-resolution master archives. The new garden artwork is checked by SHA-256 and image decoding before publication.

Official documentary films are linked to their source websites; they are not silently copied or represented as owned media.

## Custom domain later

No domain is invented or bound in this release. When the final domain is supplied, configure it in GitHub Pages and its DNS provider. Relative website paths support the current `/Healing/` project path and a future domain root.

The publication script preserves any existing `gh-pages/CNAME` unless a replacement root `CNAME` has explicitly been committed in `main`. Do not put a placeholder domain in a live `CNAME` file.

## Portable build

Run `python scripts/build_site.py` with Pillow and FFmpeg installed. Serve `_site` through a static server. The build vendors version-pinned mapping libraries and the Natural Earth geographic basemap, avoiding runtime dependence on third-party map/CDN requests by visitors. Library license files are included; no font binaries are distributed.
