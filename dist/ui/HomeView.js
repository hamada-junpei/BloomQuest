import { saveState } from "../State";
import config from "../../content/config.json";
import { clickAmount, cost, autogenPerSec } from "../core/Economy";
export class HomeView {
    constructor(state) {
        this.state = state;
        this.el = document.createElement('div');
        this.render();
    }
    click() {
        this.state.pe += clickAmount(this.state);
        saveState(this.state);
        this.render();
    }
    buy(id) {
        const cfg = config.generators.find(g => g.id === id);
        const n = this.state.generators[id] || 0;
        const c = cost(cfg.baseCost, cfg.r, n);
        if (this.state.pe >= c) {
            this.state.pe -= c;
            this.state.generators[id] = n + 1;
            saveState(this.state);
            this.render();
        }
    }
    render() {
        const peSec = autogenPerSec(this.state);
        this.el.innerHTML = `<div>PE: ${Math.floor(this.state.pe)}</div>
<button id="click">Tap</button>
<div>PE/s: ${peSec.toFixed(2)}</div>
<div id="gens"></div>`;
        this.el.querySelector('#click').addEventListener('click', () => this.click());
        const gens = this.el.querySelector('#gens');
        for (const g of config.generators) {
            const n = this.state.generators[g.id] || 0;
            const c = cost(g.baseCost, g.r, n);
            const prod = g.p0 * Math.pow(n + 1, g.alpha) - g.p0 * Math.pow(n, g.alpha);
            const div = document.createElement('div');
            div.innerHTML = `${g.name} x${n} cost:${c} prod:+${prod.toFixed(2)} <button>buy</button>`;
            div.querySelector('button').addEventListener('click', () => this.buy(g.id));
            gens.appendChild(div);
        }
    }
}
