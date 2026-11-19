import {NeonEngine} from './engine.js';
import {NeonUI} from './ui.js';
const SAVE_KEY='neon-run-profile-v2';
const SKINS=[
{id:'cyan',name:'سایبر آبی',desc:'درخشش کلاسیک',color:'#48f4ff',price:0},
{id:'pink',name:'شبح صورتی',desc:'رد نور بنفش',color:'#ff4fd8',price:80},
{id:'solar',name:'شعله خورشید',desc:'گرمای بی‌پایان',color:'#ff9b55',price:150},
{id:'lime',name:'پالس سبز',desc:'انرژی خالص',color:'#6dffca',price:240},
{id:'gold',name:'طلای افسانه‌ای',desc:'ویژه رکوردشکن‌ها',color:'#ffd36a',price:380},
{id:'violet',name:'خلأ بنفش',desc:'سایه‌ای از آینده',color:'#aa83ff',price:520}];
const UPGRADES=[
{id:'shield',name:'سپر محافظ',desc:'شروع هر دور با سپر ۳ ثانیه‌ای',basePrice:110,maxLevel:3},
{id:'magnet',name:'مغناطیس کریستال',desc:'جذب کریستال‌ها از فاصله بیشتر',basePrice:95,maxLevel:3},
{id:'bonus',name:'پاداش آغازین',desc:'+کریستال پایان هر دور',basePrice:130,maxLevel:3}];
const MISSIONS=[
{id:'m_coins',text:'در یک دور ۱۲ کریستال جمع کن',target:12,reward:45},
{id:'m_score',text:'در یک دور به امتیاز ۵۰۰ برس',target:500,reward:55},
{id:'m_combo',text:'کمبوی ۵تایی بساز',target:5,reward:40},
{id:'m_runs',text:'سه دور بازی را کامل کن',target:3,reward:60}];
const fresh=()=>({bestScore:0,bestZone:1,wallet:0,totalCoins:0,runs:0,seconds:0,obstaclesPassed:0,unlocked:['cyan'],skin:'cyan',upgrades:{shield:0,magnet:0,bonus:0},progress:{},claimed:[],sound:true,vibration:true});
function load(){try{const v=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return v?{...fresh(),...v,upgrades:{...fresh().upgrades,...(v.upgrades||{})}}:fresh();}catch{return fresh();}}
let profile=load(),tab='skins',audio=null,muted=!profile.sound,runStarted=0,lastHud=0;
const save=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(profile));}catch{}};
function tone(freq=420,duration=.09,type='sine'){if(muted)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(.055,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);}catch{}}
const ui=new NeonUI({play:start,pause:pause,resume:resume,home:home,shop:()=>shop('skins'),missions:missions,stats:stats,sound:toggleSound,tab:t=>shop(t),purchase:purchase});
const engine=new NeonEngine(document.getElementById('game'),{sound:type=>tone(type==='coin'?760:type==='power'?990:420,.11,type==='jump'?'triangle':'sine'),hud:data=>{const now=performance.now();if(now-lastHud>70){ui.update(data);lastHud=now;}},zone:z=>ui.toast('منطقه '+z+' — سرعت بیشتر شد'),toast:m=>ui.toast(m),over:finish});
let pointerY=null;
engine.canvas.addEventListener('pointerdown',e=>{if(ui.screens.some(id=>!document.getElementById(id).hidden))return;pointerY=e.clientY;if(engine.running&&!engine.paused)engine.jump();});
engine.canvas.addEventListener('pointermove',e=>{if(pointerY!==null&&e.clientY-pointerY>35){engine.fastFall();pointerY=null;}});
engine.canvas.addEventListener('pointerup',()=>pointerY=null);
engine.canvas.addEventListener('pointercancel',()=>pointerY=null);
window.addEventListener('keydown',e=>{if(e.repeat)return;if(['Space','ArrowUp','KeyW'].includes(e.code)){e.preventDefault();if(engine.running&&!engine.paused)engine.jump();else if(!engine.running)start();}if(['ArrowDown','KeyS'].includes(e.code))engine.fastFall();if(['Escape','KeyP'].includes(e.code)){if(engine.running&&!engine.paused)pause();else if(engine.running&&engine.paused)resume();}if(e.code==='KeyM')toggleSound();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&engine.running&&!engine.paused)pause();});
function start(){ui.show('');ui.hud(true);engine.start();engine.shield=profile.upgrades.shield?Math.min(6,profile.upgrades.shield*2):0;engine.magnetLevel=profile.upgrades.magnet||0;engine.skinColor=(SKINS.find(s=>s.id===profile.skin)||SKINS[0]).color;runStarted=performance.now();tone(520,.13,'triangle');}
function pause(){if(!engine.running||engine.paused)return;engine.pause();ui.show('pauseScreen');ui.hud(false);}
function resume(){if(!engine.running)return;ui.show('');ui.hud(true);engine.resume();}
function home(){engine.stop();ui.home(profile);}
function shop(t='skins'){tab=t;ui.shop(profile,tab,SKINS,UPGRADES);}
function missions(){ui.missions(profile,MISSIONS);}
function stats(){ui.stats(profile);}
function toggleSound(){muted=!muted;profile.sound=!muted;save();document.getElementById('soundBtn').textContent=muted?'♪':'♫';if(!muted)tone(600,.1);}
function purchase(type,id){if(type==='skins'){const s=SKINS.find(x=>x.id===id);if(!s)return;if(profile.unlocked.includes(id))profile.skin=id;else if(profile.wallet>=s.price){profile.wallet-=s.price;profile.unlocked.push(id);profile.skin=id;}else return;}else{const u=UPGRADES.find(x=>x.id===id);if(!u)return;const level=profile.upgrades[id]||0,price=u.basePrice*(level+1);if(level>=u.maxLevel||profile.wallet<price)return;profile.wallet-=price;profile.upgrades[id]=level+1;}save();ui.shop(profile,tab,SKINS,UPGRADES);ui.toast('تغییرات ذخیره شد');tone(850,.12);}
function updateMissions(result){const vals={m_coins:result.coins,m_score:result.score,m_combo:engine.combo,m_runs:1};for(const m of MISSIONS){if(profile.claimed.includes(m.id))continue;const value=vals[m.id]||0;profile.progress[m.id]=m.id==='m_runs'?(profile.progress[m.id]||0)+value:Math.max(profile.progress[m.id]||0,value);if(profile.progress[m.id]>=m.target){profile.claimed.push(m.id);profile.wallet+=m.reward;ui.toast('مأموریت تکمیل شد: +'+m.reward+' کریستال');}}}
function finish(result){const newRecord=result.score>profile.bestScore;profile.runs++;profile.seconds+=(performance.now()-runStarted)/1000;profile.wallet+=result.coins+(profile.upgrades.bonus||0);profile.totalCoins+=result.coins;profile.bestScore=Math.max(profile.bestScore,result.score);profile.bestZone=Math.max(profile.bestZone,result.zone);profile.obstaclesPassed+=result.obstaclesPassed||0;updateMissions(result);save();ui.over(result,profile,newRecord);}
document.getElementById('soundBtn').textContent=muted?'♪':'♫';ui.home(profile);