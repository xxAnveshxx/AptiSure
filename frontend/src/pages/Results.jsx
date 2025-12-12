import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Award, TrendingUp, Home, RotateCcw } from 'lucide-react';
import api from '../utils/api';

function Results() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (location.state?.results) {
      setResults(location.state.results);
      fetchQuestionsWithAnswers();
    } else {
      fetchResults();
    }
  }, [id]);

  const fetchResults = async () => {
    try {
      const response = await api.get(`/results/${id}`);
      setResults(response.data);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Failed to load results.');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsWithAnswers = async () => {
    try {
      const response = await api.get(`/tests/${id}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good Job!';
    if (percentage >= 40) return 'Keep Practicing!';
    return 'Need More Practice';
  };

  const correctCount = results?.breakdown?.filter(b => b.isCorrect).length || results?.score || 0;
  const incorrectCount = (results?.totalMarks || 30) - correctCount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h1>
          <p className="text-gray-600">{results?.testName || 'Mock Test'}</p>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 mb-8">
          <div className="text-center mb-6">
            <div className={`text-7xl font-bold mb-2 ${getScoreColor(results?.percentage || 0)}`}>
              {results?.percentage || 0}%
            </div>
            <p className="text-2xl font-semibold text-gray-900 mb-1">
              {getScoreMessage(results?.percentage || 0)}
            </p>
            <p className="text-gray-600">
              You scored {results?.score || 0} out of {results?.totalMarks || 30}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Correct</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{correctCount}</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-900">Incorrect</span>
              </div>
              <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Accuracy</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{results?.percentage || 0}%</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/test')}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Take Another Test
          </button>
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            {showAnswers ? 'Hide' : 'View'} Solutions
          </button>
        </div>
        {showAnswers && questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Solutions</h2>
            
            {questions.map((question, idx) => {
              const userAnswer = results?.breakdown?.find(b => b.questionId === question._id);
              const isCorrect = userAnswer?.isCorrect || false;
              const selectedOption = userAnswer?.selectedOption;

              return (
                <div key={question._id} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Question {idx + 1}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {question.type}
                      </span>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <p className="text-gray-900 mb-4 text-lg">{question.title}</p>
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optIdx) => {
                      const isUserAnswer = selectedOption === optIdx;
                      const isCorrectAnswer = question.correctOptionIndex === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? 'border-green-500 bg-green-50'
                              : isUserAnswer
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-700">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span className={`flex-1 ${
                              isCorrectAnswer ? 'text-green-900 font-semibold' :
                              isUserAnswer ? 'text-red-900' :
                              'text-gray-700'
                            }`}>
                              {option}
                            </span>
                            {isCorrectAnswer && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {question.solution && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="font-semibold text-blue-900 mb-2">Explanation:</p>
                      <p className="text-blue-800 leading-relaxed">{question.solution}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;