export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  video: boolean
}

export interface MovieListResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetail extends Movie {
  budget: number
  genres: Genre[]
  homepage: string | null
  imdb_id: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  revenue: number
  runtime: number | null
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string | null
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Cast {
  id: number
  name: string
  original_name: string
  character: string
  profile_path: string | null
  known_for_department: string
  popularity: number
  cast_id: number
  credit_id: string
  order: number
  gender: number | null
  adult: boolean
}

export interface Crew {
  id: number
  name: string
  original_name: string
  department: string
  job: string
  profile_path: string | null
  known_for_department: string
  popularity: number
  credit_id: string
  gender: number | null
  adult: boolean
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}