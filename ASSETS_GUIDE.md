# Asset and Dist Structure Guide

## 📁 Assets Directory Structure
```
assets/
├── images/          # Store images (png, jpg, svg, etc.)
├── fonts/           # Store font files (woff, woff2, ttf, etc.)
├── icons/           # Store icon files (svg, png, ico, etc.)
└── dist/            # Build output directory (auto-generated)
```

## 📁 Dist Directory Structure
```
dist/
├── index.html       # Main HTML file
├── assets/
│   ├── *.css        # Compiled CSS files
│   ├── *.js         # Compiled JavaScript files
│   └── *.map        # Source maps for debugging
└── [other assets]   # Any other assets copied during build
```

## 🚀 Usage

### Adding Assets
1. **Images**: Place in `assets/images/`
2. **Fonts**: Place in `assets/fonts/`
3. **Icons**: Place in `assets/icons/`
4. **Public files**: Place in `public/` (served at root path)

### Building for Production
```bash
npm run build
```
This will:
- Create the `dist/` directory
- Compile and minify all assets
- Generate optimized production files
- Create source maps for debugging

### Development
```bash
npm run dev
```
This will:
- Start the development server
- Serve assets from the `public/` directory
- Hot reload on file changes

## 📋 File Types
- **Images**: .png, .jpg, .jpeg, .svg, .gif, .webp
- **Fonts**: .woff, .woff2, .ttf, .eot
- **Icons**: .svg, .png, .ico
- **Public**: favicon.ico, robots.txt, manifest.json

## 🔧 Configuration
The build configuration is set in `vite.config.ts` with:
- Output directory: `dist/`
- Assets directory: `assets/`
- Source maps enabled for debugging
