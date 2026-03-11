import React from 'react'
import { usePopularMovies } from '../hooks/usePopularMovies'
import Header from '../components/Header'
import Hero from '../components/Hero'
import MovieCarousel from '../components/MovieCarousel'

function Main() {
  const { data, isLoading, error } = usePopularMovies()

  return (
    <div className="main-wrapper">
      <Header />
      <Hero />
      <div className="app-container">
        {isLoading && <p className="loading-text">영화를 불러오는 중...</p>}

        {error && <p className="error-text">Error: {error.message}</p>}

        {data && data.results && (
          <div>
            <MovieCarousel title="인기 영화 Top 20" movies={data.results} />
            {data.results.length > 10 && (
              <MovieCarousel
                title="이번 주 화제작"
                movies={data.results.slice(10)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Main
