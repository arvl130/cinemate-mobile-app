import { LinearGradient } from "expo-linear-gradient"
import { Dimensions } from "react-native"

const { height } = Dimensions.get("window")

export function GradientBackground() {
  return (
    <LinearGradient
      colors={["#000000", "#393737"]}
      className="absolute left-0 right-0 top-0 bottom-0"
      style={{
        height,
      }}
    />
  )
}
