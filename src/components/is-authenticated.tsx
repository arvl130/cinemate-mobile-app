import { User, getAuth } from "firebase/auth"
import { ReactNode } from "react"
import { View, Text } from "react-native"

export function IsAuthenticatedView({
  children,
}: {
  children: (user: User) => ReactNode
}) {
  const auth = getAuth()

  if (!auth.currentUser)
    return <Text className="text-white">Should be authenticated.</Text>

  return <>{children(auth.currentUser)}</>
}
