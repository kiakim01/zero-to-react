import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { MovieListResponse } from '../types/tmdb'

export const useSearchMovies = (query: string, page: number = 1) => {
  return useQuery<MovieListResponse, Error>({
    queryKey: ['movies', 'search', query, page],
    queryFn: async () => {
      const response = await apiClient.get<MovieListResponse>('/search/movie', {
        params: { 
          query,
          page,
          language: 'ko-KR'
        }
      })
      return response.data
    },
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useDiscoverMovies = (page: number = 1) => {
  return useQuery<MovieListResponse, Error>({
    queryKey: ['movies', 'discover', page],
    queryFn: async () => {
      const response = await apiClient.get<MovieListResponse>('/discover/movie', {
        params: { 
          page,
          language: 'ko-KR',
          sort_by: 'popularity.desc',
          include_adult: false,
          include_video: false,
          with_watch_monetization_types: 'flatrate'
        }
      })
      return response.data
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}