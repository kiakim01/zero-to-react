import React from 'react'
import './styles.css'
import { usePopularMovies } from './hooks/usePopularMovies'
import { Movie } from './types/tmdb'

function App() {
  const { data, isLoading, error } = usePopularMovies()


  return (
    <div className="app-container">
      <h1>TMDB Popular Movies</h1>

      {isLoading && <p>Loading movies...</p>}

      {error && <p>Error: {error.message}</p>}

      {data && (
        <div>
          <p>Total Results: {data.total_results}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {data.results?.slice(0, 6).map((movie: Movie) => (
              <div key={movie.id} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '100%', borderRadius: '4px' }}
                />
                <h3>{movie.title}</h3>
                <p>평점: {movie.vote_average}/10</p>
                <p>개봉일: {movie.release_date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
