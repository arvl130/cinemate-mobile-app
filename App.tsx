import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { LoginScreen } from "./src/screens/LoginScreen"
import { SignUpScreen } from "./src/screens/SignUpScreen"
import { HomeScreen } from "./src/screens/HomeTab/HomeScreen"
import { SearchScreen } from "./src/screens/HomeTab/SearchScreen"
import { AuthStateProvider, useAuthState } from "./src/firebase"
import { useEffect } from "react"
import { Entypo, Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { FriendsScreen } from "./src/screens/FriendsTab/FriendsScreen"
import { SchedulesScreen } from "./src/screens/SchedulesTab/SchedulesScreen"
import { AccountSettingsScreen } from "./src/screens/AccountTab/AccountSettingsScreen"
import { MovieDetailsScreen } from "./src/screens/HomeTab/MovieDetails"
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CreateReviewScreen } from "./src/screens/HomeTab/CreateReview"
import { EditReviewScreen } from "./src/screens/HomeTab/EditReview"
import { SearchFriendsScreen } from "./src/screens/FriendsTab/SearchFriendsScreen"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const OnboardingStack = createNativeStackNavigator()
const HomeStack = createNativeStackNavigator()
const FriendsStack = createNativeStackNavigator()
const SchedulesStack = createNativeStackNavigator()
const AccountStack = createNativeStackNavigator()
const AuthenticatedTab = createBottomTabNavigator()

type AppStackParamList = {
  "Onboarding Screens": undefined
  "Authenticated Tabs": undefined
  "Create Review": {
    movieId: number
  }
  "Edit Review": {
    movieId: number
  }
  "Search Friends": undefined
}

const AppStack = createNativeStackNavigator<AppStackParamList>()

function HomeTab() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="Movie Details" component={MovieDetailsScreen} />
    </HomeStack.Navigator>
  )
}

function FriendsTab() {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          headerShown: false,
        }}
      />
    </FriendsStack.Navigator>
  )
}

function SchedulesTab() {
  return (
    <SchedulesStack.Navigator>
      <SchedulesStack.Screen
        name="Schedules"
        component={SchedulesScreen}
        options={{
          headerShown: false,
        }}
      />
    </SchedulesStack.Navigator>
  )
}

function AccountTab() {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
      }}
    >
      <AccountStack.Screen
        name="Account Settings"
        component={AccountSettingsScreen}
      />
    </AccountStack.Navigator>
  )
}

type OnboardingScreensProps = NativeStackScreenProps<
  AppStackParamList,
  "Onboarding Screens"
>

function OnboardingScreens({ navigation }: OnboardingScreensProps) {
  const { isLoading, isAuthenticated } = useAuthState()
  useEffect(() => {
    if (!isLoading && isAuthenticated) navigation.replace("Authenticated Tabs")
  }, [isLoading, isAuthenticated])

  if (isLoading) return <></>

  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: "white",
      }}
    >
      <OnboardingStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <OnboardingStack.Screen name="Sign Up" component={SignUpScreen} />
      <OnboardingStack.Screen
        name="Forgot Password"
        component={ForgotPasswordScreen}
      />
    </OnboardingStack.Navigator>
  )
}

type AuthenticatedTabsProps = NativeStackScreenProps<
  AppStackParamList,
  "Authenticated Tabs"
>

function AuthenticatedTabs({ navigation }: AuthenticatedTabsProps) {
  const { isLoading, isAuthenticated } = useAuthState()
  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigation.replace("Onboarding Screens")
  }, [isLoading, isAuthenticated])

  if (isLoading) return <></>

  return (
    <AuthenticatedTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FE6007",
        tabBarShowLabel: false,
      }}
    >
      <AuthenticatedTab.Screen
        name="Home Tab"
        component={HomeTab}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Entypo name="home" size={size} color={color} />
          },
        }}
      />
      <AuthenticatedTab.Screen
        name="Friends Tab"
        component={FriendsTab}
        options={{
          tabBarIcon: ({ size, color }) => {
            return (
              <FontAwesome5 name="user-friends" size={size} color={color} />
            )
          },
        }}
      />
      <AuthenticatedTab.Screen
        name="Schedules Tab"
        component={SchedulesTab}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Entypo name="calendar" size={size} color={color} />
          },
        }}
      />
      <AuthenticatedTab.Screen
        name="Account Tab"
        component={AccountTab}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Ionicons name="person" size={size} color={color} />
          },
        }}
      />
    </AuthenticatedTab.Navigator>
  )
}

function RootNavigation() {
  const { isLoading, isAuthenticated } = useAuthState()

  if (isLoading) return <></>

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: "black",
          },
        }}
      >
        <AppStack.Navigator
          initialRouteName={
            isAuthenticated ? "Authenticated Tabs" : "Onboarding Screens"
          }
        >
          <AppStack.Screen
            name="Onboarding Screens"
            component={OnboardingScreens}
            options={{
              animation: "slide_from_left",
              headerShown: false,
            }}
          />
          <AppStack.Screen
            name="Authenticated Tabs"
            component={AuthenticatedTabs}
            options={{
              animation: "slide_from_right",
              headerShown: false,
            }}
          />
          <AppStack.Screen
            name="Create Review"
            component={CreateReviewScreen}
            options={{
              animation: "slide_from_right",
              headerStyle: {
                backgroundColor: "black",
              },
              headerTintColor: "white",
            }}
          />
          <AppStack.Screen
            name="Edit Review"
            component={EditReviewScreen}
            options={{
              animation: "slide_from_right",
              headerStyle: {
                backgroundColor: "black",
              },
              headerTintColor: "white",
            }}
          />
          <AppStack.Screen
            name="Search Friends"
            component={SearchFriendsScreen}
            options={{
              animation: "slide_from_right",
              headerStyle: {
                backgroundColor: "black",
              },
              headerTintColor: "white",
            }}
          />
        </AppStack.Navigator>
      </NavigationContainer>
    </>
  )
}

const queryClient = new QueryClient()

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  if (!fontsLoaded) return <></>

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="h-full bg-black">
        <AuthStateProvider>
          <RootNavigation />
        </AuthStateProvider>
      </SafeAreaView>
    </QueryClientProvider>
  )
}
