import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

export type AppStackRoutes = {
  "Onboarding Screens": undefined
  "Authenticated Tabs": undefined
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
}

export type AppStackProp = NativeStackNavigationProp<AppStackRoutes>
