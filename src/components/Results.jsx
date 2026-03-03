import React from 'react';
import { Trophy, Target, Clock, RotateCcw, TrendingUp } from 'lucide-react';

export function Results({ result, questions, userAnswers, onRestart, onShowHistory }) {
  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPerformanceBg = (percentage) => {
    if (percentage >= 80) return 'from-emerald-500 to-green-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${getPerformanceBg(result.percentage)} rounded-full mb-4`}>
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h1>
          <p className="text-gray-600 dark:text-gray-300">Here's how you performed</p>
        </div>

        {/* Score Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-purple-500" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Score</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {result.score}/{result.total}
              </div>
              <div className={`text-xl font-semibold ${getPerformanceColor(result.percentage)}`}>
                {result.percentage}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Time</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatTime(result.time)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {(result.time / result.total).toFixed(1)}s per question
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Grade</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {result.percentage >= 90 ? 'A+' : 
                 result.percentage >= 80 ? 'A' :
                 result.percentage >= 70 ? 'B' :
                 result.percentage >= 60 ? 'C' : 'D'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {result.percentage >= 80 ? 'Excellent!' : 
                 result.percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
              </div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Question Review</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correct_answer;
              
              return (
                <div key={index} className={`p-4 rounded-xl border-2 ${
                  isCorrect 
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20' 
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrect 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {question.question}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex gap-2">
                          <span className="text-gray-600 dark:text-gray-400">Your answer:</span>
                          <span className={isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                            {userAnswer || 'No answer'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Correct answer:</span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {question.correct_answer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Take Another Quiz
          </button>
          
          <button
            onClick={onShowHistory}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-8 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            View History
          </button>
        </div>
      </div>
    </div>
  );
}