import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await api.getLeaderboard(category);
        const formattedData = data.map((item, index) => ({
          rank: index + 1,
          username: item.username,
          score: item.score,
          category: item.category,
          avatar: item.username.charAt(0).toUpperCase(),
          level: Math.floor(item.score / 100) + 1,
          streak: 0,
          change: 0
        }));
        setLeaderboardData(formattedData);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [category]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-500';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['', 'Science', 'History', 'Geography', 'Sports', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${category === cat
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {cat || 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Fetching champions...</p>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          No scores yet in this category. Be the first!
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboardData.map((user, index) => (
            <motion.div
              key={`${user.username}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${user.rank <= 3
                  ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(user.rank)}
                </div>

                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getRankBg(user.rank)}`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {user.username}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Level {user.level}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{user.score.toLocaleString()} XP</span>
                      <span className="capitalize">{user.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && leaderboardData.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Keep playing to climb higher!
          </p>
        </div>
      )}
    </div>
  );
}