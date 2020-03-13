/**
 * 
 * @param {Object} data is a simple key value object
 * @param {Array<Frame>} frames an array of frames
 * @param {Object} images images are stored base64 encoded
 */
export function Storyboard(data, frames, images) {
  this.data = data;
  this.frames = frames;
  this.images = images;
}

/**
 * 
 * @param {String} image base64 encoded
 * @param {Object} data data is a simple key value object
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