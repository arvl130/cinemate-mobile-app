import { LinearGradient } from "expo-linear-gradient"
import {
  Dimensions,
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { Entypo } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { getUserProfile } from "../../utils/api"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

const { height } = Dimensions.get("window")

function FriendSectionItem({ friendId }: { friendId: string }) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["userProfile", friendId],
    queryFn: () => getUserProfile(friendId),
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
        <Image
          source={require("../../assets/friends/eunice.jpg")}
          className="h-20 w-20 rounded-full"
        ></Image>
        <Text className="text-white">{data.displayName}</Text>
      </View>
      <View>
        <TouchableOpacity activeOpacity={0.3} onPress={() => {}}>
          <Entypo name="dots-three-vertical" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export function FriendsScreen() {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      "Search Friends": undefined
    }>
  >()

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <LinearGradient
          colors={["#000000", "#393737"]}
          className="absolute left-0 right-0 top-0 bottom-0"
          style={{
            height,
          }}
        />

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
            <View className="px-6 py-3 flex-row justify-between">
              <Text className="text-white">Sorted by Default</Text>
              <Text>
                <FontAwesome name="sort-alpha-asc" size={16} color="white" />
              </Text>
            </View>

            <View></View>
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
