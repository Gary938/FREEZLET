// UI/UI/Components/Help/helpContent.js
// Help content for all languages

export const HELP_SECTIONS = [
  { id: 'howToCreateTest', icon: '📝' },
  { id: 'backgroundSettings', icon: '🎨' },
  { id: 'aboutApp', icon: 'ℹ️' }
];

const HELP_CONTENT = {
  // English
  en: {
    title: 'Help',
    sections: {
      howToCreateTest: 'How to Create Test',
      backgroundSettings: 'Background Settings',
      aboutApp: 'About'
    },
    content: {
      howToCreateTest: `
        <h3>Two ways to create a test:</h3>

        <h3>1. Using Prompt Builder (Recommended)</h3>
        <ol>
          <li>Click the <strong>"Prompt Builder"</strong> button</li>
          <li>Fill in the parameters:
            <ul>
              <li><em>Topic</em> - test topic (required)</li>
              <li><em>Questions count</em> - number of questions (1-50, optimal: 20)</li>
              <li><em>Options count</em> - answer options (4 or 6)</li>
              <li><em>Include examples</em> - add usage examples</li>
              <li><em>Examples per question</em> - examples count (1-4)</li>
              <li><em>Additional instructions</em> - special requirements for test generation</li>
            </ul>
          </li>
          <li>Copy the generated prompt</li>
          <li>Send to AI (ChatGPT, Claude, etc.)</li>
          <li>Copy the result to <strong>"Create Test"</strong></li>
        </ol>

        <h3>Additional Instructions - Important!</h3>
        <p>Use this field to specify special requirements:</p>
        <ul>
          <li><strong>Question format</strong> - e.g. "Questions should ask for synonyms/antonyms"</li>
          <li><strong>Answer style</strong> - e.g. "Answers should be single words only"</li>
          <li><strong>Difficulty level</strong> - e.g. "Advanced level vocabulary"</li>
          <li><strong>Context</strong> - e.g. "Business English terminology"</li>
          <li><strong>Example format</strong> - e.g. "Examples should show word in a sentence"</li>
        </ul>
        <p><em>Example:</em> "Create questions where users need to choose the strong adjective form. Each wrong answer should be a plausible but incorrect adjective."</p>

        <h3>2. Manual Creation</h3>
        <p>Test format:</p>
        <pre><code>Question text?
Option A
*Correct answer B
Option C
Option D
Example: Usage example

Next question?
Option 1
*Correct option 2
Option 3
Option 4</code></pre>

        <h3>Formatting Rules:</h3>
        <ul>
          <li><code>*</code> at the beginning of line = correct answer</li>
          <li>Empty line separates questions</li>
          <li><code>Example:</code> for usage examples (optional)</li>
          <li>4-6 answer options per question</li>
        </ul>
      `,
      backgroundSettings: `
        <h3>Background Modes in Learning Mode</h3>

        <h3>Story Mode</h3>
        <p>Sequential display of slides from a story:</p>
        <ul>
          <li>When question changes → next slide appears</li>
          <li>After story ends → random new story starts</li>
          <li>Creates immersive learning atmosphere</li>
        </ul>

        <h3>Random Mode</h3>
        <p>Random background on each question change:</p>
        <ul>
          <li>Fresh visuals for each question</li>
          <li>Wide variety of images</li>
        </ul>

        <h3>Custom Mode</h3>
        <p>Use your own backgrounds:</p>
        <ul>
          <li><strong>"Load Background"</strong> - upload images from your computer</li>
          <li><strong>"My Backgrounds"</strong> - manage your gallery</li>
          <li><em>Static</em> - one selected background</li>
          <li><em>Random</em> - random selection from your images</li>
        </ul>

        <h3>How to Use:</h3>
        <ol>
          <li>Enter Learning Mode</li>
          <li>Click the gear icon <strong>⚙️</strong> (top right corner)</li>
          <li>Select mode from the menu</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>Quiz application for effective learning through gamification.</p>

        <h3>Application Modes:</h3>
        <ul>
          <li><strong>Test Mode</strong> - classic test with scoring and statistics</li>
          <li><strong>Learning Mode</strong> - interactive learning with Pacman gamification</li>
          <li><strong>Write Mode</strong> - practice by typing answers</li>
        </ul>

        <h3>Features:</h3>
        <ul>
          <li>Create tests using AI (Prompt Builder)</li>
          <li>Progress tracking and statistics</li>
          <li>Customizable backgrounds</li>
          <li>8 interface languages</li>
          <li>Category organization</li>
        </ul>

        <h3>Tips:</h3>
        <ul>
          <li>Use Learning Mode for memorization</li>
          <li>Test Mode for knowledge assessment</li>
          <li>Write Mode for spelling practice</li>
        </ul>
      `
    }
  },

  // Ukrainian
  uk: {
    title: 'Довідка',
    sections: {
      howToCreateTest: 'Як створити тест',
      backgroundSettings: 'Налаштування фону',
      aboutApp: 'Про програму'
    },
    content: {
      howToCreateTest: `
        <h3>Два способи створення тесту:</h3>

        <h3>1. Використання Prompt Builder (Рекомендовано)</h3>
        <ol>
          <li>Натисніть кнопку <strong>"Prompt Builder"</strong></li>
          <li>Заповніть параметри:
            <ul>
              <li><em>Topic</em> - тема тесту (обов'язково)</li>
              <li><em>Questions count</em> - кількість питань (1-50, оптимально: 20)</li>
              <li><em>Options count</em> - варіанти відповідей (4 або 6)</li>
              <li><em>Include examples</em> - додати приклади використання</li>
              <li><em>Examples per question</em> - кількість прикладів (1-4)</li>
              <li><em>Additional instructions</em> - спеціальні вимоги до генерації</li>
            </ul>
          </li>
          <li>Скопіюйте згенерований промпт</li>
          <li>Відправте в AI (ChatGPT, Claude тощо)</li>
          <li>Скопіюйте результат у <strong>"Create Test"</strong></li>
        </ol>

        <h3>Additional Instructions - Важливо!</h3>
        <p>Використовуйте це поле для спеціальних вимог:</p>
        <ul>
          <li><strong>Формат питань</strong> - напр. "Питання мають просити синоніми/антоніми"</li>
          <li><strong>Стиль відповідей</strong> - напр. "Відповіді мають бути одним словом"</li>
          <li><strong>Рівень складності</strong> - напр. "Просунутий рівень лексики"</li>
          <li><strong>Контекст</strong> - напр. "Бізнес-термінологія англійською"</li>
          <li><strong>Формат прикладів</strong> - напр. "Приклади мають показувати слово в реченні"</li>
        </ul>
        <p><em>Приклад:</em> "Створіть питання, де користувачі мають вибрати сильний прикметник. Неправильні відповіді мають бути схожими, але некоректними."</p>

        <h3>2. Ручне створення</h3>
        <p>Формат тесту:</p>
        <pre><code>Текст питання?
Варіант A
*Правильна відповідь B
Варіант C
Варіант D
Example: Приклад використання

Наступне питання?
Варіант 1
*Правильний варіант 2
Варіант 3
Варіант 4</code></pre>

        <h3>Правила форматування:</h3>
        <ul>
          <li><code>*</code> на початку рядка = правильна відповідь</li>
          <li>Порожній рядок розділяє питання</li>
          <li><code>Example:</code> для прикладів (необов'язково)</li>
          <li>4-6 варіантів відповідей на питання</li>
        </ul>
      `,
      backgroundSettings: `
        <h3>Режими фону в Learning Mode</h3>

        <h3>Story Mode</h3>
        <p>Послідовний показ слайдів з історії:</p>
        <ul>
          <li>При зміні питання → наступний слайд</li>
          <li>Після завершення історії → випадкова нова</li>
          <li>Створює атмосферу занурення</li>
        </ul>

        <h3>Random Mode</h3>
        <p>Випадковий фон при кожній зміні питання:</p>
        <ul>
          <li>Свіжі візуальні ефекти для кожного питання</li>
          <li>Широкий вибір зображень</li>
        </ul>

        <h3>Custom Mode</h3>
        <p>Використовуйте власні фони:</p>
        <ul>
          <li><strong>"Load Background"</strong> - завантажити зображення з комп'ютера</li>
          <li><strong>"My Backgrounds"</strong> - керувати галереєю</li>
          <li><em>Static</em> - один вибраний фон</li>
          <li><em>Random</em> - випадковий вибір з ваших зображень</li>
        </ul>

        <h3>Як використовувати:</h3>
        <ol>
          <li>Увійдіть у Learning Mode</li>
          <li>Натисніть іконку шестерні <strong>⚙️</strong> (правий верхній кут)</li>
          <li>Виберіть режим з меню</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>Програма для ефективного навчання через гейміфікацію.</p>

        <h3>Режими програми:</h3>
        <ul>
          <li><strong>Test Mode</strong> - класичний тест з підрахунком балів</li>
          <li><strong>Learning Mode</strong> - інтерактивне навчання з Pacman</li>
          <li><strong>Write Mode</strong> - практика написання відповідей</li>
        </ul>

        <h3>Можливості:</h3>
        <ul>
          <li>Створення тестів за допомогою AI</li>
          <li>Відстеження прогресу та статистика</li>
          <li>Налаштовувані фони</li>
          <li>8 мов інтерфейсу</li>
          <li>Організація за категоріями</li>
        </ul>
      `
    }
  },

  // Russian
  ru: {
    title: 'Справка',
    sections: {
      howToCreateTest: 'Как создать тест',
      backgroundSettings: 'Настройки фона',
      aboutApp: 'О приложении'
    },
    content: {
      howToCreateTest: `
        <h3>Два способа создания теста:</h3>

        <h3>1. Использование Prompt Builder (Рекомендуется)</h3>
        <ol>
          <li>Нажмите кнопку <strong>"Prompt Builder"</strong></li>
          <li>Заполните параметры:
            <ul>
              <li><em>Topic</em> - тема теста (обязательно)</li>
              <li><em>Questions count</em> - количество вопросов (1-50, оптимально: 20)</li>
              <li><em>Options count</em> - варианты ответов (4 или 6)</li>
              <li><em>Include examples</em> - добавить примеры использования</li>
              <li><em>Examples per question</em> - количество примеров (1-4)</li>
              <li><em>Additional instructions</em> - специальные требования к генерации</li>
            </ul>
          </li>
          <li>Скопируйте сгенерированный промпт</li>
          <li>Отправьте в AI (ChatGPT, Claude и др.)</li>
          <li>Скопируйте результат в <strong>"Create Test"</strong></li>
        </ol>

        <h3>Additional Instructions - Важно!</h3>
        <p>Используйте это поле для специальных требований:</p>
        <ul>
          <li><strong>Формат вопросов</strong> - напр. "Вопросы должны спрашивать синонимы/антонимы"</li>
          <li><strong>Стиль ответов</strong> - напр. "Ответы должны быть одним словом"</li>
          <li><strong>Уровень сложности</strong> - напр. "Продвинутый уровень лексики"</li>
          <li><strong>Контекст</strong> - напр. "Бизнес-терминология на английском"</li>
          <li><strong>Формат примеров</strong> - напр. "Примеры должны показывать слово в предложении"</li>
        </ul>
        <p><em>Пример:</em> "Создайте вопросы, где пользователи выбирают сильное прилагательное. Неправильные ответы должны быть похожими, но некорректными."</p>

        <h3>2. Ручное создание</h3>
        <p>Формат теста:</p>
        <pre><code>Текст вопроса?
Вариант A
*Правильный ответ B
Вариант C
Вариант D
Example: Пример использования

Следующий вопрос?
Вариант 1
*Правильный вариант 2
Вариант 3
Вариант 4</code></pre>

        <h3>Правила форматирования:</h3>
        <ul>
          <li><code>*</code> в начале строки = правильный ответ</li>
          <li>Пустая строка разделяет вопросы</li>
          <li><code>Example:</code> для примеров (необязательно)</li>
          <li>4-6 вариантов ответов на вопрос</li>
        </ul>
      `,
      backgroundSettings: `
        <h3>Режимы фона в Learning Mode</h3>

        <h3>Story Mode</h3>
        <p>Последовательный показ слайдов из истории:</p>
        <ul>
          <li>При смене вопроса → следующий слайд</li>
          <li>После завершения истории → случайная новая</li>
          <li>Создаёт атмосферу погружения</li>
        </ul>

        <h3>Random Mode</h3>
        <p>Случайный фон при каждой смене вопроса:</p>
        <ul>
          <li>Свежие визуальные эффекты для каждого вопроса</li>
          <li>Широкий выбор изображений</li>
        </ul>

        <h3>Custom Mode</h3>
        <p>Используйте собственные фоны:</p>
        <ul>
          <li><strong>"Load Background"</strong> - загрузить изображения с компьютера</li>
          <li><strong>"My Backgrounds"</strong> - управлять галереей</li>
          <li><em>Static</em> - один выбранный фон</li>
          <li><em>Random</em> - случайный выбор из ваших изображений</li>
        </ul>

        <h3>Как использовать:</h3>
        <ol>
          <li>Войдите в Learning Mode</li>
          <li>Нажмите иконку шестерёнки <strong>⚙️</strong> (правый верхний угол)</li>
          <li>Выберите режим из меню</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>Приложение для эффективного обучения через геймификацию.</p>

        <h3>Режимы приложения:</h3>
        <ul>
          <li><strong>Test Mode</strong> - классический тест с подсчётом баллов</li>
          <li><strong>Learning Mode</strong> - интерактивное обучение с Pacman</li>
          <li><strong>Write Mode</strong> - практика написания ответов</li>
        </ul>

        <h3>Возможности:</h3>
        <ul>
          <li>Создание тестов с помощью AI</li>
          <li>Отслеживание прогресса и статистика</li>
          <li>Настраиваемые фоны</li>
          <li>8 языков интерфейса</li>
          <li>Организация по категориям</li>
        </ul>
      `
    }
  },

  // Spanish
  es: {
    title: 'Ayuda',
    sections: {
      howToCreateTest: 'Cómo crear un test',
      backgroundSettings: 'Configuración de fondo',
      aboutApp: 'Acerca de'
    },
    content: {
      howToCreateTest: `
        <h3>Dos formas de crear un test:</h3>

        <h3>1. Usando Prompt Builder (Recomendado)</h3>
        <ol>
          <li>Haz clic en el botón <strong>"Prompt Builder"</strong></li>
          <li>Completa los parámetros:
            <ul>
              <li><em>Topic</em> - tema del test (obligatorio)</li>
              <li><em>Questions count</em> - número de preguntas (1-50, óptimo: 20)</li>
              <li><em>Options count</em> - opciones de respuesta (4 o 6)</li>
              <li><em>Include examples</em> - añadir ejemplos de uso</li>
              <li><em>Examples per question</em> - cantidad de ejemplos (1-4)</li>
              <li><em>Additional instructions</em> - requisitos especiales para generación</li>
            </ul>
          </li>
          <li>Copia el prompt generado</li>
          <li>Envía a AI (ChatGPT, Claude, etc.)</li>
          <li>Copia el resultado en <strong>"Create Test"</strong></li>
        </ol>

        <h3>Additional Instructions - ¡Importante!</h3>
        <p>Usa este campo para requisitos especiales:</p>
        <ul>
          <li><strong>Formato de preguntas</strong> - ej. "Las preguntas deben pedir sinónimos/antónimos"</li>
          <li><strong>Estilo de respuestas</strong> - ej. "Las respuestas deben ser una sola palabra"</li>
          <li><strong>Nivel de dificultad</strong> - ej. "Vocabulario de nivel avanzado"</li>
          <li><strong>Contexto</strong> - ej. "Terminología de negocios en inglés"</li>
          <li><strong>Formato de ejemplos</strong> - ej. "Los ejemplos deben mostrar la palabra en una oración"</li>
        </ul>
        <p><em>Ejemplo:</em> "Crea preguntas donde los usuarios elijan el adjetivo fuerte. Las respuestas incorrectas deben ser similares pero incorrectas."</p>

        <h3>2. Creación manual</h3>
        <p>Formato del test:</p>
        <pre><code>Texto de la pregunta?
Opción A
*Respuesta correcta B
Opción C
Opción D
Example: Ejemplo de uso

Siguiente pregunta?
Opción 1
*Opción correcta 2
Opción 3
Opción 4</code></pre>

        <h3>Reglas de formato:</h3>
        <ul>
          <li><code>*</code> al inicio de línea = respuesta correcta</li>
          <li>Línea vacía separa preguntas</li>
          <li><code>Example:</code> para ejemplos (opcional)</li>
          <li>4-6 opciones de respuesta por pregunta</li>
        </ul>
      `,
      backgroundSettings: `
        <h3>Modos de fondo en Learning Mode</h3>

        <h3>Story Mode</h3>
        <p>Visualización secuencial de diapositivas de una historia:</p>
        <ul>
          <li>Al cambiar pregunta → siguiente diapositiva</li>
          <li>Al terminar historia → nueva aleatoria</li>
          <li>Crea atmósfera inmersiva</li>
        </ul>

        <h3>Random Mode</h3>
        <p>Fondo aleatorio en cada cambio de pregunta:</p>
        <ul>
          <li>Visuales frescos para cada pregunta</li>
          <li>Amplia variedad de imágenes</li>
        </ul>

        <h3>Custom Mode</h3>
        <p>Usa tus propios fondos:</p>
        <ul>
          <li><strong>"Load Background"</strong> - cargar imágenes de tu ordenador</li>
          <li><strong>"My Backgrounds"</strong> - gestionar tu galería</li>
          <li><em>Static</em> - un fondo seleccionado</li>
          <li><em>Random</em> - selección aleatoria de tus imágenes</li>
        </ul>

        <h3>Cómo usar:</h3>
        <ol>
          <li>Entra en Learning Mode</li>
          <li>Haz clic en el icono de engranaje <strong>⚙️</strong> (esquina superior derecha)</li>
          <li>Selecciona el modo del menú</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>Aplicación para aprendizaje efectivo mediante gamificación.</p>

        <h3>Modos de la aplicación:</h3>
        <ul>
          <li><strong>Test Mode</strong> - test clásico con puntuación</li>
          <li><strong>Learning Mode</strong> - aprendizaje interactivo con Pacman</li>
          <li><strong>Write Mode</strong> - práctica de escritura de respuestas</li>
        </ul>

        <h3>Características:</h3>
        <ul>
          <li>Crear tests usando AI</li>
          <li>Seguimiento de progreso y estadísticas</li>
          <li>Fondos personalizables</li>
          <li>8 idiomas de interfaz</li>
          <li>Organización por categorías</li>
        </ul>
      `
    }
  },

  // German
  de: {
    title: 'Hilfe',
    sections: {
      howToCreateTest: 'Test erstellen',
      backgroundSettings: 'Hintergrund-Einstellungen',
      aboutApp: 'Über'
    },
    content: {
      howToCreateTest: `
        <h3>Zwei Möglichkeiten, einen Test zu erstellen:</h3>

        <h3>1. Mit Prompt Builder (Empfohlen)</h3>
        <ol>
          <li>Klicken Sie auf <strong>"Prompt Builder"</strong></li>
          <li>Füllen Sie die Parameter aus:
            <ul>
              <li><em>Topic</em> - Testthema (erforderlich)</li>
              <li><em>Questions count</em> - Anzahl der Fragen (1-50, optimal: 20)</li>
              <li><em>Options count</em> - Antwortoptionen (4 oder 6)</li>
              <li><em>Include examples</em> - Verwendungsbeispiele hinzufügen</li>
              <li><em>Examples per question</em> - Anzahl der Beispiele (1-4)</li>
              <li><em>Additional instructions</em> - spezielle Generierungsanforderungen</li>
            </ul>
          </li>
          <li>Kopieren Sie den generierten Prompt</li>
          <li>Senden Sie an AI (ChatGPT, Claude usw.)</li>
          <li>Kopieren Sie das Ergebnis in <strong>"Create Test"</strong></li>
        </ol>

        <h3>Additional Instructions - Wichtig!</h3>
        <p>Verwenden Sie dieses Feld für spezielle Anforderungen:</p>
        <ul>
          <li><strong>Fragenformat</strong> - z.B. "Fragen sollen nach Synonymen/Antonymen fragen"</li>
          <li><strong>Antwortstil</strong> - z.B. "Antworten sollen nur ein Wort sein"</li>
          <li><strong>Schwierigkeitsgrad</strong> - z.B. "Fortgeschrittener Wortschatz"</li>
          <li><strong>Kontext</strong> - z.B. "Geschäftsterminologie auf Englisch"</li>
          <li><strong>Beispielformat</strong> - z.B. "Beispiele sollen das Wort im Satz zeigen"</li>
        </ul>
        <p><em>Beispiel:</em> "Erstellen Sie Fragen, bei denen Benutzer das starke Adjektiv wählen. Falsche Antworten sollten ähnlich, aber falsch sein."</p>

        <h3>2. Manuelle Erstellung</h3>
        <p>Testformat:</p>
        <pre><code>Fragetext?
Option A
*Richtige Antwort B
Option C
Option D
Example: Verwendungsbeispiel

Nächste Frage?
Option 1
*Richtige Option 2
Option 3
Option 4</code></pre>

        <h3>Formatierungsregeln:</h3>
        <ul>
          <li><code>*</code> am Zeilenanfang = richtige Antwort</li>
          <li>Leere Zeile trennt Fragen</li>
          <li><code>Example:</code> für Beispiele (optional)</li>
          <li>4-6 Antwortoptionen pro Frage</li>
        </ul>
      `,
      backgroundSettings: `
        <h3>Hintergrundmodi im Learning Mode</h3>

        <h3>Story Mode</h3>
        <p>Sequentielle Anzeige von Folien aus einer Geschichte:</p>
        <ul>
          <li>Bei Fragenwechsel → nächste Folie</li>
          <li>Nach Geschichte-Ende → zufällig neue</li>
          <li>Schafft immersive Atmosphäre</li>
        </ul>

        <h3>Random Mode</h3>
        <p>Zufälliger Hintergrund bei jedem Fragenwechsel:</p>
        <ul>
          <li>Frische Visuals für jede Frage</li>
          <li>Große Bildvielfalt</li>
        </ul>

        <h3>Custom Mode</h3>
        <p>Eigene Hintergründe verwenden:</p>
        <ul>
          <li><strong>"Load Background"</strong> - Bilder vom Computer laden</li>
          <li><strong>"My Backgrounds"</strong> - Galerie verwalten</li>
          <li><em>Static</em> - ein ausgewählter Hintergrund</li>
          <li><em>Random</em> - Zufallsauswahl aus Ihren Bildern</li>
        </ul>

        <h3>Verwendung:</h3>
        <ol>
          <li>Learning Mode betreten</li>
          <li>Auf das Zahnrad-Symbol klicken <strong>⚙️</strong> (oben rechts)</li>
          <li>Modus aus dem Menü wählen</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>Anwendung für effektives Lernen durch Gamification.</p>

        <h3>Anwendungsmodi:</h3>
        <ul>
          <li><strong>Test Mode</strong> - klassischer Test mit Punktzählung</li>
          <li><strong>Learning Mode</strong> - interaktives Lernen mit Pacman</li>
          <li><strong>Write Mode</strong> - Schreibübung für Antworten</li>
        </ul>

        <h3>Funktionen:</h3>
        <ul>
          <li>Tests mit AI erstellen</li>
          <li>Fortschrittsverfolgung und Statistiken</li>
          <li>Anpassbare Hintergründe</li>
          <li>8 Oberflächensprachen</li>
          <li>Kategorieorganisation</li>
        </ul>
      `
    }
  },

  // French
  fr: {
    title: 'Aide',
    sections: {
      howToCreateTest: 'Créer un test',
      backgroundSettings: 'Paramètres d\'arrière-plan',
      aboutApp: 'À propos'
    },
    content: {
      howToCreateTest: `
        <h3>Deux façons de créer un test :</h3>

        <h3>1. Utiliser Prompt Builder (Recommandé)</h3>
        <ol>
          <li>Cliquez sur le bouton <strong>"Prompt Builder"</strong></li>
          <li>Remplissez les paramètres :
            <ul>
              <li><em>Topic</em> - sujet du test (obligatoire)</li>
              <li><em>Questions count</em> - nombre de questions (1-50, optimal : 20)</li>
              <li><em>Options count</em> - options de réponse (4 ou 6)</li>
              <li><em>Include examples</em> - ajouter des exemples d'utilisation</li>
              <li><em>Examples per question</em> - nombre d'exemples (1-4)</li>
              <li><em>Additional instructions</em> - exigences spéciales de génération</li>
            </ul>
          </li>
          <li>Copiez le prompt généré</li>
          <li>Envoyez à AI (ChatGPT, Claude, etc.)</li>
          <li>Copiez le résultat dans <strong>"Create Test"</strong></li>
        </ol>

        <h3>Additional Instructions - Important !</h3>
        <p>Utilisez ce champ pour des exigences spéciales :</p>
        <ul>
          <li><strong>Format des questions</strong> - ex. "Les questions doivent demander des synonymes/antonymes"</li>
          <li><strong>Style des réponses</strong> - ex. "Les réponses doivent être un seul mot"</li>
          <li><strong>Niveau de difficulté</strong> - ex. "Vocabulaire de niveau avancé"</li>
          <li><strong>Contexte</strong> - ex. "Terminologie commerciale en anglais"</li>
          <li><strong>Format des exemples</strong> - ex. "Les exemples doivent montrer le mot dans une phrase"</li>
        </ul>
        <p><em>Exemple :</em> "Créez des questions où les utilisateurs choisissent l'adjectif fort. Les mauvaises réponses doivent être similaires mais incorrectes."</p>

        <h3>2. Création manuelle</h3>
        <p>Format du test :</p>
        <pre><code>Texte de la question ?
Option A
*Bonne réponse B
Option C
Option D
Example: Exemple d'utilisation

Question suivante ?
Option 1
*Bonne option 2
Option 3
Option 4</code></pre>

        <h3>Règles de formatage :</h3>
        <ul>
          <li><code>*</code> en début de ligne = bonne réponse</li>
          <li>Ligne vide sépare les questions</li>
          <li><code>Example:</code> pour les exemples (optionnel)</li>
          <li>4-6 options de réponse par question</li>
        </ul>
      `,
      backgroundSettings: `
        <h3>Modes d'arrière-plan en Learning Mode</h3>

        <h3>Story Mode</h3>
        <p>Affichage séquentiel des diapositives d'une histoire :</p>
        <ul>
          <li>Au changement de question → diapositive suivante</li>
          <li>Après la fin de l'histoire → nouvelle aléatoire</li>
          <li>Crée une atmosphère immersive</li>
        </ul>

        <h3>Random Mode</h3>
        <p>Arrière-plan aléatoire à chaque changement de question :</p>
        <ul>
          <li>Visuels frais pour chaque question</li>
          <li>Grande variété d'images</li>
        </ul>

        <h3>Custom Mode</h3>
        <p>Utilisez vos propres arrière-plans :</p>
        <ul>
          <li><strong>"Load Background"</strong> - charger des images depuis votre ordinateur</li>
          <li><strong>"My Backgrounds"</strong> - gérer votre galerie</li>
          <li><em>Static</em> - un arrière-plan sélectionné</li>
          <li><em>Random</em> - sélection aléatoire de vos images</li>
        </ul>

        <h3>Comment utiliser :</h3>
        <ol>
          <li>Entrez en Learning Mode</li>
          <li>Cliquez sur l'icône engrenage <strong>⚙️</strong> (coin supérieur droit)</li>
          <li>Sélectionnez le mode dans le menu</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>Application pour un apprentissage efficace par la gamification.</p>

        <h3>Modes de l'application :</h3>
        <ul>
          <li><strong>Test Mode</strong> - test classique avec score</li>
          <li><strong>Learning Mode</strong> - apprentissage interactif avec Pacman</li>
          <li><strong>Write Mode</strong> - pratique d'écriture des réponses</li>
        </ul>

        <h3>Fonctionnalités :</h3>
        <ul>
          <li>Créer des tests avec AI</li>
          <li>Suivi des progrès et statistiques</li>
          <li>Arrière-plans personnalisables</li>
          <li>8 langues d'interface</li>
          <li>Organisation par catégories</li>
        </ul>
      `
    }
  },

  // Polish
  pl: {
    title: 'Pomoc',
    sections: {
      howToCreateTest: 'Jak stworzyć test',
      backgroundSettings: 'Ustawienia tła',
      aboutApp: 'O aplikacji'
    },
    content: {
      howToCreateTest: `
        <h3>Dwa sposoby tworzenia testu:</h3>

        <h3>1. Używając Prompt Builder (Zalecane)</h3>
        <ol>
          <li>Kliknij przycisk <strong>"Prompt Builder"</strong></li>
          <li>Wypełnij parametry:
            <ul>
              <li><em>Topic</em> - temat testu (wymagane)</li>
              <li><em>Questions count</em> - liczba pytań (1-50, optymalnie: 20)</li>
              <li><em>Options count</em> - opcje odpowiedzi (4 lub 6)</li>
              <li><em>Include examples</em> - dodaj przykłady użycia</li>
              <li><em>Examples per question</em> - liczba przykładów (1-4)</li>
              <li><em>Additional instructions</em> - specjalne wymagania generacji</li>
            </ul>
          </li>
          <li>Skopiuj wygenerowany prompt</li>
          <li>Wyślij do AI (ChatGPT, Claude itp.)</li>
          <li>Skopiuj wynik do <strong>"Create Test"</strong></li>
        </ol>

        <h3>Additional Instructions - Ważne!</h3>
        <p>Użyj tego pola dla specjalnych wymagań:</p>
        <ul>
          <li><strong>Format pytań</strong> - np. "Pytania powinny prosić o synonimy/antonimy"</li>
          <li><strong>Styl odpowiedzi</strong> - np. "Odpowiedzi powinny być jednym słowem"</li>
          <li><strong>Poziom trudności</strong> - np. "Zaawansowane słownictwo"</li>
          <li><strong>Kontekst</strong> - np. "Terminologia biznesowa po angielsku"</li>
          <li><strong>Format przykładów</strong> - np. "Przykłady powinny pokazać słowo w zdaniu"</li>
        </ul>
        <p><em>Przykład:</em> "Stwórz pytania, gdzie użytkownicy wybierają silny przymiotnik. Złe odpowiedzi powinny być podobne, ale niepoprawne."</p>

        <h3>2. Ręczne tworzenie</h3>
        <p>Format testu:</p>
        <pre><code>Tekst pytania?
Opcja A
*Prawidłowa odpowiedź B
Opcja C
Opcja D
Example: Przykład użycia

Następne pytanie?
Opcja 1
*Prawidłowa opcja 2
Opcja 3
Opcja 4</code></pre>

        <h3>Zasady formatowania:</h3>
        <ul>
          <li><code>*</code> na początku linii = prawidłowa odpowiedź</li>
          <li>Pusta linia rozdziela pytania</li>
          <li><code>Example:</code> dla przykładów (opcjonalne)</li>
          <li>4-6 opcji odpowiedzi na pytanie</li>
        </ul>
      `,
      backgroundSettings: `
        <h3>Tryby tła w Learning Mode</h3>

        <h3>Story Mode</h3>
        <p>Sekwencyjne wyświetlanie slajdów z historii:</p>
        <ul>
          <li>Przy zmianie pytania → następny slajd</li>
          <li>Po zakończeniu historii → losowa nowa</li>
          <li>Tworzy immersyjną atmosferę</li>
        </ul>

        <h3>Random Mode</h3>
        <p>Losowe tło przy każdej zmianie pytania:</p>
        <ul>
          <li>Świeże wizualizacje dla każdego pytania</li>
          <li>Szeroki wybór obrazów</li>
        </ul>

        <h3>Custom Mode</h3>
        <p>Używaj własnych teł:</p>
        <ul>
          <li><strong>"Load Background"</strong> - załaduj obrazy z komputera</li>
          <li><strong>"My Backgrounds"</strong> - zarządzaj galerią</li>
          <li><em>Static</em> - jedno wybrane tło</li>
          <li><em>Random</em> - losowy wybór z twoich obrazów</li>
        </ul>

        <h3>Jak używać:</h3>
        <ol>
          <li>Wejdź w Learning Mode</li>
          <li>Kliknij ikonę koła zębatego <strong>⚙️</strong> (prawy górny róg)</li>
          <li>Wybierz tryb z menu</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>Aplikacja do efektywnej nauki poprzez grywalizację.</p>

        <h3>Tryby aplikacji:</h3>
        <ul>
          <li><strong>Test Mode</strong> - klasyczny test z punktacją</li>
          <li><strong>Learning Mode</strong> - interaktywna nauka z Pacmanem</li>
          <li><strong>Write Mode</strong> - ćwiczenie pisania odpowiedzi</li>
        </ul>

        <h3>Funkcje:</h3>
        <ul>
          <li>Tworzenie testów za pomocą AI</li>
          <li>Śledzenie postępów i statystyki</li>
          <li>Konfigurowalne tła</li>
          <li>8 języków interfejsu</li>
          <li>Organizacja kategorii</li>
        </ul>
      `
    }
  },

  // Portuguese
  pt: {
    title: 'Ajuda',
    sections: {
      howToCreateTest: 'Como criar um teste',
      backgroundSettings: 'Configurações de fundo',
      aboutApp: 'Sobre'
    },
    content: {
      howToCreateTest: `
        <h3>Duas formas de criar um teste:</h3>

        <h3>1. Usando Prompt Builder (Recomendado)</h3>
        <ol>
          <li>Clique no botão <strong>"Prompt Builder"</strong></li>
          <li>Preencha os parâmetros:
            <ul>
              <li><em>Topic</em> - tema do teste (obrigatório)</li>
              <li><em>Questions count</em> - número de perguntas (1-50, ideal: 20)</li>
              <li><em>Options count</em> - opções de resposta (4 ou 6)</li>
              <li><em>Include examples</em> - adicionar exemplos de uso</li>
              <li><em>Examples per question</em> - quantidade de exemplos (1-4)</li>
              <li><em>Additional instructions</em> - requisitos especiais de geração</li>
            </ul>
          </li>
          <li>Copie o prompt gerado</li>
          <li>Envie para AI (ChatGPT, Claude, etc.)</li>
          <li>Copie o resultado em <strong>"Create Test"</strong></li>
        </ol>

        <h3>Additional Instructions - Importante!</h3>
        <p>Use este campo para requisitos especiais:</p>
        <ul>
          <li><strong>Formato das perguntas</strong> - ex. "As perguntas devem pedir sinônimos/antônimos"</li>
          <li><strong>Estilo das respostas</strong> - ex. "As respostas devem ser uma só palavra"</li>
          <li><strong>Nível de dificuldade</strong> - ex. "Vocabulário de nível avançado"</li>
          <li><strong>Contexto</strong> - ex. "Terminologia de negócios em inglês"</li>
          <li><strong>Formato dos exemplos</strong> - ex. "Os exemplos devem mostrar a palavra em uma frase"</li>
        </ul>
        <p><em>Exemplo:</em> "Crie perguntas onde os usuários escolhem o adjetivo forte. Respostas erradas devem ser semelhantes, mas incorretas."</p>

        <h3>2. Criação manual</h3>
        <p>Formato do teste:</p>
        <pre><code>Texto da pergunta?
Opção A
*Resposta correta B
Opção C
Opção D
Example: Exemplo de uso

Próxima pergunta?
Opção 1
*Opção correta 2
Opção 3
Opção 4</code></pre>

        <h3>Regras de formatação:</h3>
        <ul>
          <li><code>*</code> no início da linha = resposta correta</li>
          <li>Linha vazia separa perguntas</li>
          <li><code>Example:</code> para exemplos (opcional)</li>
          <li>4-6 opções de resposta por pergunta</li>
        </ul>
      `,
      backgroundSettings: `
        <h3>Modos de fundo no Learning Mode</h3>

        <h3>Story Mode</h3>
        <p>Exibição sequencial de slides de uma história:</p>
        <ul>
          <li>Ao mudar pergunta → próximo slide</li>
          <li>Após fim da história → nova aleatória</li>
          <li>Cria atmosfera imersiva</li>
        </ul>

        <h3>Random Mode</h3>
        <p>Fundo aleatório a cada mudança de pergunta:</p>
        <ul>
          <li>Visuais frescos para cada pergunta</li>
          <li>Grande variedade de imagens</li>
        </ul>

        <h3>Custom Mode</h3>
        <p>Use seus próprios fundos:</p>
        <ul>
          <li><strong>"Load Background"</strong> - carregar imagens do computador</li>
          <li><strong>"My Backgrounds"</strong> - gerenciar sua galeria</li>
          <li><em>Static</em> - um fundo selecionado</li>
          <li><em>Random</em> - seleção aleatória das suas imagens</li>
        </ul>

        <h3>Como usar:</h3>
        <ol>
          <li>Entre no Learning Mode</li>
          <li>Clique no ícone de engrenagem <strong>⚙️</strong> (canto superior direito)</li>
          <li>Selecione o modo no menu</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>Aplicativo para aprendizado eficaz através de gamificação.</p>

        <h3>Modos do aplicativo:</h3>
        <ul>
          <li><strong>Test Mode</strong> - teste clássico com pontuação</li>
          <li><strong>Learning Mode</strong> - aprendizado interativo com Pacman</li>
          <li><strong>Write Mode</strong> - prática de escrita de respostas</li>
        </ul>

        <h3>Recursos:</h3>
        <ul>
          <li>Criar testes usando AI</li>
          <li>Acompanhamento de progresso e estatísticas</li>
          <li>Fundos personalizáveis</li>
          <li>8 idiomas de interface</li>
          <li>Organização por categorias</li>
        </ul>
      `
    }
  },

  // Chinese
  zh: {
    title: '帮助',
    sections: {
      howToCreateTest: '如何创建测试',
      backgroundSettings: '背景设置',
      aboutApp: '关于'
    },
    content: {
      howToCreateTest: `
        <h3>创建测试的两种方法：</h3>

        <h3>1. 使用 Prompt Builder（推荐）</h3>
        <ol>
          <li>点击 <strong>"Prompt Builder"</strong> 按钮</li>
          <li>填写参数：
            <ul>
              <li><em>Topic</em> - 测试主题（必填）</li>
              <li><em>Questions count</em> - 问题数量（1-50，最佳：20）</li>
              <li><em>Options count</em> - 答案选项（4或6）</li>
              <li><em>Include examples</em> - 添加使用示例</li>
              <li><em>Examples per question</em> - 示例数量（1-4）</li>
              <li><em>Additional instructions</em> - AI的额外要求</li>
            </ul>
          </li>
          <li>复制生成的提示</li>
          <li>发送给AI（ChatGPT、Claude等）</li>
          <li>将结果复制到 <strong>"Create Test"</strong></li>
        </ol>

        <h3>2. 手动创建</h3>
        <p>测试格式：</p>
        <pre><code>问题文本？
选项A
*正确答案B
选项C
选项D
Example: 使用示例

下一个问题？
选项1
*正确选项2
选项3
选项4</code></pre>

        <h3>格式规则：</h3>
        <ul>
          <li>行首 <code>*</code> = 正确答案</li>
          <li>空行分隔问题</li>
          <li><code>Example:</code> 用于示例（可选）</li>
          <li>每个问题4-6个答案选项</li>
        </ul>

        <h3>附加说明 (Additional Instructions)</h3>
        <p>这是一个重要的字段，用于向AI提供额外的说明。您可以指定：</p>
        <ul>
          <li><strong>问题格式</strong> - "问简短的定义问题"、"使用场景类问题"</li>
          <li><strong>答案风格</strong> - "答案不超过3个词"、"使用专业术语"</li>
          <li><strong>难度级别</strong> - "创建高级问题"、"包含棘手选项"</li>
          <li><strong>上下文</strong> - "关于JavaScript框架"、"仅限现代API"</li>
          <li><strong>示例格式</strong> - "示例使用代码片段"、"真实世界场景"</li>
        </ul>
        <p><em>示例说明：</em></p>
        <pre><code>问题集中在实际应用上。
每个问题包含代码示例。
错误答案应该看起来可信但有细微错误。</code></pre>
      `,
      backgroundSettings: `
        <h3>学习模式中的背景模式</h3>

        <h3>故事模式</h3>
        <p>顺序显示故事幻灯片：</p>
        <ul>
          <li>问题更改时 → 下一张幻灯片</li>
          <li>故事结束后 → 随机新故事</li>
          <li>创造沉浸式氛围</li>
        </ul>

        <h3>随机模式</h3>
        <p>每次问题更改时随机背景：</p>
        <ul>
          <li>每个问题新鲜的视觉效果</li>
          <li>图片种类繁多</li>
        </ul>

        <h3>自定义模式</h3>
        <p>使用您自己的背景：</p>
        <ul>
          <li><strong>"Load Background"</strong> - 从电脑加载图片</li>
          <li><strong>"My Backgrounds"</strong> - 管理您的图库</li>
          <li><em>Static</em> - 一个选定的背景</li>
          <li><em>Random</em> - 从您的图片中随机选择</li>
        </ul>

        <h3>如何使用：</h3>
        <ol>
          <li>进入学习模式</li>
          <li>点击齿轮图标 <strong>⚙️</strong>（右上角）</li>
          <li>从菜单中选择模式</li>
        </ol>
      `,
      aboutApp: `
        <h3>FREEZLET</h3>
        <p>通过游戏化进行有效学习的应用程序。</p>

        <h3>应用模式：</h3>
        <ul>
          <li><strong>测试模式</strong> - 带评分的经典测试</li>
          <li><strong>学习模式</strong> - 带Pacman的互动学习</li>
          <li><strong>写作模式</strong> - 答案书写练习</li>
        </ul>

        <h3>功能：</h3>
        <ul>
          <li>使用AI创建测试</li>
          <li>进度跟踪和统计</li>
          <li>可自定义背景</li>
          <li>8种界面语言</li>
          <li>分类组织</li>
        </ul>
      `
    }
  }
};

// Get help content for specific language
export function getHelpContent(lang) {
  // Fallback to English if language not found
  return HELP_CONTENT[lang] || HELP_CONTENT.en;
}
