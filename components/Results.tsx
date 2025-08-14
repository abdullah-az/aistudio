import React from 'react';

interface ResultsProps {
    score: number;
    total: number;
    onRestart: () => void;
    onReview: () => void;
}

const Results: React.FC<ResultsProps> = ({ score, total, onRestart, onReview }) => {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    
    const getPerformanceColor = () => {
        if (percentage >= 80) return 'text-green-400';
        if (percentage >= 50) return 'text-yellow-400';
        return 'text-red-400';
    }

    return (
        <div className="text-center py-8 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-200">اكتمل الاختبار!</h3>
            <p className="text-gray-400 mt-2">لقد أجبت بشكل صحيح على</p>
            <div className={`my-4 text-7xl font-bold ${getPerformanceColor()}`}>
                {score} <span className="text-4xl text-gray-400">/ {total}</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4 my-4 overflow-hidden">
                <div 
                    className={`h-4 rounded-full transition-all duration-1000 ease-out ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={onReview}
                    className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300"
                >
                    مراجعة الإجابات
                </button>
                <button
                    onClick={onRestart}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300"
                >
                    إعادة الاختبار
                </button>
            </div>
        </div>
    );
};

export default Results;