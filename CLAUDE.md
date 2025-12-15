# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Language

**Всегда отвечай на русском языке** (Always respond in Russian)

## Development Commands

### Build Commands
- `npm run build` - Build renderer and preload bundles using webpack
- `./rebuild_webpack.sh` - Rebuild webpack configuration (cleans dist/, builds preload and renderer)
- `npm run start` - Start the Electron application
- `./start.sh` - Create backup and start application

### Development Commands
- `npm run check-api` - Check API consistency using Main/Utils/checkApiConsistency.js

### Build Requirements
- **Important**: Run webpack rebuild after any changes to renderer-side code
- **Do not** run webpack rebuild for Main process changes or when only editing documentation (.md files)

## Architecture Overview

### Technology Stack
- **Electron 28.0.0** - Desktop application framework
- **ES Modules** - Module system (CommonJS is prohibited)
- **better-sqlite3** - SQLite database for progress tracking
- **pixi.js** - 2D WebGL rendering for Learn Mode gamification
- **webpack** - Module bundler with custom configurations

### Process Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Main Process  │    │  Preload Script │    │ Renderer Process│
│                 │    │                 │    │                 │
│ • Business Logic│◄──►│ • Safe IPC API  │◄──►│ • UI Components │
│ • File System  │    │ • Context Bridge│    │ • User Interface│
│ • Database      │    │ • Security      │    │ • Event Handling│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Main Process Structure (6-Layer Architecture)
```
Main/
├── API/                    # Thin API layer over business layer
├── Controllers/            # Business logic controllers + IPC registration
├── BusinessLayer/          # Core business operations
│   ├── DB/                # Database operations
│   ├── FileSystem/        # File system operations
│   └── LearnMode/         # Learning mode business logic
├── Logger/                # Centralized logging system
├── Utils/                 # Utility functions
└── Main/                  # Application lifecycle management
```

### UI Process Structure (Event-Driven Architecture)
```
UI/
├── LearnMode/             # Sophisticated 7-layer learn mode UI
│   ├── Core/             # State management
│   ├── Components/       # UI components (Question, Pacman, etc.)
│   ├── Controllers/      # UI business logic
│   ├── Facade/           # Main system facade
│   ├── Bridge/           # Electron API integration
│   ├── Config/           # Configuration and validation
│   └── Utils/            # UI utilities
├── Controllers/          # UI controllers with event dispatcher
├── Bridge/               # IPC communication layer
├── UI/Components/        # Visual components
└── Utils/                # UI utilities and state management
```

## Key Architectural Patterns

### IPC Communication Pattern
All communication between UI and Main processes follows this pattern:
```
UI Component → UI Controller → Bridge → Preload API → Main Controller → API → Business Layer
```

### Event-Driven UI System
- **uiEventDispatcher.js** - Central event coordination system
- Components communicate via events: `CATEGORY_CREATED`, `CATEGORY_DELETED`, etc.
- Loose coupling between UI components through event subscription

### Hub Pattern
- **apiHub.js** - Central API access point
- **controllerHub.js** - Controller registration
- **loggerHub.js** - Logging system coordination
- **uiHub.js** - UI component access

## Learn Mode Architecture

Learn Mode implements a sophisticated "Hybrid Pattern Ultimate" with 7 distinct layers:

1. **Core Layer** - Immutable state management
2. **Components Layer** - UI components with Pacman gamification
3. **Controllers Layer** - Business logic coordination
4. **Facade Layer** - System facade and isolation
5. **Bridge Layer** - Electron API integration
6. **Config Layer** - Configuration and validation
7. **Utils Layer** - Utility functions and helpers

**Key Features:**
- AI-optimized architecture (20-120 lines per module, 8-18 lines per function)
- Pacman gamification with visual effects
- Background management system (story/random modes)
- Comprehensive state management with transformers

## Database and File System

### Database Structure
- **SQLite** database in `structure.db`
- **Progress tracking** for tests and learning sessions
- **Category management** with hierarchical structure

### File System Organization
- **Tests/** - Test files organized by categories
- **CSS/Content/** - Visual assets (images, videos)
- **Progress/** - Progress database location

### Data Flow Principles
1. **DB operations first** - Always perform database changes before file system operations
2. **API consistency** - All API functions return `{success: boolean, ...}` format
3. **Centralized logging** - All operations logged through loggerHub

## Module System and Path Aliases

### Webpack Aliases
```javascript
@UI         - UI Components
@Main       - Main Logic  
@Preload    - Preloader
@FileManager - File Manager
@CSS        - Styles
@Renderer   - Renderer
@Progress   - Progress
```

### Module Requirements
- **ES Modules only** - No CommonJS allowed
- **Centralized exports** - Use index.js files for module exports
- **Path aliases** - Use webpack aliases for imports

## Testing and Quality

### Test Structure
- **Tests/** directory contains actual test files (not unit tests)
- **Test validation** through business layer
- **API consistency checking** via `npm run check-api`

### Logging System
- **Centralized logging** through loggerHub.js
- **AI debug logs** in `ai_debug.jsonl`
- **IPC logging** with automatic hijacking
- **UI to Main log forwarding** through preload bridge

## Development Guidelines

### Naming Convention
- **Folders** - Always start with capital letter (PascalCase): `Controllers/`, `Components/`
- **Files** - Always start with lowercase letter (camelCase): `categoryController.js`, `uiHub.js`

### Code Organization
- **Single responsibility** - Each module has one clear purpose
- **Dependency injection** - Components receive dependencies
- **Error handling** - Standardized error responses with success/error format
- **Guard clauses** - Early validation and returns
- **No global window assignments** - Exception only for logs and DB/File API
- **No documentation unless requested** - Do not create .md files unless user explicitly asks

### UI Development
- **Components** handle display and basic interaction
- **Controllers** manage business logic and state
- **Bridges** abstract IPC communication
- **Event system** for loose coupling between components

### Main Process Development
- **Controllers** coordinate between API and business logic
- **API layer** provides thin wrapper over business operations
- **Business layer** implements core functionality
- **Repository pattern** for data access

## Special Considerations

### Security
- **Content Security Policy** enforced in HTML
- **Whitelisted IPC channels** in preload script
- **Secure context bridge** for renderer communication

### Performance
- **Webpack optimization** for bundle size
- **Selective rebuilding** - only rebuild on renderer changes
- **Caching strategies** in UI state management

### Cyrillic Support
- **File names and paths** - Handle Cyrillic characters properly
- **Interface** - Russian language

## Common Patterns

### API Function Template
```javascript
export async function apiFunction(params) {
  const logger = createApiLogger('Module:function');
  
  try {
    logApiStart(logger, 'function', params);
    
    // DB operations first
    const dbResult = await dbOperation(params);
    if (!dbResult.success) return dbResult;
    
    // Then filesystem operations
    const fsResult = await fsOperation(params);
    
    logApiSuccess(logger, 'function');
    return { success: true, data: fsResult };
    
  } catch (error) {
    logApiError(logger, 'function', error);
    return { success: false, error: error.message };
  }
}
```

### UI Controller Template
```javascript
export function createController() {
  const logger = createLogger('UI:Module:Controller');
  
  function handleEvent(data) {
    // Event handling logic
    uiEventDispatcher.dispatch(eventName, result);
  }
  
  // Event subscriptions
  uiEventDispatcher.subscribe(eventName, handleEvent);
  
  return { initialize, cleanup };
}
```

### Component Creation Pattern
```javascript
export function createComponent(config) {
  const element = document.createElement('div');
  // Component setup
  
  return {
    element,
    render: (data) => { /* render logic */ },
    destroy: () => { /* cleanup */ }
  };
}
```

This architecture ensures maintainability, scalability, and AI-optimized development while providing a sophisticated quiz and learning application framework.