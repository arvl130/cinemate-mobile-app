import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { LoginScreen } from "./src/screens/LoginScreen"
import { SignUpScreen } from "./src/screens/SignUpScreen"
import { HomeScreen } from "./src/screens/HomeScreen"

const OnboardingStack = createNativeStackNavigator()

function OnboardingScreens() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OnboardingStack.Screen name="Login" component={LoginScreen} />
      <OnboardingStack.Screen name="Sign Up" component={SignUpScreen} />
    </OnboardingStack.Navigator>
  )
}

const HomeStack = createNativeStackNavigator()
const FriendsStack = createNativeStackNavigator()
const SchedulesStack = createNativeStackNavigator()
const AccountStack = createNativeStackNavigator()

function HomeTab() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  )
}

function FriendsTab() {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen name="Home" component={HomeScreen} />
    </FriendsStack.Navigator>
  )
}

function SchedulesTab() {
  return (
    <SchedulesStack.Navigator>
      <SchedulesStack.Screen name="Home" component={HomeScreen} />
    </SchedulesStack.Navigator>
  )
}

function AccountTab() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen name="Home" component={HomeScreen} />
    </AccountStack.Navigator>
  )
}

const AuthenticatedTab = createBottomTabNavigator()

function AuthenticatedTabs() {
  return (
    <AuthenticatedTab.Navigator>
      <AuthenticatedTab.Screen name="Home Tab" component={HomeTab} />
      <AuthenticatedTab.Screen name="Friends Tab" component={FriendsTab} />
      <AuthenticatedTab.Screen name="Schedules Tab" component={SchedulesTab} />
      <AuthenticatedTab.Screen name="Account Tab" component={AccountTab} />
    </AuthenticatedTab.Navigator>
  )
}

const AppStack = createNativeStackNavigator()

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  if (!fontsLoaded) return null

  return (
    <SafeAreaView className="h-full">
      <StatusBar style="auto" />
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <AppStack.Screen
            name="Onboarding Screens"
            component={OnboardingScreens}
          />
          <AppStack.Screen
            name="Authenticated Tabs"
            component={AuthenticatedTabs}
          />
        </AppStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}
