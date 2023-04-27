import { LinearGradient } from "expo-linear-gradient"
import { Dimensions, Image, ScrollView, Text, View } from "react-native"
import { getMovieDetails } from "../../utils/api"
import type { MovieDetails } from "tmdb-ts"
import { useQuery } from "@tanstack/react-query"
import { useRefreshOnFocus } from "../../utils/refresh-on-focus"

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

function LongInfo({ movieDetails }: { movieDetails: MovieDetails }) {
  return (
    <View>
      <Text className="text-white font-semibold text-base">Overview</Text>
      <Text className="text-white">{movieDetails.overview}</Text>
      <Text className="text-white font-semibold text-base mt-3">
        Ratings & Reviews
      </Text>
      <Text className="text-white">
        Ratings and reviews are from people who have watched the movie.
      </Text>
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
