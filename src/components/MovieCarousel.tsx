import React, { useState, useRef } from 'react'
import { Movie } from '../types/tmdb'

interface MovieCarouselProps {
  title: string
  movies: Movie[]
}

function MovieCarousel({ title, movies }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const itemsPerView = 6 // 한 화면에 보여줄 영화 개수
  
  const maxIndex = Math.ceil(movies.length / itemsPerView) - 1

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.clientWidth
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.clientWidth
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-wrapper">
        {currentIndex > 0 && (
          <button className="carousel-button carousel-button-prev" onClick={handlePrevious}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        )}
        
        <div className="carousel-content" ref={carouselRef}>
          <div className="carousel-track">
            {movies.map((movie) => (
              <div key={movie.id} className="carousel-item">
                <div className="movie-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-info">⭐ {movie.vote_average.toFixed(1)}</p>
                  <p className="movie-info">{movie.release_date?.split('-')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentIndex < maxIndex && (
          <button className="carousel-button carousel-button-next" onClick={handleNext}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default MovieCarousel