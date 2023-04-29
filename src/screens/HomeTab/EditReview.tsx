import { Text, View, TextInput, TouchableOpacity } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Entypo } from "@expo/vector-icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  deleteMovieReview,
  editMovieReview,
  getMovieReview,
} from "../../utils/api"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { IsAuthenticatedView } from "../../components/is-authenticated"
import { User } from "firebase/auth"
import { useQuery } from "@tanstack/react-query"
import { Review } from "../../types/review"
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

function EditReviewForm({
  movieId,
  review,
}: {
  movieId: number
  review: Review
}) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      details: review.details,
      rating: review.rating,
    },
  })

  const queryClient = useQueryClient()
  const navigation = useNavigation<NativeStackNavigationProp<{}>>()

  const { mutate: doDeleteMovieReview } = useMutation({
    mutationKey: ["deleteReview", movieId],
    mutationFn: () => deleteMovieReview(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviewDetails", movieId, review.userId],
      })
      navigation.goBack()
    },
  })

  const { mutate: doEditMovieReview } = useMutation({
    mutationKey: ["editReview", movieId],
    mutationFn: ({ details, rating }: { details: string; rating: number }) =>
      editMovieReview(movieId, details, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviewDetails", movieId, review.userId],
      })
      navigation.goBack()
    },
  })

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
        <Text className="text-red-500 mt-1 text-right">This is required.</Text>
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
        className="bg-red-500 rounded-md mb-3 mx-2"
        onPress={() => doDeleteMovieReview()}
      >
        <Text className="text-white text-center py-3 font-medium">DELETE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-blue-500 rounded-md mb-3 mx-2"
        onPress={handleSubmit((formData) => doEditMovieReview(formData))}
      >
        <Text className="text-white text-center py-3 font-medium">SUBMIT</Text>
      </TouchableOpacity>
    </View>
  )
}

function AuthenticatedView({ user, movieId }: { user: User; movieId: number }) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["reviewDetails", movieId, user.uid],
    queryFn: () => getMovieReview(movieId, user.uid),
  })

  if (isLoading)
    return (
      <View>
        <Text className="text-white">Loading ...</Text>
      </View>
    )

  if (isError)
    return (
      <View>
        <Text className="text-white">
          An error occured while retrieving review :{"("}
        </Text>
      </View>
    )

  if (!data) return <></>

  return <EditReviewForm movieId={movieId} review={data} />
}

export function EditReviewScreen({ route }: any) {
  const { movieId } = route.params

  return (
    <IsAuthenticatedView>
      {(user) => <AuthenticatedView user={user} movieId={movieId} />}
    </IsAuthenticatedView>
  )
}
