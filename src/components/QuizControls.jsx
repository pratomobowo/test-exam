
import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const QuizControls = ({
    currentQuestionIndex,
    totalQuestions,
    onNext,
    onPrev,
    onSubmit,
    onFinish,
    showFeedback,
    hasSelectedOption
}) => {
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    return (
        // Mobile: Floating bar (bottom-4 inset-x-4)
        // Desktop: Full width bar (sm:bottom-0 sm:inset-x-0)
        <div className="fixed bottom-4 inset-x-4 sm:bottom-0 sm:inset-x-0 z-20 pb-safe sm:pb-0 pointer-events-none sm:pointer-events-auto">
            <div className="max-w-3xl mx-auto pointer-events-auto">
                <div className="bg-white sm:bg-transparent rounded-2xl sm:rounded-none shadow-xl sm:shadow-none border border-slate-200 sm:border-0 sm:border-t sm:border-slate-200 p-3 sm:p-4 md:p-6 flex items-center justify-between gap-3">
                    <button
                        onClick={onPrev}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center justify-center px-4 py-3 sm:py-2.5 rounded-xl font-medium transition-colors border border-transparent ${currentQuestionIndex === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-slate-100 active:bg-slate-200'
                            }`}
                        aria-label="Previous Question"
                    >
                        <ArrowLeft className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex-1 max-w-[200px] sm:max-w-none flex justify-end">
                        {!showFeedback ? (
                            <button
                                onClick={onSubmit}
                                disabled={!hasSelectedOption}
                                className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 sm:py-2.5 rounded-xl font-semibold shadow-sm transition-all ${!hasSelectedOption
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
                                    }`}
                            >
                                Submit <span className="hidden sm:inline ml-1">Answer</span>
                            </button>
                        ) : isLastQuestion ? (
                            <button
                                onClick={onFinish}
                                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 sm:py-2.5 rounded-xl font-semibold shadow-sm transition-all bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:scale-[0.98]"
                            >
                                Finish <span className="hidden sm:inline ml-1">Exam</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={onNext}
                                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 sm:py-2.5 rounded-xl font-semibold shadow-sm transition-all bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
                            >
                                Next <span className="hidden sm:inline ml-1">Question</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizControls;
