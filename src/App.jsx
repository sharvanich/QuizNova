import { useState } from 'react'
import './App.css'
import HomePage from './components/HomePage.jsx'
import QuizGenerator from './components/QuizGenerator.jsx'
import GeneratedQuiz from './components/GeneratedQuiz.jsx'
import ResultsDisplay from './components/ResultsDisplay.jsx'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home', 'generator', 'quiz', 'results'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [quizData, setQuizData] = useState(null)
  const [userAnswers, setUserAnswers] = useState([])
  const [quizResults, setQuizResults] = useState(null)

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setCurrentView('generator')
  }

  const handleQuizGenerated = (generatedQuiz) => {
    setQuizData(generatedQuiz)
    setCurrentView('quiz')
  }

  const handleQuizCompleted = (answers, results) => {
    setUserAnswers(answers)
    setQuizResults(results)
    setCurrentView('results')
  }

  const handleStartOver = () => {
    setCurrentView('home')
    setSelectedCategory(null)
    setQuizData(null)
    setUserAnswers([])
    setQuizResults(null)
  }

  return (
    <div className="app">
      <div className="app-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
      </div>
      


      <main className="app-main">
        <div className="container">
          {currentView === 'home' && (
            <HomePage onCategorySelect={handleCategorySelect} />
          )}
          
          {currentView === 'generator' && (
            <QuizGenerator 
              selectedCategory={selectedCategory}
              onQuizGenerated={handleQuizGenerated}
              onBack={() => setCurrentView('home')}
            />
          )}
          
          {currentView === 'quiz' && quizData && (
            <GeneratedQuiz 
              quizData={quizData}
              onQuizCompleted={handleQuizCompleted}
              onBack={() => setCurrentView('generator')}
            />
          )}
          
          {currentView === 'results' && quizResults && (
            <ResultsDisplay 
              results={quizResults}
              userAnswers={userAnswers}
              quizData={quizData}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
