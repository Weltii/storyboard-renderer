export function initEditorUi() {
  global.sidebarLeft = document.getElementById("sidebar-left");
  global.sidebarRight = document.getElementById("sidebar-right");
  global.errorLogList = document.getElementById("error-log-list");
  global.layoutList = document.getElementById("possible-layouts-list");

  let sidebarLeftClose = document.getElementById("sidebar-left-close");
  let sidebarRightClose = document.getElementById("sidebar-right-close");
  let sidebarLeftOpen = document.getElementById("sidebar-left-open");
  let sidebarRightOpen = document.getElementById("sidebar-right-open");
  
  sidebarLeftClose.addEventListener("click", onClickCloseSidebar);
  sidebarRightClose.addEventListener("click", onClickCloseSidebar);
  sidebarLeftOpen.addEventListener("click", onClickCloseSidebar);
  sidebarRightOpen.addEventListener("click", onClickCloseSidebar);

  clearLog();
  initLayoutsList();
  document.addEventListener("MissingData", (event) => {
    this.addError({
      title: "MissingData",
      message: event.detail.message
    });
    openSideBar(sidebarRight);
  });
  initSidebarExportButton();
};

/* Sidebar */

function onClickCloseSidebar(event) {
  if (event.target.id.search("left") == -1) {
    toggleSidebar(sidebarRight);
  }
  else {
    toggleSidebar(sidebarLeft);
  }
}

function toggleSidebar(sidebar) {
  if (sidebar && sidebar.style) { 
    if (sidebar.style.width == "0px") {
      openSideBar(sidebar);
    }
    else {
      closeSidebar(sidebar);
    }
  }
}

export function openSideBar(sidebar) {
  if (sidebar && sidebar.style) { 
    sidebar.style.width = "350px";
  }
}

export function closeSidebar(sidebar) {
  if (sidebar && sidebar.style) { 
    sidebar.style.width = "0px";
  }
}

/* Error Log */

export function clearLog() {
  removeChilds(errorLogList);
}

export function addError(error) {
  let title = error.title;
  let message = error.message;
  errorLogList.appendChild(generateErrorLogMessage(title, message));
}

function generateErrorLogMessage(title, message) {
  let element = document.createElement("li");
  element.classList.add("error-message");
  element.innerHTML = message;
  return element;
}

/* Layout chooser */

function initLayoutsList() {
  for (let key in layoutParser.layouts) {
    layoutList.appendChild(generateLayoutListItem(key));
  }
}

function generateLayoutListItem(key) {
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
  return element;
}

/* Sidebar Import Button */
/* Sidebar Export Button */

function initSidebarExportButton() {
  document.getElementById("sidebar-export-button").addEventListener("click", () => {
    lastGeneratedDoc.download("GeneratedLayout.pdf");
  });
}