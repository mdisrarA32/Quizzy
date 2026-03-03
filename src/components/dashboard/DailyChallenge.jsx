import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Clock, Star, Play } from 'lucide-react';

export function DailyChallenge({ onStartChallenge, expanded = false }) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const challenge = {
    title: "Science Spectacular",
    description: "Test your knowledge of physics, chemistry, and biology",
    category: "Science & Nature",
    difficulty: "Medium",
    questions: 15,
    timeLimit: 10,
    reward: 500,
    participants: 1247,
    completed: false
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Challenge</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{today}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {challenge.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {challenge.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold">{challenge.reward} XP</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {challenge.questions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {challenge.timeLimit}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Limit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {challenge.difficulty}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Difficulty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {challenge.participants}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Participants</div>
            </div>
          </div>

          <button
            onClick={onStartChallenge}
            disabled={challenge.completed}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
              challenge.completed
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg'
            }`}
          >
            {challenge.completed ? (
              <>
                <Trophy className="w-5 h-5" />
                Challenge Completed
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Challenge
              </>
            )}
          </button>
        </div>

        {expanded && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Previous Challenges</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      History Challenge #{i}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Completed • 85% accuracy
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">+400 XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}