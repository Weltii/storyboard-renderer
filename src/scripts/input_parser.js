import {Storyboard, Frame} from './classes';

export function InputParser() {
  /**
   * Parse the specified input into an Storyboard.
   * If smth. went wrong, the method will throw errors.
   * @param {String} inpit
   */
  this.parseInput = function (input) {
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
    let data = {};
    let frames = [];

    if (rawData["data"] && typeof rawData["data"] == "object") {
      for (let key in rawData["data"]) {
        data[key] = rawData["data"][key];
      }
    } else {
      this.throwWrongData("data");
    }
    if (rawData["frames"] && typeof rawData["frames"] == "object") {
      for (let rawFrame of rawData["frames"]) {
        let image = "";
        let frameData = {};
        if (rawFrame["image"] && typeof rawFrame["image"] == "string") {
          image = rawFrame["image"];
        } else {
          this.throwWrongData("image");
        }
        if (rawFrame["data"] && typeof rawFrame["data"] == "object") {
          for (let key in rawFrame["data"]) {
            frameData[key] = rawFrame["data"][key];
          }
        } else {
          this.throwWrongData("data");
        }
        frames.push(new Frame(image, frameData));
      }
    } else {
      this.throwWrongData("frames");
    };
    return new Storyboard(data, frames);
  };

  /**
   * Create an error object and throw it
   * @param {String} key
   */
  this.throwWrongData = function (key) {
    throw {
      title: "Missing or incorrect Data",
      message: `Data '${key}' missing, has the wrong type, or is empty!`
    };
  };
};