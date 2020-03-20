import { EditorBridge } from '../editorBridge.js';

export class ImageUpload {
  constructor(editorBridge) {
    this.editorBridge = editorBridge;
    this.inputId = document.getElementById("image-upload-id");
    this.inputFile = document.getElementById("image-upload-file");
    this.fileReader = new FileReader();
    this.possibleTypes = ["image/png", "image/jpg"];

    this.fileReader.onloadend = this.onLoad.bind(this);
    this.inputId.addEventListener("input", this.checkId.bind(this));
    document.getElementById("image-upload-button").addEventListener("click", this.uploadImage.bind(this));
    document.addEventListener("StartRenderProcess", (event) => {
      this.lastStoryboard = event.detail.storyboard;
    });
  }

  uploadImage(event) {
    let files = this.inputFile.files;
    if (files.length > 1) {
      console.log("too many files selected");
      return;
    }
    if (files.length == 0) {
      console.log("too less files selected");
    }
    let file = files[0];
    if (!this.possibleTypes.includes(file.type)) {
      console.log("File has the wrong type!");
    } else {
      this.fileReader.readAsDataURL(file);
    }
  }

  onLoad() {
    if (this.checkId()) {
      this.lastStoryboard.images[this.inputId.value] = this.fileReader.result;
      this.editorBridge.setData(JSON.stringify(this.lastStoryboard, null, "\t"));
    }
  }

  checkId() {
    document.dispatchEvent(new CustomEvent("ClearLog"));
    if (
      this.lastStoryboard &&
      this.lastStoryboard.images[this.inputId.value] != null
    ) {
      document.dispatchEvent(new CustomEvent("AddError", {
        detail: {
          title: "Incorrect Id for the image",
          message: "The Id is already set, please choose another one!"
        }
      }));
      return false;
    }
    return true;
  }
}