import { shouldAddPageBreak } from './layoutUtil';

export class MovieLayout {
  constructor(storyboard) {
    this.name = "Movie Layout";
    this.framesPerPage = 2;
    this.storyboard = storyboard;
    this.pageSize = {
      height: 595.28,
      orientation: "landscape",
      width: 841.89
    };
  }

  getName() {
    return this.name;
  }

  process() {
    let ret = {
      pageSize: "A4",
      pageOrientation: 'landscape',
      pageMargins: [71, 82, 71, 82],
      info: {
        title: this.storyboard.getData("project_name"),
        author: this.storyboard.getData("author"),
      },
      header: this.generateHeader.bind(this),
      footer: this.generateFooter.bind(this),
      content: this.generateFrames(),
      defaultStyle: {
        columnGap: 10
      }
    };
    return ret;
  }

  generateHeader(currentPage, pageCount, pageSize) {
    return {
      margin: [71, 35],
      columns: [
        {
          width: "auto",
          fontSize: 15,
          text: [
            {
              text: 'Filmprojekt ',
              style: {
                //bold: true
              },
            },
            `"${this.storyboard.getData("project_name")}"`
          ]
        }
      ]
    };
  }

  generateFooter(currentPage, pageCount, pageSize) {
    return {
      margin: [71, 35],
      columns: [
        {
          width: "auto",
          text: `${this.storyboard.getData("author")} - Stand: ${this.storyboard.getData("last_edit")}`
        }, 
        {
          width: 450,
          text: ""
        }, 
        {
          width: "auto",
          text: `${currentPage}/${pageCount}`
        }
      ]
    };
  }

  generateFrames() {
    let frames = [];
    for (let i = 0; i < this.storyboard.frames.length; i++) {
      let frame = this.storyboard.frames[i];
      frames.push(
        this.generateFrame(
          frame,
          shouldAddPageBreak(this.framesPerPage, i, this.storyboard.frames.length - 1)
        )
      );
    }
    return frames;
  }

  generateFrame(frame, addPageBreak) {
    let image = frame.getImage() ? frame.getImage() : this.storyboard.getImageFromId(frame.image);
    let wid = 267//(this.pageSize.width - (71 * 2)) * .33;
    return [
      {
        columns: [
          {
            // scene
            width: 'auto',
            text: ["Szene:", frame.getData("scene")]
          },
          {
            // einstellung
            width: 'auto',
            text: ["Einstellung:", frame.getData("setting")]
          },
          {
            // abschnitt
            width: 'auto',
            text: ["Abschnitt:", frame.getData("section")]
          },
          {
            // spacing
            width: 300,
            text: ""
          },
          {
            // timecode
            width: 'auto',
            margin: [0,0,0,15],
            text: ["TC:", frame.getData("timecode")]
          }
        ],
        maring: 20,
      },
      {
        columns: [
          {
            width: wid,
            height: 167,
            fit: [wid, 167],
            image: image
          },
          {
            width: "*",
            height: 167,
            text: [
              {
                //bold: true,
                text: "Bild\n"
              },
              frame.getData("description")
            ]
          },
          {
            width: "*",
            height: 167,
            text: [
              {
                //bold: true,
                text: "Ton\n"
              },
              frame.getData("audio_description")
            ]
          }
        ]
      },
      {
        columns: [
          {
            width: "auto",
            text: ["EG:", frame.getData("setting_size")]
          },
          {
            width: "auto",
            text: ["P:", frame.getData("perspective")]
          },
          {
            width: "auto",
            text: ["Kamera: ", frame.getData("focal_length"), " mm - ", frame.getData("camera_movement"), " - ", frame.getData("camera_support")]
          },
          {
            width: "auto",
            text: ["FX:", frame.getData("fx")]
          }
        ],
        pageBreak: addPageBreak ? "after": null,
        margin: [0,0,0,20]
      }
    ];
  }
}


/*
  source element:
  {
      pageSize: "A4",
      pageOrientation: 'landscape',
      pageMargins: [ 40, 60, 40, 60 ],
      info: {
        title: "project name",
        author: "author",
      },
      header: {
          margin: [40, 30],
          columns: [
              {
                  width: "auto",
                  fontSize: 15,
                  text: [
                      {
                          text: 'Filmprojekt ',
                          style: {
                              bold: true
                          },
                      },
                      '"Dein Titel"'
                  ]
              }
          ]
      },
      footer: {
          margin: [40],
          columns: [
              {
                  width: "auto",
                  text: "Name des Studierenden - Stand: 11.12.20"
              }
          ]
      },
    content: [
      [
        {
          columns: [
            {
              width: 'auto',
              text: 'Szene: 001'
            },
            {
              width: 'auto',
              text: 'Einstellung: 001'
            },
            {
              width: 'auto',
              text: 'Abschnitt: 001'
            },
            {
                width: 378,
                text: ""
            },
            {
              width: 'auto',
              text: 'TC: 00:00:02:01'
            }

          ]
        },
        {
            columns: [
                {
                    width: 200,
                    fit: [250,200],
                    image: "add here base64 encoded images"
                },
                {
                    width: "*",
                    text: "Hello"
                },
                {
                    width: "*",
                    text: "Hello"
                }
              ]
        },
        {
            columns: [
                {
                    width: "auto",
                    text: "EG: Nah"
                },
                {
                    width: "auto",
                    text: "P: Leichte Untersicht"
                },
                {
                    width: "auto",
                    text: "Kamera: 105 mm - Zoomfahrt - Dolly"
                },
                {
                    width: "auto",
                    text: "FX: Weichzeichner"
                }
              ]
        }
      ]
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      bigger: {
        fontSize: 15,
        italics: true
      }
    },
    defaultStyle: {
      columnGap: 20
    }
  }
*/