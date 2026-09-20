# Google Maps Detail Layer Setup / Google 地图详情层配置

Earth Healing now has three map modes:

1. **Garden Atlas / 花园图谱** — self-hosted branded MapLibre + Natural Earth overview.
2. **Geographic Detail / 地理细节** — OpenFreeMap fallback for modern geographic detail.
3. **Google Maps / Google 地图** — embedded Google Maps JavaScript API when a production browser key is configured; otherwise opens the selected place in Google Maps via a normal Maps URL.

## Required Google Cloud configuration

Enable **Maps JavaScript API** in the Google Cloud project that will serve `healing.saga1001.com`.

Create a dedicated **browser API key** and restrict it:

### Application restriction
HTTP referrers (web sites)

Recommended allowed referrers:
- `https://healing.saga1001.com/*`
- `https://minyajing-rgb.github.io/Healing/*` only if the GitHub Pages staging URL should also load embedded Google Maps.

### API restriction
Restrict key to:
- Maps JavaScript API

Do not use an unrestricted key.

## GitHub configuration

Repository:
`minyajing-rgb/Healing`

Open:
**Settings → Secrets and variables → Actions**

Add:

### Repository secret
- Name: `GOOGLE_MAPS_API_KEY`
- Value: the HTTP-referrer-restricted browser API key

### Optional repository variable
- Name: `GOOGLE_MAPS_MAP_ID`
- Value: a Google Maps Map ID if Cloud-based Map Styling / Advanced Markers are desired.

Do not commit the API key into HTML, JS, JSON, Markdown or the repository.

The publishing workflow already injects these values into the generated public `google-map-config.js`.

## After configuration

Re-run **Publish Earth Healing** or make any site commit.

The build release metadata will change from:
`google_maps_enabled: false`

to:
`google_maps_enabled: true`.

The **Google 地图 / Google Maps** button will then switch the in-page detail layer to Google Maps and allow normal Google zoom/pan to specific modern places and streets.

## Product model

Do not replace the branded world overview with Google Maps.

Recommended hierarchy:

`Garden Atlas → select era / region / story → Google Maps detail → exact modern location`

Historical eras continue to use the Earth Healing atlas and sourced story dates. Google Maps is treated as **present-day geographic detail**, not as a reconstruction of historical borders, roads or settlements.
