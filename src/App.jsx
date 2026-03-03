import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { EnhancedQuizConfig } from './components/enhanced/EnhancedQuizConfig';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { ScoreHistory } from './components/ScoreHistory';
import { UserProfile } from './components/profile/UserProfile';
import { Header } from './components/layout/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ThemeToggle } from './components/ThemeToggle';
import { fetchQuestions } from './services/triviaAPI';
import { api } from './services/api';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';

function AppContent() {
  const { user, updateUserStats } = useAuth();
  const [state, setState] = useState('dashboard');
  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [scoreHistory, setScoreHistory] = useLocalStorage('quizzy-scores', []);
  const [isDark, setIsDark] = useDarkMode();

  if (!user) {
    return <AuthPage />;
  }

  const handleStartQuiz = async (quizConfig) => {
    if (quizConfig) {
      setConfig(quizConfig);
      setState('loading');

      try {
        const fetchedQuestions = await fetchQuestions(quizConfig);
        setQuestions(fetchedQuestions);
        setState('quiz');
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        alert('Failed to load questions. Please try again with different settings.');
        setState('config');
      }
    } else {
      setState('config');
    }
  };

  const handleQuizComplete = (score, answers, timeElapsed) => {
    const percentage = Math.round((score / questions.length) * 100);
    const result = {
      id: Math.random().toString(36).substr(2, 9),
      score,
      total: questions.length,
      percentage,
      time: timeElapsed,
      config: config,
      date: new Date().toISOString(),
      xpEarned: score * 10,
      perfectAnswers: score,
      streak: 1,
      mode: config?.mode || 'classic',
      answers: answers.map((answer, index) => ({
        questionId: questions[index].id || index.toString(),
        userAnswer: answer,
        correctAnswer: questions[index].correct_answer,
        isCorrect: answer === questions[index].correct_answer,
        timeSpent: Math.round(timeElapsed / questions.length),
        points: answer === questions[index].correct_answer ? 10 : 0
      }))
    };

    // Update user statistics
    updateUserStats({
      totalQuizzes: user.totalQuizzes + 1,
      totalCorrect: user.totalCorrect + score,
      totalQuestions: user.totalQuestions + questions.length,
      xp: user.xp + result.xpEarned,
      level: Math.floor((user.xp + result.xpEarned) / 1000) + 1,
      streak: percentage === 100 ? user.streak + 1 : 0,
      maxStreak: Math.max(user.maxStreak, percentage === 100 ? user.streak + 1 : user.streak),
      lastActive: new Date().toISOString(),
      totalTimeSpent: (user.totalTimeSpent || 0) + timeElapsed,
      averageScore: Math.round(((user.averageScore || 0) * user.totalQuizzes + percentage) / (user.totalQuizzes + 1)),
      bestScore: Math.max(user.bestScore || 0, percentage),
      achievements: updateAchievements(user, result)
    });

    // Update backend score
    api.submitScore({
      category: config.category,
      score: score,
      total: questions.length,
      percentage: percentage,
      time: timeElapsed,
      difficulty: config.difficulty || 'mixed'
    }).catch(err => console.error('Score submission failed:', err));

    setResults(result);
    setUserAnswers(answers);
    setScoreHistory(prev => [...prev, result]);
    setState('results');
  };

  const updateAchievements = (currentUser, result) => {
    const newAchievements = [...currentUser.achievements];

    // First quiz achievement
    if (currentUser.totalQuizzes === 0) {
      newAchievements.push({
        id: 'first-quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🎯',
        unlockedAt: new Date().toISOString(),
        rarity: 'common'
      });
    }

    // Perfect score achievement
    if (result.percentage === 100 && !newAchievements.find(a => a.id === 'perfect-score')) {
      newAchievements.push({
        id: 'perfect-score',
        name: 'Perfectionist',
        description: 'Get 100% on any quiz',
        icon: '⭐',
        unlockedAt: new Date().toISOString(),
        rarity: 'epic'
      });
    }

    // Quiz master achievement (10 quizzes)
    if (currentUser.totalQuizzes + 1 === 10) {
      newAchievements.push({
        id: 'quiz-master',
        name: 'Quiz Master',
        description: 'Complete 10 quizzes',
        icon: '🏆',
        unlockedAt: new Date().toISOString(),
        rarity: 'rare'
      });
    }

    // Speed demon achievement (fast completion)
    const avgTimePerQuestion = result.time / result.total;
    if (avgTimePerQuestion < 10 && !newAchievements.find(a => a.id === 'speed-demon')) {
      newAchievements.push({
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete a quiz with average time under 10 seconds per question',
        icon: '⚡',
        unlockedAt: new Date().toISOString(),
        rarity: 'rare'
      });
    }

    return newAchievements;
  };

  const handleRestart = () => {
    setConfig(null);
    setQuestions([]);
    setResults(null);
    setUserAnswers([]);
    setState('dashboard');
  };

  const handleShowHistory = async () => {
    try {
      const data = await api.getMyScores();
      setScoreHistory(data);
      setState('history');
    } catch (error) {
      console.error('Failed to fetch score history:', error);
      setState('history'); // Still show page, but maybe with error
    }
  };

  const handleBackToDashboard = () => {
    setState('dashboard');
  };

  const handleShowProfile = () => {
    setState('profile');
  };

  const handleShowSettings = () => {
    // Settings functionality can be added here
    console.log('Settings clicked');
  };

  return (
    <div className="relative min-h-screen">
      {/* Header - only show when logged in and not in auth flow */}
      {user && state !== 'loading' && (
        <Header
          onProfileClick={handleShowProfile}
          onSettingsClick={handleShowSettings}
        />
      )}

      {/* Theme Toggle - positioned differently when header is present */}
      {!user && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
      )}

      {/* Main Content */}
      <main className={user ? 'pt-0' : ''}>
        {state === 'dashboard' && (
          <Dashboard
            onStartQuiz={() => handleStartQuiz()}
            onViewHistory={handleShowHistory}
            onViewLeaderboard={() => console.log('Leaderboard')}
          />
        )}

        {state === 'config' && (
          <EnhancedQuizConfig
            onStartQuiz={handleStartQuiz}
            onShowHistory={handleShowHistory}
            onShowDashboard={handleBackToDashboard}
          />
        )}

        {state === 'loading' && (
          <LoadingSpinner message="Loading your quiz questions..." />
        )}

        {state === 'quiz' && questions.length > 0 && (
          <Quiz
            questions={questions}
            onComplete={handleQuizComplete}
            timeLimit={questions.length * (config?.timeLimit || 30)}
          />
        )}

        {state === 'results' && results && (
          <Results
            result={results}
            questions={questions}
            userAnswers={userAnswers}
            onRestart={handleRestart}
            onShowHistory={handleShowHistory}
          />
        )}

        {state === 'history' && (
          <ScoreHistory
            history={scoreHistory}
            onBack={handleBackToDashboard}
          />
        )}

        {state === 'profile' && (
          <UserProfile onBack={handleBackToDashboard} />
        )}
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#374151' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            border: isDark ? '1px solid #4B5563' : '1px solid #E5E7EB',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;