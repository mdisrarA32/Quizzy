import React, { useState, useEffect, useCallback } from 'react';
import { Clock, HelpCircle, ChevronRight } from 'lucide-react';

export function Quiz({ questions, onComplete, timeLimit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [startTime] = useState(Date.now());
  const [isAnswered, setIsAnswered] = useState(false);

  const handleComplete = useCallback(() => {
    const score = userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correct_answer ? 1 : 0);
    }, 0);
    
    const timeElapsed = Math.round((Date.now() - startTime) / 1000);
    onComplete(score, userAnswers, timeElapsed);
  }, [userAnswers, questions, onComplete, startTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleComplete]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  const handleNext = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      handleComplete();
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(userAnswers[currentQuestion + 1] || '');
      setIsAnswered(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-purple-500" />
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
          <div className="mb-8">
            <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {currentQ.category} • {currentQ.difficulty}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQ.answers?.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(answer)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                  selectedAnswer === answer
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                disabled={!selectedAnswer && isAnswered}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    selectedAnswer === answer
                      ? 'border-white bg-white text-purple-500'
                      : 'border-gray-400 dark:border-gray-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{answer}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}