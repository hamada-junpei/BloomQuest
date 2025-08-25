import { saveState } from "../State";
import config from "../../content/config.json";
export class SeedsView {
    constructor(state) {
        this.state = state;
        this.el = document.createElement('div');
        this.render();
    }
    plant(i) {
        const seed = this.state.seeds[i];
        if (seed.state !== "unknown")
            return;
        const pool = config.seedPools.find(p => p.id === seed.poolId);
        const plantId = pool.candidates[Math.floor(Math.random() * pool.candidates.length)];
        seed.state = "planted";
        seed.plantId = plantId;
        seed.progress = 0;
        saveState(this.state);
        this.render();
    }
    collect(i) {
        this.state.seeds.splice(i, 1);
        saveState(this.state);
        this.render();
    }
    render() {
        this.el.innerHTML = "";
        this.state.seeds.forEach((s, i) => {
            const div = document.createElement('div');
            div.className = 'seed';
            if (s.state === 'unknown') {
                div.textContent = `${s.poolId} 未鑑定`;
                const b = document.createElement('button');
                b.textContent = '植える';
                b.onclick = () => this.plant(i);
                div.appendChild(b);
            }
            else if (s.state === 'planted') {
                const cfg = config.plants.find(p => p.id === s.plantId);
                const need = cfg.stages[0] + cfg.stages[1];
                const prog = Math.min(1, (s.progress || 0) / need);
                div.textContent = `育成中 ${(prog * 100).toFixed(0)}%`;
            }
            else {
                const cfg = config.plants.find(p => p.id === s.plantId);
                div.innerHTML = `${cfg.name} ${s.variant ? '<span class="variant">Variant</span>' : ''}`;
                const b = document.createElement('button');
                b.textContent = '回収';
                b.onclick = () => this.collect(i);
                div.appendChild(b);
            }
            this.el.appendChild(div);
        });
    }
}
