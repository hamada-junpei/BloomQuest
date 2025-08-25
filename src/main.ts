import { loadState, State, saveState, SeedState } from "./State";
import config from "../content/config.json";
import { autogenPerSec } from "./core/Economy";
import { HomeView } from "./ui/HomeView";
import { SeedsView } from "./ui/SeedsView";
import { RelicsView } from "./ui/RelicsView";
import { DexView } from "./ui/DexView";
import { FEATURES } from "./features";

const state = loadState();
const home = new HomeView(state);
const seeds = new SeedsView(state);
const relics = new RelicsView(state);
const dex = new DexView(state);
const view = document.getElementById('view')!;

function show(v:any){ view.innerHTML=''; view.appendChild(v.el); v.render(); }
(document.getElementById('tab-home') as HTMLElement).onclick=()=>show(home);
(document.getElementById('tab-seeds') as HTMLElement).onclick=()=>show(seeds);
(document.getElementById('tab-relics') as HTMLElement).onclick=()=>show(relics);
(document.getElementById('tab-dex') as HTMLElement).onclick=()=>show(dex);
show(home);

const TICK_MS=100;
let acc=0,last=performance.now();
function loop(now:number){
  const dt=now-last; last=now; acc+=dt;
  while(acc>=TICK_MS){
    state.pe += autogenPerSec(state)*(TICK_MS/1000);
    advancePlant(state,TICK_MS);
    advanceSeeds(state,TICK_MS);
    acc-=TICK_MS;
  }
  home.render(); seeds.render(); relics.render(); dex.render();
  saveState(state);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function advancePlant(state:State, dt:number){
  const cfg=config.plants.find(p=>p.id===state.plant.id)!;
  state.plant.progress += dt;
  if(state.plant.progress >= cfg.stages[state.plant.stage]){
    state.plant.progress=0;
    state.plant.stage++;
    if(state.plant.stage>=4){
      dropSeed(state);
      state.plant.stage=0;
    }
  }
}

function dropSeed(state:State){
  if(state.seeds.length>=3) return;
  let chance=0.6;
  const unreg = 1 - state.dex.length / config.plants.length;
  chance += 0.2*unreg;
  if(Math.random()>chance) return;
  const pool=config.seedPools[0];
  const seed:SeedState={state:'unknown',poolId:pool.id};
  if(FEATURES.MUTATION){
    const mut=(config as any).mutation;
    const pity=state.pity.mutationNoHit;
    let rate=mut.baseRate;
    if(pity>=mut.pity) rate=1;
    if(Math.random()<rate){
      seed.variant=true;
      seed.traits=[(config as any).traits[0].id];
      state.pity.mutationNoHit=0;
    }else state.pity.mutationNoHit++;
  }
  state.seeds.push(seed);
}

function advanceSeeds(state:State, dt:number){
  for(const s of state.seeds){
    if(s.state==='planted'){
      const cfg=config.plants.find(p=>p.id===s.plantId)!;
      const need=cfg.stages[0]+cfg.stages[1];
      s.progress=(s.progress||0)+dt;
      if((s.progress||0)>=need){
        s.state='revealed';
        const newSp=!state.dex.includes(s.plantId!);
        if(newSp) state.dex.push(s.plantId!); else state.dust++;
        if(s.variant){
          if(!state.dexVariants.includes(s.plantId!)) state.dexVariants.push(s.plantId!);
          else state.dust++;
        }
      }
    }
  }
}
