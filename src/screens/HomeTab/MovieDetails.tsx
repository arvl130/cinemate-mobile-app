import { LinearGradient } from "expo-linear-gradient"
import { Dimensions, Image, ScrollView, Text, View } from "react-native"
import { useEffect, useState } from "react"
import { GetMovieResult } from "../../types/Movie"
import { getMovieDetails } from "../../utils/api"

const { height } = Dimensions.get("window")

function ShortInfo({ movie }: { movie: GetMovieResult }) {
  return (
    <View className="flex-[0] gap-6 flex-row">
      <View className="flex-[2]">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
          }}
          className="h-48 w-32 rounded-2xl mb-3"
        />
      </View>
      <View className="flex-[3]">
        <Text className="text-white font-semibold text-xl mb-1">
          {movie.title}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-1">
          {movie.genres.map((genre) => (
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
            {new Date(movie.release_date).getFullYear()}
            {" • "}
            {movie.original_language.toUpperCase()}
            {" • "}
            {movie.runtime} min
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

function LongInfo({ movie }: { movie: GetMovieResult }) {
  return (
    <View>
      <Text className="text-white font-semibold text-base">Overview</Text>
      <Text className="text-white">{movie.overview}</Text>
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
  const [movie, setMovie] = useState<GetMovieResult | null>(null)

  async function getMovie(movieId: string) {
    const movie = await getMovieDetails(movieId)
    setMovie(movie)
  }

  useEffect(() => {
    getMovie(id)
  }, [])

  return (
    <View>
      <LinearGradient
        colors={["#000000", "#393737"]}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height,
        }}
      />
      {movie ? (
        <>
          <ScrollView>
            <View className="px-6">
              <ShortInfo movie={movie} />
              <LongInfo movie={movie} />
            </View>
          </ScrollView>
        </>
      ) : (
        <View>
          <Text>Loading ...</Text>
        </View>
      )}
    </View>
  )
}
