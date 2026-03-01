import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchMovies, useDiscoverMovies } from '../hooks/useSearchMovies';
import MovieCard from '../components/MovieCard';
import './Search.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayCount, setDisplayCount] = useState(10); // 초기 10개 표시 (5의 배수)
  const [totalPages, setTotalPages] = useState(0);
  const [previousDisplayCount, setPreviousDisplayCount] = useState(0);
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);

  // 검색 결과 또는 인기 영화 표시
  const searchQuery = useSearchMovies(debouncedSearchTerm, page);
  const discoverQuery = useDiscoverMovies(page);
  
  const query = debouncedSearchTerm ? searchQuery : discoverQuery;
  const { data, isLoading } = query;

  // 데이터가 변경될 때마다 영화 목록 업데이트
  useEffect(() => {
    if (data && data.results) {
      if (page === 1) {
        setAllMovies(data.results);
        setDisplayCount(10); // 첫 페이지에서는 10개 표시로 리셋
      } else {
        setAllMovies(prev => {
          const existingIds = new Set(prev.map(movie => movie.id));
          const newMovies = data.results.filter(movie => !existingIds.has(movie.id));
          return [...prev, ...newMovies];
        });
      }
      setTotalPages(data.total_pages);
    }
  }, [data]);

  // displayCount가 변경되면 자동 스크롤
  useEffect(() => {
    if (previousDisplayCount > 0 && displayCount > previousDisplayCount && gridRef.current) {
      // 새로 추가된 영화들이 보이도록 스크롤하되, 더 보기 버튼도 화면에 유지
      setTimeout(() => {
        if (!gridRef.current) return;
        const cardElements = gridRef.current.querySelectorAll('.movie-card');
        if (cardElements.length > previousDisplayCount) {
          // 새로 추가된 첫 번째 영화 카드
          const firstNewCard = cardElements[previousDisplayCount];
          // 마지막 영화 카드
          const lastCard = cardElements[cardElements.length - 1];
          
          // 첫 번째 새 카드의 위치
          const firstNewCardTop = firstNewCard.getBoundingClientRect().top + window.pageYOffset;
          // 마지막 카드의 하단 위치
          const lastCardBottom = lastCard.getBoundingClientRect().bottom + window.pageYOffset;
          
          // 뷰포트 높이
          const viewportHeight = window.innerHeight;
          
          // 스크롤 목표: 새로운 카드들을 보여주되, 더 보기 버튼이 화면 하단에 보이도록
          // 더 보기 버튼 영역(약 300px)을 고려하여 계산 - 버튼이 더 편하게 보이도록 여유 공간 증가
          const idealScrollPosition = firstNewCardTop - 100; // 헤더 여백
          const maxScrollPosition = lastCardBottom + 300 - viewportHeight; // 더 보기 버튼 공간 확보 (200 → 300으로 증가)
          
          // 두 값 중 작은 값을 선택하여 더 보기 버튼이 항상 보이도록 함
          const targetPosition = Math.min(idealScrollPosition, maxScrollPosition);
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // DOM 업데이트 완료를 위한 짧은 지연
    }
  }, [displayCount, previousDisplayCount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== debouncedSearchTerm) {
        setDebouncedSearchTerm(searchTerm);
        setPage(1); // 검색어 변경 시 첫 페이지로 리셋
        // allMovies는 새 데이터가 올 때 자동으로 교체됨
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // 검색어가 변경되면 스크롤을 최상단으로
  useEffect(() => {
    if (searchTerm !== '') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [searchTerm]);

  const handleMovieClick = (movieId: number) => {
    // TODO: 영화 상세 페이지로 이동
    console.log('Movie clicked:', movieId);
  };

  const handleLoadMore = () => {
    setPreviousDisplayCount(displayCount);
    
    if (debouncedSearchTerm) {
      // 검색 모드: 다음 페이지 로드
      if (page < totalPages) {
        setPage(prev => prev + 1);
      }
    } else {
      // 디스커버 모드: 10개씩 더 표시
      if (displayCount < allMovies.length) {
        // 현재 로드된 영화 중에서 10개 더 표시
        setDisplayCount(prev => Math.min(prev + 10, allMovies.length));
      } else if (page < totalPages) {
        // 현재 페이지의 모든 영화를 표시했으면 다음 페이지 로드
        setPage(prev => prev + 1);
        // 새 페이지 로드 후에도 displayCount는 유지 (자동으로 더 많이 보여줌)
      }
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <button 
          className="search-back-button"
          onClick={() => navigate('/')}
        >
          ←
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="영화 제목을 검색하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        {searchTerm && (
          <button
            className="search-clear-button"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="search-results">
        {!searchTerm && (
          <div className="search-section-title">
            인기 영화
          </div>
        )}
        
        {isLoading && page === 1 && allMovies.length === 0 ? (
          <div className="search-loading">
            <div className="search-loading-spinner"></div>
            <p>검색 중...</p>
          </div>
        ) : allMovies.length > 0 ? (
          <>
            <div className="search-results-grid" ref={gridRef}>
              {(debouncedSearchTerm ? allMovies : allMovies.slice(0, displayCount)).map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  voteAverage={movie.vote_average}
                  releaseDate={movie.release_date}
                  onClick={handleMovieClick}
                  variant="grid"
                />
              ))}
            </div>
            
            {(debouncedSearchTerm ? page < totalPages : (displayCount < allMovies.length || page < totalPages)) && (
              <div className="search-load-more-container">
                {isLoading && page > 1 ? (
                  <div className="search-loading-spinner"></div>
                ) : (
                  <button 
                    className="search-load-more-button"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    더 보기
                  </button>
                )}
              </div>
            )}
          </>
        ) : searchTerm ? (
          <div className="search-no-results">
            <p>"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
            <p className="search-no-results-hint">다른 검색어를 입력해보세요.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;