import { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Sparkles } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { TOPICS } from '../config/topics';
import api from '../utils/api';

function Practice() {
  const [mode, setMode] = useState('random');
  const [selectedTopic, setSelectedTopic] = useState('Mixed Practice');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Any');
  const [easyCount, setEasyCount] = useState(5);
  const [mediumCount, setMediumCount] = useState(3);
  const [hardCount, setHardCount] = useState(2);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = selectedTopic !== 'Mixed Practice' && TOPICS[selectedTopic] 
    ? Object.keys(TOPICS[selectedTopic]) 
    : [];
  const subtopics = selectedCategory && TOPICS[selectedTopic]?.[selectedCategory] 
    ? TOPICS[selectedTopic][selectedCategory] 
    : [];

  const fetchRandomQuestion = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTopic !== 'Mixed Practice') params.append('type', selectedTopic);
      if (selectedSubtopic) params.append('subtopic', selectedSubtopic);
      if (selectedDifficulty !== 'Any') params.append('difficulty', selectedDifficulty);

      const response = await api.get(`/questions/random?${params}`);
      setCurrentQuestion(response.data);
      setShowResult(false);
      setResult(null);
    } catch (error) {
      console.error('Error fetching question:', error);
      setCurrentQuestion({
        _id: '1',
        title: 'If 40% of a number is 80, what is 25% of that number?',
        options: ['50', '40', '60', '45'],
        correctOptionIndex: 0,
        solution: 'Let the number be x. Then 0.40x = 80, so x = 200. Therefore 25% of 200 = 50.',
        difficulty: 'Easy',
        type: 'Quants',
        tags: ['Quants', 'Arithmetic', 'Percentages']
      });
      setShowResult(false);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const generateQuestionSet = async () => {
    setLoading(true);
    try {
      const response = await api.post('/questions/generate-set', {
        topic: selectedTopic === 'Mixed Practice' ? null : selectedSubtopic || selectedTopic,
        counts: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount
        }
      });
      setGeneratedQuestions(response.data.questions);
      setCurrentIndex(0);
      setShowResult(false);
      setResult(null);
    } catch (error) {
      console.error('Error generating questions:', error);
      setGeneratedQuestions([
        {
          _id: '1',
          title: 'What is 15% of 200?',
          options: ['30', '25', '35', '20'],
          correctOptionIndex: 0,
          solution: '15% of 200 = (15/100) × 200 = 30',
          difficulty: 'Easy',
          type: 'Quants'
        },
        {
          _id: '2',
          title: 'If A can do a work in 10 days and B in 15 days, in how many days can they do it together?',
          options: ['6 days', '5 days', '7 days', '8 days'],
          correctOptionIndex: 0,
          solution: 'Work done by A in 1 day = 1/10. Work done by B in 1 day = 1/15. Together = 1/10 + 1/15 = 1/6. So 6 days.',
          difficulty: 'Medium',
          type: 'Quants'
        }
      ]);
      setCurrentIndex(0);
      setShowResult(false);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (selectedOption) => {
    try {
      const questionId = mode === 'random' ? currentQuestion._id : generatedQuestions[currentIndex]._id;
      
      const response = await api.post('/attempts', {
        questionId,
        selectedOption,
        mode: 'practice'
      });

      setResult(response.data);
      setShowResult(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
      const question = mode === 'random' ? currentQuestion : generatedQuestions[currentIndex];
      const isCorrect = selectedOption === question.correctOptionIndex;
      setResult({
        isCorrect,
        correctOptionIndex: question.correctOptionIndex,
        solution: question.solution
      });
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (mode === 'random') {
      fetchRandomQuestion();
    } else {
      if (currentIndex < generatedQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowResult(false);
        setResult(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Mode</h1>
          <p className="text-gray-600">Choose your practice style and start learning</p>
        </div>
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit">
          <button
            onClick={() => setMode('random')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'random' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Random Mode
          </button>
          <button
            onClick={() => setMode('generate')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'generate' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Generate Set
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {mode === 'random' ? 'Filters' : 'Configuration'}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value);
                    setSelectedCategory('');
                    setSelectedSubtopic('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(TOPICS).map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              {categories.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubtopic('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}
              {subtopics.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtopic</label>
                  <select
                    value={selectedSubtopic}
                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Subtopics</option>
                    {subtopics.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              {mode === 'random' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Any">Any</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <button
                    onClick={fetchRandomQuestion}
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Get Random Question
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Easy</label>
                        <span className="text-sm font-semibold text-green-600">{easyCount}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={easyCount}
                        onChange={(e) => setEasyCount(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Medium</label>
                        <span className="text-sm font-semibold text-yellow-600">{mediumCount}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={mediumCount}
                        onChange={(e) => setMediumCount(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Hard</label>
                        <span className="text-sm font-semibold text-red-600">{hardCount}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={hardCount}
                        onChange={(e) => setHardCount(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-900">
                      Total: <span className="font-bold">{easyCount + mediumCount + hardCount}</span> questions
                    </p>
                  </div>

                  <button
                    onClick={generateQuestionSet}
                    disabled={loading || (easyCount + mediumCount + hardCount === 0)}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        Generate Practice Set
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            {mode === 'random' ? (
              currentQuestion ? (
                <>
                  <QuestionCard
                    question={currentQuestion}
                    onSubmit={handleSubmitAnswer}
                    showResult={showResult}
                    result={result}
                  />
                  {showResult && (
                    <button
                      onClick={handleNext}
                      className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      Next Question
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl p-12 shadow-md border border-gray-100 text-center">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Click "Get Random Question" to start practicing</p>
                </div>
              )
            ) : (
              generatedQuestions.length > 0 ? (
                <>
                  <div className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Question {currentIndex + 1} of {generatedQuestions.length}
                      </span>
                      <div className="flex gap-1">
                        {generatedQuestions.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === currentIndex ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <QuestionCard
                    question={generatedQuestions[currentIndex]}
                    onSubmit={handleSubmitAnswer}
                    showResult={showResult}
                    result={result}
                  />

                  {showResult && currentIndex < generatedQuestions.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      Next Question
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {showResult && currentIndex === generatedQuestions.length - 1 && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <h3 className="text-xl font-bold text-green-900 mb-2">Practice Set Complete! 🎉</h3>
                      <p className="text-green-700">You've completed all questions in this set.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl p-12 shadow-md border border-gray-100 text-center">
                  <RefreshCw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Configure your practice set and click "Generate"</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Practice;