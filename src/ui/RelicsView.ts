import { State, saveState } from "../State";
import config from "../../content/config.json" assert { type: "json" };
import { rollGacha } from "../core/Gacha";

export class RelicsView {
  el:HTMLElement;
  options:HTMLElement|null=null;
  constructor(private state:State){
    this.el=document.createElement('div');
    this.render();
  }
  gacha(){
    const opts=rollGacha(this.state);
    saveState(this.state);
    this.options=document.createElement('div');
    for(const r of opts){
      const div=document.createElement('div');
      div.className='relic-option';
      div.textContent=r.name;
      div.onclick=()=>{this.pick(r);};
      this.options.appendChild(div);
    }
    this.render();
  }
  pick(r:any){
    const rec=this.state.relics[r.id];
    if(rec){ rec.stars=Math.min(5,rec.stars+1); }
    else this.state.relics[r.id]={stars:1};
    this.options=null;
    saveState(this.state);
    this.render();
  }
  render(){
    this.el.innerHTML=`<div>pulls:${this.state.pity.pulls} epic+${this.state.pity.epicBonus}%</div>`;
    const btn=document.createElement('button'); btn.textContent='ガチャ'; btn.onclick=()=>this.gacha();
    this.el.appendChild(btn);
    if(this.options) this.el.appendChild(this.options);
  }
}
