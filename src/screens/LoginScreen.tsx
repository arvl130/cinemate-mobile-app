import {
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Text } from "../components/Text"
import { Dimensions } from "react-native"

export function LoginScreen() {
  return (
    <View className="flex-1 relative">
      <ImageBackground
        source={require("../assets/login-background.jpg")}
        resizeMode={"cover"}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height: Dimensions.get("window").height,
        }}
      >
        <View className="bg-black/50 h-full"></View>
      </ImageBackground>
      <View className="px-12">
        <View className="flex-row justify-center gap-3 mb-12 mt-36 items-end">
          <Image
            className="h-20 w-20"
            source={require("../assets/cinemate-logo.png")}
          ></Image>
          <Text
            className="text-white mb-3 text-3xl"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            cinemate
          </Text>
        </View>
        <Text
          className="text-white my-1"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          EMAIL
        </Text>
        <TextInput
          placeholder="email here"
          className="[background-color:_#393737] px-4 py-2 rounded-md text-white"
          placeholderTextColor={"#6F6969"}
        />
        <Text
          className="text-white my-1"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          PASSWORD
        </Text>
        <TextInput
          placeholder="password here"
          className="[background-color:_#393737] px-4 py-2 rounded-md mb-1 text-white"
          placeholderTextColor={"#6F6969"}
        />
        <Text
          className="text-white mb-6 text-right text-xs"
          style={{
            fontFamily: "Inter_500Medium",
          }}
        >
          FORGOT?
        </Text>
        <TouchableOpacity className="[background-color:_#FE6007] rounded-md">
          <Text
            className="text-white text-center py-3"
            style={{
              fontFamily: "Inter_500Medium",
            }}
          >
            LOGIN
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center mt-6 mb-3 px-6">
        <View className="bg-white flex-1 h-[1]"></View>
        <View>
          <Text className="text-white text-center px-6">Sign in with</Text>
        </View>
        <View className="bg-white flex-1 h-[1]"></View>
      </View>
      <View className="mb-6 flex-row justify-center gap-1">
        <Image
          className="h-12 w-12"
          source={require("../assets/social-media-icons/facebook.png")}
        ></Image>
        <Image
          className="h-12 w-12"
          source={require("../assets/social-media-icons/google.png")}
        ></Image>
      </View>
      <View className="flex-row gap-1 justify-center px-12">
        <Text className="text-white">New here?</Text>
        <Text className="[color:_#FE6007] underline">Create an account.</Text>
      </View>
    </View>
  )
}
