import * as simple from './layouts/simpleLayout';

export class LayoutProcessor {
  constructor() {
    this.layouts = {
      "simpleExampleLayout": simple
    };
    this.defaultLayout = this.layouts["simpleExampleLayout"];
    document.addEventListener("changeLayout", this.onLayoutChange.bind(this));
  }

  processLayout(storyboard, layout = this.defaultLayout) {
    console.log(storyboard);
    if (!layout) {
      throw {
        title: "Incorrect layout",
        message: "Something went wrong with the layout, may it's not defined!"
      };
    }
    return layout.process(storyboard);
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