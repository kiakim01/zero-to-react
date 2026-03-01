import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMovieDetail, useMovieCredits } from '../hooks/useMovieDetail'
import Header from '../components/Header'
import './MovieDetail.css'

function MovieDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'info' | 'related'>('info')
  
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovieDetail(id)
  const { data: credits, isLoading: creditsLoading } = useMovieCredits(id)

  if (movieLoading || creditsLoading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner"></div>
        <p>영화 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (movieError || !movie) {
    return (
      <div className="movie-detail-error">
        <p>영화 정보를 불러올 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    )
  }

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  const getImageUrl = (path: string | null, size: string = 'original') => {
    if (!path) return null
    return `https://image.tmdb.org/t/p/${size}${path}`
  }

  // 주요 출연진 (상위 8명)
  const mainCast = credits?.cast?.slice(0, 8) || []
  // 감독 찾기
  const director = credits?.crew?.find(person => person.job === 'Director')

  return (
    <div className="movie-detail-page">
      <Header />
      
      <div className="movie-detail-container">
        {/* 메인 히어로 섹션 - Watcha 스타일 */}
        <div className="movie-hero-section">
          <div className="movie-hero-content">
            {/* 왼쪽: 영화 정보 */}
            <div className="movie-info-left">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-metadata">
                <span className="movie-year">{movie.release_date?.split('-')[0]}</span>
                <span className="separator">·</span>
                <span className="movie-genre">{movie.genres[0]?.name}</span>
                <span className="separator">·</span>
                <span className="movie-country">{movie.production_countries[0]?.name || movie.original_language.toUpperCase()}</span>
              </div>
              <p className="movie-description">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
              
              {/* 평점 및 사용자 수 */}
              <div className="movie-rating-section">
                <div className="rating-display">
                  <span className="rating-star">★</span>
                  <span className="rating-value">{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="rating-count">
                  평균 {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()}명)
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="movie-actions">
                <button className="action-button watch-button">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  감상하기
                </button>
                <button className="action-button wishlist-button">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  찜하기
                </button>
              </div>

              {/* 추가 액션 버튼들 */}
              <div className="movie-extra-actions">
                <button className="icon-action" title="보고싶어요">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  <span>보고싶어요</span>
                </button>
                <button className="icon-action" title="관심없어요">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
                  </svg>
                  <span>관심없어요</span>
                </button>
                <button className="icon-action" title="평가하기">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span>평가하기</span>
                </button>
                <button className="icon-action" title="더보기">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <span>더보기</span>
                </button>
              </div>
            </div>

            {/* 오른쪽: 포스터/백드롭 이미지 */}
            <div className="movie-image-right">
              <img 
                src={getImageUrl(movie.backdrop_path || movie.poster_path) || 'https://via.placeholder.com/800x450/333/fff?text=No+Image'} 
                alt={movie.title}
                className="movie-hero-image"
              />
            </div>
          </div>
        </div>

        {/* 탭 섹션 */}
        <div className="movie-tabs-section">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              콘텐츠 정보
            </button>
            <button 
              className={`tab-button ${activeTab === 'related' ? 'active' : ''}`}
              onClick={() => setActiveTab('related')}
            >
              관련 콘텐츠
            </button>
          </div>

          {activeTab === 'info' && (
            <div className="tab-content">
              {/* 관련 동영상 썸네일 */}
              <div className="related-videos">
                <h3 className="section-title">관련 동영상</h3>
                <div className="video-thumbnail">
                  <img 
                    src={getImageUrl(movie.backdrop_path, 'w780') || 'https://via.placeholder.com/300x170/333/fff?text=No+Video'} 
                    alt="Video thumbnail"
                  />
                  <div className="play-overlay">
                    <svg width="48" height="48" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* 감독/출연 섹션 */}
              <div className="cast-section">
                <h3 className="section-title">감독/출연</h3>
                <div className="cast-list">
                  {director && (
                    <div className="cast-item">
                      <div className="cast-photo-wrapper">
                        <img 
                          src={getImageUrl(director.profile_path, 'w185') || 'https://via.placeholder.com/60x60/333/fff?text=No+Photo'}
                          alt={director.name}
                          className="cast-photo"
                        />
                      </div>
                      <div className="cast-details">
                        <p className="cast-name">{director.name}</p>
                        <p className="cast-role">감독</p>
                      </div>
                    </div>
                  )}
                  {mainCast.map(actor => (
                    <div key={actor.cast_id} className="cast-item">
                      <div className="cast-photo-wrapper">
                        <img 
                          src={getImageUrl(actor.profile_path, 'w185') || 'https://via.placeholder.com/60x60/333/fff?text=No+Photo'}
                          alt={actor.name}
                          className="cast-photo"
                        />
                      </div>
                      <div className="cast-details">
                        <p className="cast-name">{actor.name}</p>
                        <p className="cast-role">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {credits?.cast && credits.cast.length > 8 && (
                  <button className="see-more-button">더보기</button>
                )}
              </div>

              {/* 왓챠피디아 사용자 평 */}
              <div className="reviews-section">
                <h3 className="section-title">왓챠피디아 사용자 평 <span className="review-count">{movie.vote_count.toLocaleString()}+</span></h3>
                <div className="reviews-list">
                  {/* 샘플 리뷰들 (실제로는 API에서 가져와야 함) */}
                  <div className="review-item">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar"></div>
                      <div className="reviewer-details">
                        <p className="reviewer-name">토나리노 토토로★★★★★</p>
                        <p className="review-text">아름답지 않아도 아름다울 수 있다.</p>
                      </div>
                    </div>
                  </div>
                  <div className="review-item">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar"></div>
                      <div className="reviewer-details">
                        <p className="reviewer-name">메칸★★★★☆</p>
                        <p className="review-text">어른들의 동화 비틀기.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'related' && (
            <div className="tab-content">
              <p className="no-content">관련 콘텐츠가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 하단 액션 버튼 (고정) */}
        <div className="bottom-actions">
          <button className="bottom-action-button">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            구매하기
          </button>
          <button className="bottom-action-button">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
            </svg>
            선물하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail