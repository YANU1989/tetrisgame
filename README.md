# Tetris Game

A simple and classic Tetris game built with HTML, CSS, and JavaScript.

## Features

- Classic Tetris gameplay with 7 different piece shapes
- Score and lines cleared tracking
- Next piece preview
- Speed increases as you clear more lines
- Responsive design that works on different screen sizes
- Son Goku character display with special effects

## How to Play

1. Open `index.html` in your web browser
2. Click the "Start Game" button
3. Use the keyboard controls:
   - **Arrow Left (←)** - Move piece left
   - **Arrow Right (→)** - Move piece right
   - **Arrow Down (↓)** - Soft drop (faster drop)
   - **Arrow Up (↑)** - Rotate piece
   - **Spacebar** - Hard drop (instant drop)

## Controls

- **Start Game** button - Begin a new game
- **Pause** button - Pause/resume the game

## Scoring

- Clearing 1 line: 100 points
- Clearing 2 lines: 400 points
- Clearing 3 lines: 900 points
- Clearing 4 lines: 1600 points
- Soft drop (↓): +1 point per cell
- Hard drop (Space): +2 points per cell

## Game Over

The game ends when the pieces stack up to the top of the board. Your final score and lines cleared will be displayed.

## Requirements

No installation or dependencies required! Just open `index.html` in any modern web browser.

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Customizing Son Goku Image

The game includes a Son Goku character display. To use your own image:

1. Save your Son Goku image as `goku.png` or `goku.jpg` in the same folder
2. Edit `index.html` line 18 and change the `src` attribute to:
   ```html
   <img src="goku.png" alt="Son Goku" id="goku-image" class="goku-img">
   ```

Or keep it as is to use the online image.

## 🚀 Hosting Website

To host this website online for free:

📖 **See full guide**: [GITHUB_PAGES_GUIDE.md](GITHUB_PAGES_GUIDE.md)

Quick steps:
1. Create a GitHub account
2. Create a new public repository
3. Upload all files (index.html, styles.css, tetris.js)
4. Enable GitHub Pages in Settings
5. Your website will be live at: `https://username.github.io/repository-name/`

Enjoy playing Tetris! 🎮🐉

