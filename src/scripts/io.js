export function saveData(data) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', "storyboard_file.json");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function loadWorkingFile(file, callBack) {
  if (file.type != "application/json") {
    console.log("wrong file type");
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    callBack(e.target.result);
  };
  reader.readAsText(file);
}