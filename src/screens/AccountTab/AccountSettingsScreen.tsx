import React, { useState } from "react"
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
} from "react-native"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase"
import { GradientBackground } from "../../components/gradient-bg"

export function AccountSettingsScreen() {
  const [isModalVisible, setisModalVisible] = useState(false)

  const changeModalVisible = (bool: boolean) => {
    setisModalVisible(bool)
  }
  const closeModal = (bool: boolean) => {
    changeModalVisible(bool)
  }
  return (
    <SafeAreaView>
      <GradientBackground />

      <View className="px-6">
        <View className="flex-row items-center justify-center">
          <View className="items-center">
            <Image
              source={{
                uri: "https://www.angelogeulin.me/assets/profile-picture.ca024b3e.webp",
              }}
              className="h-24 w-24 rounded-full"
            ></Image>
            <TouchableOpacity activeOpacity={0.8} className="mt-2">
              <Text className="text-blue-500 underline text-xs">
                Edit Picture
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-white font-medium [color:_#7E7979] mb-1">
          Name
        </Text>
        <TextInput
          placeholderTextColor={"white"}
          value={auth.currentUser?.displayName as string}
          className="[background-color:_#353535] rounded-md px-4 py-1 text-white"
        />
        <Text className="text-white font-medium [color:_#7E7979] mt-3 mb-1">
          Email Address
        </Text>
        <TextInput
          placeholderTextColor={"white"}
          value={auth.currentUser?.email as string}
          className="[background-color:_#353535] rounded-md px-4 py-1 text-white"
        />
        <Text className="text-white font-medium [color:_#7E7979] mt-3 mb-1">
          Password
        </Text>
        <TextInput
          placeholderTextColor={"white"}
          placeholder={"********"}
          className="[background-color:_#353535] rounded-md px-4 py-1"
          secureTextEntry={true}
        />
        <Text className="text-white font-medium [color:_#7E7979] mt-6 mb-1">
          Connected Account
        </Text>
        <TouchableOpacity activeOpacity={0.8}>
          <View className="[background-color:_#353535] flex-row flex-wrap px-3 py-2 rounded-md justify-between items-center">
            <View className="flex-row">
              <View className="flex-row items-center">
                <Image
                  className="h-10 w-10"
                  source={require("../../assets/social-media-icons/google.png")}
                />
              </View>
              <View className="pl-2 justify-center">
                <Text className="text-white font-medium">Google</Text>
                <Text className="[color:_#848484] text-xs">
                  {auth.currentUser?.email}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-blue-500 underline text-xs">Remove</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View className="mt-6">
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
    </SafeAreaView>
  )
}
