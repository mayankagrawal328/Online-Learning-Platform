import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TeacherQuiz = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('create');
  
  // Quiz form state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDuration, setQuizDuration] = useState(30);
  const [scheduledDate, setScheduledDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState([{ 
    id: uuidv4(),
    text: '', 
    options: ['', '', '', ''], 
    correctAnswer: 0 
  }]);
  
  // Quiz management state
  const [quizzes, setQuizzes] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Helper function to validate quiz
  const validateQuiz = () => {
    const newErrors = {};
    
    if (!quizTitle.trim()) newErrors.quizTitle = 'Quiz title is required';
    if (quizDuration < 1) newErrors.quizDuration = 'Duration must be at least 1 minute';
    if (!scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (new Date(dueDate) <= new Date(scheduledDate)) {
      newErrors.dueDate = 'Due date must be after scheduled date';
    }
    
    questions.forEach((q, qIndex) => {
      if (!q.text.trim()) newErrors[`question-${qIndex}`] = 'Question text is required';
      
      q.options.forEach((opt, oIndex) => {
        if (!opt.trim()) newErrors[`option-${qIndex}-${oIndex}`] = 'Option cannot be empty';
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Question handlers
  const handleAddQuestion = () => {
    setQuestions([
      ...questions, 
      { 
        id: uuidv4(),
        text: '', 
        options: ['', '', '', ''], 
        correctAnswer: 0 
      }
    ]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleOptionChange = (qId, oIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[oIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleCorrectAnswerChange = (qId, oIndex) => {
    setQuestions(questions.map(q => 
      q.id === qId ? { ...q, correctAnswer: oIndex } : q
    ));
  };

  // Quiz submission
  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    
    if (!validateQuiz()) return;
    
    const newQuiz = {
      id: uuidv4(),
      title: quizTitle,
      description: quizDescription,
      duration: quizDuration,
      questions: questions.filter(q => q.text.trim() !== ''),
      scheduledAt: scheduledDate,
      dueAt: dueDate,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    setQuizzes([...quizzes, newQuiz]);
    resetForm();
    setSuccessMessage('Quiz created successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const resetForm = () => {
    setQuizTitle('');
    setQuizDescription('');
    setQuizDuration(30);
    setScheduledDate('');
    setDueDate('');
    setQuestions([{ 
      id: uuidv4(),
      text: '', 
      options: ['', '', '', ''], 
      correctAnswer: 0 
    }]);
    setErrors({});
  };

  // Quiz management actions
  const handlePublishQuiz = (quizId) => {
    setQuizzes(quizzes.map(q => 
      q.id === quizId ? { ...q, status: 'published' } : q
    ));
    setSuccessMessage('Quiz published to students!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8 text-richblack-5 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-richblack-5">Quiz Management</h1>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-600 text-white rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-richblack-700 mb-6">
        {['create', 'manage'].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium transition-all duration-300 ${
              activeTab === tab
                ? 'text-[#00A1E4] border-b-2 border-[#00A1E4]'
                : 'text-richblack-300 hover:text-[#00A1E4]'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'create' ? 'Create New Quiz' : 'Manage Quizzes'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'create' ? (
        <div className="bg-richblack-800 rounded-lg shadow-lg p-6 border border-richblack-700">
          <h2 className="text-xl font-semibold mb-6 text-richblack-5">Create New Quiz</h2>

          {/* Form */}
          <form onSubmit={handleSubmitQuiz}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Quiz Title */}
              <div>
                <label className="block text-richblack-300 mb-2">Quiz Title *</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.quizTitle ? 'border-red-500' : 'border-richblack-700'
                  } bg-richblack-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4]`}
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                />
                {errors.quizTitle && (
                  <p className="text-red-400 text-sm mt-1">{errors.quizTitle}</p>
                )}
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-richblack-300 mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  min="1"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.quizDuration ? 'border-red-500' : 'border-richblack-700'
                  } bg-richblack-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4]`}
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(Math.max(1, e.target.value))}
                />
                {errors.quizDuration && (
                  <p className="text-red-400 text-sm mt-1">{errors.quizDuration}</p>
                )}
              </div>
              
              {/* Scheduled Date */}
              <div>
                <label className="block text-richblack-300 mb-2">Scheduled Date *</label>
                <input
                  type="datetime-local"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.scheduledDate ? 'border-red-500' : 'border-richblack-700'
                  } bg-richblack-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4]`}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
                {errors.scheduledDate && (
                  <p className="text-red-400 text-sm mt-1">{errors.scheduledDate}</p>
                )}
              </div>
              
              {/* Due Date */}
              <div>
                <label className="block text-richblack-300 mb-2">Due Date *</label>
                <input
                  type="datetime-local"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.dueDate ? 'border-red-500' : 'border-richblack-700'
                  } bg-richblack-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4]`}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={scheduledDate}
                />
                {errors.dueDate && (
                  <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-richblack-300 mb-2">Quiz Description</label>
              <textarea
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-richblack-700 bg-richblack-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
              />
            </div>

            {/* Questions */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-richblack-5">Questions *</h3>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="bg-[#2EC4B6] hover:bg-teal-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Add Question
                </button>
              </div>

              {/* Question List */}
              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={question.id} className="p-4 rounded-lg border border-richblack-700 bg-richblack-700">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium text-richblack-5">Question {qIndex + 1}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(question.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Question Text */}
                    <div className="mb-4">
                      <label className="block text-richblack-300 mb-2">Question Text *</label>
                      <input
                        type="text"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[`question-${qIndex}`] ? 'border-red-500' : 'border-richblack-600'
                        } bg-richblack-800 text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4]`}
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                      />
                      {errors[`question-${qIndex}`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`question-${qIndex}`]}</p>
                      )}
                    </div>

                    {/* Options */}
                    <div>
                      <label className="block text-richblack-300 mb-2">Options *</label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correctAnswer-${question.id}`}
                              className="accent-[#00A1E4]"
                              checked={question.correctAnswer === oIndex}
                              onChange={() => handleCorrectAnswerChange(question.id, oIndex)}
                            />
                            <input
                              type="text"
                              className={`flex-1 px-4 py-2 rounded-lg border ${
                                errors[`option-${qIndex}-${oIndex}`] ? 'border-red-500' : 'border-richblack-600'
                              } bg-richblack-800 text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4]`}
                              value={option}
                              onChange={(e) => handleOptionChange(question.id, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                            />
                            {errors[`option-${qIndex}-${oIndex}`] && (
                              <p className="text-red-400 text-sm ml-2">{errors[`option-${qIndex}-${oIndex}`]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="bg-richblack-600 hover:bg-richblack-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="bg-[#00A1E4] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-richblack-800 rounded-lg shadow-lg p-6 border border-richblack-700">
          <h2 className="text-xl font-semibold mb-6 text-richblack-5">Manage Existing Quizzes</h2>
          
          {quizzes.length === 0 ? (
            <p className="text-richblack-300">No quizzes created yet.</p>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="border border-richblack-600 p-4 rounded-lg bg-richblack-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-richblack-5">{quiz.title}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        quiz.status === 'published' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {quiz.status}
                      </span>
                    </div>
                    <div className="space-x-2">
                      {quiz.status !== 'published' && (
                        <button
                          onClick={() => handlePublishQuiz(quiz.id)}
                          className="bg-[#00A1E4] hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-richblack-300 mb-2">{quiz.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-richblack-400">
                    <p>Duration: {quiz.duration} min</p>
                    <p>Scheduled: {formatDate(quiz.scheduledAt)}</p>
                    <p>Due: {formatDate(quiz.dueAt)}</p>
                  </div>
                  {quiz.questions.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-sm text-[#00A1E4] cursor-pointer">
                        View Questions ({quiz.questions.length})
                      </summary>
                      <div className="mt-2 space-y-3 pl-4">
                        {quiz.questions.map((q, idx) => (
                          <div key={idx} className="border-l-2 border-richblack-500 pl-3">
                            <p className="font-medium text-richblack-100">{q.text}</p>
                            <ul className="list-disc pl-5 text-richblack-300">
                              {q.options.map((opt, optIdx) => (
                                <li key={optIdx} className={optIdx === q.correctAnswer ? 'text-green-400' : ''}>
                                  {opt} {optIdx === q.correctAnswer && '(Correct)'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherQuiz;