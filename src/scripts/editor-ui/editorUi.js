import * as io from "../io";
import { removeChilds } from '../util';
import { EditorBridge } from '../editorBridge';
import { MakePdfBridge } from '../makePdfBridge';
import { InputParser } from '../input_parser';
import { LayoutProcessor} from '../layout_processor';
import { ImageUpload } from "./imageUpload";

export class EditorUi {
  constructor() {
    this.layoutProcessor = new LayoutProcessor();
    this.inputParser = new InputParser();
    this.editorBridge = new EditorBridge(this.inputParser);
    this.makePdfBridge = new MakePdfBridge(this.layoutProcessor);
    this.imageUpload = new ImageUpload(this.editorBridge);
    this.editorBridge.sendStartProcessEvent();
    
    this.sidebarLeft = document.getElementById("sidebar-left");
    this.sidebarRight = document.getElementById("sidebar-right");
    this.errorLogList = document.getElementById("error-log-list");
    this.layoutList = document.getElementById("possible-layouts-list");

    document.getElementById("sidebar-left-close").addEventListener("click", this.onClickCloseSidebar.bind(this));
    document.getElementById("sidebar-right-close").addEventListener("click", this.onClickCloseSidebar.bind(this));
    document.getElementById("sidebar-left-open").addEventListener("click", this.onClickCloseSidebar.bind(this));
    document.getElementById("sidebar-right-open").addEventListener("click", this.onClickCloseSidebar.bind(this));
    document.addEventListener("AddError", this.onErrorReceive.bind(this));
    document.addEventListener("ClearLog", this.onClearLog.bind(this));

    this.clearLog();
    this.initLayoutsList();
    this.initSidebarExportButton();
    this.initSidebarImportButton();
    this.initSidebarSaveWorkingFile();
  }

  onClearLog() {
    this.clearLog();
    this.closeSidebar(this.sidebarRight);
  }

  onErrorReceive(event) {
    this.addError({
      title: event.detail.title,
      message: event.detail.message
    });
    this.openSideBar(this.sidebarRight);
  }

  /* Sidebar */

  onClickCloseSidebar(event) {
    if (event.target.id.search("left") == -1) {
      this.toggleSidebar(this.sidebarRight);
    }
    else {
      this.toggleSidebar(this.sidebarLeft);
    }
  }

  toggleSidebar(sidebar) {
    if (sidebar && sidebar.style) { 
      if (sidebar.style.width == "0px") {
        this.openSideBar(sidebar);
      }
      else {
        this.closeSidebar(sidebar);
      }
    }
  }

  openSideBar(sidebar) {
    if (sidebar && sidebar.style) { 
      sidebar.style.width = "350px";
    }
  }

  closeSidebar(sidebar) {
    if (sidebar && sidebar.style) { 
      sidebar.style.width = "0px";
    }
  }


  /* Error Log */

  clearLog() {
    removeChilds(this.errorLogList);
  }

  addError(error) {
    let title = error.title;
    let message = error.message;
    this.errorLogList.appendChild(this.generateErrorLogMessage(title, message));
  };
  
  generateErrorLogMessage(title, message) {
    let element = document.createElement("li");
    element.classList.add("error-message");
    element.innerHTML = message;
    return element;
  };


  /* Layout chooser */

  initLayoutsList() {
    for (let key in this.layoutProcessor.layouts) {
      this.layoutList.appendChild(this.generateLayoutListItem(key));
    }
  };

  generateLayoutListItem(key) {
    let container = document.createElement("li");
    let element = document.createElement("button");
    element.innerText = key;
    element.classList.add("layoutItem");
    element.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("changeLayout", {
        detail: {
          key: key
        }
      }));
    });
    container.appendChild(element);
    return container;
  };


  /* Sidebar Import Button */

  initSidebarImportButton() {
    document.getElementById("sidebar-input-file").addEventListener("change", (event) => {
      let files = event.target.files;
      if (files.length > 1) {
        console.log("too many files selected");
        return;
      }
      if (files.length == 0) {
        console.log("too less files selected");
      }
      let file = files[0];
      io.loadWorkingFile(file, (parsedText) => {
        this.editorBridge.setData(parsedText);
      });
    });
  };


  /* Save working file */
  
  initSidebarSaveWorkingFile() {
    document.getElementById("sidebar-save-button").addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("saveWork"));
    });
  };


  /* Sidebar Export Button */

  initSidebarExportButton() {
    document.getElementById("sidebar-export-button").addEventListener("click", () => {
      lastGeneratedDoc.download("GeneratedLayout.pdf");
    });
  }
}