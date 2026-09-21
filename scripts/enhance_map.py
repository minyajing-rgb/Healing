"""Bundle the interactive atlas and normalize dateline-crossing coastlines for planar rendering."""
from __future__ import annotations
import hashlib,json,pathlib,subprocess,time,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=ROOT/'_site';REPORT=ROOT/'site-report'
remote={
 'vendor/maplibre-gl.js':'https://cdn.jsdelivr.net/npm/maplibre-gl@6.6.0/dist/maplibre-gl.js',
 'vendor/maplibre-gl.css':'https://cdn.jsdelivr.net/npm/maplibre-gl@6.6.0/dist/maplibre-gl.css',
 'vendor/MAPLIBRE-LICENSE':'https://cdn.jsdelivr.net/npm/maplibre-gl@6.6.0/LICENSE.txt',
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
# A spherical atlas may jump from -180 to +179 degrees. Planar engines otherwise draw
# a spurious horizontal coast across the entire map. Unwrap consecutive ring vertices;
# the map's GeoJSON tiler handles periodic world copies. Do not invent country borders.
normalizer=r'''
const fs=require('fs'), path=require('path');
const root=process.argv[1], topo=require(path.join(root,'vendor/topojson-client.min.js'));
const source=JSON.parse(fs.readFileSync(path.join(root,'data/land-50m.json')));
const land=topo.feature(source,source.objects.land), arcs=[],geometries=[];let normalized=0;
function unwrap(ring,outerCenter){
 const out=[];
 for(const c of ring){let x=c[0];if(out.length)x+=360*Math.round((out[out.length-1][0]-x)/360);out.push([x,c[1]]);}
 if(Math.abs(out.at(-1)[0]-out[0][0])>180){
  const pole=out.reduce((a,c)=>a+c[1],0)/out.length<0?-90:90;
  out.push([out.at(-1)[0],pole],[out[0][0],pole],out[0].slice());
 }
 const center=(Math.min(...out.map(c=>c[0]))+Math.max(...out.map(c=>c[0])))/2;
 const shift=outerCenter===undefined?-360*Math.round(center/360):360*Math.round((outerCenter-center)/360);
 if(ring.some((c,i)=>i&&Math.abs(c[0]-ring[i-1][0])>180))normalized++;
 return out.map(c=>[Math.round((c[0]+shift)*1e6)/1e6,Math.round(c[1]*1e6)/1e6]);
}
for(const f of land.features||[land]){
 const g=f.geometry,polys=g.type==='MultiPolygon'?g.coordinates:[g.coordinates];
 for(const poly of polys){
  const outer=unwrap(poly[0]);const center=(Math.min(...outer.map(c=>c[0]))+Math.max(...outer.map(c=>c[0])))/2;
  const rings=[outer,...poly.slice(1).map(r=>unwrap(r,center))];
  const ids=rings.map(r=>{const i=arcs.length;arcs.push(r);return [i];});
  geometries.push({type:'Polygon',arcs:ids});
 }
}
fs.writeFileSync(path.join(root,'data/land-50m.json'),JSON.stringify({type:'Topology',objects:{land:{type:'GeometryCollection',geometries}},arcs}));
console.log(JSON.stringify({polygons:geometries.length,dateline_rings_normalized:normalized}));
'''
result=subprocess.run(['node','-e',normalizer,str(OUT)],capture_output=True,text=True,check=True)
print('Geographic normalization:',result.stdout)
for dep in digests:
    if dep['path']=='data/land-50m.json':
        dep['original_sha256']=dep['sha256'];dep['sha256']=hashlib.sha256((OUT/dep['path']).read_bytes()).hexdigest();dep['transformation']='antimeridian ring normalization; same source coastlines'
assets='''<link rel="stylesheet" href="./vendor/maplibre-gl.css">
<link rel="stylesheet" href="./map-experience.css?v=20260921-biblemap1">
<script defer src="./vendor/maplibre-gl.js"></script>
<script defer src="./map-experience.js?v=20260921-biblemap1"></script>
'''
for path in OUT.glob('*.html'):
    content=path.read_text(encoding='utf-8')
    if 'id="mapCanvas"' in content and 'map-experience.js' not in content:path.write_text(content.replace('</head>',assets+'</head>'),encoding='utf-8')
# Additional rules for counter-rotating the marker glyph and accessible co-located stories.
with (OUT/'map-experience.css').open('a',encoding='utf-8') as f:
    f.write('\n.eh-pin-ring>span{transform:rotate(45deg)}.is-cluster .eh-pin-ring>span{transform:none}.eh-cluster-list{display:grid;gap:7px;padding:10px}.eh-cluster-list button{border:1px solid #d5be8d;background:#fffaf0;color:#64336d;border-radius:10px;min-height:44px;padding:8px;font-size:14px;text-align:left}.maplibregl-popup-content{border:1px solid #d3b77a;border-radius:15px;background:#fffaf0}\n')
release=json.loads((OUT/'release.json').read_text())
release.update({'release':'2026.09.21-biblemap1','map_engine':'self-hosted MapLibre GL JS 6.6.0 + OpenFreeMap cloud detail','map_styles':['healing-atlas-local','openfreemap-positron'],'google_maps_enabled':False,'map':'Same no-key architecture as bible.saga1001.com: branded Natural Earth atlas plus MapLibre/OpenFreeMap cloud detail; story coordinates and timeline synchronized; not historical boundaries','geography_normalization':json.loads(result.stdout)})
release['dependency_digests'].extend(digests)
for path in (OUT/'release.json',REPORT/'build-summary.json'):path.write_text(json.dumps(release,ensure_ascii=False,indent=2),encoding='utf-8')
with (OUT/'ASSET-LICENSES.txt').open('a',encoding='utf-8') as f:
    f.write('\nMapLibre GL JS 6.6.0: see vendor/MAPLIBRE-LICENSE. The branded overview uses Natural Earth (public domain), packaged with world-atlas; dateline rings are normalized for planar rendering. Deep geographic detail follows the same keyless pattern used by bible.saga1001.com: MapLibre with OpenFreeMap Positron, with OpenFreeMap / OpenMapTiles / OpenStreetMap attribution supplied by the style. No Google API key is required. Historical dates come from Earth Healing story data; the modern basemap does not represent historical borders.\n')
print(json.dumps(release,ensure_ascii=False,indent=2))
