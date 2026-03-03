import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, TrendingUp, Zap, Target, Clock, Trophy } from 'lucide-react';
import { QUIZ_CATEGORIES, DIFFICULTIES, QUESTION_TYPES, QUIZ_MODES } from '../../types/quiz';

export function EnhancedQuizConfig({ onStartQuiz, onShowHistory, onShowDashboard }) {
  const [config, setConfig] = useState({
    amount: 10,
    category: '',
    difficulty: '',
    type: '',
    timeLimit: 30,
    mode: 'classic',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartQuiz(config);
  };

  const selectedMode = QUIZ_MODES.find(mode => mode.id === config.mode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6 shadow-2xl">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Configure Your Quiz</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Customize your perfect learning experience</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Quiz Mode Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quiz Mode
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUIZ_MODES.map(mode => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, mode: mode.id }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          config.mode === mode.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{mode.icon}</span>
                          <h3 className="font-bold text-gray-900 dark:text-white">{mode.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{mode.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Basic Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      id="amount"
                      min="1"
                      max="50"
                      value={config.amount}
                      onChange={(e) => setConfig(prev => ({ ...prev, amount: parseInt(e.target.value) || 10 }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="timeLimit" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Time per Question (seconds)
                    </label>
                    <input
                      type="number"
                      id="timeLimit"
                      min="10"
                      max="120"
                      value={config.timeLimit}
                      onChange={(e) => setConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Category
                  </label>
                  <select
                    id="category"
                    value={config.category}
                    onChange={(e) => setConfig(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    {QUIZ_CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      value={config.difficulty}
                      onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      {DIFFICULTIES.map(difficulty => (
                        <option key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Question Type
                    </label>
                    <select
                      id="type"
                      value={config.type}
                      onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      {QUESTION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 pt-6">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Play className="w-6 h-6" />
                    Start {selectedMode?.name} Quiz
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={onShowDashboard}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-5 h-5" />
                      Dashboard
                    </button>
                    
                    <button
                      type="button"
                      onClick={onShowHistory}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-5 h-5" />
                      History
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Quiz Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Mode Info */}
            {selectedMode && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{selectedMode.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMode.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedMode.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Questions</span>
                    <span className="font-medium text-gray-900 dark:text-white">{config.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Time Limit</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round((config.amount * (config.timeLimit || 30)) / 60)}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {DIFFICULTIES.find(d => d.value === config.difficulty)?.label || 'Any'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Estimated Rewards</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {config.amount * 10} - {config.amount * 25} XP
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Based on performance</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Streak Bonus</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">+50% XP if perfect</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Speed Bonus</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">+25% XP if fast</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}