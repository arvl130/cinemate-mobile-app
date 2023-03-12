import {
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native"
import { Dimensions } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

function AppName() {
  return (
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
  )
}

function SignInForm({ onSubmitFn }: { onSubmitFn: () => void }) {
  return (
    <View className="px-12">
      <Text className="text-white my-1 font-medium">EMAIL</Text>
      <TextInput
        placeholder="email here"
        className="[background-color:_#393737] px-4 py-2 rounded-md text-white"
        placeholderTextColor={"#6F6969"}
      />
      <Text className="text-white my-1 font-medium">PASSWORD</Text>
      <TextInput
        placeholder="password here"
        className="[background-color:_#393737] px-4 py-2 rounded-md mb-1 text-white"
        placeholderTextColor={"#6F6969"}
      />
      <Text className="text-white mb-6 text-right text-xs font-medium">
        FORGOT?
      </Text>
      <TouchableOpacity
        className="[background-color:_#FE6007] rounded-md"
        onPress={onSubmitFn}
      >
        <Text className="text-white text-center py-3 font-medium">LOGIN</Text>
      </TouchableOpacity>
    </View>
  )
}

function SignInWithSection() {
  return (
    <>
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
    </>
  )
}

function NewHereSection({ gotoSignUpFn }: { gotoSignUpFn: () => void }) {
  return (
    <View className="flex-row gap-1 justify-center px-12">
      <Text className="text-white">New here?</Text>
      <TouchableOpacity onPress={gotoSignUpFn}>
        <Text className="[color:_#FE6007] underline">Create an account.</Text>
      </TouchableOpacity>
    </View>
  )
}

type LoginScreenProps = NativeStackScreenProps<{
  Login: undefined
  "Sign Up": undefined
}>

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { height } = Dimensions.get("window")
  return (
    <View className="flex-1 relative">
      <ImageBackground
        source={require("../assets/login-background.jpg")}
        resizeMode={"cover"}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height,
        }}
      >
        <View className="bg-black/50 h-full"></View>
      </ImageBackground>

      <AppName />
      <SignInForm onSubmitFn={() => {}} />
      <SignInWithSection />
      <NewHereSection
        gotoSignUpFn={() => {
          navigation.navigate("Sign Up")
        }}
      />
    </View>
  )
}
