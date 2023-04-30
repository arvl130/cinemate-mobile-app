import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { GradientBackground } from "../../components/gradient-bg"
import { IsAuthenticatedView } from "../../components/is-authenticated"
import { getMovieDetails, getSchedule, getUserProfile } from "../../utils/api"
import { useQuery } from "@tanstack/react-query"
import { Schedule, ScheduleInvite } from "../../types/schedule"
import { MovieDetails } from "tmdb-ts"
import { AppStackProp } from "../../types/routes"
import { useNavigation } from "@react-navigation/native"

function MovieDetailsSection({ movieDetails }: { movieDetails: MovieDetails }) {
  return (
    <View className="border-b border-gray-500 pb-3">
      <Text className="text-white font-semibold text-lg mb-3">
        {movieDetails.title}
      </Text>
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
  const navigation = useNavigation<AppStackProp>()

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
            navigation.push("Edit Schedule", {
              isoDate: schedule.isoDate,
              movieId: schedule.movieId,
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
            source={require("../../assets/no-photo-url.jpg")}
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
        <MovieDetailsSection movieDetails={movieDetails} />
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

export function ScheduleDetailsScreen({ route }: any) {
  const { isoDate } = route.params
  return (
    <IsAuthenticatedView>
      {(user) => <AuthenticatedView userId={user.uid} isoDate={isoDate} />}
    </IsAuthenticatedView>
  )
}
