import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { MovieListResponse } from '../types/tmdb'

export const usePopularMovies = (page: number = 1) => {
  return useQuery<MovieListResponse, Error>({
    queryKey: ['movies', 'popular', page],
    queryFn: async () => {
      const response = await apiClient.get<MovieListResponse>('/movie/popular', {
        params: { page }
      })
      return response.data
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}