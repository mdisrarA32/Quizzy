import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('quizzy-user', null);
  const [isLoading, setIsLoading] = useState(false);

  // Hydrate user data with defaults if missing (e.g., from old sessions)
  useEffect(() => {
    if (user && (!user.achievements || user.xp === undefined)) {
      setUser(prev => ({
        totalQuizzes: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        xp: 0,
        level: 1,
        streak: 0,
        maxStreak: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        bestScore: 0,
        achievements: [],
        ...prev
      }));
    }
  }, [user, setUser]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await api.login(email, password);
      setUser({
        totalQuizzes: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        xp: 0,
        level: 1,
        streak: 0,
        maxStreak: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        bestScore: 0,
        achievements: [],
        ...data,
        lastActive: new Date().toISOString()
      });
      toast.success(`Welcome back, ${data.username}!`);
      setIsLoading(false);
      return true;
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (username, email, password) => {
    setIsLoading(true);
    try {
      const data = await api.register(username, email, password);
      setUser({
        totalQuizzes: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        xp: 0,
        level: 1,
        streak: 0,
        maxStreak: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        bestScore: 0,
        achievements: [],
        ...data,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      });
      toast.success(`Welcome to Quizzy, ${username}!`);
      setIsLoading(false);
      return true;
    } catch (error) {
      toast.error(error.message || 'User already exists');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const updateUserStats = (stats) => {
    if (user) {
      const updatedUser = { ...user, ...stats };
      setUser(updatedUser);

      // Show achievement notifications
      if (stats.achievements && stats.achievements.length > user.achievements.length) {
        const newAchievements = stats.achievements.filter(
          newAch => !user.achievements.find(oldAch => oldAch.id === newAch.id)
        );

        newAchievements.forEach(achievement => {
          toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, {
            duration: 4000,
          });
        });
      }

      // Show level up notification
      if (stats.level && stats.level > user.level) {
        toast.success(`🎉 Level Up! You're now level ${stats.level}!`, {
          duration: 4000,
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      updateUserStats,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}