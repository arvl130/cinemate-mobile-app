import { TouchableOpacity } from "react-native"
import { Entypo } from "@expo/vector-icons"

export function HamburgerMenu({ actionFn }: { actionFn: () => void }) {
  return (
    <TouchableOpacity onPress={actionFn}>
      <Entypo name="dots-three-vertical" size={20} color="white" />
    </TouchableOpacity>
  )
}
