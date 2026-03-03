import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, Target, TrendingUp, Award, Zap } from 'lucide-react';

export function RecentActivity({ user, onViewHistory }) {
  // Generate recent activities based on user data
  const generateActivities = () => {
    const activities = [];

    // Recent achievements
    const recentAchievements = [...(user?.achievements || [])]
      .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())
      .slice(0, 2);

    recentAchievements.forEach(achievement => {
      activities.push({
        id: `achievement-${achievement.id}`,
        type: 'achievement',
        title: 'Achievement Unlocked',
        description: `${achievement.name} - ${achievement.description}`,
        time: getTimeAgo(achievement.unlockedAt),
        icon: Award,
        color: 'text-purple-500',
        bg: 'bg-purple-100 dark:bg-purple-900/20'
      });
    });

    // Level up activity
    if (user.level > 1) {
      activities.push({
        id: 'level-up',
        type: 'level',
        title: 'Level Up!',
        description: `Reached Level ${user.level}`,
        time: getTimeAgo(user.lastActive),
        icon: TrendingUp,
        color: 'text-blue-500',
        bg: 'bg-blue-100 dark:bg-blue-900/20'
      });
    }

    // Quiz completion activity
    if (user.totalQuizzes > 0) {
      activities.push({
        id: 'quiz-completed',
        type: 'quiz',
        title: 'Quiz Completed',
        description: `${user.totalQuizzes} total quizzes completed with ${user.totalQuestions > 0 ? Math.round((user.totalCorrect / user.totalQuestions) * 100) : 0}% accuracy`,
        time: getTimeAgo(user.lastActive),
        icon: Trophy,
        color: 'text-yellow-500',
        bg: 'bg-yellow-100 dark:bg-yellow-900/20'
      });
    }

    // Streak activity
    if (user.streak > 0) {
      activities.push({
        id: 'streak',
        type: 'streak',
        title: 'Streak Active',
        description: `${user.streak} day learning streak!`,
        time: getTimeAgo(user.lastActive),
        icon: Zap,
        color: 'text-orange-500',
        bg: 'bg-orange-100 dark:bg-orange-900/20'
      });
    }

    // XP gained activity
    if (user.xp > 0) {
      activities.push({
        id: 'xp-gained',
        type: 'xp',
        title: 'XP Earned',
        description: `Total ${user.xp.toLocaleString()} XP earned`,
        time: getTimeAgo(user.lastActive),
        icon: Target,
        color: 'text-green-500',
        bg: 'bg-green-100 dark:bg-green-900/20'
      });
    }

    // If no activities, show welcome message
    if (activities.length === 0) {
      activities.push({
        id: 'welcome',
        type: 'welcome',
        title: 'Welcome to Quizzy!',
        description: 'Start your first quiz to see your activity here',
        time: 'Just now',
        icon: Trophy,
        color: 'text-purple-500',
        bg: 'bg-purple-100 dark:bg-purple-900/20'
      });
    }

    return activities.slice(0, 4); // Show max 4 activities
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const now = new Date();
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'Just now';

    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const activities = generateActivities();

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
        <button
          onClick={onViewHistory}
          className="text-purple-500 hover:text-purple-600 font-medium transition-colors duration-200"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
          >
            <div className={`p-2 rounded-lg ${activity.bg}`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {activity.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activity.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              {activity.time}
            </div>
          </motion.div>
        ))}
      </div>

      {user.totalQuizzes === 0 && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
            🎯 Complete your first quiz to start tracking your progress and unlock achievements!
          </p>
        </div>
      )}
    </div>
  );
}