import { useState, useEffect } from 'react'
import type { InterviewQuestion } from './types/InterviewQuestion'
import { api } from './services/api'
import { getDifficultyLabel } from './utils/constants'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import mermaid from 'mermaid'
import './App.css'

mermaid.initialize({ startOnLoad: false, theme: 'default' })

function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('')
  
  useEffect(() => {
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
    mermaid.render(id, chart).then(({ svg }) => {
      setSvg(svg)
    }).catch((err) => {
      console.error('Mermaid error:', err)
    })
  }, [chart])
  
  return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
}

function App() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<InterviewQuestion[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [questionsPerPage, setQuestionsPerPage] = useState<number>(9)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      filterQuestions()
    }
  }, [selectedCategory, selectedDifficulty])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [questionsData, categoriesData] = await Promise.all([
        api.getAllQuestions(),
        api.getAllCategories()
      ])
      setQuestions(questionsData)
      setFilteredQuestions(questionsData)
      setCategories(categoriesData)
    } catch (err) {
      setError('Failed to load data. Please refresh the page.')
      console.error('Error loading initial data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      let result: InterviewQuestion[]

      if (selectedCategory && selectedDifficulty > 0) {
        // Filter by both category and difficulty
        const categoryQuestions = await api.getQuestionsByCategory(selectedCategory)
        result = categoryQuestions.filter(q => q.difficulty === selectedDifficulty)
      } else if (selectedCategory) {
        // Filter by category only
        result = await api.getQuestionsByCategory(selectedCategory)
      } else if (selectedDifficulty > 0) {
        // Filter by difficulty only
        result = await api.getQuestionsByDifficulty(selectedDifficulty)
      } else {
        // No filters
        result = await api.getAllQuestions()
      }

      setFilteredQuestions(result)
      setCurrentPage(1) // Reset to first page when filtering
    } catch (err) {
      setError('Failed to filter questions. Please try again.')
      console.error('Error filtering questions:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate current questions for pagination
  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Change questions per page
  const handleQuestionsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
  }

  const handleDifficultyChange = (difficulty: number) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? 0 : difficulty)
  }

  const handleQuestionClick = (question: InterviewQuestion) => {
    setSelectedQuestion(question)
  }

  const handleCloseDetail = () => {
    setSelectedQuestion(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Java Backend Interview Questions</h1>
        <p>Your comprehensive guide to Java backend interview preparation</p>
      </header>

      <main className="main">
        {loading ? (
          <div className="loading">Loading questions...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {/* Filters */}
            <div className="filters">
              <div className="filter-section">
                <h3>Categories</h3>
                <div className="filter-tags">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`filter-tag ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>Difficulty</h3>
                <div className="filter-tags">
                  {[1, 2, 3].map((difficulty) => (
                    <button
                      key={difficulty}
                      className={`filter-tag ${selectedDifficulty === difficulty ? 'active' : ''}`}
                      onClick={() => handleDifficultyChange(difficulty)}
                    >
                      {getDifficultyLabel(difficulty)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="questions-list">
              <div className="questions-header">
                <h2>Questions ({filteredQuestions.length})</h2>
                <div className="pagination-controls">
                  <label htmlFor="questions-per-page">Questions per page:</label>
                  <select
                    id="questions-per-page"
                    value={questionsPerPage}
                    onChange={handleQuestionsPerPageChange}
                    className="questions-per-page-select"
                  >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                  </select>
                </div>
              </div>
              <div className="questions-grid">
                {currentQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="question-card"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <div className="question-header">
                      <span className="category-tag">{question.category}</span>
                      <span className={`difficulty-tag difficulty-${question.difficulty}`}>
                        {getDifficultyLabel(question.difficulty)}
                      </span>
                    </div>
                    <h3 className="question-title">{question.question}</h3>
                    <button className="view-details-btn">View Details</button>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {filteredQuestions.length > questionsPerPage && (
                <div className="pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {Math.ceil(filteredQuestions.length / questionsPerPage)}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredQuestions.length / questionsPerPage)}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseDetail}>×</button>
            <div className="question-detail">
              <div className="question-detail-header">
                <span className="category-tag">{selectedQuestion.category}</span>
                <span className={`difficulty-tag difficulty-${selectedQuestion.difficulty}`}>
                  {getDifficultyLabel(selectedQuestion.difficulty)}
                </span>
              </div>
              <h2>{selectedQuestion.question}</h2>
              <div className="answer-section">
                <h3>Answer:</h3>
                <div className="answer markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match
                        if (!isInline && match && match[1] === 'mermaid') {
                          return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
                        }
                        return isInline ? (
                          <code className={className} {...props}>{children}</code>
                        ) : (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match ? match[1] : 'text'}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        )
                      },
                      table({ children }) {
                        return <table className="markdown-table">{children}</table>
                      }
                    }}
                  >
                    {selectedQuestion.answer}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2026 Java Interview Prep Tool</p>
      </footer>
    </div>
  )
}

export default App
