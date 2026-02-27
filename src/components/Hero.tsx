import React, { useEffect, useState, useRef } from 'react'
import { usePopularMovies } from '../hooks/usePopularMovies'
import { Movie } from '../types/tmdb'

function Hero() {
  const { data } = usePopularMovies()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [heroMovies, setHeroMovies] = useState<Movie[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data && data.results && data.results.length > 0) {
      // 상위 5개 영화를 히어로 슬라이드로 사용
      setHeroMovies(data.results.slice(0, 5))
    }
  }, [data])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroMovies.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === heroMovies.length - 1 ? 0 : prev + 1))
  }

  if (!heroMovies.length) return null

  return (
    <div className="hero-container">
      <div className="hero-carousel-wrapper">
        <button className="hero-nav-button hero-nav-prev" onClick={handlePrevious}>
          <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        
        <div className="hero-carousel-track" ref={containerRef}>
          {heroMovies.map((movie, index) => {
            const offset = index - currentIndex
            const isActive = index === currentIndex
            const isNext = index === (currentIndex + 1) % heroMovies.length
            const isPrev = index === (currentIndex - 1 + heroMovies.length) % heroMovies.length
            
            return (
              <div
                key={movie.id}
                className={`hero-slide ${isActive ? 'active' : ''} ${isNext ? 'next' : ''} ${isPrev ? 'prev' : ''}`}
                style={{
                  transform: `translateX(${offset * 85}%)`,
                  opacity: isActive ? 1 : isNext ? 0.7 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  zIndex: isActive ? 2 : isNext ? 1 : 0
                }}
              >
                <div 
                  className="hero-background"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%), 
                                     url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                    backgroundPosition: 'center 30%'
                  }}
                >
                  <div className="hero-content">
                    <h1 className="hero-title">{movie.title}</h1>
                    <div className="hero-meta">
                      <span className="hero-year">{movie.release_date?.split('-')[0]}</span>
                      <span className="hero-rating">⭐ {movie.vote_average.toFixed(1)}</span>
                    </div>
                    <p className="hero-overview">{movie.overview}</p>
                    <div className="hero-buttons">
                      <button className="hero-play-button">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        재생
                      </button>
                      <button className="hero-info-button">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        상세 정보
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button className="hero-nav-button hero-nav-next" onClick={handleNext}>
          <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>

        {/* 인디케이터 */}
        <div className="hero-indicators">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              className={`hero-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero