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
  global.inputParser = require("./input_parser");
  global.layoutParser = require("./layout_processor");
  
  let classes = require("./classes");
  global.Frame = classes.Frame;
  global.Storyboard = classes.Storyboard;
  
  configurePdfMake();
  configureEditor();
  processData();
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
      processData();   
    }, 300);
  });
}

function processData() {
  try {
    let parsedData = inputParser.parseInput(editor.getSession().getValue());
    let docContent = layoutParser.processLayout(parsedData, "");
    if (!lastGen || lastGen < lastChanged) {
      generatePdf(docContent);
    };
  } catch(err) {
    // todo show this error in ui
    console.table(err);
  }
}

/**
 * 
 * @param {Object} docContent 
 */
function generatePdf(docContent) {
  lastGen = new Date();
  let content = editor.getSession().getValue();
  const pdfDocGenerator = pdfMake.createPdf(docContent);
  pdfDocGenerator.getDataUrl((dataUrl) => {
    document.getElementById("pdf-viewer").src = dataUrl;
  });
}

window.onload = init();