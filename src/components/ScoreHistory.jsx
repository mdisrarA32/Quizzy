import React from 'react';
import { ArrowLeft, Trophy, Calendar, Clock, Target, BarChart } from 'lucide-react';

export function ScoreHistory({ history, onBack }) {
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const averageScore = history.length > 0
    ? Math.round(history.reduce((acc, result) => acc + result.percentage, 0) / history.length)
    : 0;

  const bestScore = history.length > 0
    ? Math.max(...history.map(result => result.percentage))
    : 0;

  const totalQuestions = history.reduce((acc, result) => acc + result.total, 0);

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-700/20 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Score History</h1>
            <p className="text-gray-600 dark:text-gray-300">Track your quiz performance over time</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 dark:border-gray-700/20 text-center">
            <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Quiz History</h2>
            <p className="text-gray-600 dark:text-gray-400">Take your first quiz to see your performance history here.</p>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Average Score</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {averageScore}%
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Best Score</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {bestScore}%
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart className="w-6 h-6 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Total Questions</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalQuestions}
                </div>
              </div>
            </div>

            {/* History List */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Quizzes</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sortedHistory.map((result, index) => (
                  <div key={index} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl font-bold ${getGradeColor(result.percentage)}`}>
                          {result.percentage}%
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {result.score}/{result.total} correct
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(result.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {formatTime(result.time)}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{result.config?.amount || result.total || 0} questions</span>
                      {result.category && (
                        <span> • Category: {
                          result.category === '9' ? 'General Knowledge' :
                            result.category === '17' ? 'Science & Nature' :
                              result.category === '18' ? 'Computers' :
                                result.category === '21' ? 'Sports' :
                                  result.category === '22' ? 'Geography' :
                                    result.category === '23' ? 'History' :
                                      result.category || 'Mixed'
                        }</span>
                      )}
                      {result.difficulty && (
                        <span> • {result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}