import config from "../../content/config.json" assert { type: "json" };
export function cost(base, r, n) {
    return Math.floor(base * Math.pow(r, n));
}
export function prod(p0, alpha, n) {
    return p0 * Math.pow(n, alpha);
}
function getEffect(state, type) {
    let sum = 0;
    for (const id in state.relics) {
        const info = state.relics[id];
        const relic = config.relics.find(r => r.id === id);
        if (!relic)
            continue;
        for (const e of relic.effects) {
            if (e.type === type)
                sum += e.value * info.stars;
        }
    }
    return sum;
}
export function clickAmount(state) {
    const base = 1;
    let amt = base * (1 + getEffect(state, "click_mult"));
    if (Math.random() < 0.05)
        amt *= 5;
    return amt;
}
export function autogenPerSec(state) {
    let total = 0;
    for (const g of config.generators) {
        const n = state.generators[g.id] || 0;
        if (n > 0)
            total += prod(g.p0, g.alpha, n);
    }
    total *= (1 + getEffect(state, "autogen_mult"));
    return total;
}
