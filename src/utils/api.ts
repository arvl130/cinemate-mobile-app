import Constants from "expo-constants"
import { TMDB } from "tmdb-ts"
import type { Movie } from "tmdb-ts"
import { Review } from "../types/review"
import { getAuth, getIdToken } from "firebase/auth"
import { Friend, UserRecord } from "../types/user"
import { SavedMovie, WatchedMovie, WatchlistMovie } from "../types/saved-movie"

if (typeof Constants.expoConfig?.extra?.backendBaseUrl !== "string")
  throw new Error("No backend base URL found")

if (typeof Constants.expoConfig?.extra?.tmdbAccessToken !== "string")
  throw new Error("No TMDB access token found")

const { backendBaseUrl, tmdbAccessToken } = Constants.expoConfig.extra
const tmdb = new TMDB(tmdbAccessToken)

export async function searchMovies(query: string) {
  const response = await fetch(`${backendBaseUrl}/movie/search/${query}`)
  const { results } = await response.json()
  return results as Movie[]
}

export function getMovieDetails(id: number) {
  return tmdb.movies.details(id)
}

export async function getMovieReviews(id: number) {
  const response = await fetch(`${backendBaseUrl}/movie/${id}/review`)
  const { results } = await response.json()
  return results as Review[]
}

export async function getUserProfile(userId: string) {
  const response = await fetch(`${backendBaseUrl}/user/${userId}`)
  const data = await response.json()

  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }

  const { result } = data
  return result as UserRecord
}

export async function createMovieReview(
  movieId: number,
  details: string,
  rating: number
) {
  const auth = getAuth()
  if (!auth.currentUser)
    throw new Error("Must be authenticated to create review")

  const idToken = await getIdToken(auth.currentUser)
  const response = await fetch(`${backendBaseUrl}/movie/${movieId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      details,
      rating,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}

export async function editMovieReview(
  movieId: number,
  details: string,
  rating: number
) {
  const auth = getAuth()
  if (!auth.currentUser) throw new Error("Must be authenticated to edit review")

  const idToken = await getIdToken(auth.currentUser)
  const response = await fetch(
    `${backendBaseUrl}/movie/${movieId}/review/${auth.currentUser.uid}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        details,
        rating,
      }),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}

export async function deleteMovieReview(movieId: number) {
  const auth = getAuth()
  if (!auth.currentUser) throw new Error("Must be authenticated to edit review")

  const idToken = await getIdToken(auth.currentUser)
  const response = await fetch(
    `${backendBaseUrl}/movie/${movieId}/review/${auth.currentUser.uid}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  )

  const data = await response.json()
  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}

export async function getMovieReview(movieId: number, userId: string) {
  const response = await fetch(
    `${backendBaseUrl}/movie/${movieId}/review/${userId}`
  )
  const { result } = await response.json()
  if (response.status === 404) return null
  return result as Review
}

export async function searchUserProfiles(query: string) {
  const response = await fetch(`${backendBaseUrl}/user/search/${query}`)
  const data = await response.json()
  return data.results as UserRecord[]
}

export async function getFriends() {
  const auth = getAuth()
  if (!auth.currentUser) throw new Error("Must be authenticated to add friend")

  const response = await fetch(
    `${backendBaseUrl}/user/${auth.currentUser.uid}/friend`
  )
  const { results } = await response.json()

  return results as Friend[]
}

export async function addFriend(friendId: string) {
  const auth = getAuth()
  if (!auth.currentUser) throw new Error("Must be authenticated to add friend")

  const response = await fetch(
    `${backendBaseUrl}/user/${auth.currentUser.uid}/friend`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        friendId,
      }),
    }
  )
  const data = await response.json()

  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}

export async function removeFriend(friendId: string) {
  const auth = getAuth()
  if (!auth.currentUser) throw new Error("Must be authenticated to add friend")

  const response = await fetch(
    `${backendBaseUrl}/user/${auth.currentUser.uid}/friend/${friendId}`,
    {
      method: "DELETE",
    }
  )
  const data = await response.json()

  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}

export async function getSavedMovies(userId: string) {
  const response = await fetch(`${backendBaseUrl}/user/${userId}/saved`)
  const { results } = await response.json()
  return results as SavedMovie[]
}

export async function getWatchedMovies(userId: string) {
  const response = await fetch(`${backendBaseUrl}/user/${userId}/watched`)
  const { results } = await response.json()
  return results as WatchedMovie[]
}

export async function addWatchedMovie(userId: string, movieId: number) {
  const response = await fetch(`${backendBaseUrl}/user/${userId}/watched`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}

export async function removeWatchedMovie(userId: string, movieId: number) {
  const response = await fetch(
    `${backendBaseUrl}/user/${userId}/watched/${movieId}`,
    {
      method: "DELETE",
    }
  )

  const data = await response.json()
  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}

export async function getWatchlistMovies(userId: string) {
  const response = await fetch(`${backendBaseUrl}/user/${userId}/watchlist`)
  const { result } = await response.json()
  return result as WatchlistMovie[]
}

export async function addWatchlistMovie(userId: string, movieId: number) {
  const response = await fetch(`${backendBaseUrl}/user/${userId}/watchlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}

export async function removeWatchlistMovie(userId: string, movieId: number) {
  const response = await fetch(
    `${backendBaseUrl}/user/${userId}/watchlist/${movieId}`,
    {
      method: "DELETE",
    }
  )

  const data = await response.json()
  if (!response.ok) {
    if (data.error) console.log("Error cause:", data.error)
    throw new Error(data.message)
  }
}
