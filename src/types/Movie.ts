export type MovieListEntry = {
  adult: boolean
  backdrop_path: string | null
  genre_ids: Array<number>
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export type GetMovieResult = {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: {
    id: number
    name: string
    poster_path: string
    backdrop_path: string
  }
  genres: Array<{
    id: number
    name: string
  }>
  homepage: string
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: Array<{
    id: number
    logo_path: string
    name: string
    origin_country: string
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  release_date: string
  revenue: string
  runtime: number
  spoken_languages: Array<{
    english_name: string
    iso_3166_1: string
    name: string
  }>
  status: string
  tagling: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}
