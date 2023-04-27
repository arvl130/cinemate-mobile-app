import { LinearGradient } from "expo-linear-gradient"
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import {
  getMovieDetails,
  getMovieReviews,
  getUserProfile,
} from "../../utils/api"
import type { MovieDetails } from "tmdb-ts"
import { useQuery } from "@tanstack/react-query"
import { useRefreshOnFocus } from "../../utils/refresh-on-focus"
import { Review } from "../../types/review"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { IsAuthenticatedView } from "../../components/is-authenticated"
import { Entypo } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const { height } = Dimensions.get("window")

function ShortInfo({ movieDetails }: { movieDetails: MovieDetails }) {
  return (
    <View className="flex-[0] gap-6 flex-row">
      <View className="flex-[2]">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`,
          }}
          className="h-48 w-32 rounded-2xl mb-3"
        />
      </View>
      <View className="flex-[3]">
        <Text className="text-white font-semibold text-xl mb-1">
          {movieDetails.title}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-1">
          {movieDetails.genres.map((genre) => (
            <Text
              key={genre.id}
              className="bg-gray-500 rounded-full text-white text-xs px-2 py-1"
            >
              {genre.name}
            </Text>
          ))}
        </View>
        <View className="mb-3">
          <Text className="text-gray-400">
            {new Date(movieDetails.release_date).getFullYear()}
            {" • "}
            {movieDetails.original_language.toUpperCase()}
            {" • "}
            {movieDetails.runtime} min
          </Text>
        </View>
        <View>
          <Text className="text-center">⭐⭐⭐⭐</Text>
          <Text className="text-gray-400 text-xs text-center">
            From 123 users
          </Text>
        </View>
      </View>
    </View>
  )
}

function OverviewSection({ overview }: { overview: string }) {
  return (
    <View>
      <Text className="text-white font-semibold text-base">Overview</Text>
      <Text className="text-white py-3">{overview}</Text>
      <View className="flex-row flex-2 gap-3">
        <View className="flex-1">
          <TouchableOpacity
            activeOpacity={0.6}
            className="border-2 [border-color:_#FE6007] [background-color:_#FE6007] rounded-md"
            onPress={() => {}}
          >
            <Text className="text-white text-center py-3 font-medium">
              Watched Already
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <TouchableOpacity
            activeOpacity={0.6}
            className="border-2 [border-color:_#FE6007] rounded-md"
            onPress={() => {}}
          >
            <Text className="[color:_#FE6007] text-center py-3 font-medium">
              Add to Watchlist
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        className="border-2 bg-gray-100 rounded-md mt-3"
        onPress={() => {}}
      >
        <Text className="text-center py-3 font-medium">Schedule</Text>
      </TouchableOpacity>
    </View>
  )
}

function ReviewSectionItem({
  review,
  currentUserId,
}: {
  review: Review
  currentUserId?: string
}) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["userProfile", review.userId],
    queryFn: () => getUserProfile(review.userId),
  })
  useRefreshOnFocus(refetch)

  function formattedDate(dateStr: string) {
    const date = new Date(dateStr)
    const monthInt = date.getMonth() + 1
    const month = monthInt > 9 ? `${monthInt}` : `0${monthInt}`
    const dayInt = date.getDate()
    const day = dayInt > 9 ? `${dayInt}` : `0${dayInt}`
    return `${month}/${day}/${date.getFullYear()}`
  }

  const navigation = useNavigation<
    NativeStackNavigationProp<{
      "Edit Review": {
        movieId: number
      }
    }>
  >()

  return (
    <View>
      <View className="flex-row gap-3 items-center mb-3">
        <View className="w-12 h-12 rounded-full bg-gray-300"></View>
        <View className="flex-1">
          <View>
            <>
              {isLoading ? (
                <Text className="text-white">...</Text>
              ) : (
                <>
                  {isError ? (
                    <Text className="text-red-500">Error</Text>
                  ) : (
                    <Text className="text-white">{data.displayName}</Text>
                  )}
                </>
              )}
            </>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-row">
              {[...Array(review.rating)].map((value) => (
                <Text key={value}>
                  <Entypo name="star" size={16} color={"#facc15"} />
                </Text>
              ))}
            </View>
            <Text className="text-white">
              {formattedDate(review.createdAt)}
            </Text>
          </View>
        </View>
        <>
          {review.userId === currentUserId && (
            <TouchableOpacity
              onPress={() => {
                navigation.push("Edit Review", {
                  movieId: review.movieId,
                })
              }}
            >
              <MaterialCommunityIcons name="pencil" size={24} color="white" />
            </TouchableOpacity>
          )}
        </>
      </View>
      <View>
        <Text className="text-white">{review.details}</Text>
      </View>
    </View>
  )
}

function YourOwnReview({
  userId,
  reviews,
  goToCreateReview,
}: {
  userId: string
  reviews: Review[]
  goToCreateReview: () => void
}) {
  const yourReview = reviews.find((review) => review.userId === userId)
  if (yourReview === undefined)
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          className="[background-color:_#FE6007] rounded-md"
          onPress={goToCreateReview}
        >
          <Text className="text-white text-center py-3 font-medium">
            Leave a review
          </Text>
        </TouchableOpacity>
      </>
    )

  return <ReviewSectionItem review={yourReview} currentUserId={userId} />
}

function ReviewSection({ movieId }: { movieId: number }) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["movieReviews", movieId],
    queryFn: () => getMovieReviews(movieId),
  })
  useRefreshOnFocus(refetch)

  const navigation = useNavigation<
    NativeStackNavigationProp<{
      "Create Review": {
        movieId: number
      }
    }>
  >()

  return (
    <IsAuthenticatedView>
      {(user) => {
        return (
          <>
            <Text className="text-white font-semibold text-base mt-3">
              Ratings & Reviews
            </Text>
            <Text className="text-white py-3">
              Ratings and reviews are from people who have watched the movie.
            </Text>
            {/* Reviews by users */}
            {isLoading ? (
              <Text className="text-white text-center">Loading ...</Text>
            ) : (
              <>
                {isError ? (
                  <Text className="text-white text-center">
                    An error occured while fetching movie reviews. :{"("}
                  </Text>
                ) : (
                  <>
                    <YourOwnReview
                      userId={user.uid}
                      reviews={data}
                      goToCreateReview={() => {
                        navigation.navigate("Create Review", {
                          movieId,
                        })
                      }}
                    />
                    {data.length === 0 ? (
                      <Text className="text-white text-center py-3">
                        No reviews yet.
                      </Text>
                    ) : (
                      <>
                        {/* TODO: Stars section */}
                        {data
                          .filter((review) => review.userId !== user.uid)
                          .map((review) => (
                            <View className="mt-3">
                              <ReviewSectionItem
                                key={review.userId}
                                review={review}
                              />
                            </View>
                          ))}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )
      }}
    </IsAuthenticatedView>
  )
}

function LongInfo({ movieDetails }: { movieDetails: MovieDetails }) {
  return (
    <View>
      <OverviewSection overview={movieDetails.overview} />
      <ReviewSection movieId={movieDetails.id} />
    </View>
  )
}

export function MovieDetailsScreen({ route }: any) {
  const { id } = route.params
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["movieDetails", id],
    queryFn: () => getMovieDetails(id),
  })

  useRefreshOnFocus(refetch)

  return (
    <View>
      <LinearGradient
        colors={["#000000", "#393737"]}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height,
        }}
      />
      {isLoading ? (
        <Text className="text-white text-center">Loading ...</Text>
      ) : (
        <>
          {isError ? (
            <Text className="text-white text-center">
              An error occured while fetching movie details. :{"("}
            </Text>
          ) : (
            <ScrollView>
              <View className="px-6">
                <ShortInfo movieDetails={data} />
                <LongInfo movieDetails={data} />
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  )
}
