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
import { Slot } from "expo-router"

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
          <Slot />
        </AuthStateProvider>
      </SafeAreaView>
    </QueryClientProvider>
  )
}
