import { Redirect, Tabs } from "expo-router"
import { Entypo, Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { useAuthState } from "../../../src/firebase"
import { View } from "react-native"
import { GradientBackground } from "../../../src/components/gradient-bg"

export default function Layout() {
  const { isLoading, isAuthenticated } = useAuthState()

  if (isLoading)
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <GradientBackground />
      </View>
    )

  if (!isAuthenticated)
    return (
      <View>
        <GradientBackground />
        <Redirect href={"/login"} />
      </View>
    )

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FE6007",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Entypo name="home" size={size} color={color} />
          },
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ size, color }) => {
            return (
              <FontAwesome5 name="user-friends" size={size} color={color} />
            )
          },
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Entypo name="calendar" size={size} color={color} />
          },
        }}
      />
      <Tabs.Screen
        name="account-settings"
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Ionicons name="person" size={size} color={color} />
          },
        }}
      />
    </Tabs>
  )
}
