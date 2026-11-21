import { deviceIcon } from "./device-icons.js";
import { updateMeters } from "./meters.js";
import "./styles.css";

(function(){
"use strict";
const STEPS=["Pojazd","Podróże","Urządzenia","Kable","Sprzęt","Realizacja","Podsumowanie"];

const VEH={
  bus:{t:"Bus",d:"Ducato, Sprinter, Transit",roofL:300,roofW:170,len:{alt:4,roof:5,inv:1,fuse:1.5,shore:3}},
  kamper:{t:"Kamper",d:"Kamper z zabudową",roofL:400,roofW:210,len:{alt:6,roof:6,inv:1,fuse:2,shore:3}},
  przyczepa:{t:"Przyczepka",d:"np. Aster 2, przyczepa kempingowa",roofL:200,roofW:130,len:{alt:8,roof:3,inv:1,fuse:1.5,shore:2}}
};

const APPS=[
 {id:"led",g:"Podstawowe",n:"Oświetlenie LED",w:4,v:12,h:4,q:6,p:["low","med","high"]},
 {id:"usb",g:"Podstawowe",n:"Gniazda USB",w:18,v:12,h:1.5,q:2,p:["low","med","high"]},
 {id:"fridge",g:"Podstawowe",n:"Lodówka kompresorowa 50 L",w:50,v:12,h:8,q:1,p:["low","med","high"]},
 {id:"fan",g:"Podstawowe",n:"Wentylator dachowy",w:30,v:12,h:2,q:1,p:["low","med","high"]},
 {id:"pump",g:"Podstawowe",n:"Pompa wody",w:15,v:12,h:0.25,q:1,p:["low","med","high"]},
 {id:"heater",g:"Podstawowe",n:"Ogrzewanie diesel / gaz",w:30,v:12,h:2,q:1,p:["med","high"]},
 {id:"laptop",g:"Praca i rozrywka",n:"Ładowarka laptopa",w:80,v:230,h:2,q:1,p:["low","med","high"]},
 {id:"speaker",g:"Praca i rozrywka",n:"Głośnik",w:10,v:12,h:2,q:1,p:[]},
 {id:"tv12",g:"Praca i rozrywka",n:"Telewizor 12V",w:40,v:12,h:2,q:1,p:["med","high"]},
 {id:"tv230",g:"Praca i rozrywka",n:"Telewizor 230V",w:55,v:230,h:2,q:1,p:[]},
 {id:"starlink",g:"Praca i rozrywka",n:"Internet satelitarny",w:35,v:230,h:6,q:1,p:["med","high"]},
 {id:"console",g:"Praca i rozrywka",n:"Konsola do gier",w:200,v:230,h:1,q:1,p:[]},
 {id:"kettle",g:"Kuchnia",n:"Czajnik niskiej mocy",w:900,v:230,h:0.17,q:1,p:["med","high"]},
 {id:"micro",g:"Kuchnia",n:"Mikrofalówka",w:900,v:230,h:0.17,q:1,p:[]},
 {id:"toaster",g:"Kuchnia",n:"Toster",w:800,v:230,h:0.17,q:1,p:["high"]},
 {id:"induction",g:"Kuchnia",n:"Płyta indukcyjna",w:1800,v:230,h:0.5,q:1,p:["high"]},
 {id:"coffee",g:"Kuchnia",n:"Ekspres do kawy",w:1500,v:230,h:0.1,q:1,p:[]},
 {id:"airfryer",g:"Kuchnia",n:"Frytkownica beztłuszczowa",w:1500,v:230,h:0.33,q:1,p:["high"]},
 {id:"dryer",g:"Komfort",n:"Suszarka do włosów",w:1200,v:230,h:0.17,q:1,p:[]},
 {id:"ebike",g:"Komfort",n:"Ładowanie roweru elektrycznego",w:150,v:230,h:2,q:1,p:[]},
 {id:"ac",g:"Komfort",n:"Klimatyzator",w:700,v:230,h:3,q:1,p:[]},
 {id:"straight",g:"Komfort",n:"Prostownica",w:150,v:230,h:0.25,q:1,p:["med","high"]}
];
const PRESETS=[
 {id:"low",t:"Weekend",d:"Światło, lodówka, ładowanie telefonów i laptopa"},
 {id:"med",t:"Dłuższe trasy",d:"Do tego ogrzewanie, TV, internet, czajnik"},
 {id:"high",t:"Życie w kamperze",d:"Gotowanie na prądzie, wszystko na pokładzie"}
];
const TIERS={
 eko:{t:"Ekonomiczny",d:"Sprawdzony sprzęt w dobrej cenie. Monitoring z aplikacji baterii."},
 std:{t:"Standard",d:"Markowe komponenty, bateria z grzaniem, bocznik pomiarowy z Bluetooth."},
 pro:{t:"Premium",d:"Komponenty klasy Victron, centrum sterowania z ekranem, bateria z komunikacją."}
};
const DELIV={
 diy:{t:"Zestaw do montażu",d:"Wszystkie części, kable przycięte i zaciśnięte, schemat oraz film instruktażowy."},
 box:{t:"Zmontowana skrzynka",d:"Gotowa, przetestowana płyta. Podłączasz baterię, solar, alternator i 230V."},
 install:{t:"Montaż w naszej hali",d:"Montujemy całą instalację w Twoim pojeździe i oddajemy gotową do drogi."}
};
const INV=[{va:500,w:430,ch:20},{va:800,w:650,ch:35},{va:1200,w:1000,ch:50},{va:1600,w:1300,ch:70},{va:2000,w:1600,ch:80},{va:3000,w:2400,ch:120}];
const BATT=[100,200,300,400,600,900,1200];
const BCFG={100:"1 × 100 Ah",200:"1 × 200 Ah",300:"1 × 300 Ah",400:"2 × 200 Ah",600:"2 × 300 Ah",900:"3 × 300 Ah",1200:"4 × 300 Ah"};
const PANELS={
 rigid:[{w:175,l:1480,b:670},{w:200,l:1480,b:780},{w:285,l:1550,b:880},{w:345,l:1870,b:880},{w:465,l:1762,b:1134}],
 flex:[{w:120,l:1150,b:660},{w:230,l:1200,b:900},{w:320,l:1400,b:1150}]
};
const MPPT=[15,20,30,50,70,100];
const DCDC=[18,30,50,70];
const SEC=[6,10,16,25,35,50,70,95], AMP=[45,70,100,140,200,250,300,400];
const FUSES=[10,15,20,25,30,40,50,60,70,80,100,125,150,175,200,250,300,400];
const SUN_SUMMER=4.0, SUN_WINTER=0.7, PV_EFF=0.85, DERATE=0.87;

const S={step:0,veh:"bus",starter:12,panel:"rigid",roofL:300,roofW:170,style:"oba",winter:false,days:"3-5",drive:1,
  preset:"med",apps:{},details:false,len:Object.assign({},VEH.bus.len),tier:"std",deliv:"diy",contact:{}};
function applyPreset(p){S.preset=p;S.apps={};APPS.forEach(a=>{if(a.p.indexOf(p)>=0)S.apps[a.id]={w:a.w,h:a.h,q:a.q};});}
applyPreset("med");

const $=s=>document.querySelector(s);
const fmt=(n,d)=>Number(n).toLocaleString("pl-PL",{maximumFractionDigits:d===undefined?0:d,minimumFractionDigits:0});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function appAh(a,x){return x.w*x.h*x.q/12/(a.v===230?0.9:1);}

function sizeCable(Inom,L,drop){
  const needA=2*L*Inom*0.0195/(12*drop), Ires=Inom*1.25;
  for(let i=0;i<SEC.length;i++){const amp=AMP[i]*DERATE;if(SEC[i]>=needA&&amp>=Ires&&FUSES.some(f=>f>=Ires&&f<=amp))return{s:SEC[i],amp:amp,ires:Ires};}
  return{s:95,amp:400*DERATE,ires:Ires,over:true};
}
function pickFuse(Ires,amp){let f=FUSES.find(x=>x>=Ires&&x<=amp);if(!f)f=FUSES.find(x=>x>=Ires)||400;return f;}
function fuseType(f){return f<=40?"bezpiecznik ANL/blade":f<=125?"bezpiecznik MIDI":"bezpiecznik MEGA";}

function compute(){
  const R={warn:[]};
  // zużycie
  let ah=0,max230=0,w12=0,any230=false;
  APPS.forEach(a=>{const x=S.apps[a.id];if(!x)return;ah+=appAh(a,x);if(a.v===230){any230=true;max230=Math.max(max230,x.w);}else w12+=x.w*x.q;});
  R.ah=ah;R.wh=ah*12;R.any230=any230;R.max230=max230;
  // 230V
  if(any230){
    let m=INV.find(x=>x.w>=max230);
    if(!m){m=INV[INV.length-1];R.warn.push({c:"crit",t:"Urządzenie "+fmt(max230)+" W przekracza 2400 W. W instalacji 12V tego nie zasilimy, porozmawiajmy o systemie 24V."});}
    R.inv={type:"ic",va:m.va,w:m.w,ch:m.ch};
  } else if(S.style!=="autark"){R.inv={type:"ch"};} else R.inv=null;
  // bateria
  const buf={"1-2":1,"3-5":1.5,"6-10":2,"10+":3}[S.days]*(S.style==="kemping"?0.67:1);
  const needAh=ah*buf/0.9;
  let minInv=0;if(R.inv&&R.inv.type==="ic"){if(R.inv.w>=2400)minInv=600;else if(R.inv.w>=1600)minInv=400;else if(R.inv.w>=1300)minInv=300;}
  let cap=BATT.find(c=>c>=Math.max(needAh,minInv,100));
  if(!cap){cap=1200;R.warn.push({c:"crit",t:"Potrzeba ponad 1200 Ah. Przy takim zużyciu lepszy będzie system 24V."});}
  R.cap=cap;R.bcfg=BCFG[cap];R.heated=S.winter||S.tier!=="eko";R.minInv=minInv;
  if(minInv>0&&minInv>=needAh)R.warn.push({c:"info",t:"Bateria powiększona do "+minInv+" Ah, żeby udźwignęła pobór falownika "+fmt(R.inv.w)+" W."});
  if(S.winter&&S.tier==="eko")R.warn.push({c:"info",t:"Zimą dobieramy baterię z grzaniem, także w poziomie Ekonomicznym."});
  if(R.inv&&R.inv.type==="ch"){R.inv.a=cap>=400?30:cap>=200?20:15;}
  // solar
  R.solar=null;
  if(S.panel!=="none"){
    const cov={autark:1,oba:0.7,kemping:0.3}[S.style];
    const target=R.wh*cov/(SUN_SUMMER*PV_EFF);
    const L=S.roofL*10,W=S.roofW*10;
    const opts=[];
    PANELS[S.panel].forEach(p=>{
      let n1=(p.l+120<=W)?Math.floor((L-120)/p.b):0;
      let n2=(p.l+120<=L)?Math.floor((W-120)/p.b):0;
      const n=Math.min(4,Math.max(n1,n2,0));
      for(let k=1;k<=n;k++)opts.push({p:p,n:k,w:p.w*k});
    });
    if(!opts.length){R.warn.push({c:"warn",t:"Na dachu "+S.roofL+" × "+S.roofW+" cm nie zmieści się żaden panel z odstępem 12 cm. Rozważ mniejsze panele elastyczne."});}
    else{
      opts.sort((a,b)=>a.w-b.w||a.n-b.n);
      let ch=opts.find(o=>o.w>=target);
      if(!ch){ch=opts.reduce((a,b)=>b.w>a.w?b:a);if(S.style!=="kemping")R.warn.push({c:"warn",t:"Dach mieści maksymalnie "+fmt(ch.w)+" Wp. Na pełne pokrycie zużycia latem potrzeba ok. "+fmt(Math.ceil(target/10)*10)+" Wp."});}
      R.solar={n:ch.n,pw:ch.p.w,w:ch.w,dim:ch.p.l+" × "+ch.p.b+" mm",target:target};
      R.mppt=MPPT.find(x=>x>=ch.w/12*1.1)||100;
    }
  }
  // DC-DC
  const hasAlt=S.veh!=="przyczepa";
  if(S.starter===24){R.dcdc=30;R.warn.push({c:"info",t:"Przy instalacji rozruchowej 24V stosujemy ładowarkę 24/12V 30 A."});}
  else if(!hasAlt){R.dcdc=18;R.warn.push({c:"info",t:"Przyczepka ładuje się z auta przez gniazdo holownicze, dlatego prąd ograniczamy do 18 A."});}
  else{const need=ah*0.4/Math.max(S.drive,0.5);const lim=Math.min(need,cap*0.5);R.dcdc=DCDC.find(x=>x>=lim)||70;}
  R.dcdcTime=cap*0.6/R.dcdc;
  // dni off-grid
  const usable=cap*0.9;
  const altAh=R.dcdc*S.drive*(hasAlt?0.9:0.5);
  const sw=R.solar?R.solar.w:0;
  R.chS=sw*SUN_SUMMER*PV_EFF/12+altAh;R.chW=sw*SUN_WINTER*PV_EFF/12+altAh;
  const days=c=>{const net=ah-c;return net<=0?30:Math.min(30,usable/net);};
  R.dS=days(R.chS);R.dW=days(R.chW);
  if(R.dW<1&&S.winter)R.warn.push({c:"warn",t:"Zimą bateria wystarczy na mniej niż dobę bez ładowania. Dodaj godziny jazdy albo prąd z kempingu."});
  // kable
  const C=[];
  const add=(id,name,Inom,L,drop,ends)=>{const r=sizeCable(Inom,L,drop);const f=pickFuse(r.ires,r.amp);C.push({id,name,L,s:r.s,f,ft:fuseType(f),ends:ends||1,over:r.over,I:Inom});};
  add("alt","Akumulator rozruchowy → ładowarka DC-DC",R.dcdc*1.1,S.len.alt,0.07,2);
  add("dcdc","Ładowarka DC-DC → bateria",R.dcdc,0.5,0.03);
  if(R.solar){C.push({id:"pv",name:"Panele → regulator solarny (kabel PV)",L:S.len.roof,s:6,f:null,ft:"rozłącznik PV",pv:true});add("mppt","Regulator solarny → bateria",R.mppt,0.5,0.03);}
  if(R.inv&&R.inv.type==="ic")add("inv","Bateria → falownik z ładowarką",R.inv.w/12,S.len.inv,0.03);
  if(R.inv&&R.inv.type==="ch")add("chg","Ładowarka 230V → bateria",R.inv.a,S.len.inv,0.03);
  add("fuse","Bateria → rozdzielnica 12V",Math.max(30,w12/12),S.len.fuse,0.03);
  const mainI=Math.max(R.inv&&R.inv.type==="ic"?R.inv.w/12:0,R.dcdc+(R.mppt||0),Math.max(30,w12/12));
  add("main","Bateria → szyna główna i wyłącznik",mainI,0.5,0.03);
  if(R.inv)C.push({id:"shore",name:"Gniazdo zasilania → "+(R.inv.type==="ic"?"falownik":"ładowarka"),L:S.len.shore,s:"3 × 2,5",f:16,ft:"wyłącznik różnicowoprądowy + B16",ac:true});
  R.cables=C;
  C.forEach(c=>{if(c.over)R.warn.push({c:"warn",t:"Obwód \""+c.name+"\" przekracza 95 mm². Przebieg i zabezpieczenie obwodu wymagają indywidualnego doboru przez instalatora."});});
  let lugs=0,meters=0;C.forEach(c=>{meters+=c.ac?c.L:2*c.L;if(!c.ac&&!c.pv)lugs+=4;});
  R.lugs=lugs;R.meters=meters;R.fuseCount=C.filter(c=>c.f&&!c.ac&&!c.pv).reduce((s,c)=>s+(c.ends||1),0);
  return R;
}

/* ---------- render: kroki ---------- */
function renderSteps() {
  const step = S.step + 1;
  const progress = $("#step-progress");
  $("#step-count").textContent = "Krok " + step + " z " + STEPS.length;
  progress.innerHTML = STEPS.map((name, index) => {
    const current = index === S.step;
    const complete = index < S.step;
    return '<li class="' + (current ? 'current' : complete ? 'complete' : 'upcoming') + '"' +
      (current ? ' aria-current="step"' : '') + '><span class="segment-line" aria-hidden="true"></span>' +
      '<span>' + name + '</span>' + (complete ? '<span class="sr-only"> — ukończony</span>' : '') + '</li>';
  }).join("");
}
function opt(name,val,cur,t,d,type){
  const on=(type==="checkbox")?cur:(String(cur)===String(val));
  return '<label class="opt'+(on?" on":"")+'"><input type="'+(type||"radio")+'" name="'+name+'" value="'+val+'"'+(on?" checked":"")+' id="'+name+'-'+val+'"><span class="t">'+t+'</span>'+(d?'<span class="d">'+d+'</span>':'')+'</label>';
}
function navHtml(){
  return '<div class="config-nav"><button type="button" class="btn" id="back"'+(S.step===0?" disabled":"")+'>Wstecz</button>'+(S.step<STEPS.length-1?'<button type="button" class="btn pri" id="next">Dalej: '+STEPS[S.step+1]+'</button>':'')+'</div>';
}
function head(t,h){return '<div><h2>'+t+'</h2><p class="hint">'+h+'</p></div>';}

const VIEWS=[
 function(){return head("W czym montujemy instalację?","Od pojazdu zależą domyślne długości kabli, miejsce na panele i sposób ładowania w trakcie jazdy.")+
  '<fieldset><legend>Pojazd</legend><div class="opts">'+Object.keys(VEH).map(k=>opt("veh",k,S.veh,VEH[k].t,VEH[k].d)).join("")+'</div></fieldset>'+
  '<fieldset><legend>Instalacja rozruchowa pojazdu</legend><div class="opts">'+opt("starter",12,S.starter,"12V","Większość busów i kamperów")+opt("starter",24,S.starter,"24V","Ciężarówki, duże kampery")+'</div></fieldset>'+
  '<fieldset><legend>Panele na dachu</legend><div class="opts">'+opt("panel","rigid",S.panel,"Sztywne na ramie","Najwyższy uzysk, potrzebują relingów lub uchwytów")+opt("panel","flex",S.panel,"Elastyczne klejone","Niski profil, na łuki i podnoszone dachy")+opt("panel","none",S.panel,"Bez paneli","Ładowanie tylko z jazdy i kempingu")+'</div></fieldset>'+
  '<fieldset'+(S.panel==="none"?' disabled':'')+'><legend>Wolne miejsce na dachu</legend><div class="row"><div class="field"><label for="roofL">Długość</label><div><input type="number" id="roofL" min="50" max="900" step="10" value="'+S.roofL+'"> <span class="unit">cm</span></div></div><div class="field"><label for="roofW">Szerokość</label><div><input type="number" id="roofW" min="50" max="260" step="5" value="'+S.roofW+'"> <span class="unit">cm</span></div></div></div><p class="note">Licz tylko miejsce wolne od okien dachowych, wentylatora i anten. Zostawiamy 12 cm odstępu wokół paneli.</p></fieldset>';},
 function(){return head("Jak podróżujesz?","Te odpowiedzi decydują o wielkości baterii i o tym, ile prądu musi dawać słońce.")+
  '<fieldset><legend>Gdzie najczęściej stoisz</legend><div class="opts">'+opt("style","autark",S.style,"Na dziko","Bez prądu z zewnątrz")+opt("style","kemping",S.style,"Na kempingach","Z podłączeniem do prądu")+opt("style","oba",S.style,"Raz tu, raz tu","Mieszane postoje")+'</div></fieldset>'+
  '<fieldset><legend>Ile dni chcesz stać bez ładowania</legend><div class="opts">'+[["1-2","1-2 dni","Weekend"],["3-5","3-5 dni","Krótki urlop"],["6-10","6-10 dni","Dłuższa wyprawa"],["10+","Ponad 10 dni","Pełna niezależność"]].map(x=>opt("days",x[0],S.days,x[1],x[2])).join("")+'</div></fieldset>'+
  '<fieldset><legend>Sezon</legend><div class="opts">'+opt("winter","0",S.winter?"1":"0","Od wiosny do jesieni","")+opt("winter","1",S.winter?"1":"0","Także zimą","Bateria z grzaniem, mniej słońca")+'</div></fieldset>'+
  '<fieldset><legend>Ile jeździsz dziennie</legend><div class="row"><div class="field"><label for="drive">Średnio godzin jazdy na dzień postoju</label><div><input type="number" id="drive" min="0" max="10" step="0.5" value="'+S.drive+'"> <span class="unit">h</span></div></div></div></fieldset>';},
 function(){
  const groups=[];APPS.forEach(a=>{if(groups.indexOf(a.g)<0)groups.push(a.g);});
  return head("Co chcesz zasilać?","Zacznij od gotowego zestawu i dopasuj. Urządzenia oznaczone 230V wymagają falownika.")+
  '<fieldset><legend>Gotowe zestawy</legend><div class="presets">'+PRESETS.map(p=>opt("preset",p.id,S.preset,p.t,p.d)).join("")+'</div></fieldset>'+
  '<label class="toggle"><input type="checkbox" id="details"'+(S.details?" checked":"")+'> Pokaż moc, czas pracy i liczbę sztuk</label>'+
  groups.map(g=>'<div class="group"><h3>'+g+'</h3><div class="apps">'+APPS.filter(a=>a.g===g).map(a=>{
    const x=S.apps[a.id],on=!!x;
    return '<div class="app'+(on?" on":"")+'"><label class="top" for="app-'+a.id+'">'+deviceIcon(a.id)+
      '<span class="device-label">'+a.n+'<span class="v">'+a.v+' V</span></span><span class="w">'+(on?x.w:a.w)+' W</span>'+
      '<input type="checkbox" id="app-'+a.id+'" data-app="'+a.id+'"'+(on?" checked":"")+'></label>'+
    (on&&S.details?'<div class="det"><input type="number" min="1" step="1" id="w-'+a.id+'" data-f="w" data-id="'+a.id+'" value="'+x.w+'" aria-label="Moc W">W ×<input type="number" min="0" step="0.25" id="h-'+a.id+'" data-f="h" data-id="'+a.id+'" value="'+x.h+'" aria-label="Godziny dziennie">h ×<input type="number" min="1" step="1" id="q-'+a.id+'" data-f="q" data-id="'+a.id+'" value="'+x.q+'" aria-label="Liczba sztuk">szt.</div>':'')+
    (on?'<span class="ah">'+fmt(appAh(a,x),1)+' Ah/dzień</span>':'')+'</div>';}).join("")+'</div></div>').join("");},
 function(){
  const L=S.len,R=compute();
  const items=[["alt","Akumulator rozruchowy → bateria","Wzdłuż pojazdu, od komory silnika do baterii",true],["roof","Dach → regulator solarny","Od przepustu dachowego do miejsca montażu",!!R.solar],["inv","Bateria → falownik","Im krócej, tym cieńszy kabel",!!R.inv],["fuse","Bateria → rozdzielnica 12V","Do skrzynki z bezpiecznikami odbiorników",true],["shore","Gniazdo zasilania → falownik","Od gniazda na ścianie pojazdu",!!R.inv]];
  return head("Ile kabla trzeba poprowadzić?","Podaj długości w jedną stronę. Na ich podstawie liczymy przekroje i bezpieczniki. Wartości startowe są typowe dla wybranego pojazdu.")+
  '<div class="cables"><div class="cablelist">'+items.map((it,i)=>'<div class="cable"'+(it[3]?'':' style="opacity:.5"')+'><span class="k">'+(i+1)+'</span><label for="len-'+it[0]+'">'+it[1]+'<small>'+it[2]+(it[3]?'':' (nie dotyczy)')+'</small></label><div><input type="number" id="len-'+it[0]+'" data-len="'+it[0]+'" min="0.2" max="20" step="0.1" value="'+L[it[0]]+'"'+(it[3]?'':' disabled')+'> <span class="unit">m</span></div></div>').join("")+'</div>'+vanSvg()+'</div>';},
 function(){return head("Jaki poziom sprzętu?","Każdy poziom liczymy tą samą metodą. Różni się trwałością, gwarancją i wygodą monitorowania.")+
  '<fieldset><legend>Poziom</legend><div class="opts">'+Object.keys(TIERS).map(k=>opt("tier",k,S.tier,TIERS[k].t,TIERS[k].d)).join("")+'</div></fieldset>';},
 function(){return head("Jak chcesz to dostać?","Te same części w każdej opcji. Różni się tylko to, ile pracy zostaje po Twojej stronie.")+
  '<fieldset><legend>Forma realizacji</legend><div class="opts">'+Object.keys(DELIV).map(k=>opt("deliv",k,S.deliv,DELIV[k].t,DELIV[k].d)).join("")+'</div></fieldset>';},
 function(){return summaryHtml();}
];

function vanSvg(){
  const t=S.veh;
  const body=t==="przyczepa"?'<path d="M70 60 Q70 30 130 30 L250 30 Q300 30 300 80 L300 110 L70 110 Z" class="vb"/><line x1="20" y1="104" x2="70" y2="104" class="vb2"/><circle cx="180" cy="114" r="14" class="vw"/>':
   '<image href="/media/camper-side.webp" x="8" y="5" width="314" height="130" preserveAspectRatio="xMidYMid meet" class="vehicle-image"/>' ;
  const engX=t==="przyczepa"?24:288;
  return '<svg class="vansvg" viewBox="0 0 330 150" role="img" aria-label="Rozmieszczenie kabli w pojeździe"><style>.vb{fill:var(--bg);stroke:var(--muted);stroke-width:1.5}.vb2{stroke:var(--muted);stroke-width:3}.vw{fill:var(--surface);stroke:var(--muted);stroke-width:1.5}.vc{stroke:var(--wire);stroke-width:2.5;fill:none}.vt{fill:var(--surface);font:600 11px var(--f-mono)}.vk{fill:var(--wire)}.vbat{fill:var(--accent)}.vl{fill:var(--muted);font:500 10px var(--f-body)}</style>'+body+
   '<rect x="150" y="80" width="34" height="22" rx="3" class="vbat"/><text x="167" y="95" text-anchor="middle" class="vt">BAT</text>'+
   '<path d="M'+engX+' 92 L184 92" class="vc"/><path d="M200 34 L200 78" class="vc"/><path d="M150 88 L118 88" class="vc"/><path d="M150 98 L110 98 L110 104" class="vc"/><path d="M60 100 L60 70 L110 70 L110 80" class="vc"/>'+
   [[engX>150?engX-14:engX+14,92,1],[210,52,2],[130,82,3],[100,104,4],[50,82,5]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="8" class="vk"/><text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle" class="vt">'+p[2]+'</text>').join("")+
   '<text x="'+(engX>150?250:30)+'" y="140" class="vl">'+(t==="przyczepa"?"gniazdo holownicze":"komora silnika")+'</text></svg>';
}

function summaryHtml(){
  const R=compute();
  const comp=[];
  comp.push(["Bateria","Bateria litowa LiFePO4 "+R.cap+" Ah ("+R.bcfg+")"+(R.heated?", z grzaniem":""),"ok. "+fmt(R.cap*0.09)+" kg","1"]);
  comp.push(["Bateria",{eko:"Monitoring w aplikacji baterii (Bluetooth)",std:"Bocznik pomiarowy z Bluetooth",pro:"Centrum sterowania z ekranem 7\" i bocznikiem"}[S.tier],"","1"]);
  if(R.solar){comp.push(["Solar","Panel "+(S.panel==="flex"?"elastyczny":"sztywny")+" "+R.solar.pw+" Wp",R.solar.dim,String(R.solar.n)]);comp.push(["Solar","Regulator solarny MPPT "+R.mppt+" A","","1"]);comp.push(["Solar","Przepust dachowy, złącza MC4, rozłącznik PV","","1 kpl."]);}
  comp.push(["Jazda","Ładowarka DC-DC "+(S.starter===24?"24/12V ":"")+R.dcdc+" A","20 → 80% w "+fmt(R.dcdcTime,1)+" h jazdy","1"]);
  if(R.inv&&R.inv.type==="ic")comp.push(["230V","Falownik z ładowarką "+R.inv.va+" VA",fmt(R.inv.w)+" W bez kempingu, ładowanie "+R.inv.ch+" A","1"]);
  if(R.inv&&R.inv.type==="ch")comp.push(["230V","Ładowarka sieciowa "+R.inv.a+" A","","1"]);
  if(R.inv)comp.push(["230V","Gniazdo zasilania CEE, skrzynka z wyłącznikiem różnicowoprądowym, gniazdo 230V","","1 kpl."]);
  comp.push(["12V","Rozdzielnica 12V na 12 obwodów z minusem, gniazda USB-C","","1 kpl."]);
  comp.push(["Ochrona","Wyłącznik główny baterii, szyny zbiorcze, osłony biegunów","","1 kpl."]);
  const cab=R.cables.map(c=>'<tr><td>'+c.name+'</td><td class="num">'+fmt(c.L,1)+' m</td><td class="num">'+(typeof c.s==="number"?c.s+" mm²":c.s+" mm²")+'</td><td>'+(c.f?(c.ac?c.ft:(c.ends===2?"2 × ":"")+c.ft+" "+c.f+" A"):c.ft)+'</td></tr>').join("");
  const sel=APPS.filter(a=>S.apps[a.id]).map(a=>a.n+(S.apps[a.id].q>1?" ×"+S.apps[a.id].q:"")).join(", ");
  return head("Twój system","Sprawdź zestawienie i pobierz propozycję. Dobór elementów i cena wymagają potwierdzenia po weryfikacji instalacji.")+
  '<div class="kv"><div><b>'+fmt(R.ah)+' Ah</b><span>zużycie na dobę ('+fmt(R.wh)+' Wh)</span></div><div><b>'+R.cap+' Ah</b><span>bateria '+(R.heated?"z grzaniem":"")+'</span></div><div><b>'+(R.solar?fmt(R.solar.w)+" Wp":"brak")+'</b><span>solar na dachu</span></div><div><b>'+(R.inv&&R.inv.type==="ic"?fmt(R.inv.w)+" W":"brak")+'</b><span>moc 230V bez kempingu</span></div></div>'+
  '<div><h3 style="margin:0 0 8px;font-size:16px">Podzespoły</h3><div class="tablewrap"><table><thead><tr><th>Moduł</th><th>Element</th><th>Parametry</th><th>Ilość</th></tr></thead><tbody>'+comp.map(r=>'<tr><td class="mod">'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td class="num">'+r[3]+'</td></tr>').join("")+'</tbody></table></div></div>'+
  '<div><h3 style="margin:0 0 8px;font-size:16px">Kable i zabezpieczenia</h3><div class="tablewrap"><table><thead><tr><th>Obwód</th><th>Długość</th><th>Przekrój</th><th>Zabezpieczenie</th></tr></thead><tbody>'+cab+'</tbody></table></div><p class="note">Razem ok. '+fmt(Math.ceil(R.meters))+' m kabla, '+R.lugs+' końcówek rurkowych zaciskanych hydraulicznie, '+R.fuseCount+' bezpieczników DC. Przekroje liczone przy 40°C, ze spadkiem napięcia 3% (7% dla ładowarki DC-DC) i 25% zapasu prądu.</p></div>'+
  '<p class="note"><b>Urządzenia:</b> '+(sel||"brak")+'. <b>Poziom:</b> '+TIERS[S.tier].t+'. <b>Realizacja:</b> '+DELIV[S.deliv].t+'.</p>'+
  formHtml();
}
function formHtml(){
  const c=S.contact;
  return '<form id="lead"><h3 style="margin:0 0 10px;font-size:16px">Dane do propozycji</h3><div class="row"><div class="field"><label for="c-name">Imię</label><input id="c-name" name="name" autocomplete="name" value="'+esc(c.name||"")+'"></div><div class="field"><label for="c-mail">E-mail</label><input id="c-mail" name="mail" type="email" autocomplete="email" value="'+esc(c.mail||"")+'"></div><div class="field"><label for="c-tel">Telefon</label><input id="c-tel" name="tel" type="tel" autocomplete="tel" value="'+esc(c.tel||"")+'"></div></div><div class="field" style="margin-top:12px"><label for="c-msg">Uwagi (opcjonalnie)</label><textarea id="c-msg" name="msg" rows="3" maxlength="1500">'+esc(c.msg||"")+'</textarea></div><p class="note" id="formerr" style="color:var(--crit)" hidden>Podaj poprawny e-mail albo numer telefonu zawierający co najmniej 9 cyfr.</p><p class="note" role="status" id="pdf-status"></p><div class="config-nav" style="margin-top:14px"><button type="button" class="btn" id="back">Wstecz</button><button type="submit" class="btn pri">Zatwierdź i pobierz PDF</button></div></form>';
}
/* ---------- panel boczny ---------- */
function renderAside(){
  const R=compute();
  $("#sysTier").textContent=TIERS[S.tier].t.toUpperCase();
  const acAvailable = R.inv?.type === "ic";
  const readings = {
    solar: R.solar ? R.solar.n + " × " + R.solar.pw + " Wp" : "brak",
    alternator: R.dcdc + " A",
    shore: R.inv ? "dostępne" : "brak",
    battery: R.cap + " Ah",
    dc: "12 obwodów",
    ac: acAvailable ? fmt(R.inv.w) + " W" : "brak",
  };
  const diagram = $("#diagram");
  for (const [key, value] of Object.entries(readings)) {
    const active = value !== "brak";
    diagram.querySelector('[data-reading="' + key + '"]').textContent = value;
    diagram.querySelector('[data-node="' + key + '"]').classList.toggle("inactive", !active);
    diagram.querySelector('[data-branch="' + key + '"]')?.classList.toggle("inactive", !active);
  }
  diagram.setAttribute("aria-label", "Schemat instalacji. " +
    [...diagram.querySelectorAll("[data-node]")].map(node =>
      node.querySelector(".circuit-label").textContent + ": " +
      node.querySelector(".circuit-value").textContent).join(". "));
  updateMeters({
    energy: R.wh, battery: R.cap, solar: R.solar?.w ?? 0,
    daily: R.ah, usable: R.cap * 0.9, summer: R.dS, winter: R.dW,
  });
  $("#summer-bar").style.width=Math.min(100,R.dS/30*100)+"%";
  $("#winter-bar").style.width=Math.min(100,R.dW/30*100)+"%";
  $("#cable-totals").textContent=fmt(Math.ceil(R.meters))+" m kabla · "+R.lugs+" końcówek · "+R.fuseCount+" bezpieczników";
  $("#warns").innerHTML=R.warn.map(w=>'<li class="'+(w.c==="warn"?"":w.c)+'">'+w.t+'</li>').join("");
}

function render(){renderSteps();$("#panel").innerHTML=VIEWS[S.step]()+(S.step<STEPS.length-1?navHtml():"");renderAside();}
function go(index) {
  const step = Math.max(0, Math.min(STEPS.length - 1, index));
  if (step === S.step) return;
  const direction = step > S.step ? 1 : -1;
  S.step = step;
  const panel = $("#panel");
  panel.getAnimations().forEach(animation => animation.cancel());
  render();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    panel.animate([
      { opacity: 0, transform: "translateX(" + direction * 16 + "px)" },
      { opacity: 1, transform: "translateX(0)" },
    ], { duration: 300, easing: "cubic-bezier(.2,.75,.3,1)" });
  }
  const heading = panel.querySelector("h2");
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  $("#wizard-scroll").scrollTop = 0;
}

/* ---------- zdarzenia ---------- */
document.addEventListener("click",e=>{
  if(e.target.id==="next")go(S.step+1);
  else if(e.target.id==="back")go(S.step-1);

});
document.addEventListener("change",e=>{
  const t=e.target;if(!t.name&&!t.id)return;
  if(t.type==="radio"){
    const v=t.value;
    if(t.name==="veh"){S.veh=v;S.roofL=VEH[v].roofL;S.roofW=VEH[v].roofW;S.len=Object.assign({},VEH[v].len);}
    else if(t.name==="starter")S.starter=+v;
    else if(t.name==="panel")S.panel=v;
    else if(t.name==="style")S.style=v;
    else if(t.name==="days")S.days=v;
    else if(t.name==="winter")S.winter=v==="1";
    else if(t.name==="preset")applyPreset(v);
    else if(t.name==="tier")S.tier=v;
    else if(t.name==="deliv")S.deliv=v;
    render();return;
  }
  if(t.id==="details"){S.details=t.checked;render();return;}
  if(t.dataset.app){const a=APPS.find(x=>x.id===t.dataset.app);if(t.checked)S.apps[a.id]={w:a.w,h:a.h,q:a.q};else delete S.apps[a.id];S.preset="";render();return;}
});
document.addEventListener("input",e=>{
  const t=e.target,v=parseFloat(String(t.value).replace(",","."));
  if(t.id==="roofL"&&v>0){S.roofL=v;renderAside();}
  else if(t.id==="roofW"&&v>0){S.roofW=v;renderAside();}
  else if(t.id==="drive"&&v>=0){S.drive=v;renderAside();}
  else if(t.dataset.len&&v>0){S.len[t.dataset.len]=v;renderAside();}
  else if(t.dataset.f&&v>=0){const x=S.apps[t.dataset.id];if(x){x[t.dataset.f]=v;S.preset="";const card=t.closest(".app");const a=APPS.find(z=>z.id===t.dataset.id);card.querySelector(".ah").textContent=fmt(appAh(a,x),1)+" Ah/dzień";card.querySelector(".w").textContent=x.w+" W";renderAside();}}
  else if(t.closest&&t.closest("#lead")){S.contact[t.name]=t.value;}
});
document.addEventListener("submit",async e=>{
  if(e.target.id!=="lead")return;
  e.preventDefault();
  const c=Object.fromEntries(new FormData(e.target));
  const error=$("#formerr"), status=$("#pdf-status"), button=e.submitter;
  error.hidden=!!(c.mail.trim()||c.tel.replace(/\D/g,"").length>=9);
  if(!error.hidden)return;
  const R=compute();
  const tables=[...document.querySelectorAll("#panel table")].map(table=>
    [...table.rows].map(row=>[...row.cells].map(cell=>cell.textContent.trim())));
  const options=[
    ["Pojazd",VEH[S.veh].t], ["Instalacja rozruchowa",S.starter+" V"],
    ["Panele dachowe",{rigid:"Sztywne",flex:"Elastyczne",none:"Bez paneli"}[S.panel]],
    ["Wolna powierzchnia dachu",S.panel==="none"?"Nie dotyczy":S.roofL+" × "+S.roofW+" cm"],
    ["Styl podróży",{autark:"Na dziko",kemping:"Na kempingach",oba:"Mieszany"}[S.style]],
    ["Postój bez ładowania",S.days+" dni"], ["Sezon",S.winter?"Także zimą":"Od wiosny do jesieni"],
    ["Średni czas jazdy",fmt(S.drive,1)+" h/dzień"], ["Poziom sprzętu",TIERS[S.tier].t],
    ["Forma realizacji",DELIV[S.deliv].t], ["Zużycie na dobę",fmt(R.wh)+" Wh / "+fmt(R.ah)+" Ah"],
    ["Szacowana autonomia",fmt(R.dS,1)+" dni latem / "+fmt(R.dW,1)+" dni zimą"],
    ["Kable i osprzęt",fmt(Math.ceil(R.meters))+" m kabla / "+R.lugs+" końcówek / "+R.fuseCount+" bezpieczników DC"],
  ];
  const equipment=APPS.filter(app=>S.apps[app.id]).map(app=>{
    const item=S.apps[app.id];
    return [app.n,app.v+" V",item.w+" W",fmt(item.h,2)+" h",String(item.q)];
  });
  button.disabled=true;
  status.textContent="Przygotowywanie PDF…";
  try{
    const {downloadProposal}=await import("./proposal.js");
    const totals = [
      { label: "Zużycie na dobę", value: fmt(R.wh) + " Wh" },
      { label: "Pojemność baterii", value: fmt(R.cap) + " Ah" },
      { label: "Moc paneli", value: fmt(R.solar?.w ?? 0) + " Wp" },
    ];
    await downloadProposal({contact:c,options,equipment,tables,totals,warnings:R.warn.map(item=>item.t)});
    status.textContent="Propozycja PDF jest gotowa do pobrania.";
  }catch(error){
    console.error(error);
    status.textContent="Nie udało się wygenerować PDF. Spróbuj ponownie.";
  }finally{
    button.disabled=false;
  }
});
render();
})();
