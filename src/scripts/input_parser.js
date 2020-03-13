import {Storyboard, Frame} from './classes';

export class InputParser {
  constructor() {
    this.dataIsValid = true;
  }
  /**
   * Parse the specified input into an Storyboard.
   * If smth. went wrong, the method will throw errors.
   * @param {String} inpit
   */
  parseInput(input) {
    this.dataIsValid = true;
    let rawData;
    try {
      rawData = JSON.parse(input);
    }
    catch(e) {
      throw {
        title: e.title,
        message: e.message
      };
    }
    
    if (this.isDataValid(rawData, "data", "object", false)) {
      for (let key in rawData["data"]) {
        if (!this.isDataValid(rawData["data"], key, "string")) {
          if (!this.isDataValid(rawData["data"], key, "number")) {
            this.throwWrongData(key, "Images");
          }
        }
      }
    } else {
      this.throwWrongData("data", "Storyboard");
    }

    if (this.isDataValid(rawData, "frames", "object", false)) {
      for (let rawFrame of rawData["frames"]) {
        if (!this.isDataValid(rawFrame, "image", "string")) {
          this.throwWrongData("image");
        }
        if (this.isDataValid(rawFrame, "data", "object", false)) {
          for (let key in rawFrame["data"]) {
            if (!this.isDataValid(rawFrame["data"], key, "string")) {
              if (!this.isDataValid(rawFrame["data"], key, "number")) {
                this.throwWrongData(key, "Images");
              }
            }
          }
        } else {
          this.throwWrongData("data");
        }
      }
    } else {
      this.throwWrongData("frames", "Storyboard");
    };

    if (this.isDataValid(rawData, "images", "object", false)) {
      let images = rawData["images"];
      for (let key in images) {
        if (!this.isDataValid(images, key, "string")) {
          this.throwWrongData(key, "Images");
        }
      }
    } else {
      this.throwWrongData("images", "Storyboard");
    }

    if (!this.dataIsValid) {
      throw {
        title: "Storyboard is incorrect",
        message: "The Storyboard file has incorrect data, please check the error log and try it again."
      };
    }
    return new Storyboard(rawData["data"], rawData["frames"], rawData["images"]);
  };

  /**
   * Checks if the data has a value for the key
   * and the value has the right type.
   * @param {Object} data 
   * @param {String} key 
   * @param {String} type 
   * @param {boolean} isEmpty add false and it won't check if the value of key is empty
   */
  isDataValid(data, key, type, isEmpty = true) {
    let isEmptyState = isEmpty ? Object.keys(data[key]).length > 0 : true;
    return data[key] && isEmptyState && (typeof data[key] == type);
  }

  /**
   * Create an error object and throw it
   * @param {String} key
   */
  throwWrongData(key, location = "Data") {
    this.dataIsValid = false;
    throw {
      title: "Missing or incorrect Data",
      message: `${location} '${key}' is missing, has the wrong type, or is empty! Please change this and try it again.`
    };
  };
};