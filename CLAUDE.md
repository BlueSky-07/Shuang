# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shuang (双拼练习) is a Progressive Web App (PWA) for learning Chinese double pinyin input methods. It helps users practice various double pinyin schemes through interactive exercises. The project supports 18+ different double pinyin schemes, includes keyboard layout visualization with SVG generation, and provides full offline functionality through Service Worker caching.

## Build Commands

**Development:**
- `npm run debug` - Build for development (unminified)
- `npm run debug:src` - Build source files only (for development)
- `npm start` - Start development server

**Production:**
- `npm run build` - Full production build (minified HTML/CSS/JS + SVG generation)
- `npm run build:src` - Build source files only (minified)
- `npm run build:svg` - Generate keyboard layout SVGs and PNGs

**Utilities:**
- `npm run clear` - Clear build directory
- `npm run bundle` - Bundle JavaScript files
- `npm run rename` - Rename bundled files
- `npm run release` - Create release package

## Architecture

### Core Application Structure
- **Entry Point:** `src/entry.js` - Initializes the global `Shuang` object
- **Main Bundle:** `src/app.bundle.js` - Generated bundle containing all core modules
- **Core Logic:** `src/core.js` - Contains the main `Model` class for pinyin validation
- **Settings:** `src/setting.js` - Application configuration management
- **Actions:** `src/action.js` - Event handling and user interactions

### Double Pinyin Schemes
- **Scheme Definitions:** `src/scheme/` - Individual scheme configuration files
- **Scheme Registry:** `src/scheme-list.js` - Master list of all supported schemes
- **Keyboard Layouts:** `src/keyboard-layout/` - Physical keyboard layout definitions

### Keyboard Visualization System
- **SVG Generation:** `keyboard/main.js` - Main generator script
- **Scheme Data:** `keyboard/scheme/` - Visual keyboard layout configurations
- **Rendering:** `keyboard/render.js` - SVG rendering logic
- **PNG Export:** `keyboard/png.js` - PNG conversion using @resvg/resvg-js
- **Bopomofo Support:** `keyboard/bopomofo.js` - Traditional Chinese phonetic notation

### Resource Management
The `Shuang.resource` object contains:
- `dict` - Pinyin to character mappings
- `dictHant` - Traditional Chinese character mappings
- `bopomofo` - Phonetic notation mappings
- `scheme` - Active double pinyin scheme configurations
- `keyboardLayout` - Current keyboard layout

## Adding New Double Pinyin Schemes

1. Create keyboard layout in `keyboard/scheme/[scheme-name].js`
2. Add scheme name to `keyboard/scheme.js`
3. Run `npm run build:svg` to generate visualizations
4. Create pinyin mapping in `src/scheme/[scheme-name].js`
5. Add scheme to `src/scheme-list.js`
6. Test with `npm run debug`
7. Build with `npm run build`

## Development Workflow

1. Modify source files in `src/`
2. Run `npm run debug` for development builds
3. Run `npm run build` for production builds
4. For keyboard layout changes, run `npm run build:svg`

## File Organization

- `src/` - Main application source code
- `keyboard/` - Keyboard visualization generation system
- `build/` - Generated build output
- `img/` - Generated keyboard layout images (SVG/PNG)
- `scripts/` - Build automation scripts
- `assets/` - Static assets and documentation images

## Key Dependencies

- **Babel** - JavaScript transpilation and minification
- **clean-css-cli** - CSS minification  
- **html-minifier** - HTML minification
- **@resvg/resvg-js** - SVG to PNG conversion
- **opentype.js** - Font processing for keyboard layouts
- **lodash** - Utility functions