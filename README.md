# Cosmic Sūtra - Ascendant House Guide 🌟

A **super mobile-friendly** astrology reference tool for viewing house meanings by ascendant. Built with pure HTML/CSS/JS - no dependencies, dark mode only, optimized for phones, tablets, and iPads.

## ✨ Features

- **📱 Mobile-First Design**: Optimized touch targets, swipe gestures, and responsive layout
- **🌙 Dark Mode Only**: Beautiful dark theme optimized for all devices
- **⚡ Fast & Lightweight**: No frameworks, instant loading
- **📋 One-Tap Copy**: Tap any card to copy its content
- **👆 Swipe Navigation**: Swipe left/right to change ascendants
- **🔍 Smart Search**: Filter cards by keywords
- **📄 Print Ready**: Clean PDF export
- **💾 Remembers Selection**: Saves your last viewed ascendant
- **🎯 iOS/Android Optimized**: Proper viewport handling, safe areas, no zoom issues

## 🚀 Quick Start (GitHub Pages - FREE)

1. **Fork or download** this repository
2. Go to your GitHub repo **Settings** → **Pages**
3. Source: `Deploy from branch` → `main` → `/ (root)`
4. Your site will be live at: `https://[username].github.io/[repo-name]/`

## 📁 Files

- `index.html` - Main app structure
- `styles.css` - Dark theme, mobile-optimized styles  
- `script.js` - Interactive features (swipe, copy, search)
- `ascendants.json` - All the astrological data

## 🎮 Mobile Features

### Touch Gestures
- **Tap card** = Copy content to clipboard
- **Swipe left** = Next ascendant
- **Swipe right** = Previous ascendant

### Keyboard Shortcuts (Desktop)
- **Arrow Left/Right** = Navigate ascendants
- **Ctrl/Cmd + P** = Print/Save PDF

## 🛠️ Customization

### Edit Content
Modify `ascendants.json` to change house meanings, rulers, karakas, etc.

### Styling
All colors and sizes are defined as CSS variables in `styles.css`:
```css
:root {
  --bg: #0b0d12;
  --accent: #7ae3ff;
  --radius: 16px;
  --touch-target: 44px;
}
```

## 🌐 Other Hosting Options

### Netlify (Drag & Drop)
1. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this folder into the browser
3. Done! Instant hosting

### Vercel
```bash
npx vercel
```

### Cloudflare Pages
1. Upload to Cloudflare Pages dashboard
2. Or use Wrangler CLI: `npx wrangler pages publish .`

### Local Testing
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

## 📱 Mobile Optimizations

- **44px minimum touch targets** (iOS standard)
- **No double-tap zoom** issues
- **Viewport safe areas** for notched devices
- **Smooth animations** at 60fps
- **Swipe gestures** for natural navigation
- **Offline-ready** structure (add service worker for full PWA)
- **Battery efficient** with visibility API

## 🎯 Performance

- **< 100KB total** (including all data)
- **No external requests** (fonts, libraries, APIs)
- **Instant load** time
- **Works offline** once cached

## 💝 Made with Love

Cosmic Sūtra - Your pocket astrology guide. May the stars align in your favor! ✨

---

**License**: Free to use and modify. Share the cosmic love! 🌌