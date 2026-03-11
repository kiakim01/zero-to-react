import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Movie } from '../types/tmdb'
import MovieCard from './MovieCard'

interface MovieCarouselProps {
  title: string
  movies: Movie[]
}

function MovieCarousel({ title, movies }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const itemsPerView = 5 // 한 화면에 보여줄 영화 개수 (5의 배수)
  
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
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                voteAverage={movie.vote_average}
                releaseDate={movie.release_date}
                onClick={(id) => navigate(`/movie/${id}`)}
                variant="carousel"
                rank={title.includes("Top 20") ? index + 1 : undefined}
              />
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