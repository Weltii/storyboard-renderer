let chosenLayoutKey = "simple";

export const layouts = {
  simple: require("./layouts/simpleLayout.js")
};

/**
 * 
 * @param {Storyboard} storyboard 
 * @param {Layout} layout 
 */
export function processLayout(storyboard) {
  if (!chosenLayoutKey || !layouts[chosenLayoutKey]) {
    throw {
      title: "No layout chosen",
      message: "You never choose a layout, please chose one and try it again"
    };
  }
  return layouts[chosenLayoutKey].process(storyboard);
}

export function setLayoutKey(key) {
  chosenLayoutKey = key;
}