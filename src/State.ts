export interface SeedState {
  state:"unknown"|"planted"|"revealed";
  poolId:string;
  plantId?:string;
  progress?:number;
  variant?:boolean;
  traits?:string[];
}

export interface SaveV1 {
  version:"1.0.0";
  pe:number;
  generators:Record<string,number>;
  plant:{id:string;stage:number;progress:number};
  seeds:SeedState[];
  dex:string[];
  dust:number;
  relics:Record<string,{stars:number}>;
  pity:{seedNoNewCount:number;pulls:number;epicBonus:number};
}

export interface SaveV1_1 {
  version:"1.1.0";
  pe:number;
  generators:Record<string,number>;
  plant:{id:string;stage:number;progress:number};
  seeds:SeedState[];
  dex:string[];
  dexVariants:string[];
  dust:number;
  relics:Record<string,{stars:number}>;
  pity:{seedNoNewCount:number;pulls:number;epicBonus:number;mutationNoHit:number};
}

export type Save = SaveV1_1;

export const defaultState:Save = {
  version:"1.1.0",
  pe:0,
  generators:{},
  plant:{id:"sprout",stage:0,progress:0},
  seeds:[],
  dex:[],
  dexVariants:[],
  dust:0,
  relics:{},
  pity:{seedNoNewCount:0,pulls:0,epicBonus:0,mutationNoHit:0}
};

export type State = Save;

export function loadState():State {
  try {
    const raw = localStorage.getItem('bq_save');
    if (!raw) return structuredClone(defaultState);
    const data = JSON.parse(raw);
    return migrateSave(data);
  } catch {
    return structuredClone(defaultState);
  }
}

export function saveState(state:State) {
  localStorage.setItem('bq_save', JSON.stringify(state));
}

function migrateSave(data:any):State {
  if (!data.version) return structuredClone(defaultState);
  if (data.version === "1.0.0") {
    const v1 = data as SaveV1;
    const seeds = v1.seeds.map(s=>({ ...s, variant:false, traits:[], progress:s.progress }));
    const save:Save = {
      version:"1.1.0",
      pe:v1.pe,
      generators:v1.generators,
      plant:v1.plant,
      seeds,
      dex:v1.dex,
      dexVariants:[],
      dust:v1.dust,
      relics:v1.relics,
      pity:{...v1.pity, mutationNoHit:0}
    };
    return save;
  }
  return data as Save;
}
