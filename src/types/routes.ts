import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { NavigatorScreenParams } from "@react-navigation/native"

type AuthenticatedTabsRoutes = {
  "Home Tab": undefined
  "Friends Tab": undefined
  "Schedules Tab": undefined
  "Account Tab": undefined
}

export type AppStackRoutes = {
  "Onboarding Screens": undefined
  "Authenticated Tabs": NavigatorScreenParams<AuthenticatedTabsRoutes>
  "Search Movies": undefined
  "Movie Details": {
    movieId: number
  }
  "Create Review": {
    movieId: number
  }
  "Edit Review": {
    movieId: number
  }
  "Search Friends": undefined
  "Friend Profile": {
    friendId: string
  }
  "Create Schedule": {
    movieId: number
  }
  "Edit Schedule": {
    movieId: number
    isoDate: string
  }
  "Schedule Details": {
    isoDate: string
  }
  "Account Settings": undefined
}

export type AppStackProp = NativeStackNavigationProp<AppStackRoutes>
