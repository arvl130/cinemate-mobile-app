import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import {
  addWatchedMovie,
  addWatchlistMovie,
  getMovieDetails,
  getMovieReviews,
  getOverallRating,
  getSavedMovies,
  getSchedules,
  getUserProfile,
  getWatchedMovies,
  removeWatchedMovie,
  removeWatchlistMovie,
} from "../../utils/api"
import type { MovieDetails } from "tmdb-ts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRefreshOnFocus } from "../../utils/refresh-on-focus"
import { Review } from "../../types/review"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { IsAuthenticatedView } from "../../components/is-authenticated"
import { Entypo } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { AppStackProp } from "../../types/routes"
import { GradientBackground } from "../../components/gradient-bg"

function OverallRating({ movieId }: { movieId: number }) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["getOverallRating", movieId],
    queryFn: () => getOverallRating(movieId),
  })
  useRefreshOnFocus(refetch)

  if (isLoading) return <Text className="text-white">...</Text>
  if (isError) return <Text className="text-red-500">error</Text>

  if (data.rating === 0)
    return (
      <Text className="text-gray-400 text-center">
        Be the first to rate this movie!
      </Text>
    )

  return (
    <View>
      {data.rating > 0 ? (
        <View className="flex-row justify-center">
          {[...Array(data.rating)].map((value, index) => (
            <Text key={index}>
              <Entypo name="star" size={16} color={"#facc15"} />
            </Text>
          ))}
        </View>
      ) : (
        <Text className="text-gray-400 text-center">0 stars</Text>
      )}
      <Text className="text-gray-400 text-xs text-center">
        From {data.reviewCount} {data.reviewCount === 1 ? "user" : "users"}
      </Text>
    </View>
  )
}

function ShortInfo({ movieDetails }: { movieDetails: MovieDetails }) {
  return (
    <View className="flex-[0] gap-6 flex-row">
      <View className="flex-[2]">
        {typeof movieDetails.poster_path === "string" ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`,
            }}
            className="h-48 w-32 rounded-2xl mb-3"
          />
        ) : (
          <View className="h-48 w-32 rounded-2xl mb-3 bg-gray-300 justify-center">
            <Text className="text-gray-500 text-xs px-3 text-center">
              No Poster Available
            </Text>
          </View>
        )}
      </View>
      <View className="flex-[3]">
        <Text className="text-white font-semibold text-xl mb-1">
          {movieDetails.title}
        </Text>
        {Array.isArray(movieDetails.genres) && (
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
        )}
        <View className="mb-3">
          <Text className="text-gray-400">
            {new Date(movieDetails.release_date).getFullYear()}
            {" • "}
            {typeof movieDetails.original_language === "string"
              ? movieDetails.original_language.toUpperCase()
              : "UNK"}
            {" • "}
            {movieDetails.runtime} min
          </Text>
        </View>
        <OverallRating movieId={movieDetails.id} />
      </View>
    </View>
  )
}

function ScheduleButton({
  userId,
  movieId,
}: {
  userId: string
  movieId: number
}) {
  const {
    isLoading,
    isError,
    data: schedules,
    refetch,
  } = useQuery({
    queryKey: ["getSchedules", userId],
    queryFn: () => getSchedules(userId),
  })
  useRefreshOnFocus(refetch)
  const navigation = useNavigation<AppStackProp>()

  if (isLoading) return <Text className="text-white">...</Text>
  if (isError) return <Text className="text-red-500">error</Text>

  const pendingScheduleForThisMovie = schedules.find((schedule) => {
    if (schedule.isPending && schedule.movieId === movieId) return true
    return false
  })

  if (pendingScheduleForThisMovie)
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="border-2 bg-gray-100 rounded-md"
        onPress={() => {
          navigation.navigate("Schedule Details", {
            isoDate: pendingScheduleForThisMovie.isoDate,
          })
        }}
      >
        <Text className="text-center py-3 font-medium">View Schedule</Text>
      </TouchableOpacity>
    )

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="border-2 bg-gray-100 rounded-md"
      onPress={() => {
        navigation.navigate("Create Schedule", {
          movieId,
        })
      }}
    >
      <Text className="text-center py-3 font-medium">Schedule</Text>
    </TouchableOpacity>
  )
}

function SaveButtons({ userId, movieId }: { userId: string; movieId: number }) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["savedMovies", userId],
    queryFn: () => getSavedMovies(userId),
  })

  const { refetch: refetchWatchedMovies } = useQuery({
    queryKey: ["getWatchedMovies", userId],
    queryFn: () => getWatchedMovies(userId),
  })

  const { mutate: doAddWatchedMovie } = useMutation({
    mutationKey: ["addWatchedMovie", userId, movieId],
    mutationFn: (values: { userId: string; movieId: number }) =>
      addWatchedMovie(values.userId, values.movieId),
    onSuccess: () => {
      refetch()
      refetchWatchedMovies()
    },
  })
  const { mutate: doRemoveWatchedMovie } = useMutation({
    mutationKey: ["removeWatchedMovie", userId, movieId],
    mutationFn: (values: { userId: string; movieId: number }) =>
      removeWatchedMovie(values.userId, values.movieId),
    onSuccess: () => {
      refetch()
      refetchWatchedMovies()
    },
  })

  const { mutate: doAddWatchlistMovie } = useMutation({
    mutationKey: ["addWatchlistMovie", userId, movieId],
    mutationFn: (values: { userId: string; movieId: number }) =>
      addWatchlistMovie(values.userId, values.movieId),
    onSuccess: () => refetch(),
  })
  const { mutate: doRemoveWatchlistMovie } = useMutation({
    mutationKey: ["removeWatchlistMovie", userId, movieId],
    mutationFn: (values: { userId: string; movieId: number }) =>
      removeWatchlistMovie(values.userId, values.movieId),
    onSuccess: () => refetch(),
  })

  if (isLoading)
    return (
      <View>
        <Text className="text-center text-white">Loading ...</Text>
      </View>
    )

  if (isError)
    return (
      <View>
        <Text className="text-center text-white">
          An error occured while retrieving status of this movie.
        </Text>
      </View>
    )

  const savedMovieFound = data.find(
    (savedMovie) => savedMovie.movieId === movieId
  )

  if (!savedMovieFound)
    return (
      <View className="flex-row flex-2 gap-3">
        <View className="flex-1">
          <TouchableOpacity
            activeOpacity={0.6}
            className="border-2 [border-color:_#FE6007] [background-color:_#FE6007] rounded-md"
            onPress={() => doAddWatchedMovie({ userId, movieId })}
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
            onPress={() => doAddWatchlistMovie({ userId, movieId })}
          >
            <Text className="[color:_#FE6007] text-center py-3 font-medium">
              Add to Watchlist
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )

  if (savedMovieFound.watchStatus === "Watched")
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        className="border-2 border-red-500 bg-red-500 rounded-md"
        onPress={() => doRemoveWatchedMovie({ userId, movieId })}
      >
        <Text className="text-white text-center py-3 font-medium">
          Remove from Watched
        </Text>
      </TouchableOpacity>
    )

  if (savedMovieFound.watchStatus === "WatchList")
    return (
      <>
        <ScheduleButton userId={userId} movieId={movieId} />
        <TouchableOpacity
          activeOpacity={0.6}
          className="border-2 border-red-500 bg-red-500 rounded-md mt-3"
          onPress={() => doRemoveWatchlistMovie({ userId, movieId })}
        >
          <Text className="text-white text-center py-3 font-medium">
            Remove from Watchlist
          </Text>
        </TouchableOpacity>
      </>
    )

  return (
    <Text className="text-red-500">
      {savedMovieFound.watchStatus} Should not reach here
    </Text>
  )
}

function OverviewSection({
  overview,
  movieId,
}: {
  overview: string
  movieId: number
}) {
  return (
    <View>
      <Text className="text-white font-semibold text-base">Overview</Text>
      <Text className="text-white py-3">{overview}</Text>
      <IsAuthenticatedView>
        {(user) => <SaveButtons movieId={movieId} userId={user.uid} />}
      </IsAuthenticatedView>
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

  const navigation = useNavigation<AppStackProp>()

  return (
    <View>
      <View className="flex-row gap-3 items-center mb-3">
        <View className="h-12 w-12">
          {data === undefined ? (
            <Image
              className="w-full h-full rounded-full"
              source={require("../../assets/no-photo-url.jpg")}
            />
          ) : (
            <>
              {data.photoURL ? (
                <Image
                  className="w-full h-full rounded-full"
                  source={{
                    uri: data.photoURL,
                  }}
                />
              ) : (
                <Image
                  className="w-full h-full rounded-full"
                  source={require("../../assets/no-photo-url.jpg")}
                />
              )}
            </>
          )}
        </View>
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
              {[...Array(review.rating)].map((value, index) => (
                <Text key={index}>
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

function ReviewSectionOwnReview({
  userId,
  movieId,
  reviews,
  goToCreateReview,
}: {
  userId: string
  movieId: number
  reviews: Review[]
  goToCreateReview: () => void
}) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["getWatchedMovies", userId],
    queryFn: () => getWatchedMovies(userId),
  })

  if (isLoading) return <></>
  if (isError)
    return (
      <Text className="text-center text-red-500">
        An error occured while retrieving watched movies.
      </Text>
    )

  const yourReview = reviews.find((review) => review.userId === userId)
  if (yourReview === undefined) {
    const isAWatchedMovie = data.some(
      (watchedMovie) => watchedMovie.movieId === movieId
    )

    if (isAWatchedMovie) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          className="[background-color:_#FE6007] rounded-md"
          onPress={goToCreateReview}
        >
          <Text className="text-white text-center py-3 font-medium">
            Leave a review
          </Text>
        </TouchableOpacity>
      )
    } else {
      return <></>
    }
  }

  return <ReviewSectionItem review={yourReview} currentUserId={userId} />
}

function ReviewSectionOtherReviews({
  reviews,
  userId,
}: {
  reviews: Review[]
  userId: string
}) {
  return (
    <>
      {reviews.length === 0 ? (
        <Text className="text-white text-center py-3">No reviews yet.</Text>
      ) : (
        <>
          {/* TODO: Stars section */}
          {reviews
            .filter((review) => review.userId !== userId)
            .map((review) => (
              <View key={review.userId} className="mt-3">
                <ReviewSectionItem review={review} />
              </View>
            ))}
        </>
      )}
    </>
  )
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
    <>
      <Text className="text-white font-semibold text-base mt-3">
        Ratings & Reviews
      </Text>
      <Text className="text-white py-3">
        Ratings and reviews are from people who have watched the movie.
      </Text>
      <IsAuthenticatedView>
        {(user) => {
          return (
            <>
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
                      <ReviewSectionOwnReview
                        userId={user.uid}
                        movieId={movieId}
                        reviews={data}
                        goToCreateReview={() => {
                          navigation.navigate("Create Review", {
                            movieId,
                          })
                        }}
                      />
                      <ReviewSectionOtherReviews
                        userId={user.uid}
                        reviews={data}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )
        }}
      </IsAuthenticatedView>
    </>
  )
}

function LongInfo({ movieDetails }: { movieDetails: MovieDetails }) {
  return (
    <View>
      <OverviewSection
        movieId={movieDetails.id}
        overview={movieDetails.overview}
      />
      <ReviewSection movieId={movieDetails.id} />
    </View>
  )
}

export function MovieDetailsScreen({ route }: any) {
  const { movieId } = route.params
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => getMovieDetails(movieId),
  })

  useRefreshOnFocus(refetch)

  return (
    <View>
      <GradientBackground />
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
