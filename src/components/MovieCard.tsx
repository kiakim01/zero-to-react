import React from 'react';
import './MovieCard.css';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate?: string;
  onClick?: (id: number) => void;
  variant?: 'carousel' | 'grid';
  rank?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterPath,
  voteAverage,
  releaseDate,
  onClick,
  variant = 'grid',
  rank
}) => {
  const getImageUrl = (path: string | null) => {
    if (!path) return 'https://via.placeholder.com/200x300/333/fff?text=No+Image';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const getReleaseYear = () => {
    if (!releaseDate) return 'N/A';
    return new Date(releaseDate).getFullYear();
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div className={`movie-card movie-card--${variant}`} onClick={handleClick}>
      <div className="movie-card__poster">
        {rank && rank <= 20 && (
          <div className="movie-card__rank">
            <span className="movie-card__rank-number">{rank}</span>
          </div>
        )}
        <img
          src={getImageUrl(posterPath)}
          alt={title}
          loading="lazy"
        />
        <div className="movie-card__overlay">
          <div className="movie-card__overlay-content">
            <div className="movie-card__rating">
              ⭐ {voteAverage.toFixed(1)}
            </div>
            <button className="movie-card__play-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">{title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;