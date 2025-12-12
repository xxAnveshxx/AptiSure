import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle } from 'lucide-react';
import api from '../utils/api';

function TestTaking() {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    fetchTestData();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const fetchTestData = async () => {
    try {
      const response = await api.get(`/tests/${testId}/start`);
      setTest(response.data);
      setTimeLeft(response.data.duration * 60);
    } catch (error) {
      console.error('Error fetching test:', error);
      alert('Failed to load test. Please try again.');
      navigate('/test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmitTest = async () => {
  setSubmitting(true);
  try {
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption
    }));

    const response = await api.post(`/tests/${testId}/submit`, {
      answers: formattedAnswers
    });

    navigate(`/results/${response.data.resultId || testId}`, { 
      state: { results: response.data } 
    });
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Failed to submit test. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{test.title}</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {currentQuestion.type}
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">
                {currentQuestion.title}
              </h3>
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion._id] === index;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion._id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <button
                  onClick={() => {
                    if (isLastQuestion) {
                      setShowConfirmSubmit(true);
                    } else {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-blue-700"
                >
                  {isLastQuestion ? 'Review & Submit' : 'Next'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Question Palette</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {test.questions.map((q, idx) => {
                  const isAnswered = answers[q._id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        isCurrent
                          ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                          : isAnswered
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded"></div>
                  <span className="text-gray-600">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded"></div>
                  <span className="text-gray-600">Not Answered ({test.questions.length - answeredCount})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Test?</h3>
            <p className="text-gray-600 mb-6">
              You have answered {answeredCount} out of {test.questions.length} questions. 
              Are you sure you want to submit?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestTaking;