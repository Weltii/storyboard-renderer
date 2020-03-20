// variables any layout need
const name = "SimpleExampleLayout";


// variables for the process
const imageFit = [320, 180];
const columneWidth = imageFit[0];
const framesPerPage = 4;


// Any layout need the following functions

/**
 * Returns the name of the layout
 */
export function getName() {
  return name;
}

/**
 * Start the process to convert the storyboard into a doc for pdfmake.
 * If you want to write your own layout, please see: https://pdfmake.github.io/docs/document-definition-object/
 * @param {Storyboard} storyboard
 */
export function process(storyboard) {
  return {
    pageSize: "A4",
    content: [
      {
        text: storyboard.getData("project_name"),
        style: "header"
      },
      convertFrames(storyboard)
    ],
    styles: {
      header: {
        fontSize: 15,
        bold: false,
        alignment: "left",
        decoration: "underline",
      }
    }
  };
}

// The following functions are for these special layout. 
// You can add your own to customice the process

/**
 * Convert all specified frames
 * @param {[Frames]} frames 
 */
function convertFrames(storyboard) {
  let convertedFrames = [];
  let frames = storyboard.frames;
  for (let i = 0; i < frames.length; i++) {
    convertedFrames.push(convertFrame(storyboard, frames[i], shouldAddPageBreak(i, frames.length - 1)));
  }
  return convertedFrames;
}

/**
 * Check if it necessary to add a pagebreak
 * @returns {boolean}
 */
function shouldAddPageBreak(counter, maxCounter) {
  return counter == 0 || counter == maxCounter ? false : (counter + 1) % framesPerPage == 0;
}

/**
 * convert a single frame to pdfmake code
 * @param {Frame} frame
 * @param {boolean} addPageBreak
 */
function convertFrame(storyboard, frame, addPageBreak) {
  let image = frame.getImage() ? frame.getImage() : storyboard.getImageFromId(frame.image);
  return {
    columns: [
      {
        width: columneWidth,
        fit: imageFit,
        image: image
      },
      {
        width: "*",
        text: frame.getData("description")
      }
    ],
    columnGap: 10,
    pageBreak: addPageBreak ? "after": null
  };
}
