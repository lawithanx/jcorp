# Fonts Directory

This directory contains the custom fonts for the JCORP website.

## Required Fonts

### 1. Milico Sans (Header Font)
- **Source**: https://myfontlib.com/font/milico-sans-font
- **License**: SIL Open Font License (OFL) - Free for commercial use
- **Files needed**:
  - `MilicoSans-Regular.woff2`
  - `MilicoSans-Regular.woff`
  - `MilicoSans-Regular.ttf`
  - `MilicoSans-Bold.woff2`
  - `MilicoSans-Bold.woff`
  - `MilicoSans-Bold.ttf`

### 2. Nimbus Mono L (Body Font)
- **Source**: https://font.download/font/nimbus-mono
- **License**: GNU General Public License - Free for commercial use
- **Files needed**:
  - `NimbusMonoL-Regular.woff2`
  - `NimbusMonoL-Regular.woff`
  - `NimbusMonoL-Regular.ttf`
  - `NimbusMonoL-Bold.woff2`
  - `NimbusMonoL-Bold.woff`
  - `NimbusMonoL-Bold.ttf`

## Installation

1. Download the fonts from the sources above
2. Place all font files in this directory (`frontend/public/fonts/`)
3. The fonts will be automatically loaded via `@font-face` declarations in `frontend/src/index.css`

## Fallback

If the fonts are not available, the site will fall back to:
- **Headers**: Arial, sans-serif
- **Body**: Courier New, Courier, monospace

