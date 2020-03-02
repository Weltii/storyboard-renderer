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
  let value = this.key[key];
  return value ? value : `${key} not found!`;
}