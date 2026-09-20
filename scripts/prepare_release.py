"""Prepare higher-quality artwork and browser-compatible video derivatives."""
import hashlib,json,pathlib,subprocess
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'_site';REPORT=ROOT/'site-report'
parts=sorted((ROOT/'media-source').glob('garden.avif.part*'))
assert len(parts)==2
raw=b''.join(p.read_bytes() for p in parts)
expected='a4da328e715e84ea27a352cc760df1d1b6dcde0ee29a2538c61d993e779abcd0'
assert hashlib.sha256(raw).hexdigest()==expected,'Artwork transfer integrity failed'
(OUT/'assets/garden.avif').write_bytes(raw)
im=Image.open(OUT/'assets/garden.avif');im.load();assert im.width>=1000
im.convert('RGB').save(OUT/'assets/garden.jpg',quality=90,optimize=True)
with (OUT/'assets/PROVENANCE.md').open('a') as f:
    f.write('\nProduction artwork upgrade: user-provided garden crop, AVIF quality 20, 1015x475. SHA-256: '+expected+'\n')
manifest=json.loads((OUT/'data/media.json').read_text())
for item in manifest:
    original=OUT/item['path'].removeprefix('./')
    dest=original.with_suffix('.webm')
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(original),'-an','-c:v','libvpx-vp9','-b:v','0','-crf','26',str(dest)],check=True,timeout=60)
    subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(dest),'-f','null','-'],check=True,capture_output=True,timeout=30)
    item['path']='./'+str(dest.relative_to(OUT));item['mime']='video/webm'
    item['derivative']='VP9 browser-compatible preview; original resolution unchanged'
(OUT/'data/media.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
js=(OUT/'site.js').read_text()
assert "m.mime||'video/webm'" in js,'Media renderer must respect manifest MIME types'
# The approved production hero is the new high-resolution web artwork. Keep the
# legacy garden crop only for provenance/backward compatibility.
hero=OUT/'assets/media/hero-garden.avif'
atlas=OUT/'assets/media/map-atlas.avif'
botanical=OUT/'assets/media/atlas-lavender.avif'
for asset_path in (hero,atlas,botanical):
    pic=Image.open(asset_path);pic.load();assert pic.width>=1000,asset_path
with (OUT/'site.css').open('a') as f:
    f.write('\n/* Layout hardening after real-browser visual review. */\n.button,.secondary{white-space:nowrap;flex-shrink:0}.explorer-search input{min-width:0}.hero-landscape{background-image:url(./assets/media/hero-garden.avif)!important;}\n')
release=json.loads((OUT/'release.json').read_text())
release['artwork_sha256']=expected
release['production_hero_sha256']=hashlib.sha256(hero.read_bytes()).hexdigest()
release['production_map_art_sha256']=hashlib.sha256(atlas.read_bytes()).hexdigest()
release['production_botanical_art_sha256']=hashlib.sha256(botanical.read_bytes()).hexdigest()
release['video_format']='VP9/WebM'
for path in (OUT/'release.json',REPORT/'build-summary.json'):path.write_text(json.dumps(release,ensure_ascii=False,indent=2))
print('Validated high-quality garden crop and',len(manifest),'WebM previews')
