import { LinearGradient } from "expo-linear-gradient"
import { Dimensions, Text, View } from "react-native"

const { height } = Dimensions.get("window")

export function SchedulesScreen() {
  return (
    <View>
      <LinearGradient
        colors={["#000000", "#393737"]}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height,
        }}
      />

      <View className="h-14 flex-row justify-center items-center">
        <Text className=" text-white text-lg">Schedules</Text>
      </View>
    </View>
  )
}
