/* Earth Healing: progressive map enhancement. SVG and readable lists remain fallbacks. */
'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const language=()=>document.documentElement.lang.startsWith('zh')?'zh':'en';
  const text=(zh,en)=>language()==='zh'?zh:en;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const duration=()=>matchMedia('(prefers-reduced-motion:reduce)').matches?0:650;
  let map,data=[],markers=[],activeStyle='garden',activeRegion='all',scheduled=false,enhanced=false,available=[],gardenStyle,switching=0,detailTimer,detailHealth='not_requested',popup;
  const palette={plant:'#557657',aroma:'#944373',water:'#287e99',body:'#986735',sound:'#764c9b',mind:'#8173ad',nature:'#4e7867',animal:'#9b714a',ritual:'#bd7255',apothecary:'#7a637c'};
  const glyph={plant:'❧',aroma:'◇',water:'≈',body:'○',sound:'♪',mind:'◌',nature:'△',animal:'♧',ritual:'✦',apothecary:'⚗'};
  const views={all:{center:[18,17],zoom:1.05},asia:{center:[94,29],zoom:2.55},europe:{center:[13,48],zoom:3.5},africa:{center:[16,4],zoom:2.3},americas:{center:[-85,12],zoom:1.8},oceania:{center:[155,-24],zoom:2.3}};
  function node(tag,cls,html=''){const e=document.createElement(tag);e.className=cls;e.innerHTML=html;return e;}
  const current=()=>window.EARTH_HEALING?.state()||{year:2026,region:'all'};
  function visibleStories(){const ids=new Set([...$('storyRail').querySelectorAll('[data-story]')].map(e=>e.dataset.story));return data.filter(s=>ids.has(s.id));}
  function hint(zh,en){$('mapExperienceHint').textContent=text(zh,en);}
  function home(){if(!map)return;const r=views[current().region]||views.all;if(current().region==='all')map.fitBounds([[-174,-56],[179,74]],{padding:{top:45,bottom:90,left:40,right:55},maxZoom:activeStyle==='cloud'?2.4:2,duration:duration(),bearing:activeStyle==='cloud'?8:0,pitch:activeStyle==='cloud'?35:0});else map.easeTo({...r,zoom:Math.max(r.zoom||3.3,activeStyle==='cloud'?5.2:4.4),bearing:activeStyle==='cloud'?8:0,pitch:activeStyle==='cloud'?48:0,duration:duration()});}
  function focus(s){if(!map||!s)return;map.flyTo({center:s.coordinates,zoom:Math.max(map.getZoom(),activeStyle==='cloud'?12:5.2),pitch:activeStyle==='cloud'?52:0,bearing:activeStyle==='cloud'?8:0,duration:activeStyle==='cloud'?1800:duration(),essential:true});}
  function updateStyleButtons(){document.querySelectorAll('[data-map-style]').forEach(b=>{b.disabled=b.dataset.mapStyle==='cloud'?false:!enhanced;b.classList.toggle('chosen',b.dataset.mapStyle===activeStyle);b.setAttribute('aria-pressed',String(b.dataset.mapStyle===activeStyle));});$('mapCanvas').dataset.mapStyle=activeStyle;}
  function translate(){
    document.querySelectorAll('[data-map-zh]').forEach(e=>e.textContent=e.getAttribute('data-map-'+language()));
    $('mapEngineStatus').textContent=activeStyle==='cloud'?text('云端地图 · MapLibre / OpenFreeMap','Cloud map · MapLibre / OpenFreeMap'):(enhanced?text('疗愈世界图谱 · MapLibre','Healing world atlas · MapLibre'):text('轻量地图','Lightweight map'));
    hint(activeStyle==='cloud'?'OpenFreeMap 云端细节 · 可放大到城镇与街道 · 无需 API Key':'疗愈图谱 · 地点、年代与 Story 联动',activeStyle==='cloud'?'OpenFreeMap cloud detail · zoom to towns and streets · no API key required':'Healing atlas · place, time and Story stay synchronized');
    if(enhanced){if(activeStyle==='cloud'&&map.isStyleLoaded())for(const l of map.getStyle().layers||[])if(l.type==='symbol'&&l.layout?.['text-field'])try{map.setLayoutProperty(l.id,'text-field',['coalesce',['get',language()==='zh'?'name:zh':'name:en'],['get','name']]);}catch{}drawMarkers();}
  }
  function controls(){
    if(location.pathname.endsWith('map.html'))document.body.classList.add('map-focused-page');
    const bar=node('div','map-experience-bar','<div class="map-mode-title"><span>EARTH HEALING ATLAS</span><strong data-map-zh="每一处，都有照护的故事" data-map-en="Every place has a story of care"></strong></div><div class="map-style-switch" role="group" aria-label="Map style"><button type="button" data-map-style="garden" class="chosen" aria-pressed="true"><i></i><span data-map-zh="疗愈世界图谱" data-map-en="Healing world atlas"></span></button><button type="button" data-map-style="cloud" aria-pressed="false"><i></i><span data-map-zh="云端地图" data-map-en="Cloud detail map"></span></button></div><button type="button" id="mapFullscreen" class="map-expand" data-map-zh="⛶ 全屏地图" data-map-en="⛶ Full screen"></button>');
    $('mapCanvas').parentElement.before(bar);
    $('mapCanvas').appendChild(node('div','map-engravings','<span>❧</span><span>✧</span>'));
    $('mapCanvas').appendChild(node('div','map-bottom-note','<span class="map-botanical-mark">❧</span><div><strong data-map-zh="跟随好奇，走进一个地方。" data-map-en="Follow curiosity into a place."></strong><small id="mapExperienceHint"></small></div>'));
    const status=node('span','map-engine-status');status.id='mapEngineStatus';$('visibleCount').after(status);
    bar.querySelectorAll('[data-map-style]').forEach(b=>b.addEventListener('click',()=>changeStyle(b.dataset.mapStyle)));
    $('mapFullscreen').addEventListener('click',async()=>{const shell=document.querySelector('.explorer-shell');try{if(document.fullscreenElement)await document.exitFullscreen();else if(shell.requestFullscreen)await shell.requestFullscreen();else shell.classList.toggle('map-expanded');}catch{shell.classList.toggle('map-expanded');}setTimeout(()=>map?.resize(),80);});
    document.addEventListener('fullscreenchange',()=>map?.resize());
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelector('.explorer-shell').classList.remove('map-expanded');map?.resize();}});
    updateStyleButtons();translate();
  }
  function localStyle(land){return {version:8,name:'Earth Healing — Garden Atlas',sources:{land:{type:'geojson',data:land,attribution:'<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>'},grid:{type:'geojson',data:window.d3.geoGraticule10()}},layers:[
    {id:'ocean',type:'background',paint:{'background-color':'rgba(72,139,168,0.78)'}},
    {id:'latitude',type:'line',source:'grid',paint:{'line-color':'#fff9df','line-width':0.55,'line-opacity':0.28}},
    {id:'shore-halo',type:'line',source:'land',paint:{'line-color':'#f6dfa2','line-width':7,'line-blur':5,'line-opacity':0.52}},
    {id:'islands',type:'fill',source:'land',paint:{'fill-color':'rgba(218,211,161,0.90)','fill-opacity':0.92}},
    {id:'coastline',type:'line',source:'land',paint:{'line-color':'#d8ac4c','line-width':1.15,'line-opacity':0.92}}
  ]};}
  function restoreGarden(failed=false){clearTimeout(detailTimer);activeStyle='garden';if(failed)detailHealth='fallback';map.setMaxZoom(8);map.scrollZoom.disable();try{map.dragRotate.disable();map.touchZoomRotate.disableRotation();}catch{}map.setStyle(gardenStyle);map.easeTo({pitch:0,bearing:0,duration:duration()});updateStyleButtons();translate();}
  async function changeStyle(style){
    if(!enhanced)return;
    if(style!=='cloud'){restoreGarden();return;}
    popup?.remove();clearTimeout(detailTimer);activeStyle='cloud';detailHealth='loading';updateStyleButtons();translate();
    map.setMaxZoom(19);map.scrollZoom.enable();try{map.dragRotate.enable();map.touchZoomRotate.enableRotation();}catch{}
    let settled=false;
    const finish=()=>{if(settled||activeStyle!=='cloud')return;settled=true;detailHealth='loaded';updateStyleButtons();translate();home();schedule();};
    const fail=()=>{if(settled)return;settled=true;restoreGarden(true);hint('云端地图暂不可用，已回到疗愈世界图谱。','Cloud map unavailable; returned to the healing atlas.');};
    const onError=()=>fail();
    map.once('style.load',finish);map.once('error',onError);
    detailTimer=setTimeout(fail,14000);
    try{map.setStyle(detailStyle);}catch{fail();}
  }
  function cluster(items){const groups=[];for(const s of items){const p=map.project(s.coordinates);if(p.x<-40||p.x>map.getContainer().clientWidth+40||p.y<-40||p.y>map.getContainer().clientHeight+40)continue;const g=groups.find(g=>Math.hypot(g.p.x-p.x,g.p.y-p.y)<58);if(g)g.stories.push(s);else groups.push({p,stories:[s]});}return groups;}
  function openCluster(group){
    const bounds=new maplibregl.LngLatBounds();group.stories.forEach(s=>bounds.extend(s.coordinates));
    const same=group.stories.every(s=>Math.abs(s.coordinates[0]-group.stories[0].coordinates[0])<0.0001&&Math.abs(s.coordinates[1]-group.stories[0].coordinates[1])<0.0001);
    if(same||map.getZoom()>=(activeStyle==='garden'?5.6:11.9)){
      const list=node('div','eh-cluster-list',group.stories.map(s=>'<button type="button" data-story="'+esc(s.id)+'">'+esc(s[language()].title)+'</button>').join(''));
      popup?.remove();popup=new maplibregl.Popup({offset:24,maxWidth:'280px'}).setLngLat(group.stories[0].coordinates).setDOMContent(list).addTo(map);
    }else map.fitBounds(bounds,{padding:90,maxZoom:activeStyle==='garden'?5.7:12,duration:duration()});
  }
  function drawMarkers(){
    if(!enhanced||!map)return;markers.forEach(m=>m.remove());markers=[];available=visibleStories();
    for(const group of cluster(available)){
      const s=group.stories[0],multiple=group.stories.length>1,lang=language();
      const wrap=node('div','eh-map-marker'+(multiple?' is-cluster':'')),b=node('button','eh-map-pin');b.type='button';b.style.setProperty('--pin-color',palette[s.themes[0]]||'#775983');
      const title=multiple?text(group.stories.length+' 个故事，点击展开',group.stories.length+' stories — zoom in'):s[lang].title+' · '+s[lang].place;
      b.setAttribute('aria-label',title);b.title=title;b.innerHTML='<span class="eh-pin-ring"><span>'+esc(multiple?group.stories.length:glyph[s.themes[0]]||'❧')+'</span></span>';
      if(!multiple)b.dataset.story=s.id;b.addEventListener('click',()=>multiple?openCluster(group):focus(s));
      const label=node('span','eh-pin-label',esc(multiple?text('展开 '+group.stories.length+' 个故事',group.stories.length+' stories'):s[lang].place.split(' · ')[0]));if(!multiple)label.innerHTML+='<small>'+esc(s[lang].title)+'</small>';
      wrap.append(b,label);markers.push(new maplibregl.Marker({element:wrap,anchor:'center'}).setLngLat(s.coordinates).addTo(map));
    }
    const r=current().region;if(r!==activeRegion){activeRegion=r;home();}
    $('mapEngineStatus').textContent=activeStyle==='cloud'?text('云端地图 · MapLibre / OpenFreeMap','Cloud map · MapLibre / OpenFreeMap'):text('疗愈世界图谱 · MapLibre','Healing world atlas · MapLibre');
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;drawMarkers();});}
  async function enhance(){
    const r=await fetch('./data/stories.json');if(!r.ok)throw new Error('Story data unavailable');data=(await r.json()).stories.filter(s=>s.status==='published');
    // MapLibre 5 has no public supported() export. Construct the map and handle actual WebGL errors.
    if(!window.maplibregl||typeof maplibregl.Map!=='function')throw new Error('Map engine unavailable');
    const res=await fetch('./data/land-50m.json');if(!res.ok)throw new Error('Basemap unavailable');const world=await res.json();gardenStyle=localStyle(topojson.feature(world,world.objects.land||Object.values(world.objects)[0]));
    const pane=node('div','map-gl-pane');pane.id='mapGl';pane.setAttribute('aria-label',text('可交互疗愈地图','Interactive healing map'));$('mapCanvas').prepend(pane);
    map=new maplibregl.Map({container:pane,style:gardenStyle,center:[18,17],zoom:1.05,minZoom:-1,maxZoom:6,renderWorldCopies:false,attributionControl:{compact:false},dragRotate:false,pitchWithRotate:false,touchPitch:false,canvasContextAttributes:{preserveDrawingBuffer:true}});
    map.touchZoomRotate.disableRotation();map.scrollZoom.disable();map.addControl(new maplibregl.NavigationControl({showCompass:true}),"bottom-left");
    let initError;
    map.on('error',event=>{if(!enhanced)initError=event.error;});
    await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(initError||new Error('Map initialization timeout')),16000);map.once('load',()=>{clearTimeout(timeout);resolve();});});
    enhanced=true;$('mapCanvas').classList.add('map-enhanced');document.body.classList.add('map-experience-ready');$('worldSvg').setAttribute('aria-hidden','true');
    const hideSvgPins=()=>$('worldSvg').querySelectorAll('.pin').forEach(p=>p.setAttribute('tabindex','-1'));hideSvgPins();updateStyleButtons();
    new MutationObserver(()=>{schedule();hideSvgPins();}).observe($('storyRail'),{childList:true});
    new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    new ResizeObserver(()=>map.resize()).observe($('mapCanvas'));
    map.on('moveend',schedule);map.on('zoomend',schedule);map.on('style.load',schedule);
    for(const [id,action] of Object.entries({zoomIn:()=>map.zoomIn({duration:duration()}),zoomOut:()=>map.zoomOut({duration:duration()}),zoomReset:home}))$(id).addEventListener('click',e=>{e.stopImmediatePropagation();action();},true);
    $('mapView').addEventListener('click',()=>setTimeout(()=>{map.resize();schedule();},30));$('clearFilters').addEventListener('click',()=>setTimeout(home,0));
    document.addEventListener('click',e=>{const target=e.target.closest('[data-map-story],[data-story]');if(!target)return;const s=data.find(s=>s.id===(target.dataset.mapStory||target.dataset.story));if(s)setTimeout(()=>focus(s),20);});
    window.EARTH_HEALING_MAP={engine:'maplibre+openfreemap',state:()=>({ready:enhanced,style:activeStyle,detailHealth,visible:available.length,markers:markers.length,zoom:map.getZoom(),center:map.getCenter().toArray()}),setStyle:changeStyle,reset:home};
    home();translate();drawMarkers();
  }
  controls();let attempts=0;
  const ready=setInterval(()=>{if(window.EARTH_HEALING_READY){clearInterval(ready);enhance().catch(error=>{
    if(map){try{map.remove();}catch{}}map=null;enhanced=false;$('mapGl')?.remove();$('mapCanvas').classList.remove('map-enhanced');updateStyleButtons();
    hint('轻量地图模式 · 地区、年代与故事仍可使用','Lightweight map · regions, timeline and stories remain available');
    window.EARTH_HEALING_MAP={engine:'svg-fallback',state:()=>({ready:true,style:'fallback',reason:String(error.message||error)})};
  });}else if(++attempts>600)clearInterval(ready);},50);
})();
