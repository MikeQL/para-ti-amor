const screens=[...document.querySelectorAll(".screen")];
const dots=[...document.querySelectorAll(".dot")];
const music=document.getElementById("music");
const musicBtn=document.getElementById("musicBtn");
let current=0, musicStarted=false;

window.addEventListener("load",()=>{
  setTimeout(()=>document.getElementById("loader").classList.add("hide"),650);
  musicBtn.classList.add("visible");
});

function goTo(target){
  const next=document.getElementById(target);
  if(!next)return;
  screens.forEach(s=>s.classList.remove("active","enter"));
  next.classList.add("active");
  void next.offsetWidth;
  next.classList.add("enter");
  current=screens.indexOf(next);
  dots.forEach((d,i)=>d.classList.toggle("active",i===current));
  window.scrollTo(0,0);
}

async function startMusic(){
  if(musicStarted)return;
  try{
    await music.play();
    musicStarted=true;
    musicBtn.classList.add("playing");
    musicBtn.textContent="Ⅱ";
  }catch(e){
    // Browser autoplay policy: the click itself should normally allow playback.
  }
}

document.getElementById("openBtn").addEventListener("click",async()=>{
  const env=document.getElementById("envelope");
  env.classList.add("open");
  await startMusic();
  setTimeout(()=>goTo("garden"),650);
});
document.getElementById("envelope").addEventListener("click",async()=>{
  document.getElementById("envelope").classList.add("open");
  await startMusic();
  setTimeout(()=>goTo("garden"),2000);
});
document.getElementById("envelope").addEventListener("keydown",e=>{
  if(e.key==="Enter"||e.key===" "){e.preventDefault();document.getElementById("openBtn").click()}
});

document.querySelectorAll("[data-next]").forEach(btn=>{
  btn.addEventListener("click",async()=>{
    await startMusic();
    goTo(btn.dataset.next);
  });
});

musicBtn.addEventListener("click",async()=>{
  if(music.paused){
    try{await music.play();musicBtn.textContent="Ⅱ";musicBtn.classList.add("playing")}
    catch(e){}
  }else{
    music.pause();musicBtn.textContent="♫";musicBtn.classList.remove("playing");
  }
});

document.getElementById("restart").addEventListener("click",()=>{
  music.currentTime=0;
  goTo("hero");
  document.getElementById("envelope").classList.remove("open");
});

// Cambia la disposición de las fotos de forma elegante.
const cards=[...document.querySelectorAll(".polaroid")];
document.getElementById("shuffleBtn").addEventListener("click",()=>{
  cards.forEach((card,i)=>{
    const r=(Math.random()*18)-9;
    const x=(Math.random()*35)-17;
    const y=(Math.random()*18)-9;
    card.style.transform=`translate(${x}px,${y}px) rotate(${r}deg)`;
    card.style.zIndex=2+i;
  });
});

// Teclado: flechas para navegar por la experiencia.
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"){
    const next=Math.min(current+1,screens.length-1);
    goTo(screens[next].id);
  }
  if(e.key==="ArrowLeft"){
    const prev=Math.max(current-1,0);
    goTo(screens[prev].id);
  }
});

// Partículas doradas.
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");
let W=0,H=0,pts=[];
function resize(){
  W=canvas.width=innerWidth*devicePixelRatio;
  H=canvas.height=innerHeight*devicePixelRatio;
  canvas.style.width=innerWidth+"px";
  canvas.style.height=innerHeight+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
function make(){
  return{
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    r:.3+Math.random()*1.5,v:.05+Math.random()*.25,
    a:.1+Math.random()*.65,phase:Math.random()*Math.PI*2
  };
}
function init(){resize();pts=Array.from({length:140},make)}
function draw(t){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of pts){
    p.y-=p.v;
    p.phase+=.018;
    if(p.y<-5){p.y=innerHeight+5;p.x=Math.random()*innerWidth}
    const alpha=p.a*(.65+.35*Math.sin(p.phase));
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,215,75,${alpha})`;ctx.fill();
  }
  requestAnimationFrame(draw);
}
init();addEventListener("resize",resize);requestAnimationFrame(draw);

// Swipe móvil entre escenas.
let sx=0;
document.addEventListener("touchstart",e=>sx=e.changedTouches[0].clientX,{passive:true});
document.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-sx;
  if(Math.abs(dx)<70)return;
  const next=dx<0?Math.min(current+1,screens.length-1):Math.max(current-1,0);
  goTo(screens[next].id);
},{passive:true});
