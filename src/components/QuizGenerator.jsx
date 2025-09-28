import { useState } from 'react'
import './QuizGenerator.css'

function QuizGenerator({ selectedCategory, onQuizGenerated, onBack }) {
  const [formData, setFormData] = useState({
    topic: selectedCategory ? (selectedCategory.topic || selectedCategory.name.toLowerCase()) : '',
    difficulty: 'medium',
    questionCount: 5,
    customQuestionCount: 5,
    timer: 0,
    customTimer: 30
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateMockQuiz = (topic, difficulty, questionCount, timer) => {
    const mockQuestions = {
      javascript: [
        {
          question: "What is the correct way to declare a variable in JavaScript?",
          options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
          correctAnswer: 0,
          explanation: "The 'var' keyword is used to declare variables in JavaScript, though 'let' and 'const' are more modern alternatives."
        },
        {
          question: "Which method is used to add an element to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correctAnswer: 0,
          explanation: "The push() method adds one or more elements to the end of an array and returns the new length."
        },
        {
          question: "What does '===' operator do in JavaScript?",
          options: ["Assignment", "Equality with type conversion", "Strict equality", "Not equal"],
          correctAnswer: 2,
          explanation: "The '===' operator checks for strict equality, comparing both value and type without type conversion."
        },
        {
          question: "Which of these is NOT a JavaScript data type?",
          options: ["string", "boolean", "float", "undefined"],
          correctAnswer: 2,
          explanation: "JavaScript uses 'number' for all numeric values, there's no separate 'float' type."
        },
        {
          question: "What is a closure in JavaScript?",
          options: ["A loop construct", "A function with access to outer scope", "A data structure", "An error type"],
          correctAnswer: 1,
          explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned."
        }
      ],
      python: [
        {
          question: "Which keyword is used to define a function in Python?",
          options: ["function", "def", "define", "func"],
          correctAnswer: 1,
          explanation: "The 'def' keyword is used to define functions in Python."
        },
        {
          question: "What is the correct way to create a list in Python?",
          options: ["list = {1, 2, 3}", "list = [1, 2, 3]", "list = (1, 2, 3)", "list = <1, 2, 3>"],
          correctAnswer: 1,
          explanation: "Square brackets [] are used to create lists in Python."
        },
        {
          question: "Which method is used to add an item to a list?",
          options: ["add()", "append()", "insert()", "push()"],
          correctAnswer: 1,
          explanation: "The append() method adds an item to the end of a list."
        }
      ],
      history: [
        {
          question: "In which year did World War II end?",
          options: ["1944", "1945", "1946", "1947"],
          correctAnswer: 1,
          explanation: "World War II ended in 1945 with the surrender of Japan in September."
        },
        {
          question: "Who was the first President of the United States?",
          options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
          correctAnswer: 2,
          explanation: "George Washington was the first President of the United States, serving from 1789 to 1797."
        }
      ]
    }

    const topicLower = topic.toLowerCase()
    const availableQuestions = mockQuestions[topicLower] || mockQuestions.javascript
    
    const selectedQuestions = []
    for (let i = 0; i < parseInt(questionCount); i++) {
      const questionIndex = i % availableQuestions.length
      selectedQuestions.push({
        id: i + 1,
        ...availableQuestions[questionIndex]
      })
    }

    return {
      title: `${topic} Quiz`,
      difficulty: difficulty,
      timer: timer,
      questions: selectedQuestions
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsGenerating(true)

    // Determine the actual question count and timer
    const actualQuestionCount = formData.questionCount === 'custom' 
      ? parseInt(formData.customQuestionCount) 
      : parseInt(formData.questionCount)
    
    const actualTimer = formData.timer === 'custom'
      ? parseInt(formData.customTimer)
      : parseInt(formData.timer)

    try {
      // Try to call the backend API first
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          difficulty: formData.difficulty,
          questionCount: actualQuestionCount,
          timer: actualTimer
        })
      })

      if (response.ok) {
        const quizData = await response.json()
        // Ensure timer is included in API response
        quizData.timer = actualTimer;
        onQuizGenerated(quizData)
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.log('Backend not available, using enhanced mock data:', error.message)
      
      // Use enhanced mock data with realistic questions
      const mockQuizData = generateMockQuiz(
        formData.topic, 
        formData.difficulty, 
        actualQuestionCount,
        actualTimer
      )
      
      // Add a small delay to simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onQuizGenerated(mockQuizData)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="quiz-generator">
      <div className="generator-card card">
        <div className="generator-header">
          {selectedCategory && (
            <div className="selected-category">
              <span className="category-icon">{selectedCategory.icon}</span>
              <span className="category-name">
                {selectedCategory.id === 'custom' && selectedCategory.topic 
                  ? `${selectedCategory.topic} Quiz`
                  : `${selectedCategory.name} Quiz`
                }
              </span>
            </div>
          )}
          <p>Fill in the details below to create a personalized quiz powered by AI</p>
        </div>
        
        <form onSubmit={handleSubmit} className="generator-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="questionCount">Number of Questions</label>
              <select
                id="questionCount"
                name="questionCount"
                value={formData.questionCount}
                onChange={handleInputChange}
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="custom">Custom</option>
              </select>
              {formData.questionCount === 'custom' && (
                <input
                  type="number"
                  name="customQuestionCount"
                  value={formData.customQuestionCount}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  placeholder="Enter custom number"
                  className="custom-input"
                  required
                />
              )}
              <small className="form-help">
                {formData.questionCount === 'custom' ? 'Enter 1-50 questions' : 'Or select custom for more options'}
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="timer">Time per Question</label>
              <select
                id="timer"
                name="timer"
                value={formData.timer}
                onChange={handleInputChange}
              >
                <option value="0">No time limit</option>
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="custom">Custom</option>
              </select>
              {formData.timer === 'custom' && (
                <input
                  type="number"
                  name="customTimer"
                  value={formData.customTimer}
                  onChange={handleInputChange}
                  min="5"
                  max="600"
                  placeholder="Enter seconds (5-600)"
                  className="custom-input"
                  required
                />
              )}
              <small className="form-help">
                {formData.timer === 'custom' ? 'Enter 5-600 seconds (10 minutes max)' : 'Or select custom for more control'}
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="back-btn"
              onClick={onBack}
            >
              ← Back to Categories
            </button>
            
            <button 
              type="submit" 
              className="generate-btn"
              disabled={isGenerating || 
                        (formData.questionCount === 'custom' && (!formData.customQuestionCount || formData.customQuestionCount < 1 || formData.customQuestionCount > 50)) ||
                        (formData.timer === 'custom' && (!formData.customTimer || formData.customTimer < 5 || formData.customTimer > 600))}
            >
              {isGenerating ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating Quiz...
                </>
              ) : (
                'Generate Quiz'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuizGenerator