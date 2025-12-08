
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const QuestionCard = ({ question, selectedOption, onOptionSelect, showFeedback }) => {
    const getOptionStyle = (optionLabel) => {
        let baseStyle = "flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50";

        if (showFeedback) {
            if (optionLabel === question.answer) {
                return "flex items-center p-4 border rounded-lg bg-green-50 border-green-500 text-green-700 font-medium";
            }
            if (selectedOption === optionLabel) {
                return "flex items-center p-4 border rounded-lg bg-red-50 border-red-500 text-red-700";
            }
            return "flex items-center p-4 border rounded-lg opacity-60"; // Dim other options
        }

        if (selectedOption === optionLabel) {
            return "flex items-center p-4 border rounded-lg bg-blue-50 border-blue-500 ring-1 ring-blue-500";
        }

        return baseStyle;
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-6">
                    <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-100 text-slate-600 text-xs sm:text-sm font-semibold rounded-full mb-2 sm:mb-3">
                        Question {question.id}
                    </span>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
                        {question.question}
                    </h2>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    {question.options.map((option) => (
                        <div
                            key={option.label}
                            onClick={() => !showFeedback && onOptionSelect(option.label)}
                            className={`${getOptionStyle(option.label)} p-3 sm:p-4 active:scale-[0.99] transition-transform duration-100`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 mr-3 sm:mr-4 font-bold text-sm sm:text-base ${showFeedback && option.label === question.answer ? 'border-green-500 bg-green-500 text-white' :
                                showFeedback && selectedOption === option.label && option.label !== question.answer ? 'border-red-500 bg-red-500 text-white' :
                                    selectedOption === option.label ? 'border-blue-500 text-blue-500' : 'border-slate-300 text-slate-400'
                                }`}>
                                {option.label}
                            </div>
                            <div className="flex-1 text-sm sm:text-base leading-relaxed">
                                {option.text}
                            </div>
                            {showFeedback && option.label === question.answer && (
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 ml-2" />
                            )}
                            {showFeedback && selectedOption === option.label && option.label !== question.answer && (
                                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 ml-2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
