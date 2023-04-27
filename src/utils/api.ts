import Constants from "expo-constants"

if (typeof Constants.expoConfig?.extra?.backendBaseUrl !== "string")
  throw new Error("No TMDB API key found")

const { backendBaseUrl } = Constants.expoConfig.extra

export async function getSearchResults(searchQuery: string) {
  const link = `${backendBaseUrl}/movie/search/${searchQuery}`
  const response = await fetch(link)
  const { results } = await response.json()
  return results
}

export async function getMovieDetails(movieId: string) {
  const link = `${backendBaseUrl}/movie/${movieId}`
  const response = await fetch(link)
  const { result } = await response.json()
  return result
}
