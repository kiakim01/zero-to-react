import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles.css'
import Main from './pages/Main'
import Search from './pages/Search'
import MovieDetail from './pages/MovieDetail'

function App() {



  return (
    <Router>
      <div className="watcha-bg-dark watcha-text-white min-h-screen">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
