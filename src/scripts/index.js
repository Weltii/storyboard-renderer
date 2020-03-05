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
  global.codeEditor = ace.edit("editor");
  global.inputParser = require("./input_parser");
  global.layoutParser = require("./layout_processor");
  global.uiEditor = require("./editor_ui");
  global.removeChilds = function(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };
  
  let classes = require("./classes");
  global.Frame = classes.Frame;
  global.Storyboard = classes.Storyboard;
  
  uiEditor.initEditorUi();
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
  codeEditor.getSession().setValue(oldSession);
  codeEditor.getSession().setMode('ace/mode/javascript');
  codeEditor.setTheme('ace/theme/monokai');
  codeEditor.getSession().on('change', function (e) {
    if (timer) {
      clearTimeout(timer);
    }

    localStorage.lastStoryboard = codeEditor.getSession().getValue();

    timer = setTimeout(function () {
      uiEditor.clearLog();
      processData();   
    }, 300);
  });
}

function processData() {
  try {
    let parsedData = inputParser.parseInput(codeEditor.getSession().getValue());
    let docContent = layoutParser.processLayout(parsedData, "");
      generatePdf(docContent);
  } catch(err) {
    // todo show this error in ui
    uiEditor.openSideBar(sidebarRight);
    uiEditor.addError(err);
    console.table(err);
  }
}

/**
 * 
 * @param {Object} docContent 
 */
function generatePdf(docContent) {
  const pdfDocGenerator = pdfMake.createPdf(docContent);
  pdfDocGenerator.getDataUrl((dataUrl) => {
    document.getElementById("pdf-viewer").src = dataUrl;
  });
}

window.onload = init();