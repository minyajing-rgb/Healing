# Google Maps Detail Layer / Google 云端地图详情层

## Current production behavior

**No Google API key is required for the normal Earth Healing website flow.**

Earth Healing uses three map layers:

1. **Garden Atlas / 花园图谱** — branded interactive MapLibre + Natural Earth overview.
2. **Geographic Detail / 地理细节** — modern geographic detail fallback.
3. **Google Maps / Google 地图** — when the visitor selects this mode, the site uses a real Google Maps in-page embed centered on the selected story coordinates. Visitors can also open that exact coordinate in Google Maps.

This no-key embedded flow is the default production path and is sufficient for:
- viewing the selected modern place;
- zooming/panning in Google Maps;
- switching between Earth Healing story locations;
- opening exact coordinates in full Google Maps.

## Optional advanced mode

A `GOOGLE_MAPS_API_KEY` is **optional**, not required.

It is only needed if we later want the full Maps JavaScript API for:
- custom cloud map styles / Map ID;
- programmatic advanced markers;
- more control over the embedded map UI;
- deeper Google Maps JavaScript API integrations.

If enabled later, keep the key HTTP-referrer restricted to:
- `https://healing.saga1001.com/*`

and restrict the key to Maps JavaScript API.

## Product hierarchy

`Garden Atlas → era / region / story → Google Maps modern place detail`

Google Maps represents present-day geography. Historical dates, routes and cultural context remain controlled by the Earth Healing database and timeline; Google Maps is not treated as a reconstruction of historical borders.
