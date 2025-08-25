export interface GeneratorCfg { id:string; name:string; baseCost:number; r:number; p0:number; alpha:number; }
export interface PlantCfg     { id:string; name:string; biome:string; stages:number[]; passive?:{type:string;value:number}; }
export interface RelicCfg     { id:string; name:string; rarity:string; effects:{type:string;value:number}[]; set?:string; }
export interface SeedPoolCfg  { id:string; hint:string; weights:Record<string,number>; candidates:string[]; }
export interface GachaCfg     { rates:Record<string,number>; softEpicStart:number; hardLegendary:number; tenShotRareGuarantee:boolean; }

import type { State } from "../State";
import config from "../../content/config.json" assert { type: "json" };

export function cost(base:number, r:number, n:number):number {
  return Math.floor(base * Math.pow(r, n));
}

export function prod(p0:number, alpha:number, n:number):number {
  return p0 * Math.pow(n, alpha);
}

function getEffect(state:State, type:string):number {
  let sum=0;
  for (const id in state.relics) {
    const info = state.relics[id];
    const relic = config.relics.find(r=>r.id===id);
    if (!relic) continue;
    for (const e of relic.effects) {
      if (e.type===type) sum += e.value * info.stars;
    }
  }
  return sum;
}

export function clickAmount(state:State):number {
  const base = 1;
  let amt = base * (1 + getEffect(state, "click_mult"));
  if (Math.random() < 0.05) amt *= 5;
  return amt;
}

export function autogenPerSec(state:State):number {
  let total=0;
  for (const g of config.generators) {
    const n = state.generators[g.id] || 0;
    if (n>0) total += prod(g.p0, g.alpha, n);
  }
  total *= (1 + getEffect(state, "autogen_mult"));
  return total;
}
