export const instagramPipeline = [
  {
    "nodes": [
      {
        "id": "source-1",
        "type": "source",
        "position": {
          "x": 840,
          "y": 280
        },
        "data": {},
        "measured": {
          "width": 930,
          "height": 1045
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-2",
        "type": "viewer",
        "position": {
          "x": 2260,
          "y": 140
        },
        "data": {},
        "measured": {
          "width": 930,
          "height": 1045
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "exposure-3",
        "type": "exposure",
        "position": {
          "x": 1920,
          "y": 100
        },
        "data": {
          "amount": 0.2
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "contrast-4",
        "type": "contrast",
        "position": {
          "x": 1920,
          "y": 240
        },
        "data": {
          "amount": 12
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "saturation-5",
        "type": "saturation",
        "position": {
          "x": 1920,
          "y": 660
        },
        "data": {
          "amount": 8
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "highlights-6",
        "type": "highlights",
        "position": {
          "x": 1920,
          "y": 380
        },
        "data": {
          "amount": 5
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rescale-7",
        "type": "rescale",
        "position": {
          "x": 1340,
          "y": 100
        },
        "data": {
          "scale": 1
        },
        "measured": {
          "width": 480,
          "height": 143
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "shadows-8",
        "type": "shadows",
        "position": {
          "x": 1920,
          "y": 520
        },
        "data": {
          "amount": 8
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "temperature-tint-9",
        "type": "temperature-tint",
        "position": {
          "x": 1920,
          "y": 800
        },
        "data": {
          "temperature": -3
        },
        "measured": {
          "width": 280,
          "height": 146
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "pop-10",
        "type": "pop",
        "position": {
          "x": 1920,
          "y": 980
        },
        "data": {
          "amount": 5
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": true,
        "dragging": false
      }
    ],
    "edges": [
      {
        "type": "smoothstep",
        "source": "exposure-3",
        "sourceHandle": "image",
        "target": "contrast-4",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__exposure-3image-contrast-4image"
      },
      {
        "type": "smoothstep",
        "source": "rescale-7",
        "sourceHandle": "image",
        "target": "exposure-3",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__rescale-7image-exposure-3image"
      },
      {
        "type": "smoothstep",
        "source": "source-1",
        "sourceHandle": "image",
        "target": "rescale-7",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__source-1image-rescale-7image"
      },
      {
        "type": "smoothstep",
        "source": "contrast-4",
        "sourceHandle": "image",
        "target": "highlights-6",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__contrast-4image-highlights-6image"
      },
      {
        "type": "smoothstep",
        "source": "highlights-6",
        "sourceHandle": "image",
        "target": "shadows-8",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__highlights-6image-shadows-8image"
      },
      {
        "type": "smoothstep",
        "source": "shadows-8",
        "sourceHandle": "image",
        "target": "saturation-5",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__shadows-8image-saturation-5image"
      },
      {
        "type": "smoothstep",
        "source": "saturation-5",
        "sourceHandle": "image",
        "target": "temperature-tint-9",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__saturation-5image-temperature-tint-9image"
      },
      {
        "type": "smoothstep",
        "source": "temperature-tint-9",
        "sourceHandle": "image",
        "target": "pop-10",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__temperature-tint-9image-pop-10image"
      },
      {
        "type": "smoothstep",
        "source": "pop-10",
        "sourceHandle": "image",
        "target": "viewer-2",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__pop-10image-viewer-2image"
      }
    ],
    "id": "pipeline-1789463257383-rwuf4f",
    "name": "Claredon",
    "isDeletable": true,
    "dateUpdated": "2026-09-15T09:15:57.027Z",
    "dateCreated": "2026-09-15T09:07:37.383Z",
    "type": "user"
  },
  {
    "nodes": [
      {
        "id": "source-1",
        "type": "source",
        "position": {
          "x": 840,
          "y": 280
        },
        "data": {},
        "measured": {
          "width": 930,
          "height": 1045
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-2",
        "type": "viewer",
        "position": {
          "x": 2260,
          "y": 140
        },
        "data": {},
        "measured": {
          "width": 930,
          "height": 1045
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "exposure-3",
        "type": "exposure",
        "position": {
          "x": 1920,
          "y": 100
        },
        "data": {
          "amount": 0.1
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "contrast-4",
        "type": "contrast",
        "position": {
          "x": 1920,
          "y": 240
        },
        "data": {
          "amount": -10
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "saturation-5",
        "type": "saturation",
        "position": {
          "x": 1920,
          "y": 660
        },
        "data": {
          "amount": -12
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "highlights-6",
        "type": "highlights",
        "position": {
          "x": 1920,
          "y": 380
        },
        "data": {
          "amount": -5
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rescale-7",
        "type": "rescale",
        "position": {
          "x": 1340,
          "y": 100
        },
        "data": {
          "scale": 1
        },
        "measured": {
          "width": 480,
          "height": 143
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "shadows-8",
        "type": "shadows",
        "position": {
          "x": 1920,
          "y": 520
        },
        "data": {
          "amount": 8
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "temperature-tint-9",
        "type": "temperature-tint",
        "position": {
          "x": 1920,
          "y": 800
        },
        "data": {
          "temperature": -2,
          "tint": 1
        },
        "measured": {
          "width": 280,
          "height": 146
        },
        "selected": true,
        "dragging": false
      },
      {
        "id": "fade-11",
        "type": "fade",
        "position": {
          "x": 1920,
          "y": 980
        },
        "data": {
          "amount": 12
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "grain-12",
        "type": "grain",
        "position": {
          "x": 1920,
          "y": 1120
        },
        "data": {
          "amount": 3
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      }
    ],
    "edges": [
      {
        "type": "smoothstep",
        "source": "exposure-3",
        "sourceHandle": "image",
        "target": "contrast-4",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__exposure-3image-contrast-4image"
      },
      {
        "type": "smoothstep",
        "source": "rescale-7",
        "sourceHandle": "image",
        "target": "exposure-3",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__rescale-7image-exposure-3image"
      },
      {
        "type": "smoothstep",
        "source": "source-1",
        "sourceHandle": "image",
        "target": "rescale-7",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__source-1image-rescale-7image"
      },
      {
        "type": "smoothstep",
        "source": "contrast-4",
        "sourceHandle": "image",
        "target": "highlights-6",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__contrast-4image-highlights-6image"
      },
      {
        "type": "smoothstep",
        "source": "highlights-6",
        "sourceHandle": "image",
        "target": "shadows-8",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__highlights-6image-shadows-8image"
      },
      {
        "type": "smoothstep",
        "source": "shadows-8",
        "sourceHandle": "image",
        "target": "saturation-5",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__shadows-8image-saturation-5image"
      },
      {
        "type": "smoothstep",
        "source": "saturation-5",
        "sourceHandle": "image",
        "target": "temperature-tint-9",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__saturation-5image-temperature-tint-9image"
      },
      {
        "type": "smoothstep",
        "source": "temperature-tint-9",
        "sourceHandle": "image",
        "target": "fade-11",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__temperature-tint-9image-fade-11image"
      },
      {
        "type": "smoothstep",
        "source": "fade-11",
        "sourceHandle": "image",
        "target": "grain-12",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__fade-11image-grain-12image"
      },
      {
        "type": "smoothstep",
        "source": "grain-12",
        "sourceHandle": "image",
        "target": "viewer-2",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__grain-12image-viewer-2image"
      }
    ],
    "id": "pipeline-1789463775591-cf8n2o",
    "name": "Gingham",
    "isDeletable": true,
    "dateUpdated": "2026-09-15T09:18:35.267Z",
    "dateCreated": "2026-09-15T09:16:15.591Z",
    "type": "user"
  },
  {
    "nodes": [
      {
        "id": "source-1",
        "type": "source",
        "position": {
          "x": 840,
          "y": 280
        },
        "data": {},
        "measured": {
          "width": 930,
          "height": 1045
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "viewer-2",
        "type": "viewer",
        "position": {
          "x": 2260,
          "y": 140
        },
        "data": {},
        "measured": {
          "width": 930,
          "height": 1045
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "exposure-3",
        "type": "exposure",
        "position": {
          "x": 1920,
          "y": 100
        },
        "data": {
          "amount": 0.1
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "contrast-4",
        "type": "contrast",
        "position": {
          "x": 1920,
          "y": 240
        },
        "data": {
          "amount": 5
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "saturation-5",
        "type": "saturation",
        "position": {
          "x": 1920,
          "y": 660
        },
        "data": {
          "amount": 6
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "highlights-6",
        "type": "highlights",
        "position": {
          "x": 1920,
          "y": 380
        },
        "data": {
          "amount": 3
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "rescale-7",
        "type": "rescale",
        "position": {
          "x": 1340,
          "y": 100
        },
        "data": {
          "scale": 1
        },
        "measured": {
          "width": 480,
          "height": 143
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "shadows-8",
        "type": "shadows",
        "position": {
          "x": 1920,
          "y": 520
        },
        "data": {
          "amount": 5
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "temperature-tint-9",
        "type": "temperature-tint",
        "position": {
          "x": 1920,
          "y": 800
        },
        "data": {
          "temperature": 4,
          "tint": 3
        },
        "measured": {
          "width": 280,
          "height": 146
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "fade-11",
        "type": "fade",
        "position": {
          "x": 1920,
          "y": 980
        },
        "data": {
          "amount": 5
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "pop-1",
        "type": "pop",
        "position": {
          "x": 1920,
          "y": 1120
        },
        "data": {
          "amount": 3
        },
        "measured": {
          "width": 280,
          "height": 102
        },
        "selected": true,
        "dragging": false
      }
    ],
    "edges": [
      {
        "type": "smoothstep",
        "source": "exposure-3",
        "sourceHandle": "image",
        "target": "contrast-4",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__exposure-3image-contrast-4image"
      },
      {
        "type": "smoothstep",
        "source": "rescale-7",
        "sourceHandle": "image",
        "target": "exposure-3",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__rescale-7image-exposure-3image"
      },
      {
        "type": "smoothstep",
        "source": "source-1",
        "sourceHandle": "image",
        "target": "rescale-7",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__source-1image-rescale-7image"
      },
      {
        "type": "smoothstep",
        "source": "contrast-4",
        "sourceHandle": "image",
        "target": "highlights-6",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__contrast-4image-highlights-6image"
      },
      {
        "type": "smoothstep",
        "source": "highlights-6",
        "sourceHandle": "image",
        "target": "shadows-8",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__highlights-6image-shadows-8image"
      },
      {
        "type": "smoothstep",
        "source": "shadows-8",
        "sourceHandle": "image",
        "target": "saturation-5",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__shadows-8image-saturation-5image"
      },
      {
        "type": "smoothstep",
        "source": "saturation-5",
        "sourceHandle": "image",
        "target": "temperature-tint-9",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__saturation-5image-temperature-tint-9image"
      },
      {
        "type": "smoothstep",
        "source": "temperature-tint-9",
        "sourceHandle": "image",
        "target": "fade-11",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__temperature-tint-9image-fade-11image"
      },
      {
        "type": "smoothstep",
        "source": "fade-11",
        "sourceHandle": "image",
        "target": "pop-1",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__fade-11image-pop-1image"
      },
      {
        "type": "smoothstep",
        "source": "pop-1",
        "sourceHandle": "image",
        "target": "viewer-2",
        "targetHandle": "image",
        "style": {
          "strokeWidth": 2,
          "stroke": "rgba(113, 82, 248, 0.6)"
        },
        "id": "xy-edge__pop-1image-viewer-2image"
      }
    ],
    "id": "pipeline-1789463927005-2sadlq",
    "name": "Mayfair",
    "isDeletable": true,
    "dateUpdated": "2026-09-15T09:21:05.706Z",
    "dateCreated": "2026-09-15T09:18:47.005Z",
    "type": "user"
  }
]
