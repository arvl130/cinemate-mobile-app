import { sendPasswordResetEmail } from "firebase/auth"
import { useState } from "react"
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
import { auth } from "../firebase"

function AppName() {
  return (
    <View className="flex-row justify-center gap-3 mt-8 items-end">
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  return (
    <View className="flex-1 relative">
      <ImageBackground
        source={require("../assets/forgot-pass/bg.jpg")}
        resizeMode={"cover"}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height: Dimensions.get("window").height,
        }}
      >
        <View className="bg-black/90 h-full"></View>
      </ImageBackground>
      <View className="px-14 pt-8">
        <AppName />
        <View>
          <View className="flex-row justify-center gap-3 mb-6 mt-6 items-end">
            <Image
              className="h-24 w-24"
              source={require("../assets/forgot-pass/lock-icon.png")}
            ></Image>
          </View>
          <Text className="text-white text-2xl text-center font-semibold">
            FORGOT
          </Text>
          <Text className="text-white text-2xl text-center font-semibold">
            PASSWORD?
          </Text>
          <Text className="text-white mb-6 text-center">
            Enter the email address you used to create your account and we will
            email you a link to reset your password
          </Text>
        </View>
      </View>
      <View className="px-6">
        <TextInput
          placeholder="john@example.com"
          className="[background-color:_#d3d3d3] px-2 py-2 rounded-md text-white mb-3"
          placeholderTextColor={"#000"}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <View>
          <TouchableOpacity
            className="[background-color:_#FE6007] rounded-md py-3"
            activeOpacity={0.8}
            onPress={async () => {
              if (email === "") {
                Alert.alert("Missing input", "Please enter your email.")
                return
              }
              try {
                await sendPasswordResetEmail(auth, email)
                setEmail("")
                Alert.alert(
                  "Email sent",
                  "We have sent your password reset email."
                )
              } catch {
                Alert.alert(
                  "Error occured",
                  "There was a problem that occured when sending your password reset email."
                )
              }
            }}
          >
            <Text className="text-white text-center text-base font-semibold">
              SEND EMAIL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
