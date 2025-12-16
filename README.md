# FREEZLET

<p align="center">
  <img src="https://img.shields.io/badge/Electron-28.0.0-47848F?logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Languages-8-blue" alt="Languages">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey" alt="Platform">
</p>

<p align="center">
  <b>A gamified desktop application for learning languages and memorizing vocabulary with Pacman-style progress tracking</b>
</p>

---

## Screenshots

### Main Menu
![Main Menu](docs/screenshots/main-menu.png)
*Category tree navigation, test management, and progress tracking*

### Learning Mode
![Learning Mode](docs/screenshots/learn-mode-1.png)
*Interactive quiz with beautiful AI-generated backgrounds and Pacman ghost progress indicator*

![Learning Mode Alternative](docs/screenshots/learn-mode-2.png)
*Dynamic backgrounds change as you progress through the test*

### Write Mode
![Write Mode](docs/screenshots/write-mode.png)
*Type your answers with hints available - practice spelling and recall*

---

## Features

- **Learning Mode** - Gamified learning with Pacman-style progress visualization
- **Test Mode** - Traditional quiz format for self-assessment
- **Write Mode** - Practice spelling by typing answers
- **8 Languages** - Interface available in EN, DE, ES, FR, PT, UK, ZH, PL
- **Progress Tracking** - SQLite database stores your learning history
- **Custom Backgrounds** - Upload your own images or use story/random modes
- **Category Organization** - Hierarchical folder structure for tests
- **Merge Tests** - Combine multiple tests into one
- **Prompt Builder** - AI-assisted test creation helper

---

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/Gary938/FREEZLET.git

# Navigate to project directory
cd FREEZLET

# Install dependencies
npm install

# Rebuild native modules for Electron
npm run rebuild

# Build the application
npm run build

# Start the application
npm start
```

### Quick Start (Linux/macOS)
```bash
./start.sh
```
This script creates a backup and launches the application.

---

## Usage

### Creating Tests

1. Click **"+ New Category"** to create a category
2. Select the category and click **"CREATE TEST"** or **"LOAD NEW TEST"**
3. Test file format (`.txt`):
```
question | answer
apple | яблоко
book | книга
```

### Learning Mode

1. Select a test from the table
2. Click **"LEARNING MODE"**
3. Answer questions by clicking the correct option
4. Watch Pacman eat ghosts as you progress!

### Test Mode

1. Select a test
2. Click **"START TEST"**
3. Complete all questions
4. View your results and statistics

---

## Architecture

```
FREEZLET/
├── Main/                    # Main Process (Electron)
│   ├── API/                # API layer
│   ├── Controllers/        # IPC handlers
│   ├── BusinessLayer/      # Core business logic
│   │   ├── DB/            # SQLite operations
│   │   ├── FileSystem/    # File operations
│   │   └── LearnMode/     # Learning mode logic
│   └── Logger/            # Logging system
│
├── UI/                     # Renderer Process
│   ├── LearnMode/         # 7-layer learning mode UI
│   │   ├── Core/          # State management
│   │   ├── Components/    # UI components + Pacman
│   │   ├── Controllers/   # Business logic
│   │   └── Facade/        # Main facade
│   ├── Controllers/       # UI controllers
│   └── Bridge/            # IPC communication
│
├── Preload/               # Secure IPC bridge
├── Tests/                 # Test files storage
├── Progress/              # SQLite database
└── Locales/               # Translation files (8 languages)
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Electron 28](https://www.electronjs.org/) | Desktop application framework |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | SQLite database |
| [Pixi.js](https://pixijs.com/) | 2D WebGL rendering |
| [i18next](https://www.i18next.com/) | Internationalization |
| [Webpack 5](https://webpack.js.org/) | Module bundling |
| [Babel](https://babeljs.io/) | JavaScript transpilation |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the application |
| `npm run build` | Build webpack bundles |
| `npm run rebuild` | Rebuild native modules |
| `npm run check-api` | Validate API consistency |
| `./start.sh` | Backup + start (Linux/macOS) |
| `./rebuild_webpack.sh` | Clean rebuild webpack |

---

## Test File Format

Tests are simple text files with `question | answer` format:

```
# Example: English-Spanish vocabulary
hello | hola
goodbye | adiós
thank you | gracias
please | por favor
```

### Advanced Format
```
# With phonetic transcription
Appeal [əˈpiːl] | to
Depend [dɪˈpend] | on
```

---

## Localization

FREEZLET supports 8 languages:

| Code | Language |
|------|----------|
| `en` | English |
| `de` | German |
| `es` | Spanish |
| `fr` | French |
| `pt` | Portuguese |
| `uk` | Ukrainian |
| `zh` | Chinese |
| `pl` | Polish |

Switch language using the dropdown in the top-right corner.

---

## Project Stats

- **38,000+** lines of JavaScript
- **417** source files
- **7-layer** UI architecture
- **6-layer** backend architecture
- **18+** Pacman visual effects

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 Gary938

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ for language learners
</p>
