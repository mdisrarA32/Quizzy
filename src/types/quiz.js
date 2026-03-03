export const QUIZ_CATEGORIES = [
  { id: '', name: 'Any Category', icon: '🎯' },
  { id: '9', name: 'General Knowledge', icon: '🧠' },
  { id: '10', name: 'Entertainment: Books', icon: '📚' },
  { id: '11', name: 'Entertainment: Film', icon: '🎬' },
  { id: '12', name: 'Entertainment: Music', icon: '🎵' },
  { id: '13', name: 'Entertainment: Musicals & Theatres', icon: '🎭' },
  { id: '14', name: 'Entertainment: Television', icon: '📺' },
  { id: '15', name: 'Entertainment: Video Games', icon: '🎮' },
  { id: '16', name: 'Entertainment: Board Games', icon: '🎲' },
  { id: '17', name: 'Science & Nature', icon: '🔬' },
  { id: '18', name: 'Science: Computers', icon: '💻' },
  { id: '19', name: 'Science: Mathematics', icon: '🔢' },
  { id: '20', name: 'Mythology', icon: '⚡' },
  { id: '21', name: 'Sports', icon: '⚽' },
  { id: '22', name: 'Geography', icon: '🌍' },
  { id: '23', name: 'History', icon: '🏛️' },
  { id: '24', name: 'Politics', icon: '🏛️' },
  { id: '25', name: 'Art', icon: '🎨' },
  { id: '26', name: 'Celebrities', icon: '⭐' },
  { id: '27', name: 'Animals', icon: '🐾' },
  { id: '28', name: 'Vehicles', icon: '🚗' },
];

export const DIFFICULTIES = [
  { value: '', label: 'Any Difficulty', color: 'gray', multiplier: 1 },
  { value: 'easy', label: 'Easy', color: 'green', multiplier: 1 },
  { value: 'medium', label: 'Medium', color: 'yellow', multiplier: 1.5 },
  { value: 'hard', label: 'Hard', color: 'red', multiplier: 2 },
];

export const QUESTION_TYPES = [
  { value: '', label: 'Any Type' },
  { value: 'multiple', label: 'Multiple Choice' },
  { value: 'boolean', label: 'True / False' },
];

export const QUIZ_MODES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional quiz with timer',
    icon: '🎯',
    color: 'blue'
  },
  {
    id: 'survival',
    name: 'Survival',
    description: 'One wrong answer ends the game',
    icon: '💀',
    color: 'red'
  },
  {
    id: 'blitz',
    name: 'Blitz',
    description: 'Fast-paced with bonus points',
    icon: '⚡',
    color: 'yellow'
  },
  {
    id: 'challenge',
    name: 'Daily Challenge',
    description: 'Special daily quiz',
    icon: '🏆',
    color: 'purple'
  }
];