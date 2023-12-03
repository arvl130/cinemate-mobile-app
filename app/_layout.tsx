import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter"
import registerNNPushToken from "native-notify"
import Constants from "expo-constants"
import { SafeAreaView } from "react-native-safe-area-context"
import { AuthStateProvider } from "../src/firebase"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

const queryClient = new QueryClient()

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  registerNNPushToken(
    Constants.expoConfig?.extra?.nativeNotifyAppId,
    Constants.expoConfig?.extra?.nativeNotifyAppToken
  )

  if (!fontsLoaded) return <></>

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="h-full bg-black">
        <AuthStateProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="account-settings/profile" />
            <Stack.Screen name="account-settings/blocked-users" />
            <Stack.Screen name="friends/[friendId]/profile" />
            <Stack.Screen name="friends/search" />
            <Stack.Screen name="movies/[movieId]/review/create" />
            <Stack.Screen name="movies/[movieId]/review/edit" />
            <Stack.Screen name="movies/[movieId]/schedules/create" />
            <Stack.Screen name="movies/[movieId]/schedules/[isoDate]/edit" />
            <Stack.Screen name="movies/[movieId]/details" />
            <Stack.Screen name="movies/ask" />
            <Stack.Screen name="movies/search" />
            <Stack.Screen name="schedules/[isoDate]" />
          </Stack>
        </AuthStateProvider>
      </SafeAreaView>
    </QueryClientProvider>
  )
}
