export type Schedule = {
  userId: string
  isoDate: string
  movieId: number
  isPending: boolean
}

export type ScheduleInvite = {
  userId: string
  isoDate: string
  friendId: string
}
