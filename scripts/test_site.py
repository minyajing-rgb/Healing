"""Actual-browser acceptance checks; screenshots are rendered HTML, not mockups."""
from __future__ import annotations
import functools,http.server,json,os,pathlib,threading,traceback
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1];REPORT=ROOT/'site-report';REPORT.mkdir(exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8765),functools.partial(QuietHandler,directory=str(ROOT/'_site')))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=os.environ.get('SITE_URL','http://127.0.0.1:8765/')
records=json.loads((ROOT/'_site/data/stories.json').read_text())['stories']
checks=[];errors=[];bad=[]
def check(name,condition):
    checks.append({'check':name,'passed':bool(condition)});assert condition,name
try:
 with sync_playwright() as p:
  browser=p.chromium.launch()
  context=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1,locale='zh-CN',reduced_motion='reduce')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:bad.append({'url':r.url,'status':r.status}) if r.status>=400 and r.url.startswith(base) else None)
  response=page.goto(base,wait_until='networkidle',timeout=60000);page.wait_for_function('window.EARTH_HEALING_READY===true',timeout=30000)
  check('Homepage returns HTTP 200',response.status==200)
  state=page.evaluate('window.EARTH_HEALING.state()')
  check('Published stories and unreviewed index are separate',state['published']==len(records) and state['research']>=500)
  check('Actual geographic basemap loads',state['mapReady'] and page.locator('.land').count()==1)
  check('All published map points render',page.locator('.pin').count()==len(records))
  check('Garden artwork decodes in browser',page.evaluate("async()=>{let i=new Image();i.src='./assets/garden.avif';await i.decode();return i.naturalWidth>=1000}"))
  check('Desktop no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
  page.screenshot(path=str(REPORT/'desktop-home.png'),full_page=False)
  page.locator('.explorer-shell').screenshot(path=str(REPORT/'desktop-map.png'))
  for year in (1750,800):
   page.locator('[data-year="'+str(year)+'"]').click()
   check('Temporal filter '+str(year),page.locator('.pin').count()==sum(s['from']<=year for s in records))
  page.locator('#clearFilters').click();page.locator('#regionFilter').select_option('oceania')
  check('Regional filter',page.locator('.pin').count()==sum(s['region']=='oceania' for s in records))
  page.locator('#clearFilters').click();page.locator('[data-theme="animal"]').click()
  check('Animal-assisted theme',page.locator('.pin').count()==sum('animal' in s['themes'] for s in records))
  page.locator('#storyRail [data-story]').first.click()
  check('Story contains prose and source links',page.locator('#storyDialog').evaluate('(e)=>e.open') and page.locator('.source-list a').count()>0 and len(page.locator('.story-text').inner_text())>200)
  page.locator('[data-save]').click();check('Local bookmark persists',page.locator('[data-save]').get_attribute('aria-pressed')=='true')
  page.keyboard.press('Escape');check('Escape closes dialog',not page.locator('#storyDialog').evaluate('(e)=>e.open'))
  page.locator('#clearFilters').click();page.locator('#query').fill('Gnawa')
  check('Bilingual search filters map',page.locator('.pin').count()>=1 and page.locator('.pin').count()<len(records))
  page.locator('#listView').click();check('Map has a list alternative',page.locator('#mapList').is_visible())
  page.locator('#mapView').click();page.locator('#clearFilters').click();page.locator('#languageToggle').click()
  check('English interface',page.locator('html').get_attribute('lang')=='en' and 'A world of places.' in page.locator('h1').inner_text())
  page.locator('[data-theme="water"]').click();check('English thematic search',page.locator('.pin').count()==sum('water' in s['themes'] for s in records))
  page.locator('#clearFilters').click();page.locator('#playTimeline').click()
  check('Playback starts',page.evaluate('window.EARTH_HEALING.state().playing'))
  before=page.evaluate('window.EARTH_HEALING.state().year');page.wait_for_timeout(1950)
  check('Playback advances time',page.evaluate('window.EARTH_HEALING.state().year')!=before)
  page.locator('#playTimeline').click();check('Playback pauses',not page.evaluate('window.EARTH_HEALING.state().playing'))
  page.locator('#clearFilters').click();page.locator('#includeResearch').check();page.locator('#librarySearch').fill('Lavender')
  check('Research catalogue searchable',page.locator('#libraryGrid [data-research]').count()>=1)
  page.locator('#libraryGrid [data-research]').first.click()
  check('Unreviewed item not shown as a finished story','RESEARCH INDEX' in page.locator('#storyContent').inner_text())
  page.keyboard.press('Escape');page.locator('#languageToggle').click()
  page.locator('#includeResearch').uncheck();page.locator('#librarySearch').fill('')
  page.goto(base+'?story=grasse',wait_until='networkidle');page.wait_for_function('window.EARTH_HEALING_READY===true')
  check('Deep link opens selected story','格拉斯' in page.locator('#dialogTitle').inner_text())
  page.locator('#storyDialog').screenshot(path=str(REPORT/'desktop-story.png'))
  page.keyboard.press('Escape');page.evaluate('scrollTo(0,0)');page.screenshot(path=str(REPORT/'desktop-full.png'),full_page=True)
  video_results=[]
  for video in page.locator('video').all():
   video.scroll_into_view_if_needed()
   result=video.evaluate("""async v=>{
     v.muted=true;v.preload='auto';
     await Promise.race([v.play(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('play timeout state='+v.readyState+' error='+(v.error&&v.error.message))),15000))]);
     await new Promise(r=>setTimeout(r,300));
     const out={source:v.currentSrc,width:v.videoWidth,height:v.videoHeight,time:v.currentTime,state:v.readyState};v.pause();return out;
   }""")
   video_results.append(result)
   check('Browser decoded '+result['source'].rsplit('/',1)[-1],result['width']>0 and result['state']>=2)
  (REPORT/'video-browser-check.json').write_text(json.dumps(video_results,indent=2))
  mobile_context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,locale='zh-CN',reduced_motion='reduce')
  mobile=mobile_context.new_page();mobile.on('pageerror',lambda e:errors.append(str(e)))
  mobile.goto(base,wait_until='networkidle');mobile.wait_for_function('window.EARTH_HEALING_READY===true')
  check('Mobile no horizontal overflow',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
  mobile.screenshot(path=str(REPORT/'mobile-home.png'),full_page=False)
  mobile.locator('.explorer-shell').screenshot(path=str(REPORT/'mobile-map.png'))
  mobile.locator('#fontToggle').click();check('Large-text mode no horizontal overflow',mobile.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
  mobile.locator('#fontToggle').click();mobile.locator('#listView').click();check('Mobile list navigation',mobile.locator('#mapList').is_visible())
  mobile_context.close();check('No runtime JavaScript errors',not errors);check('All requested local resources load',not bad)
  browser.close()
except Exception:
 (REPORT/'failure.txt').write_text(traceback.format_exc());raise
finally:
 server.shutdown()
 report={'base_url':base,'checks':checks,'errors':errors,'http_failures':bad}
 (REPORT/'browser-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
