export type WatchedMovie = {
  userId: string
  movieId: number
  watchStatus: "Watched"
}

export type WatchlistMovie = {
  userId: string
  movieId: number
  watchStatus: "WatchList"
}

export type SavedMovie = {
  userId: string
  movieId: number
  watchStatus: "Watched" | "WatchList"
}
