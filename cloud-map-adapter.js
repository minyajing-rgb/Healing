/* Earth Healing — keyless cloud detail map.
   Same pattern as Dharma Atlas: Leaflet + OpenStreetMap tiles, no Google key. */
'use strict';
(() => {
  let pane,map,layerGroup,active=false;
  const lang=()=>document.documentElement.lang.startsWith('zh')?'zh':'en';
  const stories=()=>window.EARTH_HEALING?.visibleStories?.()||[];
  const ensurePane=()=>{
    if(pane)return pane;
    pane=document.createElement('div');
    pane.id='cloudMapPane';
    pane.className='cloud-map-pane';
    pane.hidden=true;
    document.getElementById('mapCanvas')?.prepend(pane);
    return pane;
  };
  const hideAtlas=hide=>{
    const gl=document.getElementById('mapGl');if(gl)gl.style.visibility=hide?'hidden':'';
    const svg=document.getElementById('worldSvg');if(svg)svg.style.visibility=hide?'hidden':'';
  };
  function markerHTML(s){
    const type=s.themes?.[0]||'plant';
    const icons={plant:'❧',aroma:'✿',water:'≈',body:'◌',sound:'♪',mind:'◉',nature:'△',animal:'♧',ritual:'✦',apothecary:'⚗'};
    return '<span class="cloud-pin cloud-pin-'+type+'">'+(icons[type]||'✦')+'</span>';
  }
  function ensureMap(){
    ensurePane();
    if(map||!window.L)return Boolean(map);
    map=L.map(pane,{scrollWheelZoom:true,zoomControl:true,worldCopyJump:true,minZoom:2,maxZoom:19}).setView([24,18],2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,
      attribution:'© OpenStreetMap contributors'
    }).addTo(map);
    layerGroup=L.layerGroup().addTo(map);
    return true;
  }
  function sync(){
    if(!active||!ensureMap())return false;
    layerGroup.clearLayers();
    const list=stories();
    const bounds=[];
    list.forEach(s=>{
      if(!Array.isArray(s.coordinates)||s.coordinates.length!==2)return;
      const [lng,lat]=s.coordinates;bounds.push([lat,lng]);
      const title=(s[lang()]?.title||s.id)+' · '+(s[lang()]?.place||'');
      const icon=L.divIcon({className:'eh-cloud-marker',html:markerHTML(s),iconSize:[38,38],iconAnchor:[19,19]});
      const mk=L.marker([lat,lng],{icon,title}).addTo(layerGroup);
      mk.bindTooltip(title,{direction:'top',offset:[0,-15]});
      mk.on('click',()=>window.EARTH_HEALING?.openStory?.(s.id));
    });
    if(bounds.length===1)map.setView(bounds[0],11,{animate:true});
    else if(bounds.length>1)map.fitBounds(bounds,{padding:[45,45],maxZoom:7,animate:true});
    setTimeout(()=>map.invalidateSize(),40);
    return true;
  }
  function activate(){
    if(!ensureMap())return false;
    active=true;pane.hidden=false;hideAtlas(true);sync();return true;
  }
  function deactivate(){
    active=false;if(pane)pane.hidden=true;hideAtlas(false);
  }
  function focus(s){
    if(!s||!activate())return false;
    const [lng,lat]=s.coordinates;map.flyTo([lat,lng],Math.max(map.getZoom(),12),{duration:.6});
    return true;
  }
  function reset(){if(!active)return;sync();}
  window.EARTH_HEALING_CLOUD_MAP={
    state:()=>({active,engine:'leaflet',provider:'OpenStreetMap',visible:stories().length,zoom:map?.getZoom?.()??null,center:map?[map.getCenter().lng,map.getCenter().lat]:null}),
    activate,deactivate,sync,focus,reset
  };
})();