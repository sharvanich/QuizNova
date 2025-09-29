import { useState, useEffect, useCallback } from 'react'
import './GeneratedQuiz.css'

function GeneratedQuiz({ quizData, onQuizCompleted, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(null)

  const calculateResults = useCallback(() => {
    let correct = 0
    let total = quizData.questions.length

    quizData.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })

    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
      passed: (correct / total) >= 0.7
    }
  }, [quizData.questions, selectedAnswers])

  // Per-question timer setup - reset timer when question changes
  useEffect(() => {
    if (quizStarted && quizData.timer && quizData.timer > 0) {
      setQuestionTimeRemaining(quizData.timer)
    }
  }, [quizStarted, currentQuestion, quizData.timer])

  // Question timer countdown
  useEffect(() => {
    if (quizStarted && questionTimeRemaining !== null && questionTimeRemaining > 0) {
      const timer = setTimeout(() => setQuestionTimeRemaining(time => time - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [questionTimeRemaining, quizStarted])

  // Auto-advance when timer reaches 0
  useEffect(() => {
    if (questionTimeRemaining === 0 && quizStarted) {
      const timeoutId = setTimeout(() => {
        if (currentQuestion < quizData.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          // Submit quiz when last question times out
          const results = calculateResults()
          onQuizCompleted(selectedAnswers, results)
        }
      }, 100) // Small delay to prevent race conditions
      
      return () => clearTimeout(timeoutId)
    }
  }, [questionTimeRemaining, quizStarted, currentQuestion, quizData.questions.length, selectedAnswers, onQuizCompleted, calculateResults])

  const handleStartQuiz = () => {
    setQuizStarted(true)
    // Initialize per-question timer
    if (quizData.timer && quizData.timer > 0) {
      setQuestionTimeRemaining(quizData.timer)
    } else {
      setQuestionTimeRemaining(null)
    }
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    // Don't allow answer selection if time has run out
    if (questionTimeRemaining === null || questionTimeRemaining > 0) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }))
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      // Reset timer for next question
      if (quizData.timer && quizData.timer > 0) {
        setQuestionTimeRemaining(quizData.timer)
      }
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      // Reset timer for previous question
      if (quizData.timer && quizData.timer > 0) {
        setQuestionTimeRemaining(quizData.timer)
      }
    }
  }

  const handleSubmitQuiz = () => {
    const results = calculateResults()
    onQuizCompleted(selectedAnswers, results)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!quizStarted) {
    return (
      <div className="quiz-preview">
        <div className="preview-card card">
          <div className="preview-header">
            <button className="back-btn" onClick={onBack}>
              ← Back to Generator
            </button>
            <h2>{quizData.title}</h2>
            <div className="quiz-info">
              <span className="info-badge">
                {quizData.questions.length} Questions
              </span>
              <span className="info-badge">
                {quizData.difficulty.charAt(0).toUpperCase() + quizData.difficulty.slice(1)}
              </span>
              <span className="info-badge">
                {(quizData.timer && parseInt(quizData.timer) > 0) 
                  ? `${formatTime(parseInt(quizData.timer) * quizData.questions.length)} Total`
                  : 'No Time Limit'
                }
              </span>
            </div>
          </div>
          
          <div className="preview-content">
            <h3>Ready to start your quiz?</h3>
            <p>
              {quizData.timer && quizData.timer > 0 
                ? `You'll have ${formatTime(quizData.timer * quizData.questions.length)} to complete all questions.`
                : 'Take your time - there\'s no time limit for this quiz.'
              }
            </p>
            <div className="quiz-rules">
              <h4>Quiz Rules:</h4>
              <div className="rules-grid">
                <div className="rule-item">
                  <span className="rule-icon">📖</span>
                  <span className="rule-text">Read each question carefully</span>
                </div>
                <div className="rule-item">
                  <span className="rule-icon">✅</span>
                  <span className="rule-text">Select the best answer for each question</span>
                </div>
                <div className="rule-item">
                  <span className="rule-icon"></span>
                  <span className="rule-text">Submit when you're ready</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="start-quiz-btn" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  const question = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

  return (
    <div className="generated-quiz">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </span>
        </div>
        
        {questionTimeRemaining !== null && (
          <div className={`timer ${questionTimeRemaining <= 10 ? 'timer-warning' : ''} ${questionTimeRemaining <= 5 ? 'timer-critical' : ''}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formatTime(questionTimeRemaining)}</span>
            <span className="timer-label">per question</span>
          </div>
        )}
      </div>

      <div className="question-card card">
        <div className="question-content">
          <h3 className="question-text">{question.question}</h3>
          
          <div className="answer-options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`answer-option ${
                  selectedAnswers[question.id] === index ? 'selected' : ''
                } ${questionTimeRemaining === 0 ? 'disabled' : ''}`}
                onClick={() => handleAnswerSelect(question.id, index)}
                disabled={questionTimeRemaining === 0}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`question-navigation ${(!quizData.timer || quizData.timer === 0) ? '' : 'no-previous'}`}>
          {(!quizData.timer || quizData.timer === 0) && (
            <button 
              className="nav-btn secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
          )}
          
          <span className="question-indicator">
            {currentQuestion + 1} / {quizData.questions.length}
          </span>
          
          {currentQuestion === quizData.questions.length - 1 ? (
            <button 
              className="nav-btn submit"
              onClick={handleSubmitQuiz}
              disabled={!selectedAnswers[question.id] && selectedAnswers[question.id] !== 0}
            >
              Submit Quiz
            </button>
          ) : (
            <button 
              className="nav-btn primary"
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[question.id] && selectedAnswers[question.id] !== 0}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GeneratedQuiz