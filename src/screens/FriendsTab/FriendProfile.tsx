import { useMutation, useQuery } from "@tanstack/react-query"
import { LinearGradient } from "expo-linear-gradient"
import {
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native"
import {
  addFriend,
  getMovieDetails,
  getUserProfile,
  getWatchedMovies,
  removeFriend,
} from "../../utils/api"
import { Text } from "react-native"
import { Image } from "react-native"
import { ReactNode, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { AppStackProp } from "../../types/routes"
import { IsAuthenticatedView } from "../../components/is-authenticated"
import { getFriends } from "../../utils/api"

const { height } = Dimensions.get("window")

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
  const { isLoading, isError, data } = useQuery({
    queryKey: ["watchedMovies", friendId],
    queryFn: () => getWatchedMovies(friendId),
  })

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
  return (
    <ScrollView>
      <Text className="text-white">Watchlist Tab</Text>
    </ScrollView>
  )
}

function ScheduledTab({ friendId }: { friendId: string }) {
  return (
    <ScrollView>
      <Text className="text-white">Scheduled Tab</Text>
    </ScrollView>
  )
}

function ReviewedTab({ friendId }: { friendId: string }) {
  return (
    <ScrollView>
      <Text className="text-white">Reviewed Tab</Text>
    </ScrollView>
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

function FriendButtons({
  userId,
  friendId,
}: {
  userId: string
  friendId: string
}) {
  const {
    isLoading,
    isError,
    data: friends,
    refetch,
  } = useQuery({
    queryKey: ["getFriends", userId],
    queryFn: () => getFriends(),
  })

  const { mutate: doAddFriend } = useMutation({
    mutationKey: ["addFriend", userId, friendId],
    mutationFn: (values: { friendId: string }) => addFriend(values.friendId),
    onSuccess: () => refetch(),
  })

  const { mutate: doRemoveFriend } = useMutation({
    mutationKey: ["removeFriend", userId, friendId],
    mutationFn: (values: { friendId: string }) => removeFriend(values.friendId),
    onSuccess: () => refetch(),
  })

  if (isLoading)
    return (
      <View>
        <Text className="text-white text-center">Loading ...</Text>
      </View>
    )

  if (isError)
    return (
      <View>
        <Text className="text-red-500 text-center">
          An error occured while retrieving friends.
        </Text>
      </View>
    )

  const isFriend = friends.some((friend) => friend.friendId === friendId)

  if (isFriend)
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.6}
          className="bg-red-500 rounded-md font-medium mb-3"
          onPress={() => doRemoveFriend({ friendId })}
        >
          <Text className="text-white text-center py-3 font-medium">
            Remove Friend
          </Text>
        </TouchableOpacity>
      </View>
    )
  else
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.6}
          className="[background-color:_#FE6007] rounded-md font-medium mb-3"
          onPress={() => doAddFriend({ friendId })}
        >
          <Text className="text-white text-center py-3 font-medium">
            Add Friend
          </Text>
        </TouchableOpacity>
      </View>
    )
}

export function FriendProfileScreen({ route }: any) {
  const { friendId } = route.params
  const {
    isLoading,
    isError,
    data: userRecord,
  } = useQuery({
    queryKey: ["userProfile", friendId],
    queryFn: () => {
      return getUserProfile(friendId)
    },
  })

  const [selectedTab, setSelectedTab] = useState<
    "WATCHED" | "WATCHLIST" | "SCHEDULED" | "REVIEWED"
  >("WATCHED")

  return (
    <View className="flex-1 px-3">
      <LinearGradient
        colors={["#000000", "#393737"]}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height,
        }}
      />

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
                    <View className="w-20 h-20">
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
                  <IsAuthenticatedView>
                    {(user) => (
                      <FriendButtons userId={user.uid} friendId={friendId} />
                    )}
                  </IsAuthenticatedView>
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
                {selectedTab === "WATCHED" && (
                  <WatchedTab friendId={friendId} />
                )}
                {selectedTab === "WATCHLIST" && (
                  <WatchlistTab friendId={friendId} />
                )}
                {selectedTab === "SCHEDULED" && (
                  <ScheduledTab friendId={friendId} />
                )}
                {selectedTab === "REVIEWED" && (
                  <ReviewedTab friendId={friendId} />
                )}
              </>
            )}
          </>
        )}
      </>
    </View>
  )
}
