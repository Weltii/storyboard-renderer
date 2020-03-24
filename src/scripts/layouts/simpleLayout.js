import {shouldAddPageBreak} from './layoutUtil';

export class SimpleLayout {
  constructor(storyboard) {
    // variables any layout need
    this.name = "SimpleExampleLayout";
    this.storyboard = storyboard;

    // variables for the process
    this.imageFit = [320, 180];
    this.columneWidth = this.imageFit[0];
    this.framesPerPage = 4;
  }

  /**
   * Returns the name of the layout
   */
  getName() {
    return this.name;
  }

  /**
   * Start the process to convert the storyboard into a doc for pdfmake.
   * If you want to write your own layout, please see: https://pdfmake.github.io/docs/document-definition-object/
   */
  process() {
    return {
      pageSize: "A4",
      content: [
        {
          text: this.storyboard.getData("project_name"),
          style: "header"
        },
        this.convertFrames(this.storyboard.frames)
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
  convertFrames(frames) {
    let convertedFrames = [];
    for (let i = 0; i < frames.length; i++) {
      convertedFrames.push(this.convertFrame(frames[i], shouldAddPageBreak(i, frames.length - 1)));
    }
    return convertedFrames;
  }

  /**
   * convert a single frame to pdfmake code
   * @param {Frame} frame
   * @param {boolean} addPageBreak
   */
  convertFrame(frame, addPageBreak) {
    let image = frame.getImage() ? frame.getImage() : this.storyboard.getImageFromId(frame.image);
    return {
      columns: [
        {
          width: this.columneWidth,
          fit: this.imageFit,
          image: image
        },
        {
          width: "*",
          text: frame.getData("description")
        }
      ],
      columnGap: 10,
      pageBreak: addPageBreak ? "after" : null
    };
  }
}

