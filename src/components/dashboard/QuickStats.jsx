import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, Zap, TrendingUp, Award } from 'lucide-react';

export function QuickStats({ user }) {
  const accuracy = user.totalQuestions > 0 ? Math.round((user.totalCorrect / user.totalQuestions) * 100) : 0;
  const avgTimePerQuestion = user.totalQuestions > 0 && user.totalTimeSpent > 0
    ? Math.round(user.totalTimeSpent / user.totalQuestions)
    : 0;

  const stats = [
    {
      icon: Trophy,
      label: 'Quizzes Completed',
      value: user?.totalQuizzes ?? 0,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      change: (user?.totalQuizzes ?? 0) > 0 ? '+1 this session' : 'Start your first quiz!'
    },
    {
      icon: Target,
      label: 'Accuracy Rate',
      value: `${accuracy}%`,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
      change: (user?.averageScore ?? 0) > 0 ? `Avg: ${user.averageScore}%` : 'No data yet'
    },
    {
      icon: Clock,
      label: 'Avg. Time/Question',
      value: avgTimePerQuestion > 0 ? `${avgTimePerQuestion}s` : '--',
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      change: (user?.totalTimeSpent ?? 0) > 0 ? `Total: ${Math.round(user.totalTimeSpent / 60)}m` : 'No data yet'
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: `${user?.streak ?? 0} days`,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      change: `Best: ${user?.maxStreak ?? 0} days`
    },
    {
      icon: TrendingUp,
      label: 'Total XP',
      value: (user?.xp ?? 0).toLocaleString(),
      color: 'text-indigo-500',
      bg: 'bg-indigo-100 dark:bg-indigo-900/20',
      change: `Level ${user?.level ?? 1}`
    },
    {
      icon: Award,
      label: 'Best Score',
      value: `${user?.bestScore ?? 0}%`,
      color: 'text-pink-500',
      bg: 'bg-pink-100 dark:bg-pink-900/20',
      change: `${user?.achievements?.length ?? 0} achievements`
    }
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Stats</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Updated in real-time
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* XP Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Level Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.xp % 1000}/1000 XP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((user.xp % 1000) / 1000) * 100}%` }}
              />
            </div>
          </div>

          {/* Accuracy Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Accuracy Goal (80%)
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {accuracy}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${accuracy >= 80
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  }`}
                style={{ width: `${Math.min(accuracy, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}