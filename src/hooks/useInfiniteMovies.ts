import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { MovieListResponse } from '../types/tmdb';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface UseInfiniteMoviesOptions {
  endpoint: string;
  queryKey: string[];
  params?: Record<string, any>;
  enabled?: boolean;
  itemsPerLoad?: number; // 한 번에 로드할 아이템 수
}

export const useInfiniteMovies = ({
  endpoint,
  queryKey,
  params = {},
  enabled = true,
  itemsPerLoad = 18 // 기본값 18개 (6의 배수)
}: UseInfiniteMoviesOptions) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // API 호출
  const { data, isLoading, error } = useQuery<MovieListResponse>({
    queryKey: [...queryKey, currentPage],
    queryFn: async () => {
      const response = await apiClient.get<MovieListResponse>(endpoint, {
        params: { ...params, page: currentPage }
      });
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 데이터가 도착하면 전체 영화 목록에 추가
  useEffect(() => {
    if (data && data.results) {
      setAllMovies(prev => {
        // 중복 제거
        const existingIds = new Set(prev.map(m => m.id));
        const newMovies = data.results.filter(m => !existingIds.has(m.id));
        return [...prev, ...newMovies];
      });
      setTotalPages(data.total_pages);
    }
  }, [data]);

  // displayedMovies 업데이트
  useEffect(() => {
    // 현재 표시할 영화 수 계산 (6의 배수)
    const moviesToShow = Math.floor(allMovies.length / itemsPerLoad) * itemsPerLoad + 
                         (allMovies.length % itemsPerLoad >= 6 ? itemsPerLoad : 0);
    
    // 최소 itemsPerLoad개는 표시
    const finalCount = Math.max(Math.min(moviesToShow, allMovies.length), 
                               Math.min(itemsPerLoad, allMovies.length));
    
    setDisplayedMovies(allMovies.slice(0, finalCount));
    
    // 더 로드할 수 있는지 확인
    setHasMore(finalCount < allMovies.length || currentPage < totalPages);
  }, [allMovies, currentPage, totalPages, itemsPerLoad]);

  // 더 보기 함수
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    // 현재 로드된 데이터에서 더 표시할 수 있는지 확인
    const nextDisplayCount = displayedMovies.length + itemsPerLoad;
    
    if (nextDisplayCount <= allMovies.length) {
      // 이미 로드된 데이터에서 더 표시
      setDisplayedMovies(allMovies.slice(0, nextDisplayCount));
    } else if (currentPage < totalPages) {
      // 다음 페이지 로드 필요
      const neededItems = nextDisplayCount - allMovies.length;
      const pagesToLoad = Math.ceil(neededItems / 20); // TMDB는 페이지당 20개 반환
      
      // 필요한 만큼 페이지 로드
      for (let i = 0; i < pagesToLoad && (currentPage + i) <= totalPages; i++) {
        setCurrentPage(prev => prev + 1);
      }
    }
    
    setIsLoadingMore(false);
  };

  // 리셋 함수
  const reset = () => {
    setAllMovies([]);
    setDisplayedMovies([]);
    setCurrentPage(1);
    setTotalPages(0);
    setHasMore(true);
  };

  return {
    movies: displayedMovies,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    reset
  };
};