import { Text, View, TextInput, TouchableOpacity } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Entypo } from "@expo/vector-icons"
import { useMutation } from "@tanstack/react-query"
import { createMovieReview } from "../../utils/api"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { GradientBackground } from "../../components/gradient-bg"

const formSchema = z.object({
  details: z.string().min(1),
  rating: z.number().min(1).max(5),
})

type FormType = z.infer<typeof formSchema>

function StarButton({
  isEnabled,
  onPress,
}: {
  isEnabled: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Entypo name="star" size={32} color={isEnabled ? "#facc15" : "#d1d5db"} />
    </TouchableOpacity>
  )
}

export function CreateReviewScreen({ route }: any) {
  const { movieId } = route.params
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      details: "",
      rating: 1,
    },
  })
  const { mutate } = useMutation({
    mutationKey: ["createReview", movieId],
    mutationFn: ({ details, rating }: { details: string; rating: number }) =>
      createMovieReview(movieId, details, rating),
    onSuccess: () => navigation.goBack(),
  })
  const navigation = useNavigation<NativeStackNavigationProp<{}>>()

  return (
    <View className="flex-1">
      <GradientBackground />

      <Controller
        name="details"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Write your review ..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="bg-gray-300 px-4 py-2 flex-1 justify-center items-start"
            textAlignVertical="top"
            multiline={true}
            numberOfLines={10}
          />
        )}
      />

      {errors.details && (
        <Text className="text-red-300 mt-1 text-right">This is required.</Text>
      )}

      <View>
        <Text className="text-white text-center mt-3 mb-1">Give Stars:</Text>
        <View className="flex-row justify-center mb-3">
          <StarButton
            isEnabled={watch("rating") >= 1}
            onPress={() => {
              setValue("rating", 1)
            }}
          />
          <StarButton
            isEnabled={watch("rating") >= 2}
            onPress={() => {
              setValue("rating", 2)
            }}
          />
          <StarButton
            isEnabled={watch("rating") >= 3}
            onPress={() => {
              setValue("rating", 3)
            }}
          />
          <StarButton
            isEnabled={watch("rating") >= 4}
            onPress={() => {
              setValue("rating", 4)
            }}
          />
          <StarButton
            isEnabled={watch("rating") >= 5}
            onPress={() => {
              setValue("rating", 5)
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        className="[background-color:_#FE6007] rounded-md mb-3 mx-2"
        onPress={handleSubmit((formData) => {
          mutate(formData)
        })}
      >
        <Text className="text-white text-center py-3 font-medium">SUBMIT</Text>
      </TouchableOpacity>
    </View>
  )
}
