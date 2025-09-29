import './ErrorPage.css'

function ErrorPage({ onRetry, onGoHome }) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="error-page">
      <div className="error-container">
        <h1>QUIZ <span>NOVA</span></h1>

        <div className="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2.001 4.045-2.001 5.199 0l7.258 12.582c1.155 2.001-.291 4.518-2.599 4.518H4.742c-2.308 0-3.754-2.517-2.599-4.518L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 10.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"/>
          </svg>
        </div>

        <h2>Oops! Something Went Wrong</h2>

        <p>We couldn't load the page you requested. This might be a temporary issue.</p>

        <div className="error-buttons">
          <button onClick={handleRetry} className="error-btn error-btn-primary">
            Try Again
          </button>
          <button onClick={handleGoHome} className="error-btn error-btn-secondary">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage