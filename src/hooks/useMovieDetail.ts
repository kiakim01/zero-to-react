import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { MovieDetail, Credits } from '../types/tmdb'

export const useMovieDetail = (movieId: string | undefined) => {
  return useQuery<MovieDetail, Error>({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      if (!movieId) throw new Error('Movie ID is required')
      const response = await apiClient.get<MovieDetail>(`/movie/${movieId}`)
      return response.data
    },
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

export const useMovieCredits = (movieId: string | undefined) => {
  return useQuery<Credits, Error>({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: async () => {
      if (!movieId) throw new Error('Movie ID is required')
      const response = await apiClient.get<Credits>(`/movie/${movieId}/credits`)
      return response.data
    },
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}