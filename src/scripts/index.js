import '../styles/index.scss';

let storageName = "lastStoryboard";
let defaultStoryboard = JSON.stringify({
  "nice": "nice"
}, null, "\t");

function init() {
  let ace = require('brace');
  require('brace/mode/javascript');
  require('brace/theme/monokai');
  
  global.pdfmake = require('pdfmake/build/pdfmake.js');
  global.timer = null;
  global.lastChanged = null;
  global.lastGen = null;
  global.editor = ace.edit("editor");
  
  configureEditor();
  configurePdfMake();
}

function configurePdfMake() {
  pdfMake.vfs = require("./vfs_fonts").pdfMake.vfs;
  pdfMake.fonts = {
    Roboto: {
            normal: 'Roboto-Regular.ttf'
    }
  };
}

function configureEditor() {
  let oldSession = localStorage[storageName] ? localStorage[storageName] : defaultStoryboard;
  editor.getSession().setValue(oldSession);
  editor.getSession().setMode('ace/mode/javascript');
  editor.setTheme('ace/theme/monokai');
  editor.getSession().on('change', function (e) {
    if (timer) {
      clearTimeout(timer);
    }
    lastChanged = new Date();

    localStorage.lastStoryboard = editor.getSession().getValue();

    timer = setTimeout(function () {
      if (!lastGen || lastGen < lastChanged) {
        generatePdf();
      };
    }, 300);
  });
}

function generatePdf() {
  lastGen = new Date();
  let content = editor.getSession().getValue();
  const pdfDocGenerator = pdfMake.createPdf({
    content: content,
  });
  pdfDocGenerator.getDataUrl((dataUrl) => {
    document.getElementById("pdf-viewer").src = dataUrl;
  });
}

window.onload = init();