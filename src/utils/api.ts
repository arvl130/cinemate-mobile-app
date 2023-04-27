import Constants from "expo-constants"
import { TMDB } from "tmdb-ts"
import type { Movie } from "tmdb-ts"

if (typeof Constants.expoConfig?.extra?.backendBaseUrl !== "string")
  throw new Error("No backend base URL found")

if (typeof Constants.expoConfig?.extra?.tmdbAccessToken !== "string")
  throw new Error("No TMDB access token found")

const { backendBaseUrl, tmdbAccessToken } = Constants.expoConfig.extra
const tmdb = new TMDB(tmdbAccessToken)

export async function getSearchResults(query: string) {
  const response = await fetch(`${backendBaseUrl}/movie/search/${query}`)
  const { results } = await response.json()
  return results as Movie[]
}

export function getMovieDetails(id: number) {
  return tmdb.movies.details(id)
}
