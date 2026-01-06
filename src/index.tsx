import Loading from './components/Loading'
import './index.css'
import { ErrorBook } from './pages/ErrorBook'
import TypingPage from './pages/Typing'
import { isOpenDarkModeAtom } from '@/store'
import { Analytics } from '@vercel/analytics/react'
import 'animate.css'
import { useAtomValue } from 'jotai'
import mixpanel from 'mixpanel-browser'
import process from 'process'
import React, { Component, Suspense, lazy, useEffect } from 'react'
import 'react-app-polyfill/stable'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-red-600">出现错误</h1>
            <p className="mb-4 text-gray-700">{this.state.error?.message || '未知错误'}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const AnalysisPage = lazy(() => import('./pages/Analysis'))
const GalleryPage = lazy(() => import('./pages/Gallery-N'))

if (process.env.NODE_ENV === 'production') {
  // for prod
  mixpanel.init('bdc492847e9340eeebd53cc35f321691')
} else {
  // for dev
  mixpanel.init('5474177127e4767124c123b2d7846e2a', { debug: true })
}

function Root() {
  const darkMode = useAtomValue(isOpenDarkModeAtom)
  useEffect(() => {
    darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
  }, [darkMode])

  const basename = REACT_APP_DEPLOY_ENV === 'pages' ? '/typoer' : ''

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter basename={basename}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route index element={<TypingPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/error-book" element={<ErrorBook />} />
              <Route path="/*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Analytics />
      </ErrorBoundary>
    </React.StrictMode>
  )
}

const container = document.getElementById('root')

container && createRoot(container).render(<Root />)
