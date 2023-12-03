import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { GradientBackground } from "../../src/components/gradient-bg"
import {
  CategoryType,
  categoryTypes,
  getAiMovieRecommendations,
  getAiMovieRecommendationsByCategory,
} from "../../src/utils/api"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Movie } from "tmdb-ts"
import { router } from "expo-router"

function MovieResultItem({ movie }: { movie: Movie }) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        router.push({
          pathname: "/movies/[movieId]/details",
          params: {
            movieId: movie.id,
          },
        })
      }}
      className="mb-4"
    >
      {movie.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
          }}
          className="rounded-3xl h-32 mb-1"
        />
      ) : (
        <View className="rounded-3xl h-32 bg-gray-300 flex-row justify-center items-center mb-1">
          <Text className="text-gray-500 text-xs px-3 text-center">
            No Poster Available
          </Text>
        </View>
      )}
      <View>
        <Text className="text-white">
          {movie.title} ({movie.release_date.split("-")[0]})
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default function AskChatGPTScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(
    categoryTypes[0]
  )
  const {
    isLoading,
    isError,
    data: aiMovieRecommendations,
  } = useQuery({
    queryKey: ["getAiMovieRecommendationsByCategory", selectedCategory],
    queryFn: () => getAiMovieRecommendationsByCategory(selectedCategory),
  })

  return (
    <View className="flex-1">
      <GradientBackground />
      <View className="px-6">
        <Text className="text-white text-lg mb-3">
          Good day. Here are some movie recommendations.
        </Text>
        <FlatList
          className="mb-3"
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoryTypes}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedCategory(item)}>
              <Text className="text-white [background-color:_#FE6007] px-2 py-1 rounded-full">
                {item}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View className="w-2"></View>}
          keyExtractor={(categoryType) => categoryType}
        />
      </View>
      <>
        {isLoading ? (
          <Text className="text-white text-center">Loading ...</Text>
        ) : (
          <>
            {isError ? (
              <Text className="text-white text-center">
                An error while fetching movie recommendations.
              </Text>
            ) : (
              <ScrollView className="px-6">
                {aiMovieRecommendations.map((movie) => (
                  <MovieResultItem key={movie.id} movie={movie} />
                ))}
              </ScrollView>
            )}
          </>
        )}
      </>
    </View>
  )
}
