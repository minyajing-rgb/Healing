/* Earth Healing: progressive map enhancement. The SVG/list remains the fallback. */
'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const text = (zh,en) => document.documentElement.lang.startsWith('zh') ? zh : en;
  const language = () => document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const reduce = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
  let map, data=[], markers=[], activeStyle='garden', activeRegion='all', scheduled=false, enhanced=false, observer, available=[];
  const palette={plant:'#557657',aroma:'#944373',water:'#287e99',body:'#986735',sound:'#764c9b',mind:'#8173ad',nature:'#4e7867',animal:'#9b714a',ritual:'#bd7255',apothecary:'#7a637c'};
  const glyph={plant:'❧',aroma:'◇',water:'≈',body:'○',sound:'♪',mind:'◌',nature:'△',animal:'♧',ritual:'✦',apothecary:'⚗'};
  const regionViews={all:{center:[18,17],zoom:1.05},asia:{center:[94,29],zoom:2.55},europe:{center:[13,48],zoom:3.5},africa:{center:[16,4],zoom:2.3},americas:{center:[-85,12],zoom:1.8},oceania:{center:[155,-24],zoom:2.3}};
  const duration=()=>reduce()?0:650;
  function node(tag,cls,html=''){const el=document.createElement(tag);el.className=cls;el.innerHTML=html;return el;}
  function current(){return window.EARTH_HEALING?.state()||{year:2026,lang:language(),region:'all'};}
  function visibleStories(){const ids=new Set([...$('storyRail').querySelectorAll('[data-story]')].map(e=>e.dataset.story));return data.filter(s=>ids.has(s.id));}
  function setHint(zh,en){$('mapExperienceHint').textContent=text(zh,en);}
  function home(){const r=regionViews[current().region]||regionViews.all;if(current().region==='all'){map.fitBounds([[-174,-56],[179,74]],{padding:{top:45,bottom:90,left:40,right:55},maxZoom:2,duration:duration(),bearing:0,pitch:0});}else{map.easeTo({...r,bearing:0,pitch:0,duration:duration()});}}
  function focus(s){if(!map||!s)return;map.easeTo({center:s.coordinates,zoom:Math.max(map.getZoom(),activeStyle==='detail'?8:4.2),duration:duration()});}
  function translate(){
    document.querySelectorAll('[data-map-zh]').forEach(e=>e.textContent=e.getAttribute('data-map-'+language()));
    $('mapEngineStatus').textContent=enhanced?text('交互地图 · MapLibre','Interactive map · MapLibre'):text('轻量地图','Lightweight map');
    setHint(activeStyle==='detail'?'现代地理细节 · 外部地图服务':'地理轮廓 · 本站加载 · 不表示历史国界',activeStyle==='detail'?'Present-day geography · external map service':'Geographic coastlines · hosted here · not historical borders');
    if(enhanced){if(activeStyle==='detail'&&map.isStyleLoaded()){for(const l of map.getStyle().layers||[]){if(l.type==='symbol'&&l.layout?.['text-field'])map.setLayoutProperty(l.id,'text-field',['coalesce',['get',language()==='zh'?'name:zh':'name:en'],['get','name']]);}}drawMarkers();}
  }
  function controls(){
    if(location.pathname.endsWith('map.html'))document.body.classList.add('map-focused-page');
    const bar=node('div','map-experience-bar','<div class="map-mode-title"><span>EARTH HEALING ATLAS</span><strong data-map-zh="每一处，都有照护的故事" data-map-en="Every place has a story of care"></strong></div><div class="map-style-switch" role="group" aria-label="Map style"><button type="button" data-map-style="garden" class="chosen" aria-pressed="true"><i></i><span data-map-zh="花园图谱" data-map-en="Garden atlas"></span></button><button type="button" data-map-style="detail" aria-pressed="false"><i></i><span data-map-zh="地理细节" data-map-en="Geographic detail"></span></button></div><button type="button" id="mapFullscreen" class="map-expand" data-map-zh="⛶ 全屏地图" data-map-en="⛶ Full screen"></button>');
    $('mapCanvas').parentElement.before(bar);
    const canvas=$('mapCanvas');
    canvas.appendChild(node('div','map-engravings','<span>❧</span><span>✧</span>'));
    canvas.appendChild(node('div','map-bottom-note','<span class="map-botanical-mark">❧</span><div><strong data-map-zh="跟随好奇，走进一个地方。" data-map-en="Follow curiosity into a place."></strong><small id="mapExperienceHint"></small></div>'));
    const status=node('span','map-engine-status');status.id='mapEngineStatus';$('visibleCount').after(status);
    bar.querySelectorAll('[data-map-style]').forEach(b=>b.addEventListener('click',()=>changeStyle(b.dataset.mapStyle)));
    $('mapFullscreen').addEventListener('click',async()=>{
      const shell=document.querySelector('.explorer-shell');
      try{if(document.fullscreenElement){await document.exitFullscreen();}else if(shell.requestFullscreen){await shell.requestFullscreen();}else{shell.classList.toggle('map-expanded');}}catch{shell.classList.toggle('map-expanded');}
      setTimeout(()=>map?.resize(),80);
    });
    document.addEventListener('fullscreenchange',()=>map?.resize());
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelector('.explorer-shell').classList.remove('map-expanded');map?.resize();}});
    document.querySelectorAll('[data-map-style]').forEach(b=>b.disabled=true);
    translate();
  }
  function localStyle(land){
    const graticule=window.d3.geoGraticule10();
    return {version:8,name:'Earth Healing — Garden Atlas',sources:{land:{type:'geojson',data:land,attribution:'<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>'},grid:{type:'geojson',data:graticule}},layers:[
      {id:'ocean',type:'background',paint:{'background-color':'#c2e2e1'}},
      {id:'latitude',type:'line',source:'grid',paint:{'line-color':'#f5fcf6','line-width':0.6,'line-opacity':0.7}},
      {id:'shore-halo',type:'line',source:'land',paint:{'line-color':'#a3cac3','line-width':9,'line-blur':6}},
      {id:'islands',type:'fill',source:'land',paint:{'fill-color':'#f4eddc'}},
      {id:'coastline',type:'line',source:'land',paint:{'line-color':'#bcab7b','line-width':0.65}}
    ]};
  }
  let gardenStyle, switching=0;
  async function changeStyle(style){
    if(!enhanced)return;
    const seq=++switching;
    if(style==='detail'){
      setHint('正在载入地理细节……','Loading geographic details…');
      try{
        const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),10000);
        let r;try{r=await fetch('https://tiles.openfreemap.org/styles/positron',{signal:abort.signal});}finally{clearTimeout(timeout);}
        if(!r.ok)throw new Error('Map source unavailable');const s=await r.json();if(seq!==switching)return;
        s.name='Earth Healing — Geographic Garden';
        s.layers=s.layers.filter(l=>!(/poi|housenumber|aeroway|airport|boundary/i.test(l.id)));
        for(const l of s.layers){l.paint={...(l.paint||{})};const id=l.id.toLowerCase();
          if(l.type==='background')l.paint['background-color']='#f8f3e8';
          if(l.type==='fill')l.paint['fill-color']=/water/.test(id)?'#c2e2e1':/park|wood|forest|grass|landcover/.test(id)?'#dbe6cb':/building/.test(id)?'#e9ddc8':'#f4eddc';
          if(l.type==='line')l.paint['line-color']=/water/.test(id)?'#88bdbf':/motorway|trunk|primary/.test(id)?'#ccae77':'#e0d2b7';
          if(l.type==='symbol'&&l.layout?.['text-field']){l.paint['text-color']='#695970';l.paint['text-halo-color']='#fffaf0';l.paint['text-halo-width']=1.6;l.layout['text-field']=['coalesce',['get',language()==='zh'?'name:zh':'name:en'],['get','name']];}
        }
        activeStyle='detail';map.setMaxZoom(16);map.setStyle(s);
      }catch{if(seq!==switching)return;activeStyle='garden';map.setMaxZoom(6);map.setStyle(gardenStyle);setHint('地理服务暂不可用；仍可探索本站花园图谱。','Detail service unavailable; the local garden atlas remains available.');return;}
    }else{activeStyle='garden';map.setMaxZoom(6);map.setStyle(gardenStyle);}
    $('mapCanvas').dataset.mapStyle=activeStyle;
    document.querySelectorAll('[data-map-style]').forEach(b=>{b.classList.toggle('chosen',b.dataset.mapStyle===activeStyle);b.setAttribute('aria-pressed',String(b.dataset.mapStyle===activeStyle));});translate();
  }
  function cluster(items){
    const groups=[];
    for(const s of items){const p=map.project(s.coordinates);if(p.x<-40||p.x>map.getContainer().clientWidth+40||p.y<-40||p.y>map.getContainer().clientHeight+40)continue;
      let g=groups.find(g=>Math.hypot(g.p.x-p.x,g.p.y-p.y)<58);
      if(g)g.stories.push(s);else groups.push({p,stories:[s]});
    }return groups;
  }
  function drawMarkers(){
    if(!enhanced||!map)return;markers.forEach(m=>m.remove());markers=[];available=visibleStories();
    for(const group of cluster(available)){
      const s=group.stories[0],isCluster=group.stories.length>1,lang=language();
      const wrap=node('div','eh-map-marker'+(isCluster?' is-cluster':''));
      const b=node('button','eh-map-pin');b.type='button';b.style.setProperty('--pin-color',palette[s.themes[0]]||'#775983');
      const title=isCluster?text(group.stories.length+' 个故事，点击展开',group.stories.length+' stories — zoom in'):s[lang].title+' · '+s[lang].place;
      b.setAttribute('aria-label',title);b.title=title;
      b.innerHTML='<span class="eh-pin-ring">'+(isCluster?group.stories.length:glyph[s.themes[0]]||'❧')+'</span>';
      if(!isCluster)b.dataset.story=s.id;
      b.addEventListener('click',()=>{
        if(isCluster){const bounds=new maplibregl.LngLatBounds();group.stories.forEach(x=>bounds.extend(x.coordinates));map.fitBounds(bounds,{padding:90,maxZoom:activeStyle==='garden'?5.7:12,duration:duration()});}
        else focus(s);
      });
      const shortPlace=s[lang].place.split(' · ')[0];
      const label=node('span','eh-pin-label',esc(isCluster?text('展开 '+group.stories.length+' 个故事',group.stories.length+' stories'):shortPlace));
      if(!isCluster)label.innerHTML+='<small>'+esc(s[lang].title)+'</small>';
      wrap.append(b,label);markers.push(new maplibregl.Marker({element:wrap,anchor:'center'}).setLngLat(s.coordinates).addTo(map));
    }
    const r=current().region;
    if(r!==activeRegion){activeRegion=r;home();}
    $('mapEngineStatus').textContent=text('交互地图 · MapLibre','Interactive map · MapLibre');
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;drawMarkers();});}
  async function enhance(){
    const r=await fetch('./data/stories.json');if(!r.ok)throw new Error('Story data unavailable');data=(await r.json()).stories.filter(s=>s.status==='published');
    if(!window.maplibregl||!maplibregl.supported())throw new Error('WebGL unavailable');
    const res=await fetch('./data/land-50m.json');if(!res.ok)throw new Error('Basemap unavailable');const world=await res.json();
    const land=topojson.feature(world,world.objects.land||Object.values(world.objects)[0]);gardenStyle=localStyle(land);
    const pane=node('div','map-gl-pane');pane.id='mapGl';pane.setAttribute('aria-label',text('可交互疗愈地图','Interactive healing map'));$('mapCanvas').prepend(pane);
    map=new maplibregl.Map({container:pane,style:gardenStyle,center:[18,17],zoom:1.05,minZoom:0,maxZoom:6,renderWorldCopies:false,attributionControl:{compact:false},dragRotate:false,pitchWithRotate:false,touchPitch:false,canvasContextAttributes:{preserveDrawingBuffer:true}});
    map.touchZoomRotate.disableRotation();map.scrollZoom.disable();
    let initFailed=false;
    map.on('error',()=>{if(enhanced&&activeStyle==='detail'){changeStyle('garden');setHint('外部地图加载不稳，已回到本站图谱。','External map unavailable; returned to the local atlas.');}else if(!enhanced)initFailed=true;});
    await new Promise((resolve,reject)=>{map.once('load',resolve);setTimeout(()=>{if(!map.loaded())reject(new Error('Map initialization timeout'));},16000);});
    if(initFailed&&!map.isStyleLoaded())throw new Error('Map could not initialize');
    enhanced=true;$('mapCanvas').classList.add('map-enhanced');document.body.classList.add('map-experience-ready');
    $('worldSvg').setAttribute('aria-hidden','true');$('worldSvg').querySelectorAll('.pin').forEach(p=>p.tabIndex=-1);
    document.querySelectorAll('[data-map-style]').forEach(b=>b.disabled=true);
    document.querySelectorAll('[data-map-style]').forEach(b=>b.disabled=false);
    observer=new MutationObserver(()=>{schedule();$('worldSvg').querySelectorAll('.pin').forEach(p=>p.tabIndex=-1);});observer.observe($('storyRail'),{childList:true});
    new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    new ResizeObserver(()=>map.resize()).observe($('mapCanvas'));
    map.on('moveend',schedule);map.on('zoomend',schedule);map.on('style.load',schedule);
    for(const [id,action] of Object.entries({zoomIn:()=>map.zoomIn({duration:duration()}),zoomOut:()=>map.zoomOut({duration:duration()}),zoomReset:home})){
      $(id).addEventListener('click',e=>{e.stopImmediatePropagation();action();},true);
    }
    $('mapView').addEventListener('click',()=>setTimeout(()=>{map.resize();schedule();},30));
    $('clearFilters').addEventListener('click',()=>setTimeout(home,0));
    document.addEventListener('click',e=>{const target=e.target.closest('[data-map-story],[data-story]');if(!target)return;const s=data.find(s=>s.id===(target.dataset.mapStory||target.dataset.story));if(s)setTimeout(()=>focus(s),20);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.fullscreenElement){document.querySelector('.explorer-shell').classList.remove('map-expanded');map.resize();}});
    window.EARTH_HEALING_MAP={engine:'maplibre',state:()=>({ready:enhanced,style:activeStyle,visible:available.length,markers:markers.length,zoom:map.getZoom(),center:map.getCenter().toArray()}),setStyle:changeStyle,reset:home};
    home();translate();drawMarkers();
  }
  controls();
  let attempts=0;
  const ready=setInterval(()=>{if(window.EARTH_HEALING_READY){clearInterval(ready);enhance().catch(()=>{
    if(map){try{map.remove();}catch{}}$('mapGl')?.remove();$('mapCanvas').classList.remove('map-enhanced');
    setHint('轻量地图模式 · 地区、年代与故事仍可使用','Lightweight map · regions, timeline and stories remain available');
    window.EARTH_HEALING_MAP={engine:'svg-fallback',state:()=>({ready:true,style:'fallback'})};
  });}else if(++attempts>600){clearInterval(ready);}},50);
})();
