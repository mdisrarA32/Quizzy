const BASE_URL = 'https://opentdb.com/api.php';

export async function fetchQuestions(config) {
  const params = new URLSearchParams({
    amount: config.amount.toString(),
  });

  if (config.category) params.append('category', config.category);
  if (config.difficulty) params.append('difficulty', config.difficulty);
  if (config.type) params.append('type', config.type);

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error('No questions available for this configuration');
    }

    return data.results.map((question) => {
      const answers = [...question.incorrect_answers, question.correct_answer];
      const shuffledAnswers = shuffleArray(answers);
      
      return {
        ...question,
        question: decodeHTMLEntities(question.question),
        correct_answer: decodeHTMLEntities(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(decodeHTMLEntities),
        answers: shuffledAnswers.map(decodeHTMLEntities),
        correct_index: shuffledAnswers.findIndex(answer => answer === question.correct_answer),
      };
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}