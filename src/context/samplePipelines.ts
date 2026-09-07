export const samplePipeline = [
  {
    "nodes": [
      {
        "id": "source-1",
        "type": "source",
        "position": {
          "x": -700,
          "y": 880
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": true,
        "dragging": false
      },
      {
        "id": "source-2",
        "type": "source",
        "position": {
          "x": -700,
          "y": -180
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "grouper-3",
        "type": "grouper",
        "position": {
          "x": 460,
          "y": 760
        },
        "data": {},
        "measured": {
          "width": 273,
          "height": 219
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-4",
        "type": "viewer",
        "position": {
          "x": 820,
          "y": 360
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      }
    ],
    "edges": [
      {
        "type": "smoothstep",
        "source": "source-2",
        "sourceHandle": "image",
        "target": "grouper-3",
        "targetHandle": "image-1",
        "id": "xy-edge__source-2image-grouper-3image-1"
      },
      {
        "type": "smoothstep",
        "source": "source-1",
        "sourceHandle": "image",
        "target": "grouper-3",
        "targetHandle": "image-4",
        "id": "xy-edge__source-1image-grouper-3image-4"
      },
      {
        "type": "smoothstep",
        "source": "grouper-3",
        "sourceHandle": "image",
        "target": "viewer-4",
        "targetHandle": "image",
        "id": "xy-edge__grouper-3image-viewer-4image"
      }
    ],
    "id": "pipeline-1788795820778-blraes",
    "name": "2 Entry Points"
  },
  {
    "nodes": [
      {
        "id": "source-5",
        "type": "source",
        "position": {
          "x": -1240,
          "y": -80
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-6",
        "type": "viewer",
        "position": {
          "x": 100,
          "y": 320
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rescale-7",
        "type": "rescale",
        "position": {
          "x": -220,
          "y": -80
        },
        "data": {},
        "measured": {
          "width": 490,
          "height": 135
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "black-white-8",
        "type": "black-white",
        "position": {
          "x": 440,
          "y": 120
        },
        "data": {},
        "measured": {
          "width": 208,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "sepia-9",
        "type": "sepia",
        "position": {
          "x": 1220,
          "y": 140
        },
        "data": {},
        "measured": {
          "width": 227,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-10",
        "type": "viewer",
        "position": {
          "x": 1040,
          "y": 320
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      }
    ],
    "edges": [
      {
        "type": "smoothstep",
        "source": "source-5",
        "sourceHandle": "image",
        "target": "rescale-7",
        "targetHandle": "image",
        "id": "xy-edge__source-5image-rescale-7image"
      },
      {
        "type": "smoothstep",
        "source": "rescale-7",
        "sourceHandle": "image",
        "target": "sepia-9",
        "targetHandle": "image",
        "id": "xy-edge__rescale-7image-sepia-9image"
      },
      {
        "type": "smoothstep",
        "source": "rescale-7",
        "sourceHandle": "image",
        "target": "black-white-8",
        "targetHandle": "image",
        "id": "xy-edge__rescale-7image-black-white-8image"
      },
      {
        "type": "smoothstep",
        "source": "black-white-8",
        "sourceHandle": "image",
        "target": "viewer-6",
        "targetHandle": "image",
        "id": "xy-edge__black-white-8image-viewer-6image"
      },
      {
        "type": "smoothstep",
        "source": "sepia-9",
        "sourceHandle": "image",
        "target": "viewer-10",
        "targetHandle": "image",
        "id": "xy-edge__sepia-9image-viewer-10image"
      }
    ],
    "id": "pipeline-1788795881205-3bm4q9",
    "name": "Sepia & Black&White"
  },
  {
    "nodes": [
      {
        "id": "source-11",
        "type": "source",
        "position": {
          "x": -1860,
          "y": 80
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rescale-13",
        "type": "rescale",
        "position": {
          "x": -780,
          "y": 0
        },
        "data": {
          "scale": 0.25
        },
        "measured": {
          "width": 485,
          "height": 135
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "flip-14",
        "type": "flip",
        "position": {
          "x": -200,
          "y": -40
        },
        "data": {},
        "measured": {
          "width": 211,
          "height": 155
        }
      },
      {
        "id": "viewer-single-15",
        "type": "viewer-single",
        "position": {
          "x": 180,
          "y": 0
        },
        "data": {},
        "measured": {
          "width": 620,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "mirror-16",
        "type": "mirror",
        "position": {
          "x": -720,
          "y": 220
        },
        "data": {},
        "measured": {
          "width": 186,
          "height": 155
        }
      },
      {
        "id": "viewer-single-17",
        "type": "viewer-single",
        "position": {
          "x": -460,
          "y": 260
        },
        "data": {},
        "measured": {
          "width": 620,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rotate-18",
        "type": "rotate",
        "position": {
          "x": 600,
          "y": -200
        },
        "data": {
          "amount": 204
        },
        "measured": {
          "width": 191,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-single-19",
        "type": "viewer-single",
        "position": {
          "x": 840,
          "y": 180
        },
        "data": {},
        "measured": {
          "width": 620,
          "height": 666
        }
      }
    ],
    "edges": [
      {
        "type": "smoothstep",
        "source": "source-11",
        "sourceHandle": "image",
        "target": "rescale-13",
        "targetHandle": "image",
        "id": "xy-edge__source-11image-rescale-13image"
      },
      {
        "type": "smoothstep",
        "source": "flip-14",
        "sourceHandle": "image",
        "target": "viewer-single-15",
        "targetHandle": "image",
        "id": "xy-edge__flip-14image-viewer-single-15image"
      },
      {
        "type": "smoothstep",
        "source": "rescale-13",
        "sourceHandle": "image",
        "target": "flip-14",
        "targetHandle": "image",
        "id": "xy-edge__rescale-13image-flip-14image"
      },
      {
        "type": "smoothstep",
        "source": "rescale-13",
        "sourceHandle": "image",
        "target": "mirror-16",
        "targetHandle": "image",
        "id": "xy-edge__rescale-13image-mirror-16image"
      },
      {
        "type": "smoothstep",
        "source": "mirror-16",
        "sourceHandle": "image",
        "target": "viewer-single-17",
        "targetHandle": "image",
        "id": "xy-edge__mirror-16image-viewer-single-17image"
      },
      {
        "type": "smoothstep",
        "source": "rescale-13",
        "sourceHandle": "image",
        "target": "rotate-18",
        "targetHandle": "image",
        "id": "xy-edge__rescale-13image-rotate-18image"
      },
      {
        "type": "smoothstep",
        "source": "rotate-18",
        "sourceHandle": "image",
        "target": "viewer-single-19",
        "targetHandle": "image",
        "id": "xy-edge__rotate-18image-viewer-single-19image"
      }
    ],
    "id": "pipeline-1788796010113-2x2rio",
    "name": "Utilities"
  },
  {
    "nodes": [
      {
        "id": "source-20",
        "type": "source",
        "position": {
          "x": -1580,
          "y": -180
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": false
      },
      {
        "id": "hue-rotation-21",
        "type": "hue-rotation",
        "position": {
          "x": -220,
          "y": -140
        },
        "data": {
          "amount": 117
        },
        "measured": {
          "width": 191,
          "height": 86
        },
        "selected": false
      },
      {
        "id": "viewer-single-22",
        "type": "viewer-single",
        "position": {
          "x": 680,
          "y": -60
        },
        "data": {},
        "measured": {
          "width": 620,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "highlights-23",
        "type": "highlights",
        "position": {
          "x": -420,
          "y": 100
        },
        "data": {
          "amount": 100
        },
        "measured": {
          "width": 208,
          "height": 121
        },
        "selected": false
      },
      {
        "id": "viewer-single-24",
        "type": "viewer-single",
        "position": {
          "x": 20,
          "y": 160
        },
        "data": {},
        "measured": {
          "width": 620,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "shadows-25",
        "type": "shadows",
        "position": {
          "x": -620,
          "y": 500
        },
        "data": {
          "amount": 77
        },
        "measured": {
          "width": 191,
          "height": 121
        },
        "selected": false
      },
      {
        "id": "viewer-single-26",
        "type": "viewer-single",
        "position": {
          "x": -620,
          "y": 660
        },
        "data": {},
        "measured": {
          "width": 620,
          "height": 666
        },
        "selected": false,
        "dragging": false
      }
    ],
    "edges": [
      {
        "type": "smoothstep",
        "source": "shadows-25",
        "sourceHandle": "image",
        "target": "viewer-single-26",
        "targetHandle": "image",
        "id": "xy-edge__shadows-25image-viewer-single-26image"
      },
      {
        "type": "smoothstep",
        "source": "highlights-23",
        "sourceHandle": "image",
        "target": "viewer-single-24",
        "targetHandle": "image",
        "id": "xy-edge__highlights-23image-viewer-single-24image"
      },
      {
        "type": "smoothstep",
        "source": "hue-rotation-21",
        "sourceHandle": "image",
        "target": "viewer-single-22",
        "targetHandle": "image",
        "id": "xy-edge__hue-rotation-21image-viewer-single-22image"
      },
      {
        "type": "smoothstep",
        "source": "source-20",
        "sourceHandle": "image",
        "target": "highlights-23",
        "targetHandle": "image",
        "id": "xy-edge__source-20image-highlights-23image"
      },
      {
        "type": "smoothstep",
        "source": "source-20",
        "sourceHandle": "image",
        "target": "shadows-25",
        "targetHandle": "image",
        "id": "xy-edge__source-20image-shadows-25image"
      },
      {
        "type": "smoothstep",
        "source": "source-20",
        "sourceHandle": "image",
        "target": "hue-rotation-21",
        "targetHandle": "image",
        "id": "xy-edge__source-20image-hue-rotation-21image"
      }
    ],
    "id": "pipeline-1788796110451-nw5zj8",
    "name": "Colors"
  },
  {
    "nodes": [
      {
        "id": "source-27",
        "type": "source",
        "position": {
          "x": -1360,
          "y": 580
        },
        "data": {},
        "measured": {
          "width": 938,
          "height": 1038
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-single-29",
        "type": "viewer-single",
        "position": {
          "x": -240,
          "y": 980
        },
        "data": {},
        "measured": {
          "width": 638,
          "height": 667
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-single-30",
        "type": "viewer-single",
        "position": {
          "x": 440,
          "y": 820
        },
        "data": {},
        "measured": {
          "width": 638,
          "height": 667
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-single-31",
        "type": "viewer-single",
        "position": {
          "x": 1120,
          "y": 720
        },
        "data": {},
        "measured": {
          "width": 638,
          "height": 667
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "vignette-32",
        "type": "vignette",
        "position": {
          "x": -260,
          "y": 700
        },
        "data": {
          "amount": 81
        },
        "measured": {
          "width": 242,
          "height": 103
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "hdr-33",
        "type": "hdr",
        "position": {
          "x": -220,
          "y": 840
        },
        "data": {
          "amount": 68
        },
        "measured": {
          "width": 242,
          "height": 103
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "pop-34",
        "type": "pop",
        "position": {
          "x": -300,
          "y": 560
        },
        "data": {
          "amount": 68
        },
        "measured": {
          "width": 242,
          "height": 103
        },
        "selected": false,
        "dragging": false
      }
    ],
    "edges": [
      {
        "type": "smoothstep",
        "source": "source-27",
        "sourceHandle": "image",
        "target": "pop-34",
        "targetHandle": "image",
        "id": "xy-edge__source-27image-pop-34image"
      },
      {
        "type": "smoothstep",
        "source": "pop-34",
        "sourceHandle": "image",
        "target": "viewer-single-31",
        "targetHandle": "image",
        "id": "xy-edge__pop-34image-viewer-single-31image"
      },
      {
        "type": "smoothstep",
        "source": "source-27",
        "sourceHandle": "image",
        "target": "vignette-32",
        "targetHandle": "image",
        "id": "xy-edge__source-27image-vignette-32image"
      },
      {
        "type": "smoothstep",
        "source": "source-27",
        "sourceHandle": "image",
        "target": "hdr-33",
        "targetHandle": "image",
        "id": "xy-edge__source-27image-hdr-33image"
      },
      {
        "type": "smoothstep",
        "source": "vignette-32",
        "sourceHandle": "image",
        "target": "viewer-single-30",
        "targetHandle": "image",
        "id": "xy-edge__vignette-32image-viewer-single-30image"
      },
      {
        "type": "smoothstep",
        "source": "hdr-33",
        "sourceHandle": "image",
        "target": "viewer-single-29",
        "targetHandle": "image",
        "id": "xy-edge__hdr-33image-viewer-single-29image"
      }
    ],
    "id": "pipeline-1788796202862-7id76m",
    "name": "Decorative"
  },
  {
    "nodes": [
      {
        "id": "source-1",
        "type": "source",
        "position": {
          "x": 300,
          "y": 600
        },
        "data": {},
        "measured": {
          "width": 920,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rotate-3",
        "type": "rotate",
        "position": {
          "x": 20,
          "y": 600
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "flip-4",
        "type": "flip",
        "position": {
          "x": -40,
          "y": 880
        },
        "data": {},
        "measured": {
          "width": 211,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "mirror-5",
        "type": "mirror",
        "position": {
          "x": 300,
          "y": 380
        },
        "data": {},
        "measured": {
          "width": 186,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "perspective-7",
        "type": "perspective",
        "position": {
          "x": -160,
          "y": 1080
        },
        "data": {},
        "measured": {
          "width": 308,
          "height": 474
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "grouper-8",
        "type": "grouper",
        "position": {
          "x": 800,
          "y": 360
        },
        "data": {},
        "measured": {
          "width": 273,
          "height": 219
        }
      },
      {
        "id": "crop-9",
        "type": "crop",
        "position": {
          "x": 1280,
          "y": 360
        },
        "data": {},
        "measured": {
          "width": 253,
          "height": 298
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rescale-10",
        "type": "rescale",
        "position": {
          "x": 1280,
          "y": 700
        },
        "data": {},
        "measured": {
          "width": 490,
          "height": 135
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "ai-colorizer-11",
        "type": "ai-colorizer",
        "position": {
          "x": -160,
          "y": 480
        },
        "data": {
          "passthru": true
        },
        "measured": {
          "width": 114,
          "height": 96
        }
      },
      {
        "id": "ai-denoiser-12",
        "type": "ai-denoiser",
        "position": {
          "x": -180,
          "y": 740
        },
        "data": {
          "passthru": true
        },
        "measured": {
          "width": 114,
          "height": 96
        }
      },
      {
        "id": "invert-13",
        "type": "invert",
        "position": {
          "x": 1300,
          "y": 1080
        },
        "data": {},
        "measured": {
          "width": 203,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "black-white-14",
        "type": "black-white",
        "position": {
          "x": 1300,
          "y": 880
        },
        "data": {},
        "measured": {
          "width": 208,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "sepia-15",
        "type": "sepia",
        "position": {
          "x": 1260,
          "y": 1280
        },
        "data": {},
        "measured": {
          "width": 227,
          "height": 155
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "lut-16",
        "type": "lut",
        "position": {
          "x": 1580,
          "y": 880
        },
        "data": {},
        "measured": {
          "width": 273,
          "height": 121
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "hue-rotation-17",
        "type": "hue-rotation",
        "position": {
          "x": 1580,
          "y": 1060
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "brightness-18",
        "type": "brightness",
        "position": {
          "x": 1660,
          "y": 1240
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        }
      },
      {
        "id": "exposure-19",
        "type": "exposure",
        "position": {
          "x": 1600,
          "y": 1400
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        }
      },
      {
        "id": "contrast-20",
        "type": "contrast",
        "position": {
          "x": 440,
          "y": 1700
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        }
      },
      {
        "id": "highlights-21",
        "type": "highlights",
        "position": {
          "x": 0,
          "y": 1640
        },
        "data": {},
        "measured": {
          "width": 208,
          "height": 121
        }
      },
      {
        "id": "shadows-22",
        "type": "shadows",
        "position": {
          "x": 840,
          "y": 1700
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 121
        }
      },
      {
        "id": "gamma-23",
        "type": "gamma",
        "position": {
          "x": -300,
          "y": 1640
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "luminosity-24",
        "type": "luminosity",
        "position": {
          "x": -300,
          "y": 920
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        }
      },
      {
        "id": "saturation-25",
        "type": "saturation",
        "position": {
          "x": 1360,
          "y": 1540
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        }
      },
      {
        "id": "vibrance-26",
        "type": "vibrance",
        "position": {
          "x": 1160,
          "y": 1700
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        }
      },
      {
        "id": "vignette-27",
        "type": "vignette",
        "position": {
          "x": 1700,
          "y": 1560
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        }
      },
      {
        "id": "grain-28",
        "type": "grain",
        "position": {
          "x": -420,
          "y": 1040
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "pop-29",
        "type": "pop",
        "position": {
          "x": -480,
          "y": 1200
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "hdr-30",
        "type": "hdr",
        "position": {
          "x": -480,
          "y": 1340
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "fade-31",
        "type": "fade",
        "position": {
          "x": -460,
          "y": 1480
        },
        "data": {},
        "measured": {
          "width": 191,
          "height": 86
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "photo-histogram-32",
        "type": "photo-histogram",
        "position": {
          "x": 1600,
          "y": 400
        },
        "data": {},
        "measured": {
          "width": 420,
          "height": 286
        },
        "selected": true,
        "dragging": false
      }
    ],
    "edges": [],
    "id": "pipeline-1788796499557-424bey",
    "name": "Demo"
  }
]
