# Videos Directory

## Background Video

Place your home background video here with the filename: `home-background.mp4`

The video should be:
- High resolution (1920x1080 or higher recommended)
- Format: MP4 (H.264 codec recommended for best browser compatibility)
- The video will loop automatically and play muted
- Optimized for web (compressed file size)

## Current Setup

The home page is configured to use `/videos/home-background.mp4` as the background video.

If you need to change the filename, update the `source` tag in:
- `frontend/src/pages/Home.jsx` (line 28)

## Night Vision Effect

The video will automatically have a night vision military base overlay applied with:
- Green tint filter (brightness, contrast, hue-rotate, saturate)
- Scanning line animation (horizontal scanlines)
- Pulsing radial gradient overlay
- Military HUD grid pattern
- All effects are applied via CSS filters and pseudo-elements

## File Location

For React dev server (port 9441):
- Place video at: `frontend/public/videos/home-background.mp4`
- Accessible at: `http://localhost:9441/videos/home-background.mp4`

For Django production (port 9444):
- Video is served from React build: `frontend/build/videos/home-background.mp4`
- Accessible at: `http://localhost:9444/videos/home-background.mp4`
