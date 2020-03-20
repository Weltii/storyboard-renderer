/**
 * 
 * @param {string} input 
 */
export function parseInput(input) {
  let rawData = JSON.parse(input);
  let data = {};
  let frames = [];

  if (rawData["data"] && typeof rawData["data"] == "object") {
    for (let key in rawData["data"]) {
      data[key] = rawData["data"][key];
    }
  } else {
    throwWrongData("data");
  }
  if (rawData["frames"] && typeof rawData["frames"] == "object") {
    for (let rawFrame of rawData["frames"]) {
      let image = "";
      let frameData = {};
      if (rawFrame["image"] && typeof rawFrame["image"] == "string") {
        image = rawFrame["image"];
      } else {
        throwWrongData("image");
      }
      if (rawFrame["data"] && typeof rawFrame["data"] == "object") {
        for (let key in rawFrame["data"]) {
          frameData[key] = rawFrame["data"][key];
        }
      } else {
        throwWrongData("data"); 
      }
      frames.push(new Frame(image, frameData));
    }
  } else {
    throwWrongData("frames");
  };
  this.currentStoryboard = new Storyboard(data, frames);
  return this.currentStoryboard;
}

function throwWrongData(key) {
  throwError(
    "Missing or incorrect Data", 
    `Data '${key}' missing, has the wrong type, or is empty!`
  );
}

function throwError(name, message) {
  throw {
    name: name,
    message: message
 };
}