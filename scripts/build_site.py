"""Build the public static website without publishing unfinished story shells."""
from __future__ import annotations
import hashlib, json, os, pathlib, re, shutil, subprocess, time, urllib.request
from PIL import Image, ImageEnhance
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'_site'
REPORT=ROOT/'site-report'
REPORT.mkdir(exist_ok=True)
if OUT.exists(): shutil.rmtree(OUT)
shutil.copytree(ROOT/'web',OUT)
(OUT/'data').mkdir(exist_ok=True)
(OUT/'vendor').mkdir(exist_ok=True)
(OUT/'assets'/'films').mkdir(parents=True,exist_ok=True)

def write_json(path, data):
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')

asset=OUT/'assets/garden.avif'
assert hashlib.sha256(asset.read_bytes()).hexdigest()=='e476481ab71416b3652c973fa8f19f6295129dd1786eb999a51f5ed5ce1c9032','Hero image bytes did not match source'
im=Image.open(asset);im.load();assert im.width>=900
# Provide a broadly compatible web derivative as well.
im.convert('RGB').save(OUT/'assets/garden.jpg',quality=92,optimize=True)
# Retina rendering derivative: improves browser presentation, but does not invent new source detail.
hq=im.convert('RGB').resize((im.width*2,im.height*2),Image.Resampling.LANCZOS)
hq=ImageEnhance.Sharpness(hq).enhance(1.16)
hq.save(OUT/'assets/garden@2x.jpg',quality=94,subsampling=0,optimize=True)

# Google Maps JavaScript API browser credentials are injected at build time.
# The browser key is expected to be HTTP-referrer restricted to the production domain.
google_key=os.environ.get('GOOGLE_MAPS_API_KEY','').strip()
google_map_id=os.environ.get('GOOGLE_MAPS_MAP_ID','').strip()
(OUT/'google-map-config.js').write_text(
    'window.EARTH_HEALING_GOOGLE_MAPS = Object.freeze('+json.dumps({
      'apiKey':google_key,
      'mapId':google_map_id,
      'productionDomain':'healing.saga1001.com'
    },ensure_ascii=False)+');\n',encoding='utf-8')

payload=json.loads((ROOT/'data/published-stories.json').read_text())
records=payload['stories']
assert len({x['id'] for x in records})==len(records),'Duplicate IDs'
for s in records:
    assert s['status']=='published'
    assert re.fullmatch(r'[a-z0-9-]+',s['id'])
    assert -180<=s['coordinates'][0]<=180 and -85<=s['coordinates'][1]<=85
    assert -4000<=s['from']<=s['to']<=2026
    assert s['sources'] and all(p['url'].startswith('https://') for p in s['sources'])
    for lang in ('zh','en'):
        assert all(s[lang].get(k) for k in ('title','place','hook','date','date_note','story'))
        assert len(s[lang]['story'])>=2
write_json(OUT/'data/stories.json',payload)

catalog=[]
index=ROOT/'data/canonical_entries_wave1_500.jsonl'
if index.exists():
    for line in index.read_text().splitlines():
        if not line.strip():continue
        r=json.loads(line)
        catalog.append({'id':r['id'],'zh':r['names']['zh'],'en':r['names']['en'],'latin':r['names'].get('latin'),'group':r.get('group'),'status':'research_index_unreviewed'})
write_json(OUT/'data/research-index.json',catalog)

# Version-pinned public map dependencies are hosted with the site, not fetched by visitors.
remote={
 'vendor/d3.min.js':'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
 'vendor/topojson-client.min.js':'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js',
 'data/land-110m.json':'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json',
 'vendor/D3-LICENSE':'https://cdn.jsdelivr.net/npm/d3@7.9.0/LICENSE',
 'vendor/TOPOJSON-LICENSE':'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/LICENSE',
 'vendor/WORLD-ATLAS-LICENSE':'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/LICENSE'
}
deps=[]
for dest,url in remote.items():
    error=None
    for attempt in range(3):
        try:
            request=urllib.request.Request(url,headers={'User-Agent':'EarthHealing-static-builder/1.0'})
            with urllib.request.urlopen(request,timeout=45) as response: data=response.read()
            assert len(data)>100
            (OUT/dest).write_bytes(data)
            deps.append({'path':dest,'source':url,'sha256':hashlib.sha256(data).hexdigest()})
            error=None;break
        except Exception as exc:error=exc;time.sleep(attempt+1)
    if error: raise error
world=json.loads((OUT/'data/land-110m.json').read_text());assert world['type']=='Topology'

# Do not trust filenames or ffprobe metadata: decode the actual media.
audit=[];media=[];reference_images=[]
(OUT/'assets'/'reference'/'images').mkdir(parents=True,exist_ok=True)
titles={
 'estate_lifestyle_scenes.mp4':('庄园生活 · 概念片段','Estate life · concept clip'),
 'butterfly_garden_trailer.mp4':('蝴蝶花园 · 概念片段','Butterfly garden · concept clip'),
 'rare_ingredient_expedition.mp4':('香材探索 · 概念片段','Ingredient discovery · concept clip'),
 'provence_estate_sim.mp4':('普罗旺斯庄园 · 概念片段','Provence estate · concept clip'),
 'perfume_lab_tutorial.mp4':('香水工坊 · 概念片段','Perfume atelier · concept clip')
}
for p in sorted((ROOT/'assets/reference/images').glob('*')):
    try:
        pic=Image.open(p);pic.load()
        dest=OUT/'assets'/'reference'/'images'/p.name
        shutil.copy2(p,dest)
        reference_images.append({'id':p.stem,'path':'./assets/reference/images/'+p.name,'width':pic.width,'height':pic.height,'status':'user_reference_web_proxy'})
        audit.append({'file':p.name,'decodable':True,'used':True,'published_path':'./assets/reference/images/'+p.name})
    except Exception as e:audit.append({'file':p.name,'decodable':False,'excluded_reason':str(e)})
write_json(OUT/'data/reference-images.json',reference_images)
for p in sorted((ROOT/'assets/reference/videos').glob('*.mp4')):
    run=subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(p),'-f','null','-'],capture_output=True,text=True,timeout=30)
    valid=run.returncode==0
    audit.append({'file':p.name,'decodable':valid,'error':run.stderr[:200]})
    if valid and p.name in titles:
        probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration:stream=width,height','-of','json',str(p)],capture_output=True,text=True,check=True)
        info=json.loads(probe.stdout)
        assert info.get('streams') and float(info['format']['duration'])>0
        shutil.copy2(p,OUT/'assets/films'/p.name)
        zh,en=titles[p.name]
        media.append({'id':p.stem,'path':'./assets/films/'+p.name,'zh':zh,'en':en,'status':'validated_low_resolution_proxy','width':info['streams'][0].get('width'),'duration':float(info['format']['duration'])})
write_json(OUT/'data/media.json',media)
write_json(REPORT/'media-validation.json',audit)

# All static entry URLs are real HTML; relative resources support project paths and custom domains.
for name in ('map.html','story-provence.html','atlas-lavender.html','story.html','library.html'):
    shutil.copy2(OUT/'index.html',OUT/name)
(OUT/'.nojekyll').touch()
(OUT/'404.html').write_text('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Earth Healing</title><body style="background:#fcf8f0;color:#572366;font:20px Georgia;padding:12vh 10%"><h1>Earth Healing · 地球疗愈</h1><p>这个故事入口还未开放。 This story has not opened yet.</p><a href="./index.html">返回首页 / Home</a></body></html>',encoding='utf-8')
if (ROOT/'CNAME').exists():shutil.copy2(ROOT/'CNAME',OUT/'CNAME')
(OUT/'ASSET-LICENSES.txt').write_text('Basemap: Natural Earth, public domain; packaged by world-atlas (see vendor license). D3 and TopoJSON: ISC licenses in vendor/. User-provided artwork is illustrative and not historical evidence. Original photos and movies on external source websites remain with their rights holders. They are linked, not republished.\n',encoding='utf-8')
sha=os.environ.get('GITHUB_SHA','local')
release={'release':'2026.09.20-r1','source_commit':sha,'published_stories':len(records),'research_index_records':len(catalog),'validated_video_proxies':len(media),'map':'Natural Earth geographic coastlines, not historical borders','dependency_digests':deps,'google_maps_enabled':bool(google_key),'google_map_id_enabled':bool(google_map_id)}
write_json(OUT/'release.json',release)
write_json(REPORT/'build-summary.json',release)
# Check local HTML resources before allowing deployment.
html=(OUT/'index.html').read_text()
for target in re.findall(r'(?:src|href)="(\./[^"?#]+)',html):
    assert (OUT/target[2:]).exists(),f'Missing HTML resource {target}'
print(json.dumps(release,ensure_ascii=False,indent=2))
