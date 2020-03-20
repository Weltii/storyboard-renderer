const layouts = {
  simple: require("./layouts/simpleLayout.js")
};

/**
 * 
 * @param {Storyboard} storyboard 
 * @param {Layout} layout 
 */
export function processLayout(storyboard, layout) {
  return layouts.simple.process(storyboard);
}