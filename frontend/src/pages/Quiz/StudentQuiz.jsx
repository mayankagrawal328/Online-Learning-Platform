import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatTime } from '../../utils/timeUtils';
import Confetti from 'react-confetti';

const StudentQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  // Quiz state
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // New state for quiz start

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Replace with actual API call
        const mockQuiz = {
          id: quizId,
          title: "JavaScript Fundamentals Quiz",
          description: "Test your knowledge of core JavaScript concepts",
          duration: 30,
          questions: [
            {
              id: "q1",
              text: "What is the capital of France?",
              options: ["London", "Paris", "Berlin", "Madrid"],
              correctAnswer: 1,
              explanation: "Paris is the capital and most populous city of France."
            },
            {
              id: "q2",
              text: "Which of these is not a JavaScript framework?",
              options: ["React", "Angular", "Laravel", "Vue"],
              correctAnswer: 2,
              explanation: "Laravel is a PHP framework, not a JavaScript framework."
            },
            {
              id: "q3",
              text: "What does 'DOM' stand for in web development?",
              options: [
                "Document Object Model",
                "Data Object Management",
                "Digital Output Module",
                "Display Object Matrix"
              ],
              correctAnswer: 0,
              explanation: "DOM stands for Document Object Model, which represents the page so programs can change the document structure, style, and content."
            }
          ],
          dueAt: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        };
        
        setQuiz(mockQuiz);
        setTimeLeft(mockQuiz.duration * 60); // Convert to seconds
        setLoading(false);
      } catch (err) {
        setError("Failed to load quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer effect - only runs when quiz is started and not submitted
  useEffect(() => {
    if (!quiz || !quizStarted || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, quizStarted, submitted]);

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerIndex) => {
    if (submitted || !quizStarted) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  // Calculate score and results
  const calculateResults = () => {
    if (!quiz) return { score: 0, correctCount: 0, totalQuestions: 0 };
    
    let correctCount = 0;
    const results = quiz.questions.map(question => {
      const isCorrect = answers[question.id] === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        ...question,
        userAnswer: answers[question.id],
        isCorrect
      };
    });
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    return { score, correctCount, totalQuestions: quiz.questions.length, results };
  };

  // Submit quiz
  const handleSubmit = () => {
    if (submitted) return;
    
    const { score } = calculateResults();
    setScore(score);
    setSubmitted(true);
    setQuizStarted(false); // Stop the quiz
    
    if (score >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Loading and error states
  if (loading) return (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A1E4] mx-auto mb-4"></div>
      <p>Loading quiz...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-20">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <p className="text-red-500 text-xl mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-[#00A1E4] text-white px-6 py-2 rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
  
  if (!quiz) return (
    <div className="text-center py-20">
      <div className="text-4xl mb-4">🔍</div>
      <p className="text-xl mb-4">Quiz not found</p>
      <button 
        onClick={() => navigate('/quizzes')}
        className="bg-[#00A1E4] text-white px-6 py-2 rounded-lg"
      >
        Back to Quizzes
      </button>
    </div>
  );

  const { correctCount, totalQuestions, results } = calculateResults();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-richblack-800 text-richblack-5 rounded-lg shadow-lg">
      {/* Confetti for high scores */}
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Quiz header - shown in all states */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-richblack-300">{quiz.description}</p>
        </div>
        {quizStarted && !submitted && (
          <div className="bg-richblack-700 px-4 py-2 rounded-lg">
            <div className="text-lg font-semibold text-center">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-richblack-300">Time remaining</div>
          </div>
        )}
      </div>

      {/* Quiz start screen - shown before quiz starts */}
      {!quizStarted && !submitted && (
        <div className="bg-richblack-700 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Quiz Instructions</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="bg-richblack-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">ℹ️</div>
              <p>This quiz contains {quiz.questions.length} questions.</p>
            </div>
            <div className="flex items-start">
              <div className="bg-richblack-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">⏱️</div>
              <p>You have {quiz.duration} minutes to complete the quiz.</p>
            </div>
            <div className="flex items-start">
              <div className="bg-richblack-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">⚠️</div>
              <p>Once started, the timer cannot be paused.</p>
            </div>
            <div className="flex items-start">
              <div className="bg-richblack-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">📝</div>
              <p>You can review your answers before submitting.</p>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="bg-[#00A1E4] hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-all"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* Quiz questions - shown when quiz is started but not submitted */}
      {quizStarted && !submitted && (
        <>
          <div className="space-y-4 mb-8">
            {quiz.questions.map((question, index) => (
              <div 
                key={question.id}
                className="p-4 md:p-6 rounded-lg border border-richblack-700 bg-richblack-700"
              >
                <div className="flex items-start mb-4">
                  <span className="font-bold mr-2">{index + 1}.</span>
                  <h3 className="text-lg font-medium">{question.text}</h3>
                </div>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        answers[question.id] === optionIndex
                          ? 'bg-[#00A1E4] text-white'
                          : 'bg-richblack-600 hover:bg-richblack-500'
                      }`}
                      onClick={() => handleAnswerSelect(question.id, optionIndex)}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-white mr-3 flex-shrink-0 flex items-center justify-center">
                        {answers[question.id] === optionIndex && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>{option}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submission button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < quiz.questions.length}
              className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
                Object.keys(answers).length < quiz.questions.length
                  ? 'bg-richblack-500 cursor-not-allowed'
                  : 'bg-[#2EC4B6] hover:bg-teal-500'
              }`}
            >
              Submit Quiz
            </button>
          </div>
        </>
      )}

      {/* Results - shown after submission */}
      {submitted && (
        <>
          <div className="text-center p-6 bg-richblack-700 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {score >= 70 ? "🎉 Great Job!" : score >= 50 ? "👍 Good Effort" : "📚 Keep Learning"}
            </h2>
            <div className="flex justify-center items-center mb-4">
              <div 
                className="radial-progress text-4xl font-bold"
                style={{
                  '--value': score,
                  '--size': '8rem',
                  '--thickness': '8px',
                  color: score >= 80 ? '#00A1E4' : score >= 50 ? '#FFD700' : '#FF6347'
                }}
              >
                {score}%
              </div>
            </div>
            <p className="text-lg mb-4">
              You answered {correctCount} out of {totalQuestions} questions correctly
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setShowReview(!showReview)}
                className="bg-richblack-600 hover:bg-richblack-500 text-white px-6 py-2 rounded-lg"
              >
                {showReview ? 'Hide Review' : 'Review Answers'}
              </button>
              <button
                onClick={() => navigate('/dashboard/student')}
                className="bg-[#00A1E4] hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Back to Quizzes
              </button>
            </div>
          </div>

          {/* Detailed review */}
          {showReview && (
            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Detailed Review</h3>
              {results.map((question, index) => (
                <div 
                  key={question.id}
                  className={`p-6 rounded-lg border ${
                    question.isCorrect 
                      ? 'border-green-500 bg-green-900/10' 
                      : 'border-red-500 bg-red-900/10'
                  }`}
                >
                  <div className="flex items-start mb-4">
                    <span className="font-bold mr-2">{index + 1}.</span>
                    <h3 className="text-lg font-medium">{question.text}</h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`flex items-center p-3 rounded-lg ${
                          optionIndex === question.correctAnswer
                            ? 'bg-green-600/80 text-white'
                            : optionIndex === question.userAnswer
                              ? 'bg-red-600/80 text-white'
                              : 'bg-richblack-600'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-white mr-3 flex-shrink-0 flex items-center justify-center">
                          {optionIndex === question.correctAnswer && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                          {optionIndex === question.userAnswer && optionIndex !== question.correctAnswer && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>{option}</div>
                      </div>
                    ))}
                  </div>
                  
                  {!question.isCorrect && (
                    <div className="mt-3 p-3 bg-richblack-700 rounded-lg">
                      <p className="font-semibold text-green-400 mb-1">Correct Answer:</p>
                      <p>{question.options[question.correctAnswer]}</p>
                      {question.explanation && (
                        <>
                          <p className="font-semibold text-blue-400 mt-2 mb-1">Explanation:</p>
                          <p className="text-richblack-200">{question.explanation}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentQuiz;