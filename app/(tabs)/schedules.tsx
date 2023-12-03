import { LinearGradient } from "expo-linear-gradient"
import {
  Dimensions,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { GradientBackground } from "../../src/components/gradient-bg"
import { useQuery } from "@tanstack/react-query"
import { getMovieDetails, getSchedules } from "../../src/utils/api"
import { IsAuthenticatedView } from "../../src/components/is-authenticated"
import { Schedule } from "../../src/types/schedule"
import { useRefreshOnFocus } from "../../src/utils/refresh-on-focus"
import { router } from "expo-router"

function CinemateLogo() {
  return (
    <View className="flex-row justify-center items-center gap-3 mt-3 mb-6">
      <Image
        className="h-12 w-12"
        source={require("../../assets/cinemate-logo.png")}
      />
      <Text
        className="text-white text-center text-2xl"
        style={{
          fontFamily: "Inter_500Medium",
        }}
      >
        cinemate
      </Text>
    </View>
  )
}

function SearchSection() {
  return (
    <View className="px-6 mb-3">
      <TouchableOpacity>
        <LinearGradient
          colors={["rgba(254, 96, 7, 0.3)", "rgba(237, 185, 123, 0.3)"]}
          locations={[0, 1]}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl border border-white/20 px-6 py-3"
        >
          <Text className="text-white/20">Search schedules ...</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

function SchedulesSectionItem({ schedule }: { schedule: Schedule }) {
  const {
    isLoading,
    isError,
    data: movieDetails,
  } = useQuery({
    queryKey: ["getMovieDetails", schedule.movieId],
    queryFn: () => getMovieDetails(schedule.movieId),
  })

  function formattedDate(dateStr: string) {
    const date = new Date(dateStr)
    const monthInt = date.getMonth() + 1
    const month = monthInt > 9 ? `${monthInt}` : `0${monthInt}`
    const dayInt = date.getDate()
    const day = dayInt > 9 ? `${dayInt}` : `0${dayInt}`

    return `${date.getFullYear()}-${month}-${day}`
  }

  if (isLoading) return <Text className="text-center text-white">...</Text>
  if (isError)
    return <Text className="text-center text-red-500">Error occured</Text>

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: "/schedules/[isoDate]",
          params: {
            isoDate: schedule.isoDate,
          },
        })
      }}
    >
      <View className="px-1 py-1 border-b [border-color:_#2B2B2B] flex-row flex-[0]">
        <View className="flex-[2]">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`,
            }}
            className="h-36 w-24 rounded-md"
          ></Image>
        </View>
        <View className="px-1 py-1 flex-[5]">
          <View className="flex-row border-b-2 [border-color:_#2B2B2B]">
            <View className="pb-3 flex-grow">
              <Text className="text-white text-lg font-medium">
                {movieDetails.title}
              </Text>
              <Text className="[color:_#7E7979]">
                {movieDetails.runtime} min
              </Text>
            </View>
          </View>
          <View className="pb-1 pt-1 flex-row gap-2 items-center">
            <FontAwesome name="calendar" size={20} color="#3b82f6" />
            <Text className="text-blue-500">
              Scheduled on {formattedDate(schedule.isoDate)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function SchedulesSection({ userId }: { userId: string }) {
  const {
    isLoading,
    isError,
    data: schedules,
    refetch,
  } = useQuery({
    queryKey: ["getSchedules", userId],
    queryFn: () => getSchedules(userId),
  })
  useRefreshOnFocus(refetch)

  return (
    <View>
      <Text className="text-white font-medium px-6 text-lg">My List</Text>
      <View className="px-6 pb-3 flex-row justify-between border-b [border-color:_#2B2B2B]">
        <Text className="text-white">Sorted by Date Added</Text>
        <Text>
          <FontAwesome name="sort-alpha-asc" size={16} color="white" />
        </Text>
      </View>
      <View>
        {isLoading ? (
          <Text className="text-center text-white py-6">Loading ...</Text>
        ) : (
          <>
            {isError ? (
              <Text className="text-center text-white py-6">
                An error occured while fetching schedules.
              </Text>
            ) : (
              <>
                {schedules.length === 0 ? (
                  <Text className="text-center text-white py-6">
                    No schedules yet.
                  </Text>
                ) : (
                  <>
                    {schedules.map((schedule) => (
                      <SchedulesSectionItem
                        key={schedule.isoDate}
                        schedule={schedule}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </View>
    </View>
  )
}

export default function SchedulesScreen() {
  return (
    <SafeAreaView className="flex-1">
      <View>
        <GradientBackground />
        <CinemateLogo />

        <ScrollView>
          <SearchSection />
          <IsAuthenticatedView>
            {(user) => <SchedulesSection userId={user.uid} />}
          </IsAuthenticatedView>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
