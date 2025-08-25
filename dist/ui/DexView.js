import config from "../../content/config.json" assert { type: "json" };
export class DexView {
    constructor(state) {
        this.state = state;
        this.el = document.createElement('div');
        this.render();
    }
    render() {
        this.el.innerHTML = "";
        for (const id of this.state.dex) {
            const plant = config.plants.find(p => p.id === id);
            const div = document.createElement('div');
            const variant = this.state.dexVariants.includes(id);
            div.innerHTML = `${plant.name}${variant ? '<span class="variant">Variant</span>' : ''}`;
            this.el.appendChild(div);
        }
    }
}
