import { useState } from 'react'
import './ResultsDisplay.css'

function ResultsDisplay({ results, userAnswers, quizData, onStartOver }) {
  const [showReview, setShowReview] = useState(false)

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'excellent'
    if (percentage >= 70) return 'good' 
    if (percentage >= 60) return 'average'
    return 'poor'
  }

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'Outstanding! 🎉'
    if (percentage >= 80) return 'Excellent work! 👏'
    if (percentage >= 70) return 'Good job! 👍'
    if (percentage >= 60) return 'Not bad, keep practicing! 📚'
    return 'Keep learning and try again! 💪'
  }

  return (
    <div className="results-display">
      <div className="results-card card">
        <div className="results-header">
          <h2>Quiz Complete!</h2>
          <div className={`score-circle ${getScoreColor(results.percentage)}`}>
            <div className="score-number">{results.percentage}%</div>
            <div className="score-fraction">
              {results.correct} / {results.total}
            </div>
          </div>
          <p className="score-message">{getScoreMessage(results.percentage)}</p>
        </div>

        <div className="results-stats">
          <div className="stat-item">
            <div className="stat-value">{results.correct}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{results.total - results.correct}</div>
            <div className="stat-label">Incorrect</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{results.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-item">
            <div className={`stat-value ${results.passed ? 'passed' : 'failed'}`}>
              {results.passed ? 'PASS' : 'FAIL'}
            </div>
            <div className="stat-label">Result</div>
          </div>
        </div>

        <div className="results-actions">
          <button 
            className="review-btn secondary"
            onClick={() => setShowReview(!showReview)}
          >
            {showReview ? 'Hide Review' : 'Review Answers'}
          </button>
          <button className="restart-btn" onClick={onStartOver}>
            Create New Quiz
          </button>
        </div>
      </div>

      {showReview && (
        <div className="review-section">
          <h3>Answer Review</h3>
          {quizData.questions.map((question, index) => {
            const userAnswer = userAnswers[question.id]
            const isCorrect = userAnswer === question.correctAnswer
            
            return (
              <div key={question.id} className={`review-item card ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="review-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                
                <h4 className="review-question">{question.question}</h4>
                
                <div className="review-answers">
                  {question.options.map((option, optionIndex) => {
                    let className = 'review-option'
                    
                    if (optionIndex === question.correctAnswer) {
                      className += ' correct-answer'
                    }
                    if (optionIndex === userAnswer && !isCorrect) {
                      className += ' user-wrong-answer'
                    }
                    if (optionIndex === userAnswer && isCorrect) {
                      className += ' user-correct-answer'
                    }
                    
                    return (
                      <div key={optionIndex} className={className}>
                        <span className="option-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="option-text">{option}</span>
                        {optionIndex === question.correctAnswer && (
                          <span className="correct-indicator">✓</span>
                        )}
                        {optionIndex === userAnswer && !isCorrect && (
                          <span className="wrong-indicator">✗</span>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {question.explanation && (
                  <div className="explanation">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ResultsDisplay