// UI/TestRunner/modules/QuestionManager.js
// Test runner questions management module

import { getTestState, updateScore } from "../testState.js";
import { createLogger } from '@UI/Utils/loggerService.js';
import { uiEventDispatcher } from '@UI/Controllers/uiEventDispatcher.js';
import { t } from '@UI/i18n/index.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/modules/QuestionManager');

export class QuestionManager {
    constructor() {
        this.state = null;
    }

    initialize() {
        this.state = getTestState();
        logger.info(`Loaded ${this.state.questions.length} questions`);
        this.shuffleQuestions();
    }

    shuffleQuestions() {
        const questions = this.state.questions || [];
        if (questions.length > 0) {
            questions.forEach((q) => {
                const original = q.options.map((text, index) => ({ text, index }));
                const shuffled = original.sort(() => Math.random() - 0.5);
                q.options = shuffled.map(e => e.text);
                q.correctAnswer = shuffled.findIndex(e => e.index === q.correctAnswer);
            });
            logger.info("Questions shuffled");
        }
    }

    startTest() {
        if (this.state.questions.length > 0) {
            this.renderQuestion();
            logger.info("Test started");
        }
    }

    renderQuestion() {
        const currentState = getTestState();
        const currentIndex = currentState.currentQuestionIndex;
        
        if (currentIndex >= currentState.questions.length) {
            this.showFinalResult();
            return;
        }

        const question = currentState.questions[currentIndex];
        const area = document.getElementById("questionArea");

        area.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.id = "questionContent";
        wrapper.classList.add("fade-in");

        const qText = document.createElement("p");
        qText.textContent = question.question;
        wrapper.appendChild(qText);

        const answersWrap = document.createElement("div");
        answersWrap.id = "answersWrap";

        question.options.forEach((option, i) => {
            const btn = document.createElement("button");
            btn.textContent = option;
            btn.className = "answer-button";
            btn.addEventListener("click", () => this.handleAnswer(btn, i));
            answersWrap.appendChild(btn);
        });

        wrapper.appendChild(answersWrap);
        area.appendChild(wrapper);
        logger.info(`Displayed question ${currentIndex + 1} of ${currentState.questions.length}`);
        
        // Dispatch progress update event
        uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_RUNNER_PROGRESS_UPDATED, {
            current: currentIndex,
            total: currentState.questions.length,
            timestamp: Date.now()
        });
    }

    handleAnswer(button, selectedIndex) {
        const currentState = getTestState();
        const currentIndex = currentState.currentQuestionIndex;
        const question = currentState.questions[currentIndex];
        const correct = question.correctAnswer;
        const buttons = document.querySelectorAll(".answer-button");

        buttons.forEach(btn => btn.disabled = true);

        const outer = document.getElementById("testRunnerOuterArea");
        let feedbackArea = document.getElementById("feedbackArea");
        if (!feedbackArea) {
            feedbackArea = document.createElement("div");
            feedbackArea.id = "feedbackArea";
            outer.appendChild(feedbackArea);
        }

        const isCorrect = selectedIndex === correct;
        
        if (isCorrect) {
            button.classList.add("correct");
            feedbackArea.textContent = t('learnMode.correct');
            logger.info("Correct answer");
        } else {
            button.classList.add("incorrect");
            buttons[correct].classList.add("correct");
            feedbackArea.textContent = t('learnMode.correctAnswer', { answer: question.options[correct] });
            logger.info("Incorrect answer");
        }
        
        // Dispatch question answered event
        uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_RUNNER_QUESTION_ANSWERED, {
            questionIndex: currentIndex,
            isCorrect: isCorrect,
            selectedAnswer: selectedIndex,
            correctAnswer: correct,
            timestamp: Date.now()
        });
        
        // Update counter in controller
        updateScore(isCorrect);

        setTimeout(() => {
            // Get updated test state
            const updatedState = getTestState();
            
            // Update progress
            this.updateProgress();
            
            // Check if test is completed
            if (!updatedState.isRunning) {
                this.showFinalResult();
            } else {
                // Render next question
                this.renderQuestion();
            }
        }, 1000);
    }

    updateProgress() {
        const fill = document.getElementById("progressFill");
        if (!fill) return;
        
        const currentState = getTestState();
        if (!currentState.questions?.length) return;
        
        const percent = (currentState.currentQuestionIndex / currentState.questions.length) * 100;
        fill.style.height = `${percent}%`;
        logger.info(`Progress: ${percent.toFixed(1)}%`);
    }

    showFinalResult() {
        const area = document.getElementById("questionArea");
        area.innerHTML = "";
        document.body.classList.add("showing-result");
        
        const currentState = getTestState();
        const score = Math.round((currentState.correctCount / currentState.totalCount) * 100);
        logger.info(`Final result: ${score}%`);
        
        const result = document.createElement("h2");
        result.textContent = t('learnMode.yourResult', { score });
        result.className = "final-score";
        area.appendChild(result);

        const buttonsWrap = document.createElement("div");
        buttonsWrap.className = "final-buttons";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = t('buttons.close');
        closeBtn.className = "close-button";
        closeBtn.addEventListener("click", () => {
            // Use close event instead of page reload
            uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_RUNNER_CLOSE, {
                timestamp: Date.now()
            });
        });

        const retryBtn = document.createElement("button");
        retryBtn.textContent = t('buttons.retry');
        retryBtn.className = "retry-button";
        retryBtn.addEventListener("click", () => {
            // Restart test via event
            document.body.classList.remove("showing-result");
            
            uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_RUNNER_START, {
                testPath: currentState.testPath,
                restart: true,
                timestamp: Date.now()
            });
        });

        buttonsWrap.appendChild(closeBtn);
        buttonsWrap.appendChild(retryBtn);
        area.appendChild(buttonsWrap);

        if (score === 100) {
            logger.info("Starting reward animation");
            this.showRewardAnimation(area);
        }
    }

    showRewardAnimation(area) {
        setTimeout(() => {
            const animationContainer = document.createElement("div");
            animationContainer.id = "lottieReward";
            area.appendChild(animationContainer);

            const video = document.createElement("video");
            video.src = "UI/TestRunner/Assets/Content/Wings.mp4";
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            video.style.width = "200px";
            video.style.height = "200px";
            video.style.objectFit = "contain";
            video.addEventListener("ended", () => {
                video.currentTime = 0;
            });
            animationContainer.appendChild(video);
        }, 0);
    }
} 