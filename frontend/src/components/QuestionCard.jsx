import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

function QuestionCard({ question, onSubmit, showResult, result }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onSubmit(selectedOption);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
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
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {question.title}
        </h3>
      </div>
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = showResult && index === question.correctOptionIndex;
          const isWrong = showResult && isSelected && index !== question.correctOptionIndex;

          return (
            <button
              key={index}
              onClick={() => !showResult && setSelectedOption(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : isWrong
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                  : isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-500'
                        : isWrong
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                      : isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                    {showResult && isWrong && <XCircle className="w-4 h-4 text-white" />}
                    {!showResult && isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-gray-900">{option}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {!showResult && (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}
      {showResult && result && (
        <div className={`mt-6 p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.isCorrect ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-900">Incorrect</span>
              </>
            )}
          </div>
          {question.solution && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">Explanation:</p>
              <p className="text-sm text-gray-600 leading-relaxed">{question.solution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default QuestionCard;