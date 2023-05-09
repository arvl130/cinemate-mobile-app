import {
  FlatList,
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native"
import type { ViewToken } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRef, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { MovieListEntry } from "../../types/Movie"
import { AppStackProp } from "../../types/routes"
import { GradientBackground } from "../../components/gradient-bg"
import { useQuery } from "@tanstack/react-query"
import {
  getAiMovieRecommendations,
  getPopularMovies,
  getTrendingMovies,
} from "../../utils/api"
import { Movie, MovieDetails } from "tmdb-ts"
import { useRefreshOnFocus } from "../../utils/refresh-on-focus"

function SearchSection() {
  const navigation = useNavigation<AppStackProp>()

  return (
    <>
      <View className="flex-row justify-center items-center gap-3 mt-3 mb-6">
        <Image
          className="h-12 w-12"
          source={require("../../assets/cinemate-logo.png")}
        />
        <Text
          className="text-white text-center text-2xl"
          style={{
            fontFamily: "Inter_500Medium",
          }}
        >
          cinemate
        </Text>
      </View>
      <View className="px-6 mb-3">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate("Search Movies")
          }}
        >
          <LinearGradient
            colors={["rgba(254, 96, 7, 0.3)", "rgba(237, 185, 123, 0.3)"]}
            locations={[0, 1]}
            start={{ x: -1, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl border border-white/20 px-6 py-3"
          >
            <Text className="text-white/20">Search movies ...</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  )
}

function TrendingSectionItem({ movie }: { movie: Movie }) {
  const navigation = useNavigation<AppStackProp>()

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate("Movie Details", {
          movieId: movie.id,
        })
      }}
    >
      {movie.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
          }}
          className="rounded-3xl h-32 w-72 "
        />
      ) : (
        <View className="rounded-3xl h-32 w-72 bg-gray-300 flex-row justify-center items-center">
          <Text className="text-gray-500 text-xs px-3 text-center">
            No Poster Available
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

function TrendingSection() {
  const flatList = useRef<FlatList | null>(null)
  const [currentItem, setCurrentItem] = useState<null | MovieListEntry>(null)
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>
  }) => {
    const currentItem = viewableItems.filter((item) => item.isViewable)[0]
    setCurrentItem(currentItem.item)
  }

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ])

  const {
    isLoading,
    isError,
    data: trendingMovies,
  } = useQuery({
    queryKey: ["getTrendingMovies"],
    queryFn: () => getTrendingMovies(),
  })

  if (isLoading)
    return <Text className="text-white text-center">Loading ...</Text>
  if (isError)
    return (
      <Text className="text-white text-center">
        An error while fetching trending movies.
      </Text>
    )

  return (
    <View>
      <Text
        className="text-white px-6 mb-3"
        style={{
          fontFamily: "Inter_700Bold",
        }}
      >
        Trending This Week
      </Text>
      <FlatList
        className="mb-3"
        ref={flatList}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={trendingMovies}
        renderItem={({ item }) => <TrendingSectionItem movie={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        // onViewableItemsChanged property is broken, so we have
        // to use this property instead.
        // See: https://github.com/facebook/react-native/issues/30171#issuecomment-1445005493
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      {currentItem ? (
        <View className="px-6 mb-3">
          <Text className="text-white font-semibold">{currentItem.title}</Text>
          <Text className="text-white text-xs">
            Released: {new Date(currentItem.release_date).getFullYear()}
          </Text>
        </View>
      ) : (
        <Text className="text-white text-center mb-3">None selected</Text>
      )}
    </View>
  )
}

const FOR_YOU_DATA: Array<MovieListEntry> = [
  {
    adult: false,
    backdrop_path: "/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg",
    genre_ids: [28, 12, 14, 878],
    id: 19995,
    original_language: "en",
    original_title: "Avatar",
    overview:
      "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    popularity: 463.206,
    poster_path: "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    release_date: "2009-12-15",
    title: "Avatar",
    video: false,
    vote_average: 7.567,
    vote_count: 28636,
  },
  {
    adult: false,
    backdrop_path: "/ifUfE79O1raUwbaQRIB7XnFz5ZC.jpg",
    genre_ids: [27, 9648, 53],
    id: 646385,
    original_language: "en",
    original_title: "Scream",
    overview:
      "Twenty-five years after a streak of brutal murders shocked the quiet town of Woodsboro, a new killer has donned the Ghostface mask and begins targeting a group of teenagers to resurrect secrets from the town’s deadly past.",
    popularity: 420.94,
    poster_path: "/gl8lf8UejgxbkgAfrpt3UGD1qPH.jpg",
    release_date: "2022-01-12",
    title: "Scream",
    video: false,
    vote_average: 6.724,
    vote_count: 2175,
  },
  {
    adult: false,
    backdrop_path: "/eVSa4TpyXbOdk9fXSD6OcORJGtv.jpg",
    genre_ids: [53, 27],
    id: 803114,
    original_language: "en",
    original_title: "The Requin",
    overview:
      "A couple on a romantic getaway find themselves stranded at sea when a tropical storm sweeps away their villa. In order to survive, they are forced to fight the elements, while sharks circle below.",
    popularity: 75.445,
    poster_path: "/i0z8g2VRZP3dhVvvSMilbOZMKqR.jpg",
    release_date: "2022-01-28",
    title: "The Requin",
    video: false,
    vote_average: 5.005,
    vote_count: 283,
  },
]

function ForYouSectionItem({ movie }: { movie: Movie }) {
  const navigation = useNavigation<AppStackProp>()

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Movie Details", {
          movieId: movie.id,
        })
      }}
      activeOpacity={0.6}
    >
      {movie.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
          }}
          className="rounded-3xl h-32 w-24"
        />
      ) : (
        <View className="rounded-3xl h-32 w-24 bg-gray-300 flex-row justify-center items-center">
          <Text className="text-gray-500 text-xs px-3 text-center">
            No Poster Available
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

function ForYouSection() {
  const navigation = useNavigation<AppStackProp>()
  const {
    isLoading,
    isError,
    data: aiMovieRecommendations,
  } = useQuery({
    queryKey: ["getAiMovieRecommendations"],
    queryFn: () => getAiMovieRecommendations(),
  })

  if (isLoading)
    return <Text className="text-white text-center py-3">Loading ...</Text>
  if (isError)
    return (
      <Text className="text-white text-center py-3">
        An error while fetching movie recommendations.
      </Text>
    )

  return (
    <View>
      <View className="flex-row items-center px-6 mb-3">
        <Text
          className="flex-1 text-white items-center"
          style={{
            fontFamily: "Inter_700Bold",
          }}
        >
          Recommended by AI
        </Text>
        <TouchableOpacity
          activeOpacity={0.4}
          className="border border-blue-500 py-1 px-2 rounded-md font-medium"
          onPress={() => navigation.navigate("Ask ChatGPT")}
        >
          <Text className="text-blue-500">Ask ChatGPT</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        className="mb-3"
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={aiMovieRecommendations}
        renderItem={({ item }) => <ForYouSectionItem movie={item} />}
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  )
}

function PopularSection() {
  const {
    isLoading,
    isError,
    data: popularMovies,
  } = useQuery({
    queryKey: ["getPopularMovies"],
    queryFn: () => getPopularMovies(),
  })

  if (isLoading)
    return <Text className="text-white text-center">Loading ...</Text>
  if (isError)
    return (
      <Text className="text-white text-center">
        An error while fetching trending movies.
      </Text>
    )

  return (
    <View>
      <Text
        className="text-white px-6 mb-3"
        style={{
          fontFamily: "Inter_700Bold",
        }}
      >
        Popular Today
      </Text>
      <FlatList
        className="mb-3"
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={popularMovies}
        renderItem={({ item }) => <ForYouSectionItem movie={item} />}
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  )
}

export function HomeScreen() {
  return (
    <View>
      <GradientBackground />

      <ScrollView>
        <SearchSection />
        <TrendingSection />
        <ForYouSection />
        <PopularSection />
      </ScrollView>
    </View>
  )
}
