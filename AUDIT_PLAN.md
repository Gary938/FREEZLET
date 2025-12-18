# План аудита проекта FREEZLET перед публикацией

## Обзор проекта
- **Тип:** Electron приложение для обучения/тестирования
- **Размер:** ~38,000 строк кода, 415 JS файлов
- **Архитектура:** 6-слойный Main процесс + 7-слойный LearnMode UI
- **Репозиторий:** https://github.com/Gary938/FREEZLET (сейчас приватный)
- **Бинарники:** Собраны и протестированы (Windows ✅, Linux ✅, macOS ❓)

## Цель
Провести полный аудит (10 сессий) перед открытием репозитория в публичный доступ.

---

## Разбивка аудита на сессии

### ✅ Сессия 1: Критические проблемы безопасности (ВЫПОЛНЕНО)
**Цель:** Исправить найденные проблемы перед публикацией

**Задачи:**
- [x] `ai_debug.jsonl` уже в .gitignore - OK
- [x] Исправить `webpack.main.config.cjs` - изменить mode с `development` на `production`
- [x] Проверить CSP в `index.html` - `style-src 'unsafe-inline'` (оставлен - нужен для 30+ файлов с динамическими стилями)
- [x] Добавить `sandbox: true` в `Main/Main/createMainWindow.js` webPreferences

**Файлы:**
- `webpack.main.config.cjs` ✅
- `index.html` ✅ (проверено, изменения не требуются)
- `Main/Main/createMainWindow.js` ✅

---

### ⬜ Сессия 2: Аудит Main процесса - API и Controllers
**Цель:** Проверить корректность API и IPC обработчиков

**Задачи:**
- [ ] Проверить `Main/Controllers/controllersRegistrar.js` - валидация параметров
- [ ] Аудит `Main/API/CategoryAPI/` - операции с категориями
- [ ] Аудит `Main/API/TestAPI/` - операции с тестами
- [ ] Аудит `Main/API/FileAPI/` - файловые операции (path traversal)
- [ ] Проверить паттерн ответов `{success: boolean, ...}`

**Файлы:**
- `Main/Controllers/controllersRegistrar.js`
- `Main/API/CategoryAPI/*.js` (7 файлов)
- `Main/API/TestAPI/*.js` (13 файлов)
- `Main/API/FileAPI/*.js` (6 файлов)

---

### ⬜ Сессия 3: Аудит Main процесса - BusinessLayer
**Цель:** Проверить бизнес-логику и работу с данными

**Задачи:**
- [ ] Аудит `Main/BusinessLayer/DB/` - SQL операции (injection)
- [ ] Аудит `Main/BusinessLayer/FileSystem/` - файловые операции
- [ ] Аудит `Main/BusinessLayer/Categories/` - логика категорий
- [ ] Проверить обработку путей (Cyrillic, спецсимволы)

**Файлы:**
- `Main/BusinessLayer/DB/*.js`
- `Main/BusinessLayer/FileSystem/*.js`
- `Main/BusinessLayer/Categories/*.js`
- `Main/Utils/PathUtils/*.js`

---

### ⬜ Сессия 4: Аудит Main процесса - LearnMode Backend
**Цель:** Проверить сложную логику обучающего режима

**Задачи:**
- [ ] Аудит `Main/BusinessLayer/LearnMode/Core/` - state management
- [ ] Аудит `Main/BusinessLayer/LearnMode/Operations/` - обработка ответов
- [ ] Аудит `Main/BusinessLayer/LearnMode/Interactive/` - фоны, Pacman
- [ ] Проверить `Main/BusinessLayer/LearnMode/DB/` - прогресс

**Файлы:**
- `Main/BusinessLayer/LearnMode/` (30+ файлов, 11 поддиректорий)
- `Main/API/LearnMode/`
- `Main/Controllers/LearnMode/`

---

### ⬜ Сессия 5: Аудит Preload и IPC безопасности
**Цель:** Проверить безопасность коммуникации между процессами

**Задачи:**
- [ ] Аудит `Preload/preload.mjs` - белый список каналов (36 каналов)
- [ ] Проверить все exposed API методы
- [ ] Проверить timeout и retry логику
- [ ] Убедиться в отсутствии утечек через логирование

**Файлы:**
- `Preload/preload.mjs` (306 строк)
- `UI/LearnMode/Bridge/electronBridge.js`
- `UI/Bridge/*.js` (23 файла)

---

### ⬜ Сессия 6: Аудит UI - LearnMode Frontend
**Цель:** Проверить UI компоненты обучающего режима

**Задачи:**
- [ ] Аудит `UI/LearnMode/Core/` - state management
- [ ] Аудит `UI/LearnMode/Components/Question/` - компонент вопросов
- [ ] Аудит `UI/LearnMode/Components/Pacman/` - геймификация
- [ ] Аудит `UI/LearnMode/Facade/` - главный фасад
- [ ] Проверить innerHTML использование на XSS

**Файлы:**
- `UI/LearnMode/` (141 JS файл)
- Особое внимание: innerHTML в компонентах

---

### ⬜ Сессия 7: Аудит UI - Основные компоненты
**Цель:** Проверить главные UI компоненты

**Задачи:**
- [ ] Аудит `UI/UI/Components/Category/` - дерево категорий
- [ ] Аудит `UI/UI/Components/TestTable/` - таблица тестов
- [ ] Аудит `UI/Controllers/Modal/` - модальные окна
- [ ] Заменить `console.log/warn` на logger
- [ ] Заменить `alert()` на UI модальные окна

**Файлы:**
- `UI/UI/Components/*.js`
- `UI/Controllers/*.js`
- `UI/TestRunner/*.js`

---

### ⬜ Сессия 8: Аудит конфигурации и сборки
**Цель:** Проверить конфигурацию для production

**Задачи:**
- [ ] Проверить `package.json` - зависимости, лицензии
- [ ] Аудит webpack конфигов (4 файла)
- [ ] Проверить GitHub Actions workflow
- [ ] Проверить `.gitignore` полноту
- [ ] Проверить build для всех платформ

**Файлы:**
- `package.json`
- `webpack.*.config.cjs` (4 файла)
- `.github/workflows/build.yml`
- `.gitignore`

---

### ⬜ Сессия 9: Аудит данных и локализации
**Цель:** Проверить данные и переводы

**Задачи:**
- [ ] Проверить `Tests/` на чувствительные данные
- [ ] Аудит `Locales/*.json` (8 языков)
- [ ] Проверить `UI/i18n/` интернационализацию
- [ ] Проверить структуру базы данных

**Файлы:**
- `Tests/` (тестовые данные)
- `Locales/*.json`
- `UI/i18n/*.js`
- `Main/db.js`

---

### ⬜ Сессия 10: Финальная проверка и публикация
**Цель:** Финальные проверки перед релизом

**Задачи:**
- [ ] Запустить `npm run check-api` - проверка консистентности
- [ ] Собрать приложение для всех платформ
- [ ] Тестовый запуск на каждой платформе
- [ ] Проверить README.md и документацию
- [ ] Создать релиз на GitHub

---

## Найденные проблемы (из исследования)

### Критические
| Проблема | Файл | Статус |
|----------|------|--------|
| Debug логи | `ai_debug.jsonl` | ✅ В .gitignore |
| Webpack main в dev mode | `webpack.main.config.cjs` | ✅ Исправлено |

### Средние
| Проблема | Файл | Статус |
|----------|------|--------|
| CSP unsafe-inline | `index.html` | ✅ Оставлен (нужен) |
| Нет sandbox: true | `createMainWindow.js` | ✅ Добавлено |
| console.log в коде | Разные файлы | ⬜ Сессия 7 |
| alert() в коде | 2 файла | ⬜ Сессия 7 |

### Низкие
| Проблема | Файл | Статус |
|----------|------|--------|
| Избыточное логирование | Logger/* | ⬜ Проверить |

---

## Положительные аспекты (уже реализовано)
- ✅ contextIsolation: true
- ✅ nodeIntegration: false
- ✅ sandbox: true (добавлено в Сессии 1)
- ✅ Белый список IPC каналов
- ✅ Валидация параметров в controllersRegistrar
- ✅ .env исключен из git
- ✅ База данных исключена из git
- ✅ DevTools только в dev режиме
- ✅ Централизованное логирование
- ✅ 8 языков локализации
- ✅ Приложение полностью локальное (без сетевых запросов)
