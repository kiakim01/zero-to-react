import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles.css'
import Main from './pages/Main'
import Search from './pages/Search'

function App() {



  return (
    <Router>
      <div className="watcha-bg-dark watcha-text-white min-h-screen">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
