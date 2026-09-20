/* Earth Healing — Google Maps detail adapter.
   Uses Maps JavaScript API when a referrer-restricted browser key is configured.
   Without a key, a real in-page Google Maps embed is used for the selected place. */
'use strict';
(() => {
  const cfg=window.EARTH_HEALING_GOOGLE_MAPS||{};
  let pane,map,iframe,markers=[],loaded=false,loading,active=false,mode='none',selectedId=null;
  const lang=()=>document.documentElement.lang.startsWith('zh')?'zh':'en';
  const tx=(zh,en)=>lang()==='zh'?zh:en;
  const style=[
    {featureType:'all',elementType:'geometry',stylers:[{color:'#f5efe3'}]},
    {featureType:'water',elementType:'geometry',stylers:[{color:'#8fc4cf'}]},
    {featureType:'water',elementType:'labels.text.fill',stylers:[{color:'#4c6e7a'}]},
    {featureType:'landscape.natural',elementType:'geometry',stylers:[{color:'#e7e5cd'}]},
    {featureType:'poi.park',elementType:'geometry',stylers:[{color:'#cdddbb'}]},
    {featureType:'road',elementType:'geometry',stylers:[{color:'#fffaf0'}]},
    {featureType:'road.arterial',elementType:'geometry.stroke',stylers:[{color:'#d8bd89'}]},
    {featureType:'road.highway',elementType:'geometry',stylers:[{color:'#ecd6a9'}]},
    {featureType:'transit',stylers:[{visibility:'off'}]},
    {featureType:'poi.business',stylers:[{visibility:'off'}]},
    {featureType:'administrative',elementType:'labels.text.fill',stylers:[{color:'#60456b'}]},
    {elementType:'labels.text.fill',stylers:[{color:'#5f5364'}]},
    {elementType:'labels.text.stroke',stylers:[{color:'#fffaf0'},{weight:3}]}
  ];

  function ensurePane(){
    if(pane)return pane;
    pane=document.createElement('div');
    pane.id='googleMapPane';
    pane.className='google-map-pane';
    pane.hidden=true;
    document.getElementById('mapCanvas')?.prepend(pane);
    return pane;
  }
  const stories=()=>window.EARTH_HEALING?.visibleStories?.()||[];
  const selectedStory=()=>{
    const list=stories();
    return list.find(s=>s.id===selectedId)||list[0]||null;
  };
  function mapsURL(s){
    if(s?.coordinates?.length===2){
      const [lng,lat]=s.coordinates;
      return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(lat+','+lng);
    }
    return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s?.[lang()]?.place||'Earth Healing');
  }
  function embedURL(s){
    if(s?.coordinates?.length===2){
      const [lng,lat]=s.coordinates;
      return 'https://www.google.com/maps?q='+encodeURIComponent(lat+','+lng)+'&z=10&output=embed';
    }
    return 'https://www.google.com/maps?q='+encodeURIComponent(s?.[lang()]?.place||'Earth Healing')+'&output=embed';
  }
  function hideAtlas(hide){
    const gl=document.getElementById('mapGl');if(gl)gl.style.visibility=hide?'hidden':'';
    const svg=document.getElementById('worldSvg');if(svg)svg.style.visibility=hide?'hidden':'';
  }
  function renderEmbed(){
    ensurePane();active=true;mode='embed';pane.hidden=false;hideAtlas(true);
    const list=stories();
    const current=selectedStory();
    pane.innerHTML='';
    iframe=document.createElement('iframe');
    iframe.className='google-map-iframe';
    iframe.title=tx('Google 地图地点详情','Google Maps place detail');
    iframe.loading='eager';
    iframe.referrerPolicy='no-referrer-when-downgrade';
    iframe.src=embedURL(current);
    pane.appendChild(iframe);
    const overlay=document.createElement('div');
    overlay.className='google-embed-overlay';
    overlay.innerHTML='<div class="google-embed-head"><strong>'+tx('Google 地图 · 具体地点','Google Maps · Place detail')+'</strong><small>'+tx('现代地理详情，不表示历史疆域','Present-day geography, not historical borders')+'</small></div>'+
      '<div class="google-embed-stories">'+list.slice(0,8).map(s=>'<button type="button" data-google-story="'+s.id+'" class="'+(current?.id===s.id?'active':'')+'">'+
      (s[lang()]?.place||s.id)+'</button>').join('')+'</div>'+
      (current?'<a class="google-open-link" target="_blank" rel="noopener noreferrer" href="'+mapsURL(current)+'">'+tx('在 Google Maps 打开 ↗','Open in Google Maps ↗')+'</a>':'');
    pane.appendChild(overlay);
    overlay.addEventListener('click',e=>{
      const b=e.target.closest('[data-google-story]');if(!b)return;
      const s=list.find(x=>x.id===b.dataset.googleStory);if(!s)return;
      selectedId=s.id;focus(s);
    });
    return true;
  }
  function load(){
    if(loaded&&window.google?.maps)return Promise.resolve(true);
    if(!cfg.apiKey)return Promise.resolve(false);
    if(loading)return loading;
    loading=new Promise((resolve,reject)=>{
      const cb='__earthHealingGoogleReady_'+Date.now();
      window[cb]=()=>{loaded=true;delete window[cb];resolve(true);};
      const s=document.createElement('script');
      const params=new URLSearchParams({key:cfg.apiKey,loading:'async',callback:cb,v:'weekly',language:lang()==='zh'?'zh-CN':'en',region:'US',auth_referrer_policy:'origin'});
      if(cfg.mapId)params.set('map_ids',cfg.mapId);
      s.src='https://maps.googleapis.com/maps/api/js?'+params.toString();
      s.async=true;
      s.onerror=()=>reject(new Error('Google Maps JavaScript API failed to load'));
      document.head.appendChild(s);
    });
    return loading;
  }
  function clear(){
    markers.forEach(m=>{try{m.setMap?.(null);if('map' in m)m.map=null;}catch{}});
    markers=[];
  }
  async function sync(){
    if(!active)return;
    if(mode==='embed'){renderEmbed();return;}
    if(!map)return;
    clear();
    const list=stories();if(!list.length)return;
    const bounds=new google.maps.LatLngBounds();
    for(const s of list){
      const [lng,lat]=s.coordinates;const pos={lat,lng};bounds.extend(pos);
      const title=s[lang()].title+' · '+s[lang()].place;
      let marker;
      if(cfg.mapId&&google.maps.marker?.AdvancedMarkerElement){
        const dot=document.createElement('button');dot.className='google-story-pin';dot.type='button';dot.title=title;dot.setAttribute('aria-label',title);dot.textContent='✦';
        marker=new google.maps.marker.AdvancedMarkerElement({map,position:pos,title,content:dot});
        marker.addListener('gmp-click',()=>window.EARTH_HEALING?.openStory?.(s.id));
      }else{
        marker=new google.maps.Marker({map,position:pos,title});
        marker.addListener('click',()=>window.EARTH_HEALING?.openStory?.(s.id));
      }
      markers.push(marker);
    }
    if(list.length===1){
      map.setCenter({lat:list[0].coordinates[1],lng:list[0].coordinates[0]});map.setZoom(10);
    }else map.fitBounds(bounds,74);
  }
  async function activate(){
    ensurePane();
    const ok=await load().catch(()=>false);
    if(!ok)return renderEmbed();
    active=true;mode='javascript';pane.hidden=false;hideAtlas(true);
    pane.innerHTML='';
    if(!map){
      const options={center:{lat:20,lng:18},zoom:2,mapTypeControl:false,streetViewControl:true,fullscreenControl:true,zoomControl:true,gestureHandling:'greedy',backgroundColor:'#f7f0e3'};
      if(cfg.mapId)options.mapId=cfg.mapId;else options.styles=style;
      map=new google.maps.Map(pane,options);
    }
    await sync();return true;
  }
  function deactivate(){
    active=false;mode='none';if(pane)pane.hidden=true;hideAtlas(false);
  }
  function focus(s){
    if(!active||!s)return false;
    selectedId=s.id;
    if(mode==='embed'){
      if(!iframe||!pane)return false;
      iframe.src=embedURL(s);
      pane.querySelectorAll('[data-google-story]').forEach(b=>b.classList.toggle('active',b.dataset.googleStory===s.id));
      const link=pane.querySelector('.google-open-link');if(link)link.href=mapsURL(s);
      return true;
    }
    if(!map)return false;
    map.panTo({lat:s.coordinates[1],lng:s.coordinates[0]});
    map.setZoom(Math.max(map.getZoom()||0,11));
    return true;
  }
  window.EARTH_HEALING_GOOGLE_MAP={
    configured:()=>Boolean(cfg.apiKey),
    state:()=>({configured:Boolean(cfg.apiKey),active,loaded,mode,mapId:Boolean(cfg.mapId),visible:mode==='javascript'?markers.length:stories().length}),
    activate,deactivate,sync,focus,mapsURL,embedURL
  };
})();
