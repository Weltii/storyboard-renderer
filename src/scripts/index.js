import '../styles/index.scss';

console.log('webpack starterkit');

let storageName = "lastStoryboard";
let defaultStoryboard = JSON.stringify({
  "nice": "nice"
}, null, "\t");

function init() {
  global.pdfmake = require('pdfmake/build/pdfmake.js');
  global.font = require('pdfmake/build/vfs_fonts.js');

  let ace = require('brace');
  require('brace/mode/javascript');
  require('brace/theme/monokai');
   
  global.timer = null;
  global.lastChanged = null;
  global.lastGen = null;
  global.editor = ace.edit("editor");
  
  initEditor();
}

function initEditor() {
  let oldSession = localStorage[storageName] ? localStorage[storageName] : defaultStoryboard;
  editor.getSession().setValue(oldSession);
  editor.getSession().setMode('ace/mode/json');
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
    version: 1.3,
    vss: {}
  });
  pdfDocGenerator.getDataUrl((dataUrl) => {
    console.log("ready");
    document.getElementById("pdf-viewer").src = dataUrl;
  });
}

document.onload = init();