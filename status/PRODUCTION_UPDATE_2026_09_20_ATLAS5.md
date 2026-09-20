# Earth Healing Production Update — 2026-09-20

## Live production state
- Domain: https://healing.saga1001.com/
- Source commit: b7953c72e353f5afa68179aaeaca289115724749
- Publish workflow: SUCCESS
- Release: 2026.09.20-atlas5

## Map
Earth Healing no longer depends on Google Maps or a Google API key.

Production stack:
1. Self-hosted branded Healing Atlas — MapLibre GL JS + Natural Earth.
2. Keyless cloud detail — Leaflet + OpenStreetMap tiles.
3. Story coordinates, region filters and the year timeline stay synchronized.
4. Cloud detail can zoom to town/street level; it represents current geography, not historical borders.

## Content
- 19 published bilingual stories.
- 500 research-index records kept separate from published stories.
- 5 validated browser-playable concept-video previews.
- Video format: VP9/WebM.

## Artwork
The currently stable hero uses the validated reconstructed garden artwork.
Earlier reference-image proxies that failed actual image decoding were removed from the production dependency path rather than being shipped as broken images.
The visual language remains ivory / saturated botanical garden / deep plum / gold ornament / asymmetric cards.

## Publishing principle
Only decodable images and videos are allowed into the public build. A reference asset existing in GitHub is not treated as live until actual browser validation passes.
