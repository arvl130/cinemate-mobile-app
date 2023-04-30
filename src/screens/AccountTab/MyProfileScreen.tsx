import { useQuery } from "@tanstack/react-query"
import { FlatList, TouchableOpacity, View } from "react-native"
import {
  getMovieDetails,
  getReviewedMovies,
  getSchedules,
  getUserProfile,
  getWatchedMovies,
  getWatchlistMovies,
} from "../../utils/api"
import { Text, Image } from "react-native"
import Modal from "react-native-modal"
import { ReactNode, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { AppStackProp } from "../../types/routes"
import { IsAuthenticatedView } from "../../components/is-authenticated"
import { Review } from "../../types/review"
import { Entypo, Ionicons } from "@expo/vector-icons"
import { GradientBackground } from "../../components/gradient-bg"
import { useRefreshOnFocus } from "../../utils/refresh-on-focus"

function MovieItem({ movieId }: { movieId: number }) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => getMovieDetails(movieId),
  })

  const navigation = useNavigation<AppStackProp>()

  if (isLoading) return <Text className="text-white text-center">...</Text>
  if (isError) return <Text className="text-red-500 text-center">Error</Text>

  return (
    <View
      style={{
        flex: 1 / 3,
        marginHorizontal: 4,
        marginBottom: 8,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate("Movie Details", {
            movieId,
          })
        }}
      >
        <Image
          className="h-32 rounded-2xl"
          source={{
            uri: `https://image.tmdb.org/t/p/original/${data.poster_path}`,
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

function WatchedTab({ friendId }: { friendId: string }) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["watchedMovies", friendId],
    queryFn: () => getWatchedMovies(friendId),
  })
  useRefreshOnFocus(refetch)

  if (isLoading)
    return <Text className="text-white text-center">Loading ...</Text>

  if (isError)
    return (
      <Text className="text-white text-center">
        An error occured while retrieving watched movies :{"("}
      </Text>
    )

  if (data.length === 0)
    return (
      <View>
        <Text className="text-white text-center">No watched movies yet.</Text>
      </View>
    )

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <MovieItem movieId={item.movieId} />}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

function WatchlistTab({ friendId }: { friendId: string }) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["getWatchlistMovies", friendId],
    queryFn: () => getWatchlistMovies(friendId),
  })
  useRefreshOnFocus(refetch)

  if (isLoading)
    return <Text className="text-white text-center">Loading ...</Text>

  if (isError)
    return (
      <Text className="text-white text-center">
        An error occured while retrieving watchlist movies :{"("}
      </Text>
    )

  if (data.length === 0)
    return (
      <View>
        <Text className="text-white text-center">No watchlist movies yet.</Text>
      </View>
    )

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <MovieItem movieId={item.movieId} />}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

function ReviewItem({ review }: { review: Review }) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["movieDetails", review.movieId],
    queryFn: () => getMovieDetails(review.movieId),
  })
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false)

  function formattedDate(dateStr: string) {
    const date = new Date(dateStr)
    const monthInt = date.getMonth() + 1
    const month = monthInt > 9 ? `${monthInt}` : `0${monthInt}`
    const dayInt = date.getDate()
    const day = dayInt > 9 ? `${dayInt}` : `0${dayInt}`
    return `${month}/${day}/${date.getFullYear()}`
  }

  if (isLoading) return <Text className="text-white text-center">...</Text>
  if (isError) return <Text className="text-red-500 text-center">Error</Text>

  return (
    <View
      style={{
        flex: 1 / 3,
        marginHorizontal: 4,
        marginBottom: 8,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => setIsReviewModalVisible(true)}
      >
        <Image
          className="h-32 rounded-2xl"
          source={{
            uri: `https://image.tmdb.org/t/p/original/${data.poster_path}`,
          }}
        />
      </TouchableOpacity>
      <Modal
        isVisible={isReviewModalVisible}
        onBackButtonPress={() => setIsReviewModalVisible(false)}
        onBackdropPress={() => setIsReviewModalVisible(false)}
      >
        <View className="[background-color:_#2b2b2b] h-96 w-72 mx-auto px-6 pt-3 pb-5 rounded-2xl">
          <View className="flex-row  items-center gap-1 mb-2">
            <TouchableOpacity onPress={() => setIsReviewModalVisible(false)}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-semibold text-lg pb-1">
              Review
            </Text>
          </View>
          <View className="flex-1">
            <View className="flex-row">
              <Image
                className="h-32 w-24 rounded-2xl "
                source={{
                  uri: `https://image.tmdb.org/t/p/original/${data.poster_path}`,
                }}
              />
              <View className="flex-1 pl-3">
                <Text className="text-white font-medium mb-1">
                  {data.title}
                </Text>
                <View className="mb-1">
                  <Text className="text-gray-400 text-xs">
                    {new Date(data.release_date).getFullYear()}
                    {" • "}
                    {data.original_language.toUpperCase()}
                    {" • "}
                    {data.runtime} min
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {data.genres.map((genre) => (
                    <Text
                      key={genre.id}
                      className="bg-gray-500 rounded-full text-white text-xs px-2 py-1"
                    >
                      {genre.name}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <View className="flex-row justify-between gap-1 mt-1">
              <View className="flex-row">
                {[...Array(review.rating)].map((value, index) => (
                  <Text key={index}>
                    <Entypo name="star" size={16} color={"#facc15"} />
                  </Text>
                ))}
              </View>
              <Text className="text-white">
                {formattedDate(review.createdAt)}
              </Text>
            </View>
            <View className="flex-1 flex-row [background-color:_#D9D9D9] mt-3 px-3 py-2 rounded-2xl">
              <Text className="[color:_#6F6969] italic">{review.details}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

function ReviewedTab({ friendId }: { friendId: string }) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["getReviewedMovies", friendId],
    queryFn: () => getReviewedMovies(friendId),
  })
  useRefreshOnFocus(refetch)

  if (isLoading)
    return <Text className="text-white text-center">Loading ...</Text>

  if (isError)
    return (
      <Text className="text-white text-center">
        An error occured while retrieving reviewed movies :{"("}
      </Text>
    )

  if (data.length === 0)
    return (
      <View>
        <Text className="text-white text-center">No reviewed movies yet.</Text>
      </View>
    )

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ReviewItem review={item} />}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

function ScheduledTab({ friendId }: { friendId: string }) {
  const {
    isLoading,
    isError,
    data: schedules,
    refetch,
  } = useQuery({
    queryKey: ["getSchedules", friendId],
    queryFn: () => getSchedules(friendId),
  })
  useRefreshOnFocus(refetch)

  if (isLoading)
    return <Text className="text-white text-center">Loading ...</Text>

  if (isError)
    return (
      <Text className="text-white text-center">
        An error occured while retrieving reviewed movies :{"("}
      </Text>
    )

  if (schedules.length === 0)
    return (
      <View>
        <Text className="text-white text-center">
          No scheduled movies right now.
        </Text>
      </View>
    )

  return (
    <FlatList
      data={schedules}
      renderItem={({ item }) => <MovieItem movieId={item.movieId} />}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

function ProfileTab({
  children,
  onPress,
  isSelected,
}: {
  children: ReactNode
  onPress: () => void
  isSelected: boolean
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className="flex-1 font-medium mb-3"
      onPress={onPress}
    >
      <Text
        className={`${
          isSelected ? "text-white" : "text-gray-500"
        } text-center py-3 font-medium`}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}

function OtherSettingsModal({
  isVisible,
  closeFn,
}: {
  isVisible: boolean
  closeFn: () => void
}) {
  const navigation = useNavigation<AppStackProp>()

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => closeFn()}
      onBackdropPress={() => closeFn()}
      onSwipeComplete={() => closeFn()}
      swipeDirection={["down"]}
      className="m-0 justify-end"
    >
      <View className=" [background-color:_#2B2B2B] rounded-t-2xl">
        <View className="flex-row justify-center pt-6">
          <View className="bg-white h-1 rounded-full w-6"></View>
        </View>
        <View className="px-12 pt-3 pb-6">
          <TouchableOpacity
            className="py-3"
            onPress={() => {
              navigation.push("Account Settings")
              closeFn()
            }}
          >
            <Text className="text-white">Account Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3"
            onPress={() => {
              navigation.push("Blocked Users")
              closeFn()
            }}
          >
            <Text className="text-white">Blocked Users</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function HamburgerMenu({ actionFn }: { actionFn: () => void }) {
  return (
    <TouchableOpacity onPress={actionFn}>
      <Entypo name="dots-three-vertical" size={20} color="white" />
    </TouchableOpacity>
  )
}

export function UserLodaded({ userId }: { userId: string }) {
  const {
    isLoading,
    isError,
    data: userRecord,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => {
      return getUserProfile(userId)
    },
  })
  useRefreshOnFocus(refetch)

  const [selectedTab, setSelectedTab] = useState<
    "WATCHED" | "WATCHLIST" | "SCHEDULED" | "REVIEWED"
  >("WATCHED")

  const [isOtherSettingsModalVisible, setIsOtherSettingsModalVisible] =
    useState(false)

  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HamburgerMenu actionFn={() => setIsOtherSettingsModalVisible(true)} />
      ),
    })
  }, [])

  return (
    <View className="flex-1 px-3">
      <GradientBackground />

      <>
        {isLoading ? (
          <Text>Loading ...</Text>
        ) : (
          <>
            {isError ? (
              <Text>An error occured while</Text>
            ) : (
              <>
                <View>
                  <View className="flex-row justify-center mb-3">
                    <View className="w-24 h-24">
                      {userRecord.photoURL ? (
                        <Image
                          className="w-full h-full rounded-full"
                          source={{
                            uri: userRecord.photoURL,
                          }}
                        />
                      ) : (
                        <Image
                          className="w-full h-full rounded-full"
                          source={require("../../assets/no-photo-url.jpg")}
                        />
                      )}
                    </View>
                  </View>
                  <View className="mb-3">
                    <Text className="text-white text-center text-lg font-medium">
                      {userRecord.displayName}
                    </Text>
                    <Text className="text-gray-500 text-center">
                      {userRecord.email}
                    </Text>
                  </View>
                  <View className="flex-row flex-3 mb-3">
                    <View className="flex-1 items-center">
                      <Text className="text-white font-semibold text-lg">
                        123
                      </Text>
                      <Text className="text-white">Friends</Text>
                    </View>
                    <View className="flex-1 items-center">
                      <Text className="text-white font-semibold text-lg">
                        456
                      </Text>
                      <Text className="text-white">Watched</Text>
                    </View>
                    <View className="flex-1 items-center">
                      <Text className="text-white font-semibold text-lg">
                        789
                      </Text>
                      <Text className="text-white">Scheduled</Text>
                    </View>
                  </View>
                  <View className="flex-row justify-evenly">
                    <ProfileTab
                      isSelected={selectedTab === "WATCHED"}
                      onPress={() => setSelectedTab("WATCHED")}
                    >
                      Watched
                    </ProfileTab>
                    <ProfileTab
                      isSelected={selectedTab === "WATCHLIST"}
                      onPress={() => setSelectedTab("WATCHLIST")}
                    >
                      Watchlist
                    </ProfileTab>
                    <ProfileTab
                      isSelected={selectedTab === "SCHEDULED"}
                      onPress={() => setSelectedTab("SCHEDULED")}
                    >
                      Scheduled
                    </ProfileTab>
                    <ProfileTab
                      isSelected={selectedTab === "REVIEWED"}
                      onPress={() => setSelectedTab("REVIEWED")}
                    >
                      Reviewed
                    </ProfileTab>
                  </View>
                </View>
                {selectedTab === "WATCHED" && <WatchedTab friendId={userId} />}
                {selectedTab === "WATCHLIST" && (
                  <WatchlistTab friendId={userId} />
                )}
                {selectedTab === "SCHEDULED" && (
                  <ScheduledTab friendId={userId} />
                )}
                {selectedTab === "REVIEWED" && (
                  <ReviewedTab friendId={userId} />
                )}
                <OtherSettingsModal
                  isVisible={isOtherSettingsModalVisible}
                  closeFn={() => setIsOtherSettingsModalVisible(false)}
                />
              </>
            )}
          </>
        )}
      </>
    </View>
  )
}

export function MyProfileScreen({ route }: any) {
  return (
    <IsAuthenticatedView>
      {(user) => <UserLodaded userId={user.uid} />}
    </IsAuthenticatedView>
  )
}
