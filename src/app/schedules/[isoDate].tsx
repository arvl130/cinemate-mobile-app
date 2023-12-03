import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { GradientBackground } from "../../components/gradient-bg"
import { IsAuthenticatedView } from "../../components/is-authenticated"
import {
  addWatchedMovie,
  editSchedule,
  getMovieDetails,
  getMovieReview,
  getSavedMovies,
  getSchedule,
  getUserProfile,
  getWatchedMovies,
  getWatchlistMovies,
  removeWatchlistMovie,
} from "../../utils/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Schedule, ScheduleInvite } from "../../types/schedule"
import { MovieDetails } from "tmdb-ts"
import Modal from "react-native-modal"
import { useState } from "react"
import { useRefreshOnFocus } from "../../utils/refresh-on-focus"
import { router, useLocalSearchParams } from "expo-router"

function ScheduleDoneConfirmationModal({
  isVisible,
  closeFn,
  actionFn,
}: {
  isVisible: boolean
  closeFn: () => void
  actionFn: () => void
}) {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => closeFn()}
      onBackdropPress={() => closeFn()}
    >
      <View className="[background-color:_#2b2b2b] w-72 mx-auto px-6 pt-3 pb-5 rounded-2xl">
        <Text className="text-white text-justify mb-3">
          Are you sure you want to mark this schedule as done? This action
          cannot be reverted.
        </Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            activeOpacity={0.5}
            className="border [border-color:_#FE6007] rounded-md py-1"
            onPress={() => closeFn()}
          >
            <Text className="[color:_#FE6007] font-medium px-3">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            className="[background-color:_#FE6007] rounded-md py-1"
            onPress={() => {
              closeFn()
              actionFn()
            }}
          >
            <Text className="text-white font-medium px-3">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function TopActionButtons({
  schedule,
}: {
  schedule: Schedule & {
    scheduleInvites: ScheduleInvite[]
  }
}) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { refetch: refetchSchedule } = useQuery({
    queryKey: ["getSchedule", schedule.userId, schedule.isoDate],
    queryFn: () => getSchedule(schedule.userId, schedule.isoDate),
  })

  const { mutate: doEditSchedule } = useMutation({
    mutationKey: ["editSchedule", schedule.userId, schedule.isoDate],
    mutationFn: () =>
      editSchedule({
        userId: schedule.userId,
        isoDate: schedule.isoDate,
        movieId: schedule.movieId,
        newIsoDate: schedule.isoDate,
        isPending: false,
        notificationId: schedule.notificationId,
        invitedFriendIds: schedule.scheduleInvites.map(
          (scheduleInvite) => scheduleInvite.friendId
        ),
      }),
    onSuccess: () => {
      refetchSchedule()
      doRemoveWatchlistMovie({
        userId: schedule.userId,
        movieId: schedule.movieId,
      })
    },
  })

  const { refetch: refetchWatchlistMovies } = useQuery({
    queryKey: ["getWatchlistMovies", schedule.userId],
    queryFn: () => getWatchlistMovies(schedule.userId),
  })

  const { mutate: doRemoveWatchlistMovie } = useMutation({
    mutationKey: ["removeWatchlistMovie", schedule.userId, schedule.movieId],
    mutationFn: (values: { userId: string; movieId: number }) =>
      removeWatchlistMovie(values.userId, values.movieId),
    onSuccess: () => {
      refetchWatchlistMovies()
      doAddWatchedMovie({
        userId: schedule.userId,
        movieId: schedule.movieId,
      })
    },
  })

  const { refetch: refetchWatchedMovies } = useQuery({
    queryKey: ["getWatchedMovies", schedule.userId],
    queryFn: () => getWatchedMovies(schedule.userId),
  })

  const { refetch: refetchSavedMovies } = useQuery({
    queryKey: ["getSavedMovies", schedule.userId],
    queryFn: () => getSavedMovies(schedule.userId),
  })

  const { mutate: doAddWatchedMovie } = useMutation({
    mutationKey: ["addWatchedMovie", schedule.userId, schedule.movieId],
    mutationFn: (values: { userId: string; movieId: number }) =>
      addWatchedMovie(values.userId, values.movieId),
    onSuccess: () => {
      refetchWatchedMovies()
      refetchSavedMovies()
    },
  })

  const {
    isLoading,
    isError,
    data: review,
    refetch: refetchReview,
  } = useQuery({
    queryKey: ["reviewDetails", schedule.movieId, schedule.userId],
    queryFn: () => getMovieReview(schedule.movieId, schedule.userId),
  })
  useRefreshOnFocus(refetchReview)

  if (schedule.isPending)
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.5}
          className="[background-color:_#FE6007] rounded-md py-1"
          onPress={() => {
            setIsModalVisible(true)
          }}
        >
          <Text className="text-white font-medium px-3">Done</Text>
        </TouchableOpacity>
        <ScheduleDoneConfirmationModal
          isVisible={isModalVisible}
          closeFn={() => setIsModalVisible(false)}
          actionFn={() => doEditSchedule()}
        />
      </View>
    )

  if (isLoading)
    return (
      <View>
        <View className="border [border-color:_#FE6007] rounded-md py-1">
          <Text className="[color:_#FE6007] font-medium px-3">...</Text>
        </View>
      </View>
    )

  if (isError)
    return (
      <View>
        <View className="border [border-color:_#FE6007] rounded-md py-1">
          <Text className="text-red-500 font-medium px-3">error</Text>
        </View>
      </View>
    )

  if (!review)
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.6}
          className="border [border-color:_#FE6007] rounded-md py-1"
          onPress={() =>
            router.push({
              pathname: "/movies/[movieId]/review/create",
              params: {
                movieId: schedule.movieId,
              },
            })
          }
        >
          <Text className="[color:_#FE6007] font-medium px-3">Review</Text>
        </TouchableOpacity>
      </View>
    )
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        className="border [border-color:_#FE6007] rounded-md py-1"
        onPress={() =>
          router.push({
            pathname: "/movies/[movieId]/review/edit",
            params: {
              movieId: schedule.movieId,
            },
          })
        }
      >
        <Text className="[color:_#FE6007] font-medium px-3">Review</Text>
      </TouchableOpacity>
    </View>
  )
}

function MovieDetailsSection({
  movieDetails,
  schedule,
}: {
  movieDetails: MovieDetails
  schedule: Schedule & {
    scheduleInvites: ScheduleInvite[]
  }
}) {
  return (
    <View className="border-b border-gray-500 pb-3">
      <View className="flex-row items-baseline">
        <Text className="flex-1 text-white font-semibold text-lg mb-3">
          {movieDetails.title}
        </Text>
        <TopActionButtons schedule={schedule} />
      </View>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`,
        }}
        className="h-36 w-full rounded-2xl mb-3"
      ></Image>
      <View className="flex-row flex-wrap gap-2 mb-2">
        {movieDetails.genres.map((genre) => (
          <Text
            key={genre.id}
            className="bg-gray-500 rounded-full text-white text-xs px-2 py-1"
          >
            {genre.name}
          </Text>
        ))}
      </View>
      <View className="mb-1">
        <Text className="text-gray-400">
          {new Date(movieDetails.release_date).getFullYear()}
          {" • "}
          {movieDetails.original_language.toUpperCase()}
          {" • "}
          {movieDetails.runtime} min
        </Text>
      </View>
      <Text className="text-white">{movieDetails.overview}</Text>
    </View>
  )
}

function DateAndTimeSection({ schedule }: { schedule: Schedule }) {
  function formattedDateAndTime(dateStr: string) {
    const date = new Date(dateStr)
    const monthInt = date.getMonth() + 1
    const month = monthInt > 9 ? `${monthInt}` : `0${monthInt}`
    const dayInt = date.getDate()
    const day = dayInt > 9 ? `${dayInt}` : `0${dayInt}`

    const hoursInt = date.getHours()
    const hours = hoursInt > 9 ? `${hoursInt}` : `0${hoursInt}`
    const minutesInt = date.getMinutes()
    const minutes = minutesInt > 9 ? `${minutesInt}` : `0${minutesInt}`

    return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`
  }

  return (
    <View className="flex-row flex-1 border-b border-gray-400 pb-2">
      <View className="flex-1">
        <Text className="text-white py-2">Scheduled Date & Time</Text>
        <Text className="text-blue-500">
          {formattedDateAndTime(schedule.isoDate)}
        </Text>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            router.push({
              pathname: "/schedules/[isoDate]",
              params: {
                isoDate: schedule.isoDate,
                movieId: schedule.movieId,
              },
            })
          }}
        >
          <Text className="[color:_#FE6007] font-medium px-3">Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function ScheduleInviteItem({
  scheduleInvite,
}: {
  scheduleInvite: ScheduleInvite
}) {
  const {
    isLoading,
    isError,
    data: userProfile,
  } = useQuery({
    queryKey: ["getUserProfile", scheduleInvite.friendId],
    queryFn: () => getUserProfile(scheduleInvite.friendId),
  })

  if (isLoading)
    return <Text className="text-center text-white">Loading ...</Text>
  if (isError)
    return (
      <Text className="text-center text-red-500">
        An error occured while retrieving user profile
      </Text>
    )

  return (
    <View className="flex-row items-center gap-6 px-6 pt-4 pb-3  border-b-2 border-stone-500">
      <View className="h-20 w-20">
        {userProfile.photoURL ? (
          <Image
            className="w-full h-full rounded-full"
            source={{
              uri: userProfile.photoURL,
            }}
          />
        ) : (
          <Image
            className="w-full h-full rounded-full"
            source={require("../../../assets/no-photo-url.jpg")}
          />
        )}
      </View>
      <Text className="text-white">{userProfile.displayName}</Text>
    </View>
  )
}

function InvitedFriendsSection({
  schedule,
}: {
  schedule: Schedule & {
    scheduleInvites: ScheduleInvite[]
  }
}) {
  if (schedule.scheduleInvites.length === 0)
    return (
      <View>
        <Text className="text-white font-semibold py-2">Invited Friends</Text>
        <Text className="text-white text-center ">No friends invited.</Text>
      </View>
    )

  return (
    <View>
      <Text className="text-white font-semibold py-2">Invited Friends</Text>
      <>
        {schedule.scheduleInvites.map((scheduleInvite) => (
          <ScheduleInviteItem
            key={scheduleInvite.friendId}
            scheduleInvite={scheduleInvite}
          />
        ))}
      </>
    </View>
  )
}

function AuthenticatedWithScheduleView({
  schedule,
}: {
  schedule: Schedule & {
    scheduleInvites: ScheduleInvite[]
  }
}) {
  const {
    isLoading,
    isError,
    data: movieDetails,
  } = useQuery({
    queryKey: ["getMovieDetails", schedule.movieId],
    queryFn: () => getMovieDetails(schedule.movieId),
  })

  if (isLoading)
    return <Text className="text-center text-white">Loading ...</Text>
  if (isError)
    return (
      <Text className="text-center text-red-500">
        An error occured while retrieving movie details
      </Text>
    )

  return (
    <View className="flex-1">
      <GradientBackground />

      <ScrollView className="px-6">
        <MovieDetailsSection schedule={schedule} movieDetails={movieDetails} />
        <DateAndTimeSection schedule={schedule} />
        <InvitedFriendsSection schedule={schedule} />
      </ScrollView>
    </View>
  )
}

function AuthenticatedView({
  userId,
  isoDate,
}: {
  userId: string
  isoDate: string
}) {
  const {
    isLoading,
    isError,
    data: schedule,
  } = useQuery({
    queryKey: ["getSchedule", userId, isoDate],
    queryFn: () => getSchedule(userId, isoDate),
  })

  if (isLoading)
    return <Text className="text-center text-white">Loading ...</Text>
  if (isError)
    return (
      <Text className="text-center text-red-500">
        An error occured while retrieving schedule
      </Text>
    )

  return <AuthenticatedWithScheduleView schedule={schedule} />
}

export default function ScheduleDetailsScreen() {
  const { isoDate } = useLocalSearchParams<{ isoDate: string }>()

  return (
    <IsAuthenticatedView>
      {(user) => <AuthenticatedView userId={user.uid} isoDate={isoDate} />}
    </IsAuthenticatedView>
  )
}
