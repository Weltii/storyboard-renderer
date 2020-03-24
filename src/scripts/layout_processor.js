import {SimpleLayout} from './layouts/simpleLayout';
import {MovieLayout} from './layouts/movieLayout';

export class LayoutProcessor {
  constructor() {
    this.layouts = {
      "simpleExampleLayout": SimpleLayout,
      "movieLayout": MovieLayout
    };
    this.defaultLayout = this.layouts["movieLayout"];
    document.addEventListener("changeLayout", this.onLayoutChange.bind(this));
  }

  processLayout(storyboard, layout = this.defaultLayout) {
    if (!layout) {
      throw {
        title: "Incorrect layout",
        message: "Something went wrong with the layout, may it's not defined!"
      };
    }
    layout = new layout(storyboard);
    return layout.process();
  };

  setDefaultLayout(layoutName) {
    if (!layoutName) {
      throw {
        title: "Incorrect layout name!",
        message: "Something went wrong with the layout name, please check if the string isn't empty."
      };
    }
    if (!this.layouts[layoutName]) {
      throw {
        title: "Layout not found!",
        message: `The ${layoutName} layout cannot found, please check the name and that this layout is available.`
      };
    }
    this.defaultLayout = this.layouts[layoutName];
  };

  getLayout(layoutName) {
    return this.layouts[layoutName];
  };
  
  onLayoutChange(event) {
    this.setDefaultLayout(event.detail.key);
    document.dispatchEvent(new CustomEvent("StartRenderProcess"));
  }
}