
import React, { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import QuestionCard from './components/QuestionCard';
import QuizControls from './components/QuizControls';
import { Target, Trophy, RotateCcw } from 'lucide-react';
import LoginScreen from './components/LoginScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // Map of questionId -> selectedOption
  const [submittedAnswers, setSubmittedAnswers] = useState({}); // Map of questionId -> boolean (isSubmitted)
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Determine valid questions (must have an answer)
    const validQuestions = questionsData.filter(q => q.answer && q.options.length > 0);

    // Shuffle questions using Fisher-Yates algorithm
    const shuffled = [...validQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setQuestions(shuffled);
  }, []);

  const handleOptionSelect = (optionLabel) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (submittedAnswers[currentQuestion.id]) return; // Prevent changing after submit

    setSelectedOptions(prev => ({
      ...prev,
      [currentQuestion.id]: optionLabel
    }));
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selected = selectedOptions[currentQuestion.id];

    if (!selected) return;

    setSubmittedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));

    if (selected === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your progress?")) {
      setSelectedOptions({});
      setSubmittedAnswers({});
      setScore(0);
      setCurrentQuestionIndex(0);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Loading questions...
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isQuestionSubmitted = submittedAnswers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-32 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm safe-top">
        <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h1 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1">CEH Exam</h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-wider hidden sm:block">Progress</span>
              <span className="font-mono text-sm sm:text-base font-medium text-slate-700">
                {currentQuestionIndex + 1} <span className="text-slate-400">/</span> {questions.length}
              </span>
            </div>

            <div className="h-6 sm:h-8 w-px bg-slate-200"></div>

            <div className="flex flex-col items-end min-w-[2.5rem] sm:min-w-[3rem]">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold tracking-wider hidden sm:flex items-center gap-1">
                <Trophy className="w-3 h-3 text-yellow-500" /> Score
              </span>
              <div className="flex items-center gap-1 sm:hidden">
                <Trophy className="w-3 h-3 text-yellow-500" />
              </div>
              <span className={`font-mono font-bold text-sm sm:text-base ${score > 0 ? 'text-green-600' : 'text-slate-700'}`}>
                {score}
              </span>
            </div>

            <div className="h-6 sm:h-8 w-px bg-slate-200"></div>

            <button onClick={handleReset} className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors active:bg-slate-200" title="Reset Quiz">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <QuestionCard
          question={currentQuestion}
          selectedOption={selectedOptions[currentQuestion.id]}
          onOptionSelect={handleOptionSelect}
          showFeedback={isQuestionSubmitted}
        />
      </main>

      {/* Footer Controls */}
      <QuizControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        showFeedback={isQuestionSubmitted}
        hasSelectedOption={!!selectedOptions[currentQuestion.id]}
      />
    </div>
  );
}

export default App;
