import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles.css'

// 라우트 기반 코드 스플릿
const Main = React.lazy(() => import('./pages/Main'))
const Search = React.lazy(() => import('./pages/Search'))
const MovieDetail = React.lazy(() => import('./pages/MovieDetail'))

function App() {



  return (
    <Router>
      <div className="watcha-bg-dark watcha-text-white min-h-screen">
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
