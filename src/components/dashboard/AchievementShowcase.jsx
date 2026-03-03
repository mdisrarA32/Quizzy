import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Target, Zap, Crown } from 'lucide-react';

export function AchievementShowcase({ user, expanded = false }) {
  // Mock achievements
  const allAchievements = [
    {
      id: 'first-quiz',
      name: 'First Steps',
      description: 'Complete your first quiz',
      icon: Target,
      rarity: 'common',
      unlocked: true,
      progress: 100
    },
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      description: 'Complete 10 quizzes',
      icon: Trophy,
      rarity: 'rare',
      unlocked: user.totalQuizzes >= 10,
      progress: Math.min((user.totalQuizzes / 10) * 100, 100)
    },
    {
      id: 'perfect-score',
      name: 'Perfectionist',
      description: 'Get 100% on any quiz',
      icon: Star,
      rarity: 'epic',
      unlocked: false,
      progress: 0
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete a quiz in under 2 minutes',
      icon: Zap,
      rarity: 'rare',
      unlocked: false,
      progress: 0
    },
    {
      id: 'knowledge-king',
      name: 'Knowledge King',
      description: 'Reach level 10',
      icon: Crown,
      rarity: 'legendary',
      unlocked: user.level >= 10,
      progress: Math.min((user.level / 10) * 100, 100)
    },
    {
      id: 'streak-warrior',
      name: 'Streak Warrior',
      description: 'Maintain a 7-day streak',
      icon: Award,
      rarity: 'epic',
      unlocked: user.maxStreak >= 7,
      progress: Math.min((user.maxStreak / 7) * 100, 100)
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
      case 'rare': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'epic': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'legendary': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  const displayAchievements = expanded ? allAchievements : allAchievements.slice(0, 3);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {expanded ? 'All Achievements' : 'Recent Achievements'}
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {user?.achievements?.length ?? 0}/{allAchievements.length} unlocked
        </div>
      </div>

      <div className={`grid gap-4 ${expanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {displayAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`p-4 rounded-xl border transition-all duration-200 ${achievement.unlocked
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700'
                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getRarityColor(achievement.rarity)} ${achievement.unlocked ? '' : 'opacity-50'
                }`}>
                <achievement.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium mb-1 ${achievement.unlocked
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                  }`}>
                  {achievement.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {achievement.description}
                </p>

                {!achievement.unlocked && achievement.progress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Progress</span>
                      <span>{Math.round(achievement.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                  {achievement.unlocked && (
                    <div className="text-green-500">
                      <Award className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}