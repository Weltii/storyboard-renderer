/**
 * 
 * @param {Object} data is a simple key value object
 * @param {Array<Frame>} frames an array of frames
 * @param {Object} images images are stored base64 encoded
 */
export class Storyboard {
  constructor(data, frames, images) {
    this.data = data;
    this.frames = frames;
    this.images = images;
  };

  getImageFromId(id) {
    id = id.substring(1);
    let image = this.images[id];
    if (!image) {
      document.dispatchEvent(new CustomEvent("MissingData", {
        detail: {
          message: `Image with the specified id '${id}' cannot found in ${this.constructor.name}!`
        }
      }));
    }
    return image ? image : `Image with the specified id '${id}' cannot found!`;
  };
}

/**
 * 
 * @param {String} image base64 encoded
 * @param {Object} data data is a simple key value object
 */
export class Frame {
  constructor(image, data) {
    this.image = image;
    this.data = data;
  }

  getImage() {
    return this.image[0] == "$" ? null : this.image;
  }
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