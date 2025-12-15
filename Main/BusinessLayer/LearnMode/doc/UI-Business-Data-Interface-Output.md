# UI LearnMode - Данные в Бизнес-слой
## Анализ интерфейса исходящих данных (UI → Business)

### 📋 Обзор
Документ описывает все типы данных, которые UI LearnMode отправляет в бизнес-слой через API и bridge компоненты.

### 🔌 Точки вывода данных

#### Business Bridge (UI/LearnMode/Controllers/BusinessBridge/businessBridge.js)
- `startTest(testPath)` - Запуск теста
- `submitAnswerResult(result)` - Результат ответа

#### API Layer (Main/API/LearnMode/learnModeAPI.js)
- `startTestAPI(testPath)` - Инициализация теста
- `submitAnswerResultAPI(result)` - Обработка ответа
- `setBackgroundModeAPI(mode)` - Установка режима фона
- `clearCurrentTestAPI()` - Очистка состояния
- `hasActiveTestAPI()` - Проверка активности

---

## 📤 Типы исходящих данных

### 1. TEST_PATH - Путь к тесту
**Используется:** При запуске нового теста
```javascript
{
    testPath: "string"  // Абсолютный путь к файлу теста
}
```

**Примеры значений:**
```javascript
"/full/path/to/Tests/category/test_file.txt"
"C:\\2\\Tests\\English\\phrasal_verbs_test.txt"
"/absolute/path/to/test/file.txt"
```

**Валидация UI:**
```javascript
// Guard clauses в businessBridge.js
if (!testPath || typeof testPath !== 'string') {
    return errorHandlers.createValidationError('INVALID_TEST_PATH', 'Test path must be a string');
}
```

### 2. ANSWER_RESULT - Результат ответа
**Используется:** После клика по варианту ответа
```javascript
{
    result: "correct" | "incorrect"  // Строго один из двух вариантов
}
```

**Логика определения результата (UI/LearnMode/Components/Question/questionComponent.js):**
```javascript
const handleAnswerClick = (selectedIndex) => {
    // Получаем индекс правильного ответа
    const correctIndex = questionData.correctAnswer;
    
    // Определяем результат
    const result = (selectedIndex === correctIndex) ? 'correct' : 'incorrect';
    
    // Отправляем в бизнес-слой
    onAnswerClick(result);
};
```

**Валидация UI:**
```javascript
// Guard clauses в businessBridge.js  
if (!result || !['correct', 'incorrect'].includes(result)) {
    return errorHandlers.createValidationError('INVALID_ANSWER_RESULT', 'Result must be "correct" or "incorrect"');
}
```

### 3. BACKGROUND_MODE - Режим фона
**Используется:** При изменении настроек фона
```javascript
{
    mode: "story" | "random"  // Режим отображения фона
}
```

**Источники данных:**
- Пользовательский выбор в UI селекторе
- Системные настройки по умолчанию
- Восстановление после перезапуска

**Валидация:**
```javascript
// Проверка допустимых значений
const VALID_MODES = ['story', 'random'];
if (!VALID_MODES.includes(mode)) {
    throw new Error('Invalid background mode');
}
```

### 4. CLEAR_REQUEST - Запрос очистки
**Используется:** При закрытии или сбросе теста
```javascript
// Без параметров - просто вызов функции
clearCurrentTest()
```

### 5. STATUS_REQUEST - Запрос статуса
**Используется:** При проверке активного теста
```javascript
// Без параметров - просто вызов функции  
hasActiveTest()
```

---

## 🎯 Детальный анализ данных

### Test Path Format
```javascript
// Всегда абсолютный путь
testPath: "/full/absolute/path/to/file.txt"

// Примеры реальных путей
testPath: "/c/2/Tests/English/phrasal_verbs_test.txt"
testPath: "/c/2/Tests/citizen/citizenship_revision.txt"
testPath: "/c/2/Tests/3333/health_quiz_clean.txt"
```

**Характеристики:**
- Всегда абсолютный путь
- Содержит полный путь к файлу теста
- Расширение обычно `.txt`
- Путь корректен для файловой системы

### Answer Result Logic
```javascript
// UI логика определения результата
const determineAnswerResult = (selectedIndex, correctAnswer) => {
    // Простое сравнение индексов
    return selectedIndex === correctAnswer ? 'correct' : 'incorrect';
};

// Отправка результата
const submitAnswer = async (result) => {
    // result = 'correct' | 'incorrect'
    await businessBridge.submitAnswerResult(result);
};
```

**Важные особенности:**
- Результат определяется сразу при клике
- Только два возможных значения
- Отправляется немедленно после определения
- Не содержит дополнительных метаданных

### Background Mode Options
```javascript
// Возможные режимы
const BACKGROUND_MODES = {
    STORY: 'story',    // Последовательные слайды
    RANDOM: 'random'   // Случайные изображения
};

// Отправка режима
setBackgroundMode('story');
setBackgroundMode('random');
```

---

## 🔄 Последовательности вызовов

### 1. Инициализация теста
```javascript
// UI отправляет
startTest("/path/to/test.txt")

// Business отвечает  
{
    type: "question",
    data: { id, question, options, correctAnswer, pacman: { action: "init" } }
}
```

### 2. Обработка ответа
```javascript
// Пользователь кликает по варианту 2, правильный ответ 2
// UI отправляет
submitAnswerResult("correct")

// Business отвечает
{
    type: "question", 
    data: { /* новый вопрос */, pacman: { action: "move" } }
}
```

### 3. Неправильный ответ
```javascript
// Пользователь кликает по варианту 1, правильный ответ 2  
// UI отправляет
submitAnswerResult("incorrect")

// Business отвечает
{
    type: "question",
    data: { /* тот же вопрос */, pacman: { action: "stay" } }
}
```

### 4. Завершение блока
```javascript
// UI отправляет
submitAnswerResult("correct")

// Business отвечает
{
    type: "next_block",
    data: { 
        blockNumber: 2,
        nextQuestion: { /* новый вопрос */ },
        pacman: { action: "move" }
    }
}
```

### 5. Завершение теста
```javascript
// UI отправляет
submitAnswerResult("correct")

// Business отвечает  
{
    type: "final_stats",
    data: { 
        accuracy: 85,
        stars: 2,
        passed: true,
        /* остальная статистика */
    }
}
```

---

## ⚡ Паттерны взаимодействия

### Request-Response Pattern
```javascript
// UI всегда ждет ответа от Business
const response = await businessBridge.submitAnswerResult(result);

// Business всегда возвращает структурированный ответ
return {
    type: "question|next_block|final_stats|error",
    success: boolean,
    data: object,
    timestamp: number
};
```

### Error Handling Pattern
```javascript
// UI отправляет невалидные данные
submitAnswerResult("maybe_correct") // ❌ Невалидное значение

// Business возвращает ошибку
{
    type: "error",
    success: false,
    data: {
        code: "INVALID_ANSWER_RESULT",
        message: "Result must be 'correct' or 'incorrect'"
    }
}
```

### Async Operations Pattern  
```javascript
// Все операции UI → Business асинхронные
try {
    const response = await startTest(testPath);
    // Обработка ответа
} catch (error) {
    // Обработка ошибки сети/API
}
```

---

## 🛡️ Валидация и безопасность

### Input Validation
```javascript
// UI выполняет базовую валидацию перед отправкой
const validateTestPath = (path) => {
    return path && typeof path === 'string' && path.length > 0;
};

const validateAnswerResult = (result) => {
    return ['correct', 'incorrect'].includes(result);
};

const validateBackgroundMode = (mode) => {
    return ['story', 'random'].includes(mode);
};
```

### Error Recovery
```javascript
// UI обрабатывает ошибки от Business
if (!response.success) {
    // Показать ошибку пользователю
    showErrorMessage(response.data.message);
    return;
}

// UI имеет fallback для недоступного Business Bridge
if (!electronBridge.isAvailable()) {
    return errorHandlers.createUnavailableBridge();
}
```

---

## 📊 Статистика вызовов

### Частота операций
1. **submitAnswerResult** - Самая частая (каждый ответ)
2. **startTest** - При каждом запуске теста
3. **clearCurrentTest** - При закрытии/завершении
4. **setBackgroundMode** - Редко (настройки)
5. **hasActiveTest** - Периодически (проверки)

### Объем данных
- **Минимальный**: submitAnswerResult (~10 байт)
- **Средний**: startTest (~50 байт)
- **Максимальный**: Ответы от Business (1-5 КБ)

---

## 📝 Примечания реализации

1. **Синхронность**: Все UI → Business вызовы асинхронные
2. **Валидация**: UI валидирует данные перед отправкой
3. **Retry логика**: UI не повторяет неудачные вызовы
4. **Timeout**: UI не устанавливает timeout для операций
5. **Трейсинг**: Все операции логируются для отладки
6. **Immutability**: UI не мутирует отправляемые данные
7. **Type Safety**: TypeScript/JSDoc аннотации для всех интерфейсов 