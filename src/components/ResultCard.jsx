
import React from 'react';
import { Trophy, XCircle, RotateCcw, CheckCircle } from 'lucide-react';

const ResultCard = ({ score, totalQuestions, onRetry }) => {
    const isPass = score > 79;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden text-center p-8 sm:p-12">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isPass ? (
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
                ) : (
                    <XCircle className="w-10 h-10 sm:w-12 sm:h-12" />
                )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {isPass ? 'Congratulations!' : 'Keep Trying!'}
            </h2>

            <p className="text-slate-500 text-lg mb-8">
                You have {isPass ? 'passed' : 'failed'} the CEH Exam.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 max-w-xs mx-auto border border-slate-100">
                <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Total Score</div>
                <div className={`text-4xl sm:text-5xl font-black mb-2 ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                    {score}
                    <span className="text-xl sm:text-2xl text-slate-400 font-medium ml-1">/ {totalQuestions}</span>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPass ? 'LULUS (PASS)' : 'TIDAK LULUS (FAIL)'}
                </div>
            </div>

            <button
                onClick={onRetry}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold shadow-sm text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] transition-all"
            >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
            </button>
        </div>
    );
};

export default ResultCard;
