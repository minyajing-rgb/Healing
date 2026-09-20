'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = value => { try { const u=new URL(value,location.href); return u.protocol==='https:'||u.origin===location.origin?u.href:'#'; } catch { return '#'; } };
  const store={get(k,f){try{return JSON.parse(localStorage.getItem(k))??f;}catch{return f;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}};
  const params=new URLSearchParams(location.search);
  const savedLanguage=store.get('eh-language','zh');
  let lang=['zh','en'].includes(params.get('lang'))?params.get('lang'):(['zh','en'].includes(savedLanguage)?savedLanguage:'zh');
  let year=Number(params.get('year')??2026);if(!Number.isFinite(year))year=2026;year=Math.max(-1600,Math.min(2026,year));
  let theme=params.get('theme')||params.get('filter')||'all';
  let region=params.get('region')||'all', mode='cumulative', query=params.get('q')||'', visible=[], selected=null;
  let stories=[], research=[], media=[], allLoaded=false, mapReady=false, currentDialog=null, pageSize=24, timer=null, svg, viewport, pins, projection, zoom, zoomK=1, toastTimer;
  let saved=new Set(store.get('eh-bookmarks',[]));
  const tx=(zh,en)=>lang==='zh'?zh:en;
  const themes={all:['全部','All','✧'],plant:['植物','Plants','❧'],aroma:['芳香','Aroma','◇'],water:['水与浴','Water','≈'],body:['身体','Body','○'],sound:['声音','Sound','♪'],mind:['冥想','Mind','◌'],nature:['自然','Nature','△'],animal:['动物','Animals','♧'],ritual:['仪式','Ritual','✦'],apothecary:['药师制剂','Apothecary','⚗']};
  if(!themes[theme])theme='all';
  if(!['all','asia','europe','africa','americas','oceania'].includes(region))region='all';
  const paths={
    plant:'<path d="M31 56V19M31 41C13 41 10 29 10 24c13 0 21 5 21 17ZM31 32c17 0 22-12 22-19-15 0-22 9-22 19ZM31 20c-9-8-8-16 0-18 9 4 9 13 0 18Z"/>',
    aroma:'<path d="M26 9h12v9H26zM27 18v7c-12 4-13 8-13 17v12h36V42c0-9-1-13-13-17v-7M21 37h22v12H21zM24 5h16M26 29l13 4"/>',
    water:'<path d="M32 5c-5 9-18 21-18 31a18 18 0 0 0 36 0C50 26 37 14 32 5ZM22 38c0 8 5 11 9 12M8 60h48"/>',
    sound:'<path d="M25 48V13l26-7v36M25 21l26-7"/><ellipse cx="17" cy="49" rx="8" ry="6"/><ellipse cx="43" cy="43" rx="8" ry="6"/><path d="M6 15c-6 5-6 11 0 16M11 18c-3 3-3 7 0 10"/>',
    body:'<circle cx="32" cy="12" r="6"/><path d="M32 21v19M17 25l15 7 15-7M32 39L16 50l-6-5M32 39l16 11 6-5M12 58h40"/>',
    mind:'<path d="M32 50C15 41 14 25 17 17c9 4 15 14 15 24 0-10 6-20 15-24 3 8 2 24-15 33ZM32 50C12 53 4 42 4 34c11-1 22 5 28 16 6-11 17-17 28-16 0 8-8 19-28 16ZM32 35c-8-8-8-18 0-29 8 11 8 21 0 29Z"/>',
    nature:'<path d="M22 5L8 28h8L4 46h16v13M22 5l14 23h-8l12 18H24v13M44 13l12 18h-7l11 16H46v12M40 26l4-13M38 59h22"/>',
    animal:'<path d="M15 41c-5-8-5-19-2-27l10 7c6-3 12-3 18 0l10-7c3 8 3 19-2 27-9 14-25 14-34 0ZM23 32v2M41 32v2M28 41l4 3 4-3M5 39l15 2M44 41l15-2M6 46l14-2M44 44l14 2"/>',
    ritual:'<path d="M12 40h40c-2 11-9 15-20 15S14 51 12 40ZM24 37c-14-12 12-17 0-29M38 37c-12-10 12-15 0-25M25 59h14"/>',
    apothecary:'<path d="M24 5h16M27 5v19L12 48c-3 6 1 9 6 9h28c5 0 9-3 6-9L37 24V5M21 36h22M26 43h1M37 49h1"/>',
    all:'<circle cx="32" cy="32" r="25"/><ellipse cx="32" cy="32" rx="12" ry="25"/><path d="M7 32h50M11 18h42M11 46h42"/>'
  };
  const icon=type=>'<span class="icon" aria-hidden="true"><svg viewBox="0 0 64 64">'+(paths[type]||paths.plant)+'</svg></span>';
  const storyArt={
    grasse:'./assets/media/hero-garden.avif',
    padua:'./assets/media/atlas-lavender.avif',
    chelsea:'./assets/media/atlas-lavender.avif',
    forest:'./assets/media/hero-garden.avif',
    rongoa:'./assets/media/hero-garden.avif',
    ebers:'./assets/media/map-atlas.avif',
    kallawaya:'./assets/media/map-atlas.avif',
    argan:'./assets/media/map-atlas.avif',
    jamu:'./assets/media/atlas-lavender.avif'
  };
  const art=(s,label=false)=>{
    const src=storyArt[s.id];
    if(src)return '<div class="art art-photo" data-art="'+escapeHTML(s.art||s.themes?.[0]||'plant')+'"><img src="'+src+'" alt="" loading="lazy">'+(label?'<span class="art-label">'+tx('概念美术','CONCEPT ARTWORK')+'</span>':'')+'</div>';
    return '<div class="art" data-art="'+escapeHTML(s.art||s.themes?.[0]||'plant')+'">'+icon(s.art==='garden'?'aroma':s.art)+(label?'<span class="art-label">'+tx('概念插画','CONCEPT ILLUSTRATION')+'</span>':'')+'</div>';
  };
  const googleMapsURL=s=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.coordinates[1]+','+s.coordinates[0]);
  const yearText=y=>y<0?(lang==='zh'?'公元前 '+Math.abs(y):Math.abs(y)+' BCE'):(lang==='zh'?'公元 '+(y||1):String(y||1)+' CE');
  function kindText(k){return ({historical_range:tx('历史时期','Historical period'),institution:tx('机构 / 实践里程碑','Institution / practice milestone'),recognition:tx('文化认可年份','Heritage recognition'),research:tx('研究里程碑','Research milestone')})[k]||tx('历史记录','Historical record');}
  function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3000);}
  function stopPlayback(){clearInterval(timer);timer=null;$('playTimeline').setAttribute('aria-pressed','false');$('playTimeline').innerHTML='▶ '+tx('播放时间','Play timeline');}
  function applyLanguage(){
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    document.querySelectorAll('[data-zh]').forEach(el=>{const v=el.getAttribute('data-'+lang);if(v!==null)el.textContent=v.replace(/\\n/g,'\n');});
    $('languageToggle').textContent=lang==='zh'?'EN':'中文';
    $('languageToggle').setAttribute('aria-label',lang==='zh'?'Switch to English':'切换为中文');
    $('query').placeholder=tx('植物、地区、声音、浴疗……','Plants, places, sound, bathing…');
    const regionLabels={all:tx('全球','World'),asia:tx('亚洲','Asia'),europe:tx('欧洲','Europe'),africa:tx('非洲','Africa'),americas:tx('美洲','Americas'),oceania:tx('大洋洲','Oceania')};
    [...$('regionFilter').options].forEach(o=>o.textContent=regionLabels[o.value]);
    $('playTimeline').innerHTML=(timer?'Ⅱ ':'▶ ')+(timer?tx('暂停','Pause'):tx('播放时间','Play timeline'));
    renderPortals();if(allLoaded){renderFeatured();renderExplorer();renderLibrary();renderFilms();if(currentDialog)renderDialog(currentDialog);}
  }
  function renderPortals(){
    $('themePortals').innerHTML=['plant','aroma','water','sound','nature','animal','mind','ritual'].map(t=>'<button class="portal" data-portal="'+t+'">'+icon(t)+'<strong>'+themes[t][lang==='zh'?0:1]+'</strong><small>'+themes[t][1]+'</small></button>').join('');
    $('methodFilters').innerHTML=Object.keys(themes).map(t=>'<button class="filter'+(t===theme?' active':'')+'" data-theme="'+t+'" aria-pressed="'+(t===theme)+'">'+icon(t)+'<span>'+themes[t][lang==='zh'?0:1]+'</span></button>').join('');
  }
  function renderFeatured(){
    const ids=['grasse','forest','gnawa','lum'];
    $('featuredStories').innerHTML=ids.map(id=>stories.find(s=>s.id===id)).filter(Boolean).map(s=>{const t=s[lang];return '<button class="story-card" data-story="'+s.id+'">'+art(s)+'<span class="card-copy"><span class="card-place">'+escapeHTML(t.place)+'</span><h3>'+escapeHTML(t.title)+'</h3><p>'+escapeHTML(t.hook)+'</p><span class="card-date">'+escapeHTML(t.date)+'</span><span class="card-arrow"> ↗</span></span></button>';}).join('');
  }
  function matchesText(s,q){return !q||JSON.stringify([s.zh,s.en,s.themes,s.id]).toLowerCase().includes(q.toLowerCase());}
  function interval(){const end=year===0?1:year;const start=Math.floor(end/100)*100;return [start,end];}
  function filtered(){const [lo,hi]=interval();return stories.filter(s=>(theme==='all'||s.themes.includes(theme))&&(region==='all'||s.region===region)&&matchesText(s,query)&&(mode==='cumulative'?s.from<=year:s.from<=hi&&s.to>=lo));}
  function syncURL(){const u=new URL(location.href);for(const [k,v] of Object.entries({year,theme,region,q:query,lang})){if(v==='all'||v==='')u.searchParams.delete(k);else u.searchParams.set(k,String(v));}history.replaceState(null,'',u);}
  function renderExplorer(){
    visible=filtered();if(selected&&!visible.some(s=>s.id===selected))selected=null;
    $('yearSlider').value=String(year);$('yearLabel').textContent=yearText(year);$('yearSlider').setAttribute('aria-valuetext',yearText(year));
    $('visibleCount').textContent=tx(visible.length+' 个故事 · 已上线 '+stories.length+' 个',visible.length+' visible · '+stories.length+' published');
    document.querySelectorAll('[data-theme]').forEach(b=>{b.classList.toggle('active',b.dataset.theme===theme);b.setAttribute('aria-pressed',String(b.dataset.theme===theme));});
    document.querySelectorAll('[data-year]').forEach(b=>b.classList.toggle('active',Number(b.dataset.year)===year));
    const empty='<div class="empty-state"><strong>'+tx('这一页，还留着空白。','A page still waiting to be filled.')+'</strong>'+tx('当前筛选下没有已上线故事。可以换一个年代、切换“截至此时的记录”，或重置筛选。','No published story matches these filters. Change the year, switch to cumulative records or reset the filters.')+'</div>';
    $('storyRail').innerHTML=visible.length?visible.map(s=>{const t=s[lang];return '<button class="rail-card'+(selected===s.id?' current':'')+'" data-story="'+s.id+'">'+art(s)+'<span><strong>'+escapeHTML(t.title)+'</strong><small>'+escapeHTML(t.place)+'</small><small>'+escapeHTML(t.date)+'</small></span></button>';}).join(''):empty;
    $('mapList').innerHTML=visible.length?visible.map(s=>'<button class="list-item" data-story="'+s.id+'"><strong>'+escapeHTML(s[lang].title)+'</strong><small>'+escapeHTML(s[lang].place)+' · '+escapeHTML(s[lang].date)+'</small></button>').join(''):empty;
    renderPins();syncURL();
  }
  function resizePins(){if(!pins||!svg)return;const b=svg.node().getBoundingClientRect(),ratio=Math.min(b.width/1000,b.height/550)||1;const scale=1/(Math.max(zoomK,.1)*ratio);pins.selectAll('.pin').attr('transform',d=>{const p=projection(d.coordinates);return 'translate('+p[0]+','+p[1]+') scale('+scale+')';});}
  function renderPins(){
    if(!mapReady)return;
    pins.selectAll('.pin').data(visible,d=>d.id).join(enter=>{
      const node=enter.append('g').attr('class','pin').attr('role','button').attr('tabindex',0);
      node.append('circle').attr('r',22).attr('fill','transparent');
      node.append('circle').attr('class','pin-halo').attr('r',19);
      node.append('circle').attr('class','pin-circle').attr('r',12);
      node.append('text');return node;
    },update=>update,exit=>exit.remove()).classed('selected',s=>s.id===selected).attr('aria-label',s=>s[lang].title+' · '+s[lang].place).on('click',(event,s)=>{event.stopPropagation();openStory(s.id);}).on('keydown',(event,s)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openStory(s.id);}}).on('pointerenter',(event,s)=>{
      const t=$('mapTooltip'),r=$('mapCanvas').getBoundingClientRect();t.textContent=s[lang].place+' · '+s[lang].title;t.hidden=false;t.style.left=Math.min(Math.max(5,event.clientX-r.left-70),r.width-255)+'px';t.style.top=Math.max(5,event.clientY-r.top-68)+'px';
    }).on('pointerleave',()=>$('mapTooltip').hidden=true).select('text').text(s=>themes[s.themes[0]]?.[2]||'✧');
    resizePins();
  }
  async function setupMap(){
    if(!window.d3||!window.topojson)throw new Error('Mapping library unavailable');
    const response=await fetch('./data/land-110m.json');if(!response.ok)throw new Error('Basemap unavailable');const world=await response.json();
    svg=d3.select('#worldSvg');projection=d3.geoNaturalEarth1().fitExtent([[20,35],[980,510]],{type:'Sphere'});
    const path=d3.geoPath(projection);viewport=svg.append('g');
    viewport.append('path').datum({type:'Sphere'}).attr('class','sphere').attr('d',path);
    viewport.append('path').datum(d3.geoGraticule10()).attr('class','graticule').attr('d',path);
    const land=topojson.feature(world,world.objects.land||Object.values(world.objects)[0]);
    viewport.append('path').datum(land).attr('class','land').attr('d',path);
    pins=viewport.append('g').attr('class','pins');
    zoom=d3.zoom().scaleExtent([1,7]).translateExtent([[-150,-100],[1150,650]]).on('zoom',event=>{viewport.attr('transform',event.transform);zoomK=event.transform.k;resizePins();});
    svg.call(zoom).on('dblclick.zoom',null);mapReady=true;$('mapLoading').hidden=true;renderPins();
    new ResizeObserver(resizePins).observe($('worldSvg'));
  }
  function resetFilters(){stopPlayback();theme='all';region='all';query='';year=2026;mode='cumulative';$('query').value='';$('regionFilter').value='all';$('timeMode').value=mode;renderExplorer();if(mapReady)svg.call(zoom.transform,d3.zoomIdentity);}
  function mapForStory(id){const s=stories.find(x=>x.id===id);if(!s)return;closeDialog();theme='all';region='all';query='';year=Math.max(s.from,s.to);mode='cumulative';selected=id;$('query').value='';$('regionFilter').value='all';$('timeMode').value=mode;renderExplorer();$('map').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});if(mapReady){const p=projection(s.coordinates);svg.call(zoom.transform,d3.zoomIdentity.translate(500,275).scale(2.7).translate(-p[0],-p[1]));}}
  function closeDialog(){if($('storyDialog').open)$('storyDialog').close();currentDialog=null;document.body.classList.remove('dialog-open');}
  function renderDialog(s){
    const t=s[lang],sourceHTML=s.sources.map(src=>'<li><a href="'+escapeHTML(safeURL(src.url))+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(src.title)+' ↗</a></li>').join('');
    const safety=tx('本页介绍历史与文化，不提供诊断、剂量、针刺或制剂操作指导。医疗效果必须按具体用途、材料、途径与研究分别评估；植物和精油并不因天然而自动安全。','This page introduces history and culture, not diagnosis, dosing or procedural instructions. Medical effects require evaluation of specific uses, materials, routes and studies; natural materials are not automatically safe.');
    $('storyContent').innerHTML='<article class="story-content">'+art(s,true)+'<div class="story-text"><p class="meta">'+escapeHTML(t.place)+' · '+kindText(s.date_kind)+'</p><h2 id="dialogTitle">'+escapeHTML(t.title)+'</h2><p class="hook">'+escapeHTML(t.hook)+'</p><div class="story-tools"><button class="secondary" data-map-story="'+s.id+'">'+tx('在疗愈地图里看','View in Healing Atlas')+'</button><a class="secondary google-place-link" href="'+escapeHTML(googleMapsURL(s))+'" target="_blank" rel="noopener noreferrer">'+tx('Google Maps 看具体地点 ↗','Open exact place in Google Maps ↗')+'</a><button class="secondary" data-save="'+s.id+'" aria-pressed="'+saved.has(s.id)+'">'+(saved.has(s.id)?tx('♥ 已收藏','♥ Saved'):tx('♡ 收藏故事','♡ Save story'))+'</button><button class="secondary" data-share="'+s.id+'">'+tx('分享链接','Share link')+'</button></div>'+t.story.map(p=>'<p>'+escapeHTML(p)+'</p>').join('')+'<details open><summary>'+tx('年代与地点：这一点究竟代表什么？','Time and place: what does this anchor mean?')+'</summary><p><strong>'+escapeHTML(t.date)+'</strong><br>'+escapeHTML(t.date_note)+'</p><p>'+tx('地图坐标用于区域导航，不是起源证明；概念插画也不是历史实物照片。','Map coordinates are for regional navigation, not proof of origin. Concept illustrations are not photographs of historical objects.')+'</p></details><details><summary>'+tx('传统、研究与安全','Tradition, research and safety')+'</summary><p>'+safety+'</p></details><details open><summary>'+tx('原始资料与延伸阅读','Sources and further reading')+'</summary><ul class="source-list">'+sourceHTML+'</ul></details>'+(s.film?'<a class="secondary" target="_blank" rel="noopener noreferrer" href="'+escapeHTML(safeURL(s.film))+'">'+tx('▶ 在官方来源观看纪录片 ↗','▶ Watch the official documentary ↗')+'</a>':'')+'</div></article>';
  }
  function openStory(id){const s=stories.find(x=>x.id===id);if(!s)return;stopPlayback();currentDialog=s;selected=id;$('mapTooltip').hidden=true;renderPins();renderDialog(s);if(!$('storyDialog').open)$('storyDialog').showModal();document.body.classList.add('dialog-open');$('storyDialog').scrollTop=0;}
  function openResearch(id){const r=research.find(x=>x.id===id);if(!r)return;currentDialog=null;const name=lang==='zh'?r.zh:r.en;const q=lang==='zh'?r.zh:r.en;$('storyContent').innerHTML='<article class="story-content">'+art({art:'plant'})+'<div class="story-text"><span class="status-badge pending">'+tx('待研究目录 · 非完整故事','RESEARCH INDEX · NOT A PUBLISHED STORY')+'</span><h2 id="dialogTitle">'+escapeHTML(name)+'</h2><p>'+escapeHTML(r.en)+(r.latin?' · <em>'+escapeHTML(r.latin)+'</em>':'')+'</p><p>'+tx('这个条目已经进入研究目录，但身份、历史年代、具体来源与安全资料尚未逐项核验，因此不会被自动显示为已完成的地图故事。','This item is in the research index. Identity, historical dating, sources and safety details have not all been reviewed, so it is not automatically published as a map story.')+'</p><p>'+tx('待研究目录不是疗效结论，也不提供配方或使用建议。','A research-index record is not an efficacy conclusion, recipe or recommendation.')+'</p><button class="secondary" data-related-query="'+escapeHTML(q)+'">'+tx('查找已上线的相关故事','Search related published stories')+'</button></div></article>';if(!$('storyDialog').open)$('storyDialog').showModal();document.body.classList.add('dialog-open');}
  function renderLibrary(){
    const q=$('librarySearch').value.trim().toLowerCase(),include=$('includeResearch').checked;
    let records=stories.filter(s=>matchesText(s,q)).map(s=>({id:s.id,title:s[lang].title,sub:s[lang].place,live:true}));
    if(include)records=records.concat(research.filter(r=>JSON.stringify(r).toLowerCase().includes(q)).map(r=>({id:r.id,title:lang==='zh'?r.zh:r.en,sub:r.en+(r.latin?' · '+r.latin:''),live:false})));
    $('libraryCount').textContent=tx(records.length+' 条结果 · '+stories.length+' 篇已上线故事；另有 '+research.length+' 条待研究目录',records.length+' results · '+stories.length+' published stories; '+research.length+' research-index records');
    $('libraryGrid').innerHTML=records.length?records.slice(0,pageSize).map(r=>'<button class="library-item" '+(r.live?'data-story':'data-research')+'="'+escapeHTML(r.id)+'"><span class="status-badge'+(r.live?'':' pending')+'">'+(r.live?tx('可阅读故事','PUBLISHED STORY'):tx('待研究目录','RESEARCH INDEX'))+'</span><strong>'+escapeHTML(r.title)+'</strong><small>'+escapeHTML(r.sub)+'</small></button>').join(''):'<p class="empty-state">'+tx('没有匹配结果。也可以勾选“待研究目录”继续查找。','No matches. You can also include the research index.')+'</p>';
    $('moreLibrary').hidden=records.length<=pageSize;
  }
  function renderFilms(){
    const filmStories=stories.filter(s=>s.film);
    let html=filmStories.map(s=>'<article class="film-card">'+art(s)+'<div class="film-copy"><h3>'+escapeHTML(s[lang].title)+'</h3><p>'+tx('官方来源影像 · 外部播放','Official-source film · plays on the source website')+'</p><a href="'+escapeHTML(safeURL(s.film))+'" target="_blank" rel="noopener noreferrer">'+tx('▶ 观看纪录片 ↗','▶ Watch the documentary ↗')+'</a></div></article>').join('');
    html+=media.map((m,i)=>'<article class="film-card"><video controls playsinline preload="metadata" poster="'+['./assets/media/hero-garden.avif','./assets/media/atlas-lavender.avif','./assets/media/map-atlas.avif'][i%3]+'" aria-label="'+escapeHTML(m[lang]||m.en)+'"><source src="'+escapeHTML(m.path)+'" type="'+escapeHTML(m.mime||'video/webm')+'"></video><div class="film-copy"><span class="media-kicker">EARTH HEALING FILM</span><h3>'+escapeHTML(m[lang]||m.en)+'</h3><p>'+tx('用户提供的概念影像 · 用于网站世界观与场景体验，不作为历史证据','User-supplied concept film · part of the visual world, not historical evidence')+'</p></div></article>').join('');
    $('filmGrid').innerHTML=html;
  }
  document.addEventListener('click',async event=>{
    const target=event.target.closest('button,a');if(!target)return;
    if(target.dataset.story){openStory(target.dataset.story);return;}
    if(target.dataset.research){openResearch(target.dataset.research);return;}
    if(target.dataset.mapStory){mapForStory(target.dataset.mapStory);return;}
    if(target.dataset.relatedQuery){closeDialog();$('librarySearch').value=target.dataset.relatedQuery;$('includeResearch').checked=false;renderLibrary();$('library').scrollIntoView();return;}
    if(target.dataset.save){const id=target.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);store.set('eh-bookmarks',[...saved]);if(currentDialog)renderDialog(currentDialog);return;}
    if(target.dataset.share){const u=new URL('./',location.href);u.searchParams.set('story',target.dataset.share);u.searchParams.set('lang',lang);try{await navigator.clipboard.writeText(u.href);toast(tx('故事链接已复制','Story link copied'));}catch{const p=document.createElement('input');p.value=u.href;p.setAttribute('aria-label',tx('可复制的故事链接','Story link to copy'));$('storyContent').appendChild(p);p.focus();p.select();}return;}
    if(target.dataset.portal){stopPlayback();theme=target.dataset.portal;year=2026;query='';region='all';mode='cumulative';$('regionFilter').value=region;$('query').value='';$('timeMode').value=mode;renderExplorer();$('map').scrollIntoView();return;}
    if(target.dataset.theme){stopPlayback();theme=target.dataset.theme;renderExplorer();return;}
    if(target.dataset.year){stopPlayback();year=Number(target.dataset.year);renderExplorer();}
  });
  $('languageToggle').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';store.set('eh-language',lang);applyLanguage();});
  $('fontToggle').addEventListener('click',()=>{const bigger=$('fontToggle').getAttribute('aria-pressed')!=='true';$('fontToggle').setAttribute('aria-pressed',String(bigger));document.documentElement.style.setProperty('--scale',bigger?'1.2':'1');store.set('eh-large-text',bigger);});
  if(store.get('eh-large-text',false)){$('fontToggle').setAttribute('aria-pressed','true');document.documentElement.style.setProperty('--scale','1.2');}
  $('surprise').addEventListener('click',()=>{if(stories.length)openStory(stories[Math.floor(Math.random()*stories.length)].id);});
  $('explorerSearch').addEventListener('submit',event=>{event.preventDefault();stopPlayback();query=$('query').value.trim();renderExplorer();});
  $('query').addEventListener('input',()=>{query=$('query').value.trim();if(allLoaded)renderExplorer();});
  $('clearFilters').addEventListener('click',resetFilters);
  $('regionFilter').addEventListener('change',()=>{stopPlayback();region=$('regionFilter').value;renderExplorer();});
  $('timeMode').addEventListener('change',()=>{mode=$('timeMode').value;renderExplorer();});
  $('yearSlider').addEventListener('input',()=>{stopPlayback();year=Number($('yearSlider').value);if(year===0)year=1;renderExplorer();});
  $('playTimeline').addEventListener('click',()=>{if(timer){stopPlayback();return;}if(!stories.length)return;closeDialog();const milestones=[...new Set(stories.flatMap(s=>[s.from,s.to]).concat(2026))].sort((a,b)=>a-b);let index=milestones.findIndex(y=>y>year);if(index<0)index=0;year=milestones[index];renderExplorer();$('playTimeline').setAttribute('aria-pressed','true');$('playTimeline').innerHTML='Ⅱ '+tx('暂停','Pause');timer=setInterval(()=>{index++;if(index>=milestones.length){stopPlayback();return;}year=milestones[index];renderExplorer();},1700);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback();});
  const switchView=list=>{$('mapCanvas').hidden=list;$('mapList').hidden=!list;$('listView').classList.toggle('selected',list);$('mapView').classList.toggle('selected',!list);$('listView').setAttribute('aria-pressed',String(list));$('mapView').setAttribute('aria-pressed',String(!list));if(!list)resizePins();};
  $('mapView').addEventListener('click',()=>switchView(false));$('listView').addEventListener('click',()=>switchView(true));
  $('zoomIn').addEventListener('click',()=>{if(mapReady)svg.call(zoom.scaleBy,1.4);});$('zoomOut').addEventListener('click',()=>{if(mapReady)svg.call(zoom.scaleBy,1/1.4);});$('zoomReset').addEventListener('click',()=>{if(mapReady)svg.call(zoom.transform,d3.zoomIdentity);});
  $('librarySearch').addEventListener('input',()=>{pageSize=24;renderLibrary();});$('includeResearch').addEventListener('change',()=>{pageSize=24;renderLibrary();});$('moreLibrary').addEventListener('click',()=>{pageSize+=24;renderLibrary();});
  $('closeDialog').addEventListener('click',closeDialog);$('storyDialog').addEventListener('close',()=>{currentDialog=null;document.body.classList.remove('dialog-open');$('storyDialog').querySelectorAll('video').forEach(v=>v.pause());});
  $('storyDialog').addEventListener('click',event=>{if(event.target===$('storyDialog')){const r=$('storyDialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
  applyLanguage();$('query').value=query;$('regionFilter').value=region;
  async function loadJSON(path,fallback){try{const r=await fetch(path);if(!r.ok)throw new Error(path+' '+r.status);return await r.json();}catch(error){if(fallback!==undefined)return fallback;throw error;}}
  (async()=>{
    try{
      const data=await loadJSON('./data/stories.json');stories=data.stories.filter(s=>s.status==='published');
      [research,media]=await Promise.all([loadJSON('./data/research-index.json',[]),loadJSON('./data/media.json',[])]);
      allLoaded=true;renderFeatured();renderExplorer();renderLibrary();renderFilms();
      try{await setupMap();}catch(error){$('mapLoading').textContent=tx('地图资源未能加载，可使用列表继续阅读。','The map could not load. All stories remain available in the list.');switchView(true);}
      const id=params.get('story')||(location.pathname.endsWith('story-provence.html')?'grasse':null);
      if(id)openStory(id);else if(location.pathname.endsWith('map.html')||location.hash==='#map')$('map').scrollIntoView({behavior:'auto'});
      window.EARTH_HEALING_READY=true;
      window.EARTH_HEALING={state:()=>({lang,year,theme,region,mode,published:stories.length,visible:visible.length,research:research.length,mapReady,playing:!!timer}),visibleStories:()=>visible.slice(),allStories:()=>stories.slice(),openStory,mapForStory,toast};
    }catch(error){$('featuredStories').innerHTML='<p class="empty-state">'+tx('暂时未能读取故事资料，请刷新页面。','Story data could not be loaded. Please refresh.')+'</p>';$('mapLoading').textContent=tx('资料加载失败。','Data loading failed.');}
  })();
})();
