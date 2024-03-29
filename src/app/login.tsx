import {
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native"
import { Dimensions } from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useState } from "react"
import { router } from "expo-router"

function AppName() {
  return (
    <View className="flex-row justify-center gap-3 mb-12 mt-36 items-end">
      <Image
        className="h-20 w-20"
        source={require("../../assets/cinemate-logo.png")}
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

function SignInForm({
  onForgotPasswordFn,
}: {
  onForgotPasswordFn: () => void
}) {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <View className="px-12">
      <Text className="text-white my-1 font-medium">EMAIL</Text>
      <TextInput
        placeholder="john@example.com"
        className="[background-color:_#393737] px-4 py-2 rounded-md text-white"
        placeholderTextColor={"#6F6969"}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Text className="text-white my-1 font-medium">PASSWORD</Text>
      <TextInput
        placeholder="********"
        className="[background-color:_#393737] px-4 py-2 rounded-md mb-1 text-white"
        placeholderTextColor={"#6F6969"}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View className="flex-row justify-end">
        <TouchableOpacity onPress={onForgotPasswordFn} activeOpacity={0.8}>
          <Text className="text-white mb-6 text-xs font-medium">
            FORGOT PASSWORD?
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={async () => {
          setIsSigningIn(true)
          try {
            await signInWithEmailAndPassword(auth, email, password)
            setEmail("")
            router.push("/(tabs)")
          } catch {
            Alert.alert(
              "Invalid",
              "You have entered an invalid email or password."
            )
          } finally {
            setIsSigningIn(false)
            setPassword("")
          }
        }}
      >
        <View
          style={{
            opacity: isSigningIn ? 0.6 : 1,
            backgroundColor: "#FE6007",
            borderRadius: 6,
          }}
        >
          <Text className="text-white text-center py-3 font-medium">
            {isSigningIn ? "LOGGING IN ..." : "LOGIN"}
          </Text>
        </View>
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
      <View className="flex-row justify-center gap-1">
        <Image
          className="h-12 w-12"
          source={require("../../assets/social-media-icons/facebook.png")}
        ></Image>
        <Image
          className="h-12 w-12"
          source={require("../../assets/social-media-icons/google.png")}
        ></Image>
      </View>
    </>
  )
}

function NewHereSection({ gotoSignUpFn }: { gotoSignUpFn: () => void }) {
  return (
    <View className="flex-row gap-1 justify-center mt-6 px-12">
      <Text className="text-white">New here?</Text>
      <TouchableOpacity onPress={gotoSignUpFn} activeOpacity={0.8}>
        <Text className="[color:_#FE6007] underline">Create an account.</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function LoginScreen() {
  const { height } = Dimensions.get("window")
  return (
    <View className="flex-1 relative bg-black">
      <ImageBackground
        source={require("../../assets/login-background.jpg")}
        resizeMode={"cover"}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height,
        }}
      >
        <View className="bg-black/50 h-full"></View>
      </ImageBackground>

      <AppName />
      <SignInForm
        onForgotPasswordFn={() => {
          router.push("/forgot-password")
        }}
      />
      {/* <SignInWithSection /> */}
      <NewHereSection
        gotoSignUpFn={() => {
          router.push("/signup")
        }}
      />
    </View>
  )
}
