/* Earth Healing — Google Maps detail adapter.
   A browser API key is injected at build time; never store server credentials here. */
'use strict';
(() => {
  const cfg=window.EARTH_HEALING_GOOGLE_MAPS||{};
  let pane,map,markers=[],loaded=false,loading,active=false;
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
    pane=document.createElement('div');pane.id='googleMapPane';pane.className='google-map-pane';pane.hidden=true;
    document.getElementById('mapCanvas')?.prepend(pane);return pane;
  }
  const stories=()=>window.EARTH_HEALING?.visibleStories?.()||[];
  function mapsURL(s){
    if(s?.coordinates?.length===2){
      const [lng,lat]=s.coordinates;
      return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(lat+','+lng);
    }
    const q=s?.[lang()]?.place||'Earth Healing';
    return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
  }
  function external(){
    const s=stories()[0];
    const u=mapsURL(s);
    window.open(u,'_blank','noopener,noreferrer');
    window.EARTH_HEALING?.toast?.(tx('尚未配置站内 Google Maps Key，已在 Google Maps 打开当前地点。','Embedded Google Maps is not configured yet. Opened the current place in Google Maps.'));
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
      s.async=true;s.onerror=()=>reject(new Error('Google Maps JavaScript API failed to load'));
      document.head.appendChild(s);
    });
    return loading;
  }
  function clear(){
    markers.forEach(m=>{try{m.setMap?.(null);if('map' in m)m.map=null;}catch{}});
    markers=[];
  }
  async function sync(){
    if(!active||!map)return;
    clear();
    const list=stories(); if(!list.length)return;
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
    if(list.length===1)map.setCenter({lat:list[0].coordinates[1],lng:list[0].coordinates[0]}),map.setZoom(10);
    else map.fitBounds(bounds,74);
  }
  async function activate(){
    ensurePane();
    const ok=await load().catch(()=>false);
    if(!ok){external();return false;}
    active=true;pane.hidden=false;
    const gl=document.getElementById('mapGl');if(gl)gl.style.visibility='hidden';
    const svg=document.getElementById('worldSvg');if(svg)svg.style.visibility='hidden';
    if(!map){
      const options={center:{lat:20,lng:18},zoom:2,mapTypeControl:false,streetViewControl:true,fullscreenControl:true,zoomControl:true,gestureHandling:'greedy',backgroundColor:'#f7f0e3'};
      if(cfg.mapId)options.mapId=cfg.mapId;else options.styles=style;
      map=new google.maps.Map(pane,options);
    }
    await sync();return true;
  }
  function deactivate(){
    active=false;if(pane)pane.hidden=true;
    const gl=document.getElementById('mapGl');if(gl)gl.style.visibility='';
    const svg=document.getElementById('worldSvg');if(svg)svg.style.visibility='';
  }
  function focus(s){
    if(!active||!map||!s)return false;
    map.panTo({lat:s.coordinates[1],lng:s.coordinates[0]});map.setZoom(Math.max(map.getZoom()||0,11));return true;
  }
  window.EARTH_HEALING_GOOGLE_MAP={
    configured:()=>Boolean(cfg.apiKey),
    state:()=>({configured:Boolean(cfg.apiKey),active,loaded,mapId:Boolean(cfg.mapId),visible:markers.length}),
    activate,deactivate,sync,focus,mapsURL
  };
})();
