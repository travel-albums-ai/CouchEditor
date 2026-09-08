export const samplePipeline = [
  {
    "nodes": [
      {
        "id": "source-1",
        "type": "source",
        "position": {
          "x": -700,
          "y": 920
        },
        "data": {},
        "measured": {
          "width": 934,
          "height": 1037
        },
        "selected": false,
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
          "width": 934,
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
          "width": 288,
          "height": 228
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-4",
        "type": "viewer",
        "position": {
          "x": 840,
          "y": 500
        },
        "data": {},
        "measured": {
          "width": 934,
          "height": 1037
        },
        "selected": true,
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
          "x": -1220,
          "y": 20
        },
        "data": {},
        "measured": {
          "width": 934,
          "height": 1037
        },
        "selected": true,
        "dragging": false
      },
      {
        "id": "viewer-6",
        "type": "viewer",
        "position": {
          "x": 80,
          "y": 320
        },
        "data": {},
        "measured": {
          "width": 934,
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
          "width": 484,
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
          "width": 250,
          "height": 91
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
          "width": 250,
          "height": 91
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
          "width": 934,
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
          "x": -1460,
          "y": 40
        },
        "data": {},
        "measured": {
          "width": 934,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rescale-13",
        "type": "rescale",
        "position": {
          "x": -760,
          "y": -160
        },
        "data": {
          "scale": 0.25
        },
        "measured": {
          "width": 480,
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
          "width": 250,
          "height": 91
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
          "width": 634,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "mirror-16",
        "type": "mirror",
        "position": {
          "x": -460,
          "y": 140
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 91
        },
        "selected": false,
        "dragging": false
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
          "width": 634,
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
          "width": 250,
          "height": 102
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
          "width": 634,
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
          "x": -1200,
          "y": 740
        },
        "data": {},
        "measured": {
          "width": 934,
          "height": 1037
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-single-29",
        "type": "viewer-single",
        "position": {
          "x": -220,
          "y": 1100
        },
        "data": {},
        "measured": {
          "width": 634,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-single-30",
        "type": "viewer-single",
        "position": {
          "x": 440,
          "y": 1100
        },
        "data": {},
        "measured": {
          "width": 634,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-single-31",
        "type": "viewer-single",
        "position": {
          "x": 1100,
          "y": 1100
        },
        "data": {},
        "measured": {
          "width": 634,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "vignette-32",
        "type": "vignette",
        "position": {
          "x": 480,
          "y": 740
        },
        "data": {
          "amount": 81
        },
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "hdr-33",
        "type": "hdr",
        "position": {
          "x": 100,
          "y": 740
        },
        "data": {
          "amount": 68
        },
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "pop-34",
        "type": "pop",
        "position": {
          "x": 860,
          "y": 720
        },
        "data": {
          "amount": 68
        },
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-single-1",
        "type": "viewer-single",
        "position": {
          "x": -1860,
          "y": 740
        },
        "data": {},
        "measured": {
          "width": 634,
          "height": 666
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "photo-histogram-3",
        "type": "photo-histogram",
        "position": {
          "x": -1200,
          "y": 400
        },
        "data": {},
        "measured": {
          "width": 434,
          "height": 286
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "photo-histogram-4",
        "type": "photo-histogram",
        "position": {
          "x": 1460,
          "y": 780
        },
        "data": {},
        "measured": {
          "width": 434,
          "height": 286
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
      },
      {
        "type": "smoothstep",
        "source": "source-27",
        "sourceHandle": "image",
        "target": "viewer-single-1",
        "targetHandle": "image",
        "style": {
          "opacity": 0.5
        },
        "id": "xy-edge__source-27image-viewer-single-1image"
      },
      {
        "type": "smoothstep",
        "source": "source-27",
        "sourceHandle": "image",
        "target": "photo-histogram-3",
        "targetHandle": "image",
        "style": {
          "opacity": 0.5
        },
        "id": "xy-edge__source-27image-photo-histogram-3image"
      },
      {
        "type": "smoothstep",
        "source": "pop-34",
        "sourceHandle": "image",
        "target": "photo-histogram-4",
        "targetHandle": "image",
        "style": {
          "opacity": 0.5
        },
        "id": "xy-edge__pop-34image-photo-histogram-4image"
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
          "width": 934,
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
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "flip-4",
        "type": "flip",
        "position": {
          "x": 1260,
          "y": 1420
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 91
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "mirror-5",
        "type": "mirror",
        "position": {
          "x": 1260,
          "y": 1540
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 91
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "perspective-7",
        "type": "perspective",
        "position": {
          "x": 1540,
          "y": 640
        },
        "data": {},
        "measured": {
          "width": 322,
          "height": 546
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "grouper-8",
        "type": "grouper",
        "position": {
          "x": 940,
          "y": 340
        },
        "data": {},
        "measured": {
          "width": 288,
          "height": 228
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "crop-9",
        "type": "crop",
        "position": {
          "x": 1540,
          "y": 1200
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 331
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rescale-10",
        "type": "rescale",
        "position": {
          "x": 1260,
          "y": 480
        },
        "data": {},
        "measured": {
          "width": 484,
          "height": 139
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "ai-colorizer-11",
        "type": "ai-colorizer",
        "position": {
          "x": 1260,
          "y": 640
        },
        "data": {
          "passthru": true
        },
        "measured": {
          "width": 250,
          "height": 97
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "ai-denoiser-12",
        "type": "ai-denoiser",
        "position": {
          "x": 20,
          "y": 740
        },
        "data": {
          "passthru": true
        },
        "measured": {
          "width": 250,
          "height": 97
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "invert-13",
        "type": "invert",
        "position": {
          "x": 1260,
          "y": 1180
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 91
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "black-white-14",
        "type": "black-white",
        "position": {
          "x": 1260,
          "y": 1060
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 91
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "sepia-15",
        "type": "sepia",
        "position": {
          "x": 1260,
          "y": 1300
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 91
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "lut-16",
        "type": "lut",
        "position": {
          "x": 1260,
          "y": 760
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 140
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "hue-rotation-17",
        "type": "hue-rotation",
        "position": {
          "x": -280,
          "y": 1280
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "brightness-18",
        "type": "brightness",
        "position": {
          "x": -280,
          "y": 1140
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "exposure-19",
        "type": "exposure",
        "position": {
          "x": -280,
          "y": 1420
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "contrast-20",
        "type": "contrast",
        "position": {
          "x": 20,
          "y": 1420
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "highlights-21",
        "type": "highlights",
        "position": {
          "x": 20,
          "y": 1280
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "shadows-22",
        "type": "shadows",
        "position": {
          "x": 20,
          "y": 1560
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "gamma-23",
        "type": "gamma",
        "position": {
          "x": 20,
          "y": 1140
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "luminosity-24",
        "type": "luminosity",
        "position": {
          "x": -280,
          "y": 600
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "saturation-25",
        "type": "saturation",
        "position": {
          "x": -280,
          "y": 1560
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "vibrance-26",
        "type": "vibrance",
        "position": {
          "x": -280,
          "y": 1000
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "vignette-27",
        "type": "vignette",
        "position": {
          "x": 1260,
          "y": 940
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "grain-28",
        "type": "grain",
        "position": {
          "x": -280,
          "y": 740
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "pop-29",
        "type": "pop",
        "position": {
          "x": 20,
          "y": 860
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "hdr-30",
        "type": "hdr",
        "position": {
          "x": -280,
          "y": 860
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "fade-31",
        "type": "fade",
        "position": {
          "x": 20,
          "y": 1000
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "photo-histogram-32",
        "type": "photo-histogram",
        "position": {
          "x": 480,
          "y": 280
        },
        "data": {},
        "measured": {
          "width": 434,
          "height": 286
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "hot-folder-read-5",
        "type": "hot-folder-read",
        "position": {
          "x": 160,
          "y": 420
        },
        "data": {},
        "measured": {
          "width": 304,
          "height": 156
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "information-6",
        "type": "information",
        "position": {
          "x": -240,
          "y": 300
        },
        "data": {
          "content": "Hello to Couch Editor"
        },
        "measured": {
          "width": 378,
          "height": 272
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "selected-photo-7",
        "type": "selected-photo",
        "position": {
          "x": 1260,
          "y": 360
        },
        "data": {
          "selectedPhotoName": "WhatsApp Image 2026-09-03 at 2.41.36 PM.jpeg"
        },
        "measured": {
          "width": 330,
          "height": 85
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "hot-folder-write-8",
        "type": "hot-folder-write",
        "position": {
          "x": 160,
          "y": 240
        },
        "data": {},
        "measured": {
          "width": 301,
          "height": 156
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rgb-white-point-1",
        "type": "rgb-white-point",
        "position": {
          "x": -520,
          "y": 320
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 240
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rgb-black-point-2",
        "type": "rgb-black-point",
        "position": {
          "x": -560,
          "y": 600
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 240
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rgb-midtones-3",
        "type": "rgb-midtones",
        "position": {
          "x": -560,
          "y": 860
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 240
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "temperature-tint-4",
        "type": "temperature-tint",
        "position": {
          "x": -560,
          "y": 1120
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 218
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "split-toning-5",
        "type": "split-toning",
        "position": {
          "x": -560,
          "y": 1360
        },
        "data": {},
        "measured": {
          "width": 250,
          "height": 222
        },
        "selected": false,
        "dragging": false
      }
    ],
    "edges": [],
    "id": "pipeline-1788796499557-424bey",
    "name": "Demo"
  }
]
