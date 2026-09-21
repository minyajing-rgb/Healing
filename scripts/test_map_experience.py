"""Exercise the enhanced map under normal browser security; preserve all original acceptance checks."""
from __future__ import annotations
import functools,http.server,json,pathlib,threading,traceback
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=ROOT/'_site';REPORT=ROOT/'site-report';REPORT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(Quiet,directory=str(OUT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:8766/'
checks=[];errors=[];bad=[];detail={};initial={}
def check(name,value):
    checks.append({'check':name,'passed':bool(value)});assert value,name
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(args=['--enable-unsafe-swiftshader','--use-angle=swiftshader'])
  context=browser.new_context(viewport={'width':1440,'height':1050},device_scale_factor=1,reduced_motion='reduce')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:bad.append({'url':r.url,'status':r.status}) if r.url.startswith(base) and r.status>=400 else None)
  page.goto(base+'map.html',wait_until='networkidle',timeout=60000)
  page.wait_for_function('window.EARTH_HEALING_MAP?.state().ready',timeout=35000)
  initial=page.evaluate('window.EARTH_HEALING_MAP.state()');print('Map initialization:',initial)
  check('MapLibre engine initialized',page.evaluate("window.EARTH_HEALING_MAP.engine.includes('maplibre')"))
  check('GL map is visible',page.locator('#mapGl').is_visible())
  check('Pins share the published story filter',initial['visible']==page.evaluate('window.EARTH_HEALING.state().visible'))
  check('Nearby places are clustered',page.locator('.is-cluster').count()>0)
  check('Interactive markers exist',page.locator('.eh-map-pin').count()>0)
  check('Desktop no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
  page.locator('.explorer-shell').screenshot(path=str(REPORT/'map-v2-desktop.png'))
  page.locator('[data-year="1750"]').click();page.wait_for_function('window.EARTH_HEALING_MAP.state().visible===8')
  check('1750 drives enhanced map',page.evaluate('window.EARTH_HEALING_MAP.state().visible')==8)
  page.locator('#clearFilters').click();page.locator('#regionFilter').select_option('europe');page.wait_for_function('window.EARTH_HEALING_MAP.state().zoom>2.5')
  check('Region selection moves the camera',page.evaluate('window.EARTH_HEALING_MAP.state().zoom')>2.5)
  page.locator('.explorer-shell').screenshot(path=str(REPORT/'map-v2-europe.png'))
  page.locator('#clearFilters').click();page.locator('[data-theme="animal"]').click();page.wait_for_function('window.EARTH_HEALING_MAP.state().visible===1')
  page.locator('.eh-map-pin[data-story]').first.click()
  check('New pin opens a real sourced story',page.locator('#storyDialog').evaluate('e=>e.open') and page.locator('.source-list a').count()>0)
  page.keyboard.press('Escape');page.locator('#clearFilters').click();page.wait_for_timeout(150)
  before=page.evaluate('window.EARTH_HEALING_MAP.state().zoom');page.locator('#zoomIn').click();page.wait_for_function('window.EARTH_HEALING_MAP.state().zoom>'+str(before))
  check('Zoom controls use new engine',page.evaluate('window.EARTH_HEALING_MAP.state().zoom')>before)
  page.locator('#languageToggle').click();check('Map controls translated','Healing world atlas' in page.locator('.map-style-switch').inner_text())
  page.locator('#regionFilter').select_option('europe');page.wait_for_timeout(300)
  check('Self-hosted atlas remains active',page.evaluate("window.EARTH_HEALING_MAP.state().style")=='garden')
  check('No-key cloud detail control is present',page.locator('[data-map-style="cloud"]').count()==1)
  check('Branded atlas control is visible','Healing world atlas' in page.locator('.map-style-switch').inner_text())
  page.locator('[data-map-style="cloud"]').click()
  page.wait_for_function("window.EARTH_HEALING_MAP.state().style==='cloud'",timeout=15000)
  page.wait_for_function("window.EARTH_HEALING_MAP.state().detailHealth==='loaded'",timeout=20000)
  check('Bible-style OpenFreeMap detail activates without API key',page.evaluate("window.EARTH_HEALING_MAP.engine==='maplibre+openfreemap' && window.EARTH_HEALING_MAP.state().detailHealth==='loaded'"))
  check('Cloud detail can zoom beyond atlas overview',page.evaluate("window.EARTH_HEALING_MAP.state().zoom>=4"))
  page.locator('.explorer-shell').screenshot(path=str(REPORT/'map-openfreemap-detail.png'))
  page.locator('[data-map-style="garden"]').click();page.wait_for_timeout(400)
  check('Return to branded atlas works',page.evaluate("window.EARTH_HEALING_MAP.state().style")=='garden')
  page.locator('#listView').click();check('List alternative remains available',page.locator('#mapList').is_visible())
  mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce');mobile.on('pageerror',lambda e:errors.append(str(e)))
  mobile.goto(base+'map.html',wait_until='networkidle');mobile.wait_for_function('window.EARTH_HEALING_MAP?.state().ready',timeout=35000)
  check('Mobile enhanced engine works',mobile.evaluate("window.EARTH_HEALING_MAP.engine.includes('maplibre')"))
  check('Mobile no horizontal overflow',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
  mobile.locator('.explorer-shell').screenshot(path=str(REPORT/'map-v2-mobile.png'))
  mobile.locator('#fontToggle').click();check('Large text remains within viewport',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
  fallback=browser.new_page(viewport={'width':1000,'height':800});fallback.add_init_script("Object.defineProperty(window,'maplibregl',{get:()=>undefined,set:()=>{}})")
  fallback.goto(base+'map.html',wait_until='networkidle');fallback.wait_for_function('window.EARTH_HEALING_MAP?.state().ready',timeout=35000)
  check('Missing engine falls back safely',fallback.evaluate('window.EARTH_HEALING_MAP.engine')=='svg-fallback')
  fallback.locator('#listView').click();check('Fallback retains readable list',fallback.locator('#mapList').is_visible())
  check('No new runtime errors',not errors);check('No missing local resources',not bad);browser.close()
except Exception:
 (REPORT/'map-v2-failure.txt').write_text(traceback.format_exc());raise
finally:
 server.shutdown();report={'checks':checks,'errors':errors,'http_failures':bad,'initial_state':initial}
 (REPORT/'map-v2-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
