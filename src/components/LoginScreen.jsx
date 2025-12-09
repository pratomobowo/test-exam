
import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

const TARGET_HASH = "6dc1ef86a7eeccca4c201824503b221822b00046ca7eb03fa8c78e55aa1a1fa4";

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export default function LoginScreen({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(false);

        try {
            const hash = await sha256(password);
            if (hash === TARGET_HASH) {
                onLogin();
            } else {
                setError(true);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 sm:p-8 border border-slate-200">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 mb-6 shadow-inner">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 text-center">Protected Exam</h1>
                    <p className="text-slate-500 text-sm mt-2 text-center">Enter the access code to start the practice session.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Enter Password"
                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${error
                                ? 'border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50 text-red-900 placeholder-red-400'
                                : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 text-slate-900 hover:bg-white focus:bg-white'
                                }`}
                            autoFocus
                        />
                        {error && (
                            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-medium animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Incorrect password
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                    >
                        {isLoading ? 'Verifying...' : (
                            <>
                                Start Exam <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
