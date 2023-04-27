// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import {
  Auth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"

export let app: FirebaseApp
export let auth: Auth

// Initialize Firebase
if (getApps().length === 0) {
  if (!Constants.expoConfig?.extra?.firebaseConfig)
    throw new Error("No Firebase config found")

  app = initializeApp(Constants.expoConfig.extra.firebaseConfig)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
} else {
  app = getApp()
  auth = getAuth(app)
}

export const AuthStateContext = createContext<{
  isLoading: boolean
  isAuthenticated: boolean
}>({
  isLoading: true,
  isAuthenticated: false,
})

export function AuthStateProvider(props: any) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setIsLoading(false)
      if (user) setIsAuthenticated(true)
      else setIsAuthenticated(false)
    })
  }, [])
  return (
    <AuthStateContext.Provider
      value={{
        isLoading,
        isAuthenticated,
      }}
      {...props}
    />
  )
}

export function useAuthState() {
  return useContext(AuthStateContext)
}
