import { State } from "../State";
import config from "../../content/config.json";

export class DexView {
  el:HTMLElement;
  constructor(private state:State){
    this.el=document.createElement('div');
    this.render();
  }
  render(){
    this.el.innerHTML="";
    for(const id of this.state.dex){
      const plant=config.plants.find(p=>p.id===id)!;
      const div=document.createElement('div');
      const variant=this.state.dexVariants.includes(id);
      div.innerHTML=`${plant.name}${variant?'<span class="variant">Variant</span>':''}`;
      this.el.appendChild(div);
    }
  }
}
