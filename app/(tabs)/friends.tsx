import { LinearGradient } from "expo-linear-gradient"
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native"
import Modal from "react-native-modal"
import { FontAwesome } from "@expo/vector-icons"
import { Entypo } from "@expo/vector-icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  addBlockedUser,
  getBlockedUsers,
  getFriends,
  getUserProfile,
  removeFriend,
} from "../../src/utils/api"
import { useNavigation } from "@react-navigation/native"
import { AppStackProp } from "../../src/types/routes"
import { IsAuthenticatedView } from "../../src/components/is-authenticated"
import { useState } from "react"
import { GradientBackground } from "../../src/components/gradient-bg"

function FriendsSectionItem({
  userId,
  friendId,
}: {
  userId: string
  friendId: string
}) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["userProfile", friendId],
    queryFn: () => getUserProfile(friendId),
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigation = useNavigation<AppStackProp>()

  const { refetch } = useQuery({
    queryKey: ["getFriends", userId],
    queryFn: () => getFriends(),
  })

  const { refetch: refetchBlockedUsers } = useQuery({
    queryKey: ["getBlockedUsers", userId],
    queryFn: () => getBlockedUsers(),
  })

  const { mutate: doRemoveFriend } = useMutation({
    mutationKey: ["removeFriend", userId, friendId],
    mutationFn: (values: { friendId: string }) => removeFriend(values.friendId),
    onSuccess: () => refetch(),
  })

  const { mutate: doAddBlockedUser } = useMutation({
    mutationKey: ["addBlockedUser", userId, friendId],
    mutationFn: () => addBlockedUser(friendId),
    onSuccess: () => {
      refetchBlockedUsers()
      doRemoveFriend({
        friendId,
      })
    },
  })

  if (isLoading)
    return (
      <View className="px-6 py-2 flex-row justify-center items-center">
        <Text className="text-white">Loading ...</Text>
      </View>
    )

  if (isError)
    return (
      <View className="px-6 py-2 flex-row justify-center items-center">
        <Text className="text-red-500">
          An error occured while retrieving this user.
        </Text>
      </View>
    )

  return (
    <View className="px-6 py-2 flex-row justify-between items-center">
      <View className="flex-row items-center gap-6">
        <View className="h-20 w-20">
          {data.photoURL ? (
            <Image
              className="w-full h-full rounded-full"
              source={{
                uri: data.photoURL,
              }}
            />
          ) : (
            <Image
              className="w-full h-full rounded-full"
              source={require("../../assets/no-photo-url.jpg")}
            />
          )}
        </View>
        <Text className="text-white">{data.displayName}</Text>
      </View>
      <View>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => setIsModalVisible(true)}
        >
          <Entypo name="dots-three-vertical" size={16} color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setIsModalVisible(false)}
        onBackdropPress={() => setIsModalVisible(false)}
        onSwipeComplete={() => setIsModalVisible(false)}
        swipeDirection={["down"]}
        className="m-0 justify-end"
      >
        <View className=" [background-color:_#2B2B2B] rounded-t-2xl">
          <View className="flex-row justify-center pt-4">
            <View className="bg-white h-1 rounded-full w-6"></View>
          </View>
          <View className="flex-row items-center gap-6 px-6 pt-4 pb-3  border-b-2 border-stone-500">
            <View className="h-20 w-20">
              {data.photoURL ? (
                <Image
                  className="w-full h-full rounded-full"
                  source={{
                    uri: data.photoURL,
                  }}
                />
              ) : (
                <Image
                  className="w-full h-full rounded-full"
                  source={require("../../assets/no-photo-url.jpg")}
                />
              )}
            </View>
            <Text className="text-white">{data.displayName}</Text>
          </View>
          <View className="px-12 pt-3 pb-6">
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setIsModalVisible(false)
                navigation.push("Friend Profile", {
                  friendId,
                })
              }}
            >
              <Text className="text-white">View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setIsModalVisible(false)
                doRemoveFriend({ friendId })
              }}
            >
              <Text className="text-white">Remove Friend</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setIsModalVisible(false)
                doAddBlockedUser()
              }}
            >
              <Text className="text-white">Block</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

function FriendsSection({ userId }: { userId: string }) {
  const {
    isLoading,
    isError,
    data: friends,
  } = useQuery({
    queryKey: ["getFriends", userId],
    queryFn: () => getFriends(),
  })

  if (isLoading)
    return (
      <View>
        <Text className="text-white text-center py-6">Loading ...</Text>
      </View>
    )

  if (isError)
    return (
      <View>
        <Text className="text-white text-center py-6">
          An error occured while retrieving friends :{"("}
        </Text>
      </View>
    )

  if (friends.length === 0)
    return (
      <View>
        <Text className="text-white text-center py-6">No friends added.</Text>
      </View>
    )

  return (
    <View>
      <View className="px-6 py-3 flex-row justify-between">
        <Text className="text-white">Sorted by Default</Text>
        <Text>
          <FontAwesome name="sort-alpha-asc" size={16} color="white" />
        </Text>
      </View>
      {friends.map((friend) => (
        <FriendsSectionItem
          key={friend.friendId}
          userId={userId}
          friendId={friend.friendId}
        />
      ))}
    </View>
  )
}

export default function FriendsScreen() {
  const navigation = useNavigation<AppStackProp>()

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <GradientBackground />

        <ScrollView>
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
          <View className="px-6 mb-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("Search Friends")
              }}
            >
              <LinearGradient
                colors={["rgba(254, 96, 7, 0.3)", "rgba(237, 185, 123, 0.3)"]}
                locations={[0, 1]}
                start={{ x: -1, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl border border-white/20 px-6 py-3"
              >
                <Text className="text-white/20">Search friends ...</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-white font-medium px-6 pb-3 text-lg border-b [border-color:_#2B2B2B]">
              My Friends
            </Text>

            <IsAuthenticatedView>
              {(user) => <FriendsSection userId={user.uid} />}
            </IsAuthenticatedView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
