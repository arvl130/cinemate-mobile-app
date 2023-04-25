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
import { Ionicons } from "@expo/vector-icons"

const { height } = Dimensions.get("window")

export function SchedulesScreen() {
  return (
    <SafeAreaView className="flex-1">
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
          <View>
            <Text className="text-white font-medium px-6 text-lg">My List</Text>
            <View className="px-6 pb-3 flex-row justify-between border-b [border-color:_#2B2B2B]">
              <Text className="text-white">Sorted by Date Added</Text>
              <Text>
                <FontAwesome name="sort-alpha-asc" size={16} color="white" />
              </Text>
            </View>
            <View>
              <TouchableOpacity activeOpacity={0.7}>
                <View className="px-1 py-1 border-b [border-color:_#2B2B2B] flex-row flex-[0]">
                  <View className="flex-[2]">
                    <Image
                      source={require("../../assets/posters/comeplay.jpg")}
                      className="h-36 w-24 rounded-md"
                    ></Image>
                  </View>
                  <View className="px-1 py-1 flex-[5]">
                    <View className="flex-row border-b-2 [border-color:_#2B2B2B]">
                      <View className=" pb-3 flex-grow">
                        <Text className="text-white text-lg font-medium">
                          Come Play
                        </Text>
                        <Text className="[color:_#7E7979]">1hr 36m</Text>
                      </View>
                      <View>
                        <Ionicons
                          name="ios-remove-circle"
                          size={16}
                          color="gray"
                        />
                      </View>
                    </View>
                    <View className="pb-1 pt-1 flex-row gap-2 items-center">
                      <FontAwesome name="calendar" size={20} color="#3b82f6" />
                      <Text className="text-blue-500">
                        Scheduled on March 1
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
