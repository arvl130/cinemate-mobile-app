import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useNavigation } from "@react-navigation/native"

const { height } = Dimensions.get("window")

export function MovieDetailsScreen({ route }: any) {
  const { id } = route.params
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      Home: undefined
      Search: {
        query: string
      }
    }>
  >()

  return (
    <View>
      <LinearGradient
        colors={["#000000", "#393737"]}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height,
        }}
      />
      <ScrollView>
        <View className="flex-row py-3 px-3 h-14">
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Ionicons name="arrow-back" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <View className="h-14 flex-row justify-center items-center">
          <Text className=" text-white text-lg">Movie Details</Text>
          <Text className="text-white">Current movie ID: {id}</Text>
        </View>
      </ScrollView>
    </View>
  )
}
