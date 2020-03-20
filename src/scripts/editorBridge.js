import * as io from './io';

export class EditorBridge {
  constructor(inputParser) {
    let ace = require("brace");
    require('brace/mode/javascript');
    require('brace/theme/monokai');
    this.prototype = ace.edit("editor");
    this.timer = null;
    this.inputParser = inputParser;
    this.prototype.getSession().setMode("ace/mode/javascript");
    this.prototype.setTheme("ace/theme/monokai");
    let startContent = localStorage.lastStoryboard ? localStorage.lastStoryboard : JSON.stringify({
      data: {
        project_name: "Initial Data"
      },
      frames: []
    }, null, "\t");
    this.prototype.getSession().setValue(startContent);

    this.prototype.getSession().on("change", () => {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      localStorage.lastStoryboard = this.prototype.getSession().getValue();

      this.timer = setTimeout(this.sendStartProcessEvent.bind(this), 300);
    });
    document.addEventListener("saveWork", this.saveData.bind(this));
  }

  sendStartProcessEvent() {
    document.dispatchEvent(new CustomEvent("ClearLog"));
    try {
      document.dispatchEvent(new CustomEvent("StartRenderProcess",
        {
          detail: {
            storyboard: this.inputParser.parseInput(this.prototype.getSession().getValue())
          }
        }
      ));
    } catch(e) {
      document.dispatchEvent(new CustomEvent("ErrorReceive", {detail: e}));
    }
  };

  setData(value) {
    this.prototype.getSession().setValue(value);
  }

  saveData() {
    io.saveData(this.prototype.getSession().getValue());
  }
};