export class MakePdfBridge {
  constructor(layoutProcessor) {
    this.prototype = require('pdfmake/build/pdfmake.js');
    this.layoutProcessor = layoutProcessor;
    this.lastGeneratedDoc = null;
    this.pdfContainer = document.getElementById("pdf-viewer");
    this.prototype.vfs = require("./vfs_fonts").pdfMake.vfs;
    this.prototype.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf'
      }
    };

    document.addEventListener("StartRenderProcess", (event) => {
      if (event.detail && event.detail.storyboard) {
        this.lastGeneratedDoc = event.detail.storyboard;
      }
      this.renderStoryboard(this.lastGeneratedDoc);
    });
  }

  renderStoryboard(storyboard) {
    document.dispatchEvent(new CustomEvent("clearLog"));
    try {
      let docContent = this.layoutProcessor.processLayout(storyboard, this.layoutProcessor.defaultLayout);
      let generatedDoc = this.prototype.createPdf(docContent);
      generatedDoc.getDataUrl((dataUrl) => {
        this.pdfContainer.src = dataUrl;
      });
    } catch (err) {
      document.dispatchEvent(new CustomEvent("AddError", {
        detail: err
      }));
   };
  };

  getLastGeneratedDoc() {
    return this.lastGeneratedDoc();
  };
};