
# CEH Exam App - Scoring and Results Implementation

This document outlines the changes made to implement the scoring system and result screen for the CEH Exam application.

## 1. Overview
The goal was to provide a final score after the user answers all questions.
- **Total Questions**: Based on the loaded questions (typically 125).
- **Pass Threshold**: Score > 79.
- **Fail Threshold**: Score <= 79.
- **Result Screen**: A dedicated view showing the score, pass/fail status, and a retry button.

## 2. Components Created

### `src/components/ResultCard.jsx`
A new component responsible for displaying the exam results.
- **Props**:
  - `score`: The user's total score.
  - `totalQuestions`: Total number of questions in the exam.
  - `onRetry`: Function to reset the exam.
- **Features**:
  - Displays "Congratulations!" or "Keep Trying!" based on the score.
  - Shows a Trophy icon (Green) for Pass, X Circle (Red) for Fail.
  - Displays the numeric score (e.g., "90 / 125").
  - Shows a "LULUS (PASS)" or "TIDAK LULUS (FAIL)" badge.

## 3. Component Updates

### `src/components/QuizControls.jsx`
Updated to handle the end of the exam.
- **New Prop**: `onFinish`
- **Logic**: 
  - Checks if the current question is the last one (`currentQuestionIndex === totalQuestions - 1`).
  - if it is the last question and the answer has been submitted, it renders a "Finish Exam" button instead of "Next Question".

### `src/App.jsx`
The main application state was updated to manage the result screen visibility.
- **New State**: `showResults` (boolean).
- **New Handler**: `handleFinish` sets `showResults` to `true`.
- **Render Logic**:
  - Conditionally renders `ResultCard` when `showResults` is true.
  - Hides `QuizControls` when showing results.
- **Reset Logic**: `handleReset` now also sets `showResults` to `false` to return to the quiz view.

## 4. Usage
1. User answers all questions.
2. On the last question, after clicking "Submit Answer", a "Finish Exam" button appears.
3. Clicking "Finish Exam" shows the Result Screen.
4. User can see their status (Pass/Fail) and score.
5. Clicking "Try Again" resets the exam progress and shuffles questions (if shuffle mode was active) or resets order.

## 5. Scoring Rules
- **Pass**: Score > 79
- **Fail**: Score <= 79
- **Total Score**: Calculated based on the number of correct answers (1 point per correct answer).
