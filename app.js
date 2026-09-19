const LANG_KEY="eh_lang", FONT_KEY="eh_font";
let lang=localStorage.getItem(LANG_KEY)||"zh", scale=parseFloat(localStorage.getItem(FONT_KEY)||"1");
document.documentElement.style.setProperty("--scale",scale);

function applyLang(){
  document.documentElement.lang=lang==="zh"?"zh-CN":"en";
  document.querySelectorAll("[data-zh]").forEach(el=>{
    el.textContent=el.getAttribute(lang==="zh"?"data-zh":"data-en")||el.textContent;
  });
}
document.querySelectorAll("[data-lang-btn]").forEach(btn=>btn.addEventListener("click",()=>{lang=lang==="zh"?"en":"zh";localStorage.setItem(LANG_KEY,lang);applyLang();renderMap&&renderMap();}));
document.querySelectorAll("[data-font-btn]").forEach(btn=>btn.addEventListener("click",()=>{scale=scale>=1.22?1:Math.round((scale+.1)*10)/10;localStorage.setItem(FONT_KEY,scale);document.documentElement.style.setProperty("--scale",scale)}));
applyLang();

const MAP_DATA={
ancient:{labelZh:"古代 · 公元前",labelEn:"Ancient · before 0",stories:[
{type:"plant",x:61,y:48,placeZh:"埃及",placeEn:"Egypt",titleZh:"尼罗河的植物智慧",titleEn:"Plant Wisdom of the Nile",hookZh:"在纸草书里，植物、矿物和身体经验被写进文字。",hookEn:"Plants, minerals and bodily knowledge entered written records.",img:"./assets/reference/images/provence_bird_botanical_atlas.webp"},
{type:"ritual",x:69,y:59,placeZh:"南亚",placeEn:"South Asia",titleZh:"吟诵、植物与早期疗愈传统",titleEn:"Chant, Plants and Early Healing",hookZh:"植物、声音、仪式和身体曾属于同一个知识世界。",hookEn:"Plants, sound, ritual and the body once shared one knowledge world.",img:"./assets/reference/images/alishan_healing_adventure.webp"},
{type:"body",x:80,y:43,placeZh:"中国",placeEn:"China",titleZh:"身体进入阴阳与四时",titleEn:"Body, Yin-Yang and the Seasons",hookZh:"古代身体观开始与季节、气候和宇宙秩序连接。",hookEn:"Body concepts became linked with season, climate and cosmology.",img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]},
classical:{labelZh:"古典时期 · 0–500",labelEn:"Classical · 0–500",stories:[
{type:"plant",x:51,y:35,placeZh:"地中海",placeEn:"Mediterranean",titleZh:"《药物志》的长途旅行",titleEn:"The Long Journey of De Materia Medica",hookZh:"一部药物书开始影响多个世纪的植物知识。",hookEn:"A materia medica text began shaping plant knowledge for centuries.",img:"./assets/reference/images/provence_bird_botanical_atlas.webp"},
{type:"water",x:48,y:39,placeZh:"罗马世界",placeEn:"Roman World",titleZh:"浴场：水、社交与身体",titleEn:"Baths: Water, Society and the Body",hookZh:"热、水和城市生活组成一整套身体照护文化。",hookEn:"Heat, water and urban life formed a culture of bodily care.",img:"./assets/reference/images/provence_perfume_estate.webp"},
{type:"plant",x:81,y:44,placeZh:"中国",placeEn:"China",titleZh:"本草开始成为体系",titleEn:"Materia Medica Becomes a System",hookZh:"药材被命名、分类，并进入更稳定的文本传统。",hookEn:"Medicinal substances were named, classified and organized.",img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]},
medieval:{labelZh:"中世纪 · 500–1500",labelEn:"Medieval · 500–1500",stories:[
{type:"aroma",x:57,y:41,placeZh:"西亚",placeEn:"West Asia",titleZh:"翻译、药房与蒸馏知识",titleEn:"Translation, Pharmacy and Distillation",hookZh:"希腊、波斯、印度等知识在新的城市网络相遇。",hookEn:"Greek, Persian and Indian knowledge met in new urban networks.",img:"./assets/reference/images/provence_perfume_estate.webp"},
{type:"plant",x:45,y:30,placeZh:"欧洲",placeEn:"Europe",titleZh:"修道院里的药草园",titleEn:"Herb Gardens in Monasteries",hookZh:"花园、抄本、药房和照护发生在同一空间。",hookEn:"Gardens, manuscripts, pharmacy and care shared one space.",img:"./assets/reference/images/provence_bird_botanical_atlas.webp"},
{type:"plant",x:80,y:44,placeZh:"中国",placeEn:"China",titleZh:"官方本草与城市药局",titleEn:"Official Materia Medica and Pharmacies",hookZh:"制度开始更深地介入药物知识与供应。",hookEn:"Institutions took a deeper role in medicine knowledge and supply.",img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]},
early:{labelZh:"17世纪 · 近代早期",labelEn:"17th Century · Early Modern",stories:[
{type:"aroma",x:45,y:31,placeZh:"普罗旺斯",placeEn:"Provence",titleZh:"普罗旺斯的香气革命",titleEn:"The Fragrance Revolution of Provence",hookZh:"植物进入花园、香水、药房与蒸馏器。",hookEn:"Plants entered gardens, perfumery, pharmacy and the still.",img:"./assets/reference/images/provence_perfume_estate.webp",url:"./story-provence.html"},
{type:"plant",x:25,y:61,placeZh:"安第斯",placeEn:"Andes",titleZh:"药用植物进入全球贸易",titleEn:"Medicinal Plants Enter Global Trade",hookZh:"地方植物逐渐卷入贸易、帝国与现代药物史。",hookEn:"Local plants became entangled with trade, empire and modern drug history.",img:"./assets/reference/images/alishan_healing_adventure.webp"},
{type:"plant",x:84,y:44,placeZh:"日本",placeEn:"Japan",titleZh:"汉方与本草学在日本发展",titleEn:"Kampo and Honzogaku in Japan",hookZh:"外来知识被重新整理，并与本土植物研究共同发展。",hookEn:"Imported knowledge was reorganized alongside local plant study.",img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]},
modern:{labelZh:"现代 · 1800–2000",labelEn:"Modern · 1800–2000",stories:[
{type:"water",x:45,y:29,placeZh:"欧洲",placeEn:"Europe",titleZh:"温泉小镇与近代健康旅行",titleEn:"Spa Towns and Modern Health Travel",hookZh:"浴疗进入疗养地、旅馆、诊所和旅游。",hookEn:"Bathing entered resorts, clinics, hotels and health travel.",img:"./assets/reference/images/provence_perfume_estate.webp"},
{type:"aroma",x:44,y:32,placeZh:"法国",placeEn:"France",titleZh:"现代芳香疗法形成",titleEn:"Modern Aromatherapy Takes Shape",hookZh:"蒸馏香料、药房文化和现代消费逐渐汇合。",hookEn:"Distilled aromatics, pharmacy culture and modern consumption converged.",img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"},
{type:"body",x:18,y:30,placeZh:"北美",placeEn:"North America",titleZh:"音乐、园艺与动物辅助逐渐专业化",titleEn:"Care Fields Professionalize",hookZh:"一些照护实践逐渐形成现代专业领域。",hookEn:"Several care practices became modern professional fields.",img:"./assets/reference/images/alishan_healing_adventure.webp"}]},
today:{labelZh:"当代 · 2000+",labelEn:"Today · 2000+",stories:[
{type:"plant",x:64,y:57,placeZh:"全球",placeEn:"Global",titleZh:"传统医学进入证据与监管时代",titleEn:"Traditional Medicine Meets Evidence and Regulation",hookZh:"今天还要同时讨论证据、安全、监管与文化权利。",hookEn:"Today we must also discuss evidence, safety, regulation and cultural rights.",img:"./assets/reference/images/provence_bird_botanical_atlas.webp"},
{type:"sound",x:58,y:44,placeZh:"全球",placeEn:"Global",titleZh:"声音疗愈需要重新分类",titleEn:"Sound Healing Needs Better Categories",hookZh:"声学、音乐、吟唱与“频率”主张不能混成一个概念。",hookEn:"Acoustics, music, chant and frequency claims are not the same thing.",img:"./assets/reference/images/alishan_healing_adventure.webp"},
{type:"ritual",x:80,y:45,placeZh:"全球",placeEn:"Global",titleZh:"活态传统如何被尊重地数字化",titleEn:"Digitizing Living Traditions Respectfully",hookZh:"公开知识、社区语境和神圣私密知识需要不同访问层级。",hookEn:"Public, community-context and sacred knowledge need different access levels.",img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]}
};

let currentEra=new URLSearchParams(location.search).get("era")||"early";
let currentFilter=new URLSearchParams(location.search).get("filter")||"all";
function renderMap(){
  const markerWrap=document.getElementById("mapMarkers"), rail=document.getElementById("mapStoryRail"), eraTitle=document.getElementById("mapEraTitle");
  if(!markerWrap||!rail||!eraTitle)return;
  const era=MAP_DATA[currentEra]||MAP_DATA.early;
  eraTitle.textContent=lang==="zh"?era.labelZh:era.labelEn;
  markerWrap.innerHTML="";rail.innerHTML="";
  document.querySelectorAll(".timeline-ribbon button").forEach(b=>b.classList.toggle("active",b.dataset.era===currentEra));
  document.querySelectorAll(".map-filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===currentFilter));
  const items=era.stories.filter(s=>currentFilter==="all"||s.type===currentFilter);
  items.forEach(s=>{
    const m=document.createElement("button");m.className="map-marker";m.style.left=s.x+"%";m.style.top=s.y+"%";m.innerHTML='<img src="'+s.img+'" alt=""><small>'+(lang==="zh"?s.placeZh:s.placeEn)+'</small>';m.onclick=()=>openStory(s);markerWrap.appendChild(m);
    const c=document.createElement("article");c.className="rail-story";c.innerHTML='<img src="'+s.img+'" alt=""><div><h3>'+(lang==="zh"?s.titleZh:s.titleEn)+'</h3><p>'+(lang==="zh"?s.hookZh:s.hookEn)+'</p><small>'+(lang==="zh"?s.placeZh:s.placeEn)+' · '+(lang==="zh"?era.labelZh:era.labelEn)+'</small></div>';c.onclick=()=>openStory(s);rail.appendChild(c);
  });
}
function openStory(s){
  if(s.url){location.href=s.url;return}
  const d=document.getElementById("storyDialog"), body=document.getElementById("dialogBody");if(!d||!body)return;
  body.innerHTML='<div class="dialog-inner"><img src="'+s.img+'" alt=""><h2>'+(lang==="zh"?s.titleZh:s.titleEn)+'</h2><p>'+(lang==="zh"?s.hookZh:s.hookEn)+'</p><p>'+(lang==="zh"?"这一层会继续展开地点、年代、人物、植物/器物、视频、证据与安全信息。":"This story can expand into place, era, people, plants/objects, media, evidence and safety.")+'</p></div>';d.showModal();
}
document.querySelectorAll(".timeline-ribbon button").forEach(b=>b.addEventListener("click",()=>{currentEra=b.dataset.era;renderMap()}));
document.querySelectorAll(".map-filter").forEach(b=>b.addEventListener("click",()=>{currentFilter=b.dataset.filter;renderMap()}));
document.querySelectorAll("[data-close-dialog]").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
renderMap();
