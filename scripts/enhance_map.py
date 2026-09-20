"""Run after build_site.py and prepare_release.py; no API key or server required."""
from __future__ import annotations
import hashlib,json,pathlib,time,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'_site'
REPORT=ROOT/'site-report'
remote={
 'vendor/maplibre-gl.js':'https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.js',
 'vendor/maplibre-gl.css':'https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.css',
 'vendor/MAPLIBRE-LICENSE':'https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/LICENSE.txt',
 'data/land-50m.json':'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json'
}
digests=[]
for target,url in remote.items():
    error=None
    for attempt in range(3):
        try:
            request=urllib.request.Request(url,headers={'User-Agent':'EarthHealing-static-builder/2.0'})
            with urllib.request.urlopen(request,timeout=45) as response:content=response.read()
            assert len(content)>100
            (OUT/target).write_bytes(content)
            digests.append({'path':target,'source':url,'sha256':hashlib.sha256(content).hexdigest()})
            error=None;break
        except Exception as e:error=e;time.sleep(attempt+1)
    if error:raise error
world=json.loads((OUT/'data/land-50m.json').read_text());assert world['type']=='Topology'
assets='''<link rel="stylesheet" href="./vendor/maplibre-gl.css">
<link rel="stylesheet" href="./map-experience.css?v=20260920-map2">
<script defer src="./vendor/maplibre-gl.js"></script>
<script defer src="./map-experience.js?v=20260920-map2"></script>
'''
for path in OUT.glob('*.html'):
    content=path.read_text(encoding='utf-8')
    if 'id="mapCanvas"' in content and 'map-experience.js' not in content:
        content=content.replace('</head>',assets+'</head>')
        path.write_text(content,encoding='utf-8')
release=json.loads((OUT/'release.json').read_text())
release.update({'release':'2026.09.20-map2','map_engine':'MapLibre GL JS 5.6.0','map_styles':['garden-local','geographic-detail-openfreemap'],'google_maps_enabled':False,'map':'Natural Earth 1:50m geography; optional present-day OpenFreeMap detail, not historical boundaries'})
release['dependency_digests'].extend(digests)
(OUT/'release.json').write_text(json.dumps(release,ensure_ascii=False,indent=2),encoding='utf-8')
(REPORT/'build-summary.json').write_text(json.dumps(release,ensure_ascii=False,indent=2),encoding='utf-8')
with (OUT/'ASSET-LICENSES.txt').open('a',encoding='utf-8') as f:
    f.write('\nMapLibre GL JS 5.6.0: see vendor/MAPLIBRE-LICENSE. Garden base uses Natural Earth (public domain), packaged with world-atlas. Geographic detail is an optional external OpenFreeMap service, with OpenMapTiles / OpenStreetMap attribution shown by the map. No Google Maps API is activated or billed.\n')
print(json.dumps(release,ensure_ascii=False,indent=2))
