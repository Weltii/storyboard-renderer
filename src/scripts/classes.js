/**
 * 
 * @param {Object} data 
 * @param {Array<Frame>} frames 
 */
export function Storyboard(data, frames) {
  this.data = data;
  this.frames = frames;
}

/**
 * 
 * @param {String} image base64 encoded
 * @param {Object} data 
 */
export function Frame(image, data) {
  this.image = image;
  this.data = data;
}

Frame.prototype.getData = getData;
Storyboard.prototype.getData = getData;

function getData(key) {
  let value = this.data[key];
  if (!value) {
    document.dispatchEvent(new CustomEvent("MissingData", {
      detail: {
        message: `${key} cannot found in ${this.constructor.name} Data`
      }
    }));
  }
  return value ? value : `${key} not found!`;
}