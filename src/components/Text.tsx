import { ReactNode } from "react"
import { Text as DefaultText } from "react-native"

export function Text(props: { children: ReactNode; [x: string]: any }) {
  const { style, ...otherProps } = props

  return (
    <DefaultText
      style={[
        {
          fontFamily: "Inter_400Regular",
        },
        style,
      ]}
      {...otherProps}
    >
      {props.children}
    </DefaultText>
  )
}
