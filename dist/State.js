export const defaultState = {
    version: "1.1.0",
    pe: 0,
    generators: {},
    plant: { id: "sprout", stage: 0, progress: 0 },
    seeds: [],
    dex: [],
    dexVariants: [],
    dust: 0,
    relics: {},
    pity: { seedNoNewCount: 0, pulls: 0, epicBonus: 0, mutationNoHit: 0 }
};
export function loadState() {
    try {
        const raw = localStorage.getItem('bq_save');
        if (!raw)
            return structuredClone(defaultState);
        const data = JSON.parse(raw);
        return migrateSave(data);
    }
    catch {
        return structuredClone(defaultState);
    }
}
export function saveState(state) {
    localStorage.setItem('bq_save', JSON.stringify(state));
}
function migrateSave(data) {
    if (!data.version)
        return structuredClone(defaultState);
    if (data.version === "1.0.0") {
        const v1 = data;
        const seeds = v1.seeds.map(s => ({ ...s, variant: false, traits: [], progress: s.progress }));
        const save = {
            version: "1.1.0",
            pe: v1.pe,
            generators: v1.generators,
            plant: v1.plant,
            seeds,
            dex: v1.dex,
            dexVariants: [],
            dust: v1.dust,
            relics: v1.relics,
            pity: { ...v1.pity, mutationNoHit: 0 }
        };
        return save;
    }
    return data;
}
