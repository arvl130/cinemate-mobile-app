import { LinearGradient } from "expo-linear-gradient"
import { signOut } from "firebase/auth"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { auth } from "../../firebase"

const { height } = Dimensions.get("window")

export function AccountSettingsScreen() {
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
        <Text className=" text-white text-lg">Account Settings</Text>
      </View>
      <View className="px-3">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-red-500 rounded-md"
          onPress={() => signOut(auth)}
        >
          <Text className="text-white text-center px-4 py-3 uppercase font-medium">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
