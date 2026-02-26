import React from 'react'
import { usePopularMovies } from '../hooks/usePopularMovies'
import { Movie } from '../types/tmdb'
import Header from '../components/Header'

function Main() {
  const { data, isLoading, error } = usePopularMovies()

  return (
    <div>
      <Header />
      <div className="app-container">


        {isLoading && <p className="text-center text-lg">영화를 불러오는 중...</p>}

        {error && <p className="watcha-text-red text-center">Error: {error.message}</p>}

        {data && (
          <div>
            <div className="movie-grid">
              {data.results?.slice(0, 12).map((movie: Movie) => (
                <div key={movie.id} className="movie-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <h3 className="watcha-text-white font-semibold mt-2">{movie.title}</h3>
                  <p className="text-gray-400 text-sm">평점: {movie.vote_average}/10</p>
                  <p className="text-gray-400 text-sm">{movie.release_date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Main
