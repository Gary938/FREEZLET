# Contributing to FREEZLET

Thank you for your interest in contributing to FREEZLET! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FREEZLET.git
   cd FREEZLET
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the application:
   ```bash
   npm start
   ```

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Electron application |
| `npm run build` | Build webpack bundles (renderer + preload) |
| `npm run check-api` | Check API consistency |
| `npm run rebuild` | Rebuild native modules (better-sqlite3) |
| `npm run dist` | Create distribution packages |

### Project Structure

```
FREEZLET/
├── Main/           # Main process (Electron backend)
├── UI/             # Renderer process (frontend)
├── Preload/        # Secure IPC bridge
├── Locales/        # Internationalization (8 languages)
├── Tests/          # User test files storage
├── Progress/       # SQLite database
└── CSS/            # Stylesheets
```

### Code Style

- **ES Modules only** - No CommonJS (`require()`)
- **Naming conventions:**
  - Folders: PascalCase (`Controllers/`, `Components/`)
  - Files: camelCase (`categoryController.js`, `uiHub.js`)
- **Comments in English only**
- Keep functions small (8-18 lines recommended)
- Use guard clauses for early returns

### Architecture Guidelines

- **Main Process**: 6-layer architecture (API → Controllers → BusinessLayer → DB/FileSystem)
- **UI Process**: Event-driven with `uiEventDispatcher`
- **IPC Communication**: Always use the preload whitelist

## Making Changes

### Branching

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style guidelines

3. Build and test:
   ```bash
   npm run build
   npm start
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

### Commit Message Format

- `Add:` - New feature
- `Fix:` - Bug fix
- `Update:` - Enhancement to existing feature
- `Refactor:` - Code refactoring
- `Docs:` - Documentation changes
- `Style:` - Formatting, no code change

### Pull Request Process

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request on GitHub

3. Fill in the PR template with:
   - Summary of changes
   - Testing performed
   - Screenshots (if UI changes)

4. Wait for review and address any feedback

## Reporting Issues

- Use the issue templates provided
- Include steps to reproduce
- Add screenshots or logs if applicable
- Specify your OS and Node.js version

## Code of Conduct

Be respectful and constructive. We welcome contributors of all experience levels.

## Questions?

Open an issue with the "question" label or start a discussion.

---

Thank you for contributing!
