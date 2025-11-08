# Videos Directory

## Background Video

Place your jaguar video here with the filename: `jaguar-background.mp4`

The video should be:
- High resolution (1920x1080 or higher recommended)
- Format: MP4 (H.264 codec recommended for best browser compatibility)
- The video will loop automatically and play muted
- Optimized for web (compressed file size)

## Current Setup

The home page is configured to use `/videos/jaguar-background.mp4` as the background video.

If you need to change the filename, update the `source` tag in:
- `frontend/src/pages/Home.jsx` (line 28)

## Night Vision Effect

The video will automatically have a night vision military base overlay applied with:
- Green tint filter
- Scanning line animation
- Noise/static effect
- Military HUD grid pattern
- Corner brackets

