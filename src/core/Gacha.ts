import config from "../../content/config.json";
import { GachaCfg, RelicCfg } from "./Economy";
import type { State } from "../State";

function drawRarity(state:State, cfg:GachaCfg):string {
  const pulls = state.pity.pulls + 1;
  if (pulls >= cfg.hardLegendary) {
    state.pity.pulls = 0;
    return "legendary";
  }
  let rates = { ...cfg.rates } as Record<string,number>;
  const bonus = Math.max(0, Math.min(pulls - cfg.softEpicStart + 1, 20)) / 100;
  state.pity.epicBonus = bonus * 100;
  rates.epic += bonus;
  rates.common -= bonus;
  const guaranteeRare = cfg.tenShotRareGuarantee && pulls % 10 === 0;
  let r = Math.random();
  if (guaranteeRare) {
    const total = rates.rare + rates.epic + rates.legendary;
    r *= total;
    if (r < rates.rare) return "rare";
    r -= rates.rare;
    if (r < rates.epic) return "epic";
    return "legendary";
  }
  if (r < rates.common) return "common";
  r -= rates.common;
  if (r < rates.rare) return "rare";
  r -= rates.rare;
  if (r < rates.epic) return "epic";
  return "legendary";
}

export function rollGacha(state:State):RelicCfg[] {
  const rarity = drawRarity(state, config.gacha);
  state.pity.pulls++;
  const pool = config.relics.filter(r=>r.rarity===rarity);
  const opts:RelicCfg[] = [];
  for (let i=0;i<3 && pool.length>0;i++) {
    const idx = Math.floor(Math.random()*pool.length);
    opts.push(pool.splice(idx,1)[0]);
  }
  return opts;
}
