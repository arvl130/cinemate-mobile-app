import { NativeStackScreenProps } from "@react-navigation/native-stack"
import {
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { auth } from "../firebase"
import { updateProfile } from "firebase/auth"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"

function AppName() {
  return (
    <View className="flex-row justify-center gap-3 mb-12 mt-12 items-end">
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

function SignUpForm({
  onSubmitFn,
}: {
  onSubmitFn: (name: string, email: string, password: string) => Promise<void>
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <View>
      <Text className="text-white my-1 font-medium">NAME</Text>
      <TextInput
        placeholder="name here"
        className="[background-color:_#393737] px-4 py-2 rounded-md mb-1 text-white"
        placeholderTextColor={"#6F6969"}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Text className="text-white my-1 font-medium">EMAIL</Text>
      <TextInput
        placeholder="email here"
        className="[background-color:_#393737] px-4 py-2 rounded-md mb-1 text-white"
        placeholderTextColor={"#6F6969"}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Text className="text-white my-1 font-medium">PASSWORD</Text>
      <TextInput
        placeholder="password here"
        secureTextEntry={true}
        className="[background-color:_#393737] px-4 py-2 rounded-md mb-6 text-white"
        placeholderTextColor={"#6F6969"}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        className="[background-color:_#FE6007] rounded-md"
        onPress={async () => {
          await onSubmitFn(name, email, password)
          setName("")
          setEmail("")
          setPassword("")
        }}
      >
        <Text className="text-white text-center py-3 font-medium">
          CREATE AN ACCOUNT
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function SignUpWithSocialMedia() {
  return (
    <View className="mt-6">
      <Text className="text-white text-center font-medium mb-1">
        Or, create an account with social media.
      </Text>
      <View className="flex-row justify-center">
        <Image
          className="h-12 w-12"
          source={require("../assets/social-media-icons/facebook.png")}
        ></Image>
        <Image
          className="h-12 w-12"
          source={require("../assets/social-media-icons/google.png")}
        ></Image>
      </View>
    </View>
  )
}

type SignUpScreenProps = NativeStackScreenProps<{
  Login: undefined
  "Sign Up": undefined
}>

export function SignUpScreen({ navigation }: SignUpScreenProps) {
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
      <View className="py-3 px-3">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          activeOpacity={0.5}
        >
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <View className="px-12">
        <AppName />
        <SignUpForm
          onSubmitFn={async (name, email, password) => {
            const { user } = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            )
            await updateProfile(user, {
              displayName: name,
            })
          }}
        />
        <SignUpWithSocialMedia />
      </View>
    </View>
  )
}
