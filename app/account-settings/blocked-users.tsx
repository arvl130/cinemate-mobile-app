import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { GradientBackground } from "../../src/components/gradient-bg"
import { IsAuthenticatedView } from "../../src/components/is-authenticated"
import { User } from "firebase/auth"
import {
  getBlockedUsers,
  getUserProfile,
  removeBlockedUser,
} from "../../src/utils/api"
import { useMutation, useQuery } from "@tanstack/react-query"

function BlockedUserItem({
  userId,
  blockedUserId,
}: {
  userId: string
  blockedUserId: string
}) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["userProfile", blockedUserId],
    queryFn: () => getUserProfile(blockedUserId),
  })

  const { refetch } = useQuery({
    queryKey: ["getBlockedUsers", userId],
    queryFn: () => getBlockedUsers(),
  })
  const { mutate: doRemoveBlockedUser } = useMutation({
    mutationKey: ["removeFriend", userId, blockedUserId],
    mutationFn: () => removeBlockedUser(blockedUserId),
    onSuccess: () => refetch(),
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
          An error occured while retrieving user.
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
          onPress={() => doRemoveBlockedUser()}
        >
          <Text className="text-white text-center font-medium [color:_#FE6007]">
            Unblock
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function MainContent({ user }: { user: User }) {
  const {
    isLoading,
    isError,
    data: blockedUsers,
  } = useQuery({
    queryKey: ["getBlockedUsers", user.uid],
    queryFn: () => getBlockedUsers(),
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
          An error occured while retrieving blocked users.
        </Text>
      </View>
    )

  if (blockedUsers.length === 0)
    return (
      <View>
        <Text className="text-white text-center py-6">No blocked users.</Text>
      </View>
    )

  return (
    <ScrollView>
      {blockedUsers.map((blockedUser) => (
        <BlockedUserItem
          key={blockedUser.blockedUserId}
          userId={blockedUser.userId}
          blockedUserId={blockedUser.blockedUserId}
        />
      ))}
    </ScrollView>
  )
}

export function BlockedUsersScreen() {
  return (
    <View className="flex-1">
      <GradientBackground />
      <IsAuthenticatedView>
        {(user) => <MainContent user={user} />}
      </IsAuthenticatedView>
    </View>
  )
}
