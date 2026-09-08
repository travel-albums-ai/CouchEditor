# CouchEditor

CouchEditor is a visual workspace for building photo-editing recipes.

Instead of applying the same edits one photo at a time, you can arrange a set of editing steps on a canvas, connect them together, and preview the result. Save the recipe for later or share it as a `.cep` pipeline file.

<!-- IMAGE PLACEHOLDER: Add a welcoming screenshot of CouchEditor with a small example pipeline visible. -->

## What can I do with CouchEditor?

- Choose photos from your computer.
- Arrange editing steps such as crop, resize, rotate, brightness, contrast, color, sharpening, and effects.
- Preview one photo or a complete set of photos.
- Use optional AI tools such as colorizing and denoising when AI features are enabled.
- Download the finished photos from a viewer step.
- Save your editing recipe in CouchEditor.
- Export a recipe as a `.cep` file and import it on another computer or browser.

## The basic idea

A CouchEditor project is made from **steps** connected on a canvas:

1. An **input** step provides photos.
2. **Editing** steps change the photos.
3. An **output** step displays or exports the result.

For example:

`Photos → Crop → Brightness → Viewer`

The steps do not change your original files. They describe what should happen to the photos while you work.

## Getting started

1. Open CouchEditor.
2. Open the toolbox on the left side of the canvas if it is hidden.
3. Drag a photo input step onto the canvas.
4. Choose the photos you want to edit.
5. Drag an editing step onto the canvas.
6. Drag an output step onto the canvas.
7. Connect the steps by dragging from one circular connector to the next.
8. Adjust the controls in the editing step and review the result in the output step.

<!-- IMAGE PLACEHOLDER: Add a screenshot showing the toolbox, a photo input, one edit, and a viewer connected together. -->

### Choosing photos

Use the photo input step to select JPEG, PNG, or WebP images from your computer. The number of selected photos appears on the step, and thumbnails appear below it.

### Adding an edit

The toolbox groups available steps by purpose:

- **Input**: bring photos or other information into the pipeline.
- **Transform**: crop, resize, rotate, flip, mirror, or correct perspective.
- **Light**: adjust exposure, brightness, contrast, highlights, shadows, gamma, or luminosity.
- **Color**: adjust saturation, vibrance, hue, black and white, sepia, inversion, or LUT color presets.
- **Detail**: sharpen, remove noise, or add grain.
- **Effects**: add vignette, pop, HDR, or fade effects.
- **AI**: use optional AI-powered editing tools.
- **Output**: preview a photo, preview a group of photos, view a histogram, or write to a folder.

### Connecting steps

Connect steps in the order you want them applied. A step can only use the result of a step connected before it.

To change a connection, drag its endpoint to another connector. To remove a connection, double-click it. To remove a step, drag it to the trash area or select it and press `Delete`.

<!-- IMAGE PLACEHOLDER: Add a close-up screenshot showing the connection points and a connected editing chain. -->

## Saving your work

The pipeline title field is in the top-left corner.

- **New** clears the current canvas so you can start another recipe.
- **Save** stores the current recipe in CouchEditor.
- **Save as clone** creates a separate copy while keeping the original recipe.
- The pipeline selector in the top-right loads a recipe you saved earlier.
- The trash button removes the currently selected saved recipe.

CouchEditor keeps saved recipes in the browser where you are using it. Clearing browser storage or changing browsers may remove access to those saved recipes, so export important recipes as `.cep` files.

## Sharing a pipeline

### Download a pipeline

1. Give the pipeline a useful title.
2. Select the **Download pipeline** button in the top-left toolbar.
3. CouchEditor downloads a file with the pipeline title and the `.cep` extension.

The downloaded file contains the editing recipe, not the original photos. This keeps the file small and makes it safe to share. The person opening it will need to select their own photos.

### Upload a pipeline

1. Select the **Upload pipeline** button in the top-left toolbar.
2. Choose a `.cep` file.
3. CouchEditor opens the recipe as a new saved pipeline.
4. Select photos in the photo input step before running it.

<!-- IMAGE PLACEHOLDER: Add a screenshot with the Download pipeline and Upload pipeline buttons highlighted. -->

## Viewing and downloading results

Connect a viewer step to the end of your pipeline.

- A single-photo viewer is useful for checking one result.
- A multi-photo viewer shows the complete output set.
- The multi-photo viewer can open the results in a larger view or download them together as a ZIP file.
- A histogram step helps inspect the tonal distribution of a photo.

## AI editing

AI steps are optional. If they are enabled in your installation, they appear in the AI section of the toolbox. AI features may require provider settings or an API key before they can be used.

<!-- IMAGE PLACEHOLDER: Add a screenshot of the AI settings or an AI editing step, if this is part of the public user experience. -->

## Tips for a comfortable workflow

- Start with a viewer connected directly to your photo input, then add edits between them.
- Keep one pipeline focused on one look or task.
- Give saved pipelines names that describe the result, such as `Warm family photos` or `Web-size exports`.
- Save before experimenting with a large change, or use **Save as clone** first.
- Export recipes you want to keep or share.

## For developers

CouchEditor is a Vite and React application.

```bash
npm install
npm run dev
```

The development server will show the local address to open in a browser.

Useful commands:

```bash
npm run build   # Create a production build
npm run lint    # Check the source code
```

## License

See [LICENSE](LICENSE) for licensing information.
