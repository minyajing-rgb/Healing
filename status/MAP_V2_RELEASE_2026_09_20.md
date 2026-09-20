# Earth Healing — Map V2 release

## Published and verified
- Release: 2026.09.20-map2
- Public map: https://minyajing-rgb.github.io/Healing/map.html
- Source commit: 382b7bf13e32ed70f366e09912cf7740dc844556
- Successful build/test/publish/live-verification run: https://github.com/minyajing-rgb/Healing/actions/runs/35485262715
- The run completed successfully, including public release.json source-commit verification.
- Release artifact: earth-healing-site-and-preview, ID 10596799564.

## Map and visual upgrade
- Actual MapLibre GL JS 5.6.0 interactive map; not a screenshot or Google iframe.
- Garden atlas: self-hosted Natural Earth 1:50m geographic data, ivory land, teal sea, fine gold coastline and a plum/gold interface.
- Geographic detail: opt-in OpenFreeMap vector basemap, recolored to match Earth Healing; present-day geography, not a reconstruction of ancient political borders.
- Drag/pinch/zoom, clustered story markers, regional camera movement, bilingual place/story labels, full-screen control, sourced story dialogs, and time-filter synchronization.
- The enhanced map reads the same filtered published stories as the existing story rail; no duplicate historical dating rules.
- Dateline-crossing coastline rings normalized to remove false horizontal rendering seams.
- Existing SVG map and readable list are retained when WebGL or the external service is unavailable.
- Google Maps API is not enabled; no Google billing configuration was created.

## Browser evidence
- Original website checks: 31 passed.
- Enhanced map checks: 21 passed, including desktop/mobile, region focus, zoom controls, time filtering, sourced story expansion, bilingual controls, larger text, optional detail service and fallback.
- Normal browser security was retained in the final map test run; no disabled-web-security argument.
- External detail map reached style=detail and detailHealth=loaded during testing.
- No JavaScript runtime errors or failed local resource requests were reported.
- Screenshots in artifact site-report/: map-v2-desktop.png, map-v2-europe.png, map-v2-detail.png and map-v2-mobile.png.

## Content scope
19 published bilingual story introductions and 500 separately labelled unreviewed research-index entries. This map upgrade does not imply that all global healing knowledge or the 500 earlier story shells are now fully researched articles. Source/recognition/research dates are not automatically origin dates.

## Domain and Alibaba Cloud
- No custom domain has been supplied or configured.
- Hosting remains GitHub Pages. A domain purchased from Alibaba Cloud can point to Pages; moving the host is not compulsory.
- deploy/ALIYUN_AND_DOMAIN_GUIDE.md documents Pages domain binding and the alternative OSS static-hosting configuration.
- deploy/upload_oss.sh is opt-in and defaults to dry-run. It uploads only a validated public build to an already-configured dedicated bucket; it does not create resources, modify ACL/DNS, enable billing or delete unrelated objects.
- No Alibaba bucket, CDN service, certificate, DNS record, AccessKey or automatic OSS deployment was created in this release.
