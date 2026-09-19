const i18n={
zh:{navExplore:"探索",navTimeline:"时间线",navAtlas:"图鉴",navStories:"故事",heroEyebrow:"PLANTS · PEOPLE · PLACES · TIME",heroTitle:"沿着时间，重新看见人类如何疗愈自己",heroSub:"不需要先懂中医、草药、芳香、冥想或传统医学。选一个地方，滑过年代，点开一个故事。",startJourney:"开始探索",surprise:"随便带我看看",statEntities:"知识与故事节点",statRelations:"知识关系",statLang:"双语浏览",featuredJourney:"精选旅程",provenceTitle:"从花园到香气：普罗旺斯的植物、蒸馏与生活",provenceDesc:"一段适合第一次进入 Earth Healing 的 3 分钟入口。",how1:"选一个地方",how1d:"从地图上的一个点开始",how2:"移动时间",how2d:"地图会跟着年代变化",how3:"点开故事",how3d:"先看懂，再决定要不要深入",mapEyebrow:"DYNAMIC WORLD MAP",mapTitle:"世界地图会随着时间改变",mapDesc:"拖动时间轴，看不同地区的植物、浴疗、声音、药师制剂与传统如何出现、传播和变化。",filterTitle:"探索筛选",allMethods:"全部方法",plants:"植物",aroma:"芳香",water:"水疗",sound:"声音",body:"身体",ritual:"仪式",documented:"已有记录",approximate:"年代约数",throughTime:"穿越时间",eraAncient:"古代",eraClassical:"古典时期",eraMedieval:"中世纪",eraEarly:"近代早期",eraModern:"现代",eraToday:"当代",storyRail:"STORY RAIL",storyNow:"这个年代正在发生什么？",storyMode:"STORY MODE",storyFeatureTitle:"不是先学术语，而是先进入一个时代",storyFeatureDesc:"你先知道“我们在哪里、现在是什么年代、眼前是什么”，再展开人物、植物、器物、视频、证据与安全信息。",step10:"一句话看懂",step3m:"读完一个故事",stepDeep:"想深挖再展开",atlasEyebrow:"EXPLORE BY THEME",atlasTitle:"从你感兴趣的入口开始",themePlant:"本草、药用植物、花园与民族植物知识",themeAroma:"精油、纯露、香料、蒸馏与气味文化",themeWater:"药浴、温泉、Hammam、Sauna 与蓝色空间",themeSound:"吟唱、音乐、鼓、声学与“频率”分层",themeBody:"针、灸、推拿、按摩、呼吸与运动",themeRitual:"民间疗愈、宗教仪式、地方传统与文化语境",evidenceEyebrow:"TRADITION ≠ BIOMEDICAL PROOF",evidenceTitle:"传统怎么说，与现代证据到哪一步，分开看",evidenceDesc:"Earth Healing 会保留历史、文化、灵性和民间叙事，但不会把它们自动写成现代医学事实。每个条目都可以继续展开 Evidence · Safety · Sources。",footerLine:"选一个地方，滑过年代，点开一个故事。"},
en:{navExplore:"Explore",navTimeline:"Timeline",navAtlas:"Atlas",navStories:"Stories",heroEyebrow:"PLANTS · PEOPLE · PLACES · TIME",heroTitle:"Explore how humanity has healed itself across time",heroSub:"No need to know TCM, herbs, aromatherapy, meditation or traditional medicine first. Pick a place, move through time, open a story.",startJourney:"Start Exploring",surprise:"Surprise Me",statEntities:"knowledge & story nodes",statRelations:"knowledge relationships",statLang:"bilingual browsing",featuredJourney:"FEATURED JOURNEY",provenceTitle:"From Garden to Scent: Plants, Distillation and Life in Provence",provenceDesc:"A three-minute doorway into Earth Healing for first-time explorers.",how1:"Pick a place",how1d:"Start from one point on the map",how2:"Move through time",how2d:"The map changes with the era",how3:"Open the story",how3d:"Understand first, then go deeper",mapEyebrow:"DYNAMIC WORLD MAP",mapTitle:"The world map changes with time",mapDesc:"Move the timeline to see plants, bathing, sound, apothecaries and traditions appear, travel and transform.",filterTitle:"Explore Filters",allMethods:"All Methods",plants:"Plants",aroma:"Aroma",water:"Water",sound:"Sound",body:"Body",ritual:"Ritual",documented:"Documented",approximate:"Approximate date",throughTime:"Through Time",eraAncient:"Ancient",eraClassical:"Classical",eraMedieval:"Medieval",eraEarly:"Early Modern",eraModern:"Modern",eraToday:"Today",storyRail:"STORY RAIL",storyNow:"What is happening in this era?",storyMode:"STORY MODE",storyFeatureTitle:"Enter an era before learning the terminology",storyFeatureDesc:"First know where you are, what time it is and what you are seeing. Then unfold people, plants, objects, media, evidence and safety.",step10:"10-second intro",step3m:"3-minute story",stepDeep:"Go deeper if curious",atlasEyebrow:"EXPLORE BY THEME",atlasTitle:"Start with what interests you",themePlant:"Materia medica, medicinal plants, gardens and ethnobotany",themeAroma:"Essential oils, hydrosols, aromatics, distillation and scent cultures",themeWater:"Medicinal baths, hot springs, hammams, saunas and blue space",themeSound:"Chant, music, drums, acoustics and clearly separated frequency claims",themeBody:"Needling, heat, bodywork, breath and movement",themeRitual:"Folk healing, religious ritual, place-based traditions and cultural context",evidenceEyebrow:"TRADITION ≠ BIOMEDICAL PROOF",evidenceTitle:"Traditional claims and modern evidence are shown separately",evidenceDesc:"Earth Healing preserves historical, cultural, spiritual and folk narratives without automatically presenting them as biomedical fact. Each topic can expand into Evidence · Safety · Sources.",footerLine:"Pick a place. Move through time. Open a story."}
};

const eras={
ancient:{label:{zh:"古代 · 公元前",en:"Ancient · before 0"},stories:[
{id:"a1",type:"plant",x:61,y:43,place:{zh:"古埃及",en:"Ancient Egypt"},title:{zh:"纸草书里的植物、矿物与身体",en:"Plants, minerals and the body in Egyptian papyri"},hook:{zh:"在纸张出现之前，治疗知识已经被写进纸草卷。",en:"Long before modern books, healing knowledge was recorded on papyrus."},img:"./assets/reference/images/provence_bird_botanical_atlas.webp"},
{id:"a2",type:"ritual",x:66,y:58,place:{zh:"南亚",en:"South Asia"},title:{zh:"植物、吟诵与早期南亚疗愈传统",en:"Plants and chant in early South Asian healing traditions"},hook:{zh:"植物、声音、仪式与身体曾经属于同一个知识世界。",en:"Plants, sound, ritual and the body once belonged to the same knowledge world."},img:"./assets/reference/images/alishan_healing_adventure.webp"},
{id:"a3",type:"body",x:78,y:45,place:{zh:"中国",en:"China"},title:{zh:"身体如何进入阴阳、季节与宇宙秩序",en:"How the body entered a world of yin-yang, season and cosmos"},hook:{zh:"先看古人如何构建身体模型，再看今天我们怎样区分传统与现代解剖。",en:"See how historical body models were built, then how we separate them from modern anatomy today."},img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]},
classical:{label:{zh:"古典时期 · 0–500",en:"Classical · 0–500"},stories:[
{id:"c1",type:"plant",x:50,y:34,place:{zh:"地中海",en:"Mediterranean"},title:{zh:"《药物志》开始漫长旅行",en:"De Materia Medica begins a long journey"},hook:{zh:"一部药物书，影响多个世纪的植物知识。",en:"One materia medica text would shape plant knowledge for centuries."},img:"./assets/reference/images/provence_bird_botanical_atlas.webp"},
{id:"c2",type:"water",x:48,y:38,place:{zh:"罗马世界",en:"Roman world"},title:{zh:"浴场不是洗澡间，而是城市生活",en:"Roman baths were more than places to wash"},hook:{zh:"热、水、社交和建筑共同构成身体照护。",en:"Heat, water, social life and architecture formed a world of bodily care."},img:"./assets/reference/images/provence_perfume_estate.webp"},
{id:"c3",type:"plant",x:79,y:46,place:{zh:"中国",en:"China"},title:{zh:"本草开始形成系统",en:"Materia medica becomes a system"},hook:{zh:"药物被命名、分类并放进更稳定的文本传统里。",en:"Medicinal substances were named, classified and organized into lasting textual traditions."},img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]},
medieval:{label:{zh:"中世纪 · 500–1500",en:"Medieval · 500–1500"},stories:[
{id:"m1",type:"aroma",x:57,y:40,place:{zh:"西亚",en:"West Asia"},title:{zh:"药房、翻译与蒸馏知识重新汇合",en:"Pharmacy, translation and distillation converge"},hook:{zh:"希腊、波斯、印度等知识在新的城市与语言网络里相遇。",en:"Greek, Persian, Indian and other knowledge traditions met in new urban and linguistic networks."},img:"./assets/reference/images/provence_perfume_estate.webp"},
{id:"m2",type:"plant",x:45,y:29,place:{zh:"欧洲",en:"Europe"},title:{zh:"修道院里的药草园与药房",en:"Herb gardens and apothecaries in monasteries"},hook:{zh:"花园、抄本、照护和药材储藏在同一空间发生。",en:"Gardens, manuscripts, care and medicine storage coexisted in one place."},img:"./assets/reference/images/provence_bird_botanical_atlas.webp"},
{id:"m3",type:"plant",x:78,y:46,place:{zh:"中国",en:"China"},title:{zh:"官方本草与城市药局",en:"Official materia medica and urban pharmacies"},hook:{zh:"国家制度开始更深地介入药物知识与供应。",en:"Institutions took a deeper role in organizing medicine knowledge and supply."},img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]},
early:{label:{zh:"近代早期 · 1500–1800",en:"Early Modern · 1500–1800"},stories:[
{id:"e1",type:"aroma",x:45,y:31,place:{zh:"法国 · 普罗旺斯",en:"Provence, France"},title:{zh:"花园、香草与蒸馏术的世界",en:"Gardens, aromatics and the world of distillation"},hook:{zh:"植物不只是花园装饰，也进入香料、药房与蒸馏器。",en:"Plants were not only garden beauty; they entered perfumery, pharmacy and the still."},img:"./assets/reference/images/provence_perfume_estate.webp",video:"./assets/reference/videos/provence_estate_sim.mp4"},
{id:"e2",type:"plant",x:25,y:61,place:{zh:"安第斯",en:"Andes"},title:{zh:"金鸡纳树皮卷入全球医药贸易",en:"Cinchona bark enters global medical trade"},hook:{zh:"一种地方植物，逐渐进入帝国、贸易、药房与现代药物史。",en:"A local plant became entangled with empire, trade, pharmacy and modern drug history."},img:"./assets/reference/images/alishan_healing_adventure.webp"},
{id:"e3",type:"plant",x:84,y:45,place:{zh:"日本",en:"Japan"},title:{zh:"江户时代的汉方与本草学",en:"Kampo and honzogaku in Edo Japan"},hook:{zh:"外来知识被重新整理，并和本土植物研究一起发展。",en:"Imported knowledge was reorganized alongside expanding study of local plants."},img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]},
modern:{label:{zh:"现代 · 1800–2000",en:"Modern · 1800–2000"},stories:[
{id:"n1",type:"water",x:45,y:28,place:{zh:"欧洲",en:"Europe"},title:{zh:"温泉小镇变成近代健康旅行目的地",en:"Spa towns become modern health destinations"},hook:{zh:"浴疗进入疗养地、旅馆、诊所与近代旅游。",en:"Bathing entered resorts, clinics, hotels and modern health travel."},img:"./assets/reference/images/provence_perfume_estate.webp"},
{id:"n2",type:"aroma",x:44,y:31,place:{zh:"法国",en:"France"},title:{zh:"现代芳香疗法与精油文化成形",en:"Modern aromatherapy and essential-oil culture take shape"},hook:{zh:"蒸馏香料、药房文化和现代消费逐渐汇合。",en:"Distilled aromatics, pharmacy culture and modern consumption gradually converged."},img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp",video:"./assets/reference/videos/perfume_lab_tutorial.mp4"},
{id:"n3",type:"body",x:17,y:29,place:{zh:"北美",en:"North America"},title:{zh:"音乐、园艺与动物辅助逐渐专业化",en:"Music, horticulture and animal-assisted fields professionalize"},hook:{zh:"一些曾经分散的照护方式，逐步形成现代专业领域。",en:"Several formerly dispersed care practices became modern professional fields."},img:"./assets/reference/images/alishan_healing_adventure.webp"}]},
today:{label:{zh:"当代 · 2000+",en:"Today · 2000+"},stories:[
{id:"t1",type:"plant",x:67,y:58,place:{zh:"全球",en:"Global"},title:{zh:"传统医学进入证据、安全与监管时代",en:"Traditional medicine enters the era of evidence, safety and regulation"},hook:{zh:"今天的核心问题不只是“古人怎么说”，还包括证据、安全、监管和文化权利。",en:"The question today is not only what tradition says, but also evidence, safety, regulation and cultural rights."},img:"./assets/reference/images/provence_bird_botanical_atlas.webp"},
{id:"t2",type:"sound",x:56,y:43,place:{zh:"全球",en:"Global"},title:{zh:"声音疗愈：声学、音乐、吟唱与“频率”必须分开看",en:"Sound healing: acoustics, music, chant and frequency claims must be separated"},hook:{zh:"同一个“声音疗愈”标签，底下可能是完全不同的东西。",en:"The same “sound healing” label can hide very different practices and claims."},img:"./assets/reference/images/alishan_healing_adventure.webp"},
{id:"t3",type:"ritual",x:79,y:46,place:{zh:"全球",en:"Global"},title:{zh:"活态传统如何被尊重地数字化",en:"How living traditions can be digitized respectfully"},hook:{zh:"公开知识、社区语境、神圣/私密知识必须有不同的访问层级。",en:"Public knowledge, community context and sacred/private knowledge need different access levels."},img:"./assets/reference/images/butterfly_perfume_estate_infographic.webp"}]}
};

let lang=localStorage.getItem("eh_lang")||"zh";
let currentEra="early";
let currentFilter="all";
let textScale=Number(localStorage.getItem("eh_text_scale")||1);

function applyLang(){
  document.documentElement.lang=lang==="zh"?"zh-CN":"en";
  document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(i18n[lang][k])el.textContent=i18n[lang][k]});
  renderEra();
}
function renderEra(){
  document.querySelectorAll(".era").forEach(b=>b.classList.toggle("active",b.dataset.era===currentEra));
  document.getElementById("eraLabel").textContent=eras[currentEra].label[lang];
  renderMarkers();
  renderStories();
}
function activeStories(){
  return eras[currentEra].stories.filter(s=>currentFilter==="all"||s.type===currentFilter);
}
function renderMarkers(){
  const box=document.getElementById("markers");box.innerHTML="";
  activeStories().forEach(s=>{
    const b=document.createElement("button");
    b.className="marker "+s.type;
    b.style.left=s.x+"%";b.style.top=s.y+"%";
    b.innerHTML='<span>'+({plant:"❧",aroma:"✿",water:"≈",sound:"♪",body:"◌",ritual:"✧"}[s.type]||"✦")+'</span><span class="tooltip">'+s.place[lang]+'</span>';
    b.addEventListener("click",()=>openStory(s));
    box.appendChild(b);
  });
}
function renderStories(){
  const wrap=document.getElementById("storyCards");wrap.innerHTML="";
  const stories=activeStories();
  if(!stories.length){wrap.innerHTML='<p style="color:#776b69">'+(lang==="zh"?"这个年代暂无此类故事，换一个筛选试试。":"No story in this filter for the selected era. Try another filter.")+'</p>';return;}
  stories.forEach(s=>{
    const el=document.createElement("article");el.className="story-card";
    el.innerHTML='<img class="story-thumb" src="'+s.img+'" alt=""><div class="story-meta"><span>'+s.place[lang]+'</span><span>'+eras[currentEra].label[lang]+'</span></div><h4>'+s.title[lang]+'</h4><p>'+s.hook[lang]+'</p><div class="open-story">'+(lang==="zh"?"展开 Story →":"Open Story →")+'</div>';
    el.addEventListener("click",()=>openStory(s));wrap.appendChild(el);
  })
}
function openStory(s){
  const d=document.getElementById("storyDialog"),c=document.getElementById("dialogContent");
  const questions=lang==="zh"?["我们在哪里？","现在是什么年代？","眼前是什么？","当时的人怎么理解、怎么做？","后来发生了什么？","今天我们知道什么？"]:["Where are we?","When is this?","What are we looking at?","How did people understand or use it then?","What changed next?","What do we know today?"];
  c.innerHTML='<div class="dialog-inner"><p class="dialog-kicker">'+s.place[lang]+' · '+eras[currentEra].label[lang]+'</p><img src="'+s.img+'" alt=""><h2>'+s.title[lang]+'</h2><p style="font-size:1.05rem">'+s.hook[lang]+'</p>'+questions.map((q,i)=>'<div class="dialog-question"><b>'+String(i+1).padStart(2,"0")+' · '+q+'</b><p>'+(lang==="zh"?"这一层会从数据库里调取对应的地点、年代、人物、植物/器物和来源，先用人话讲清楚。":"This layer pulls the relevant place, era, people, plants/objects and sources from the database, explained in plain language first.")+'</p></div>').join("")+(s.video?'<video controls playsinline style="width:100%;border-radius:16px;margin-top:16px"><source src="'+s.video+'" type="video/mp4"></video>':'')+'<div class="dialog-deep"><div><b>Evidence</b><br>'+(lang==="zh"?"现代证据单独展开":"Modern evidence opens separately")+'</div><div><b>Safety</b><br>'+(lang==="zh"?"安全与禁忌单独展开":"Safety and contraindications open separately")+'</div><div><b>Sources</b><br>'+(lang==="zh"?"原始文献与研究来源":"Primary and scholarly sources")+'</div></div></div>';
  d.showModal();
}
document.getElementById("langBtn").addEventListener("click",()=>{lang=lang==="zh"?"en":"zh";localStorage.setItem("eh_lang",lang);applyLang()});
document.getElementById("textSizeBtn").addEventListener("click",()=>{textScale=textScale>=1.2?1:textScale+.1;document.documentElement.style.setProperty("--font-scale",textScale);localStorage.setItem("eh_text_scale",textScale)});
document.querySelectorAll(".era").forEach(b=>b.addEventListener("click",()=>{currentEra=b.dataset.era;renderEra()}));
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{currentFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderEra()}));
let timer=null;const order=["ancient","classical","medieval","early","modern","today"];
document.getElementById("playBtn").addEventListener("click",()=>{if(timer){clearInterval(timer);timer=null;return}let i=order.indexOf(currentEra);timer=setInterval(()=>{i=(i+1)%order.length;currentEra=order[i];renderEra()},2200)});
document.getElementById("surpriseBtn").addEventListener("click",()=>{const e=order[Math.floor(Math.random()*order.length)];currentEra=e;currentFilter="all";document.querySelectorAll(".filter").forEach((x,i)=>x.classList.toggle("active",i===0));renderEra();document.getElementById("explore").scrollIntoView({behavior:"smooth"});setTimeout(()=>{const s=eras[e].stories[Math.floor(Math.random()*eras[e].stories.length)];openStory(s)},700)});
document.getElementById("dialogClose").addEventListener("click",()=>document.getElementById("storyDialog").close());
document.getElementById("storyDialog").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
document.documentElement.style.setProperty("--font-scale",textScale);
applyLang();
