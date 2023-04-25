import {
  Dimensions,
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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { MovieListEntry } from "../../types/Movie"

function SearchSection() {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      Home: undefined
      Search: undefined
    }>
  >()

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
            navigation.navigate("Search")
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

const NEW_RELEASE_DATA: Array<MovieListEntry> = [
  {
    adult: false,
    backdrop_path: "/zxWAv1A34kdYslBi4ekMDtgIGUt.jpg",
    genre_ids: [28, 12, 14],
    id: 566525,
    original_language: "en",
    original_title: "Shang-Chi and the Legend of the Ten Rings",
    overview:
      "Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.",
    popularity: 122.899,
    poster_path: "/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg",
    release_date: "2021-09-01",
    title: "Shang-Chi and the Legend of the Ten Rings",
    video: false,
    vote_average: 7.626,
    vote_count: 7840,
  },
  {
    adult: false,
    backdrop_path: "/en971MEXui9diirXlogOrPKmsEn.jpg",
    genre_ids: [28, 12, 35],
    id: 293660,
    original_language: "en",
    original_title: "Deadpool",
    overview:
      "The origin story of former Special Forces operative turned mercenary Wade Wilson, who, after being subjected to a rogue experiment that leaves him with accelerated healing powers, adopts the alter ego Deadpool. Armed with his new abilities and a dark, twisted sense of humor, Deadpool hunts down the man who nearly destroyed his life.",
    popularity: 102.355,
    poster_path: "/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg",
    release_date: "2016-02-09",
    title: "Deadpool",
    video: false,
    vote_average: 7.602,
    vote_count: 28108,
  },
  {
    adult: false,
    backdrop_path: "/wcKFYIiVDvRURrzglV9kGu7fpfY.jpg",
    genre_ids: [14, 28, 12],
    id: 453395,
    original_language: "en",
    original_title: "Doctor Strange in the Multiverse of Madness",
    overview:
      "Doctor Strange, with the help of mystical allies both old and new, traverses the mind-bending and dangerous alternate realities of the Multiverse to confront a mysterious new adversary.",
    popularity: 234.939,
    poster_path: "/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    release_date: "2022-05-04",
    title: "Doctor Strange in the Multiverse of Madness",
    video: false,
    vote_average: 7.399,
    vote_count: 7106,
  },
]

function NewReleaseSectionItem({ movie }: { movie: MovieListEntry }) {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      "Movie Details": {
        id: number
      }
    }>
  >()

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate("Movie Details", {
          id: movie.id,
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

function NewReleaseSection() {
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

  return (
    <View>
      <Text
        className="text-white px-6 mb-3"
        style={{
          fontFamily: "Inter_700Bold",
        }}
      >
        New release
      </Text>
      <FlatList
        className="mb-3"
        ref={flatList}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={NEW_RELEASE_DATA}
        renderItem={({ item }) => <NewReleaseSectionItem movie={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        // onViewableItemsChanged property is broken, so we have
        // to use this property instead.
        // See: https://github.com/facebook/react-native/issues/30171#issuecomment-1445005493
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      {currentItem ? (
        <View className="px-6 flex-row mb-3">
          <View className="flex-1">
            <Text className="text-white font-semibold">
              {currentItem.title}
            </Text>
            <Text className="text-white text-xs">
              Released: {new Date(currentItem.release_date).getFullYear()}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-white">⭐⭐⭐</Text>
            <Text className="text-white text-xs [color:_#848484]">
              From 342 users
            </Text>
          </View>
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

const MOVIES_TVSHOWS_POPULAR_DATA = [
  {
    adult: false,
    backdrop_path: "/8H2O044M0xp240emFWAXjZsfLLx.jpg",
    genre_ids: [53, 878, 28],
    id: 700391,
    original_language: "en",
    original_title: "65",
    overview:
      "After a catastrophic crash on an unknown planet, pilot Mills quickly discovers he's actually stranded on Earth…65 million years ago. Now, with only one chance at rescue, Mills and the only other survivor, Koa, must make their way across an unknown terrain riddled with dangerous prehistoric creatures in an epic fight to survive.",
    popularity: 396.596,
    poster_path: "/uMMIeMVk1TCG3CZilpxbzFh0JKT.jpg",
    release_date: "2023-03-02",
    title: "65",
    video: false,
    vote_average: 5.778,
    vote_count: 72,
  },
  {
    adult: false,
    backdrop_path: "/o8u0NyEigCEaZHBdCYTRfXR8U4i.jpg",
    genre_ids: [27, 9648, 53],
    id: 396422,
    original_language: "en",
    original_title: "Annabelle: Creation",
    overview:
      "Several years after the tragic death of their little girl, a doll maker and his wife welcome a nun and several girls from a shuttered orphanage into their home, soon becoming the target of the doll maker's possessed creation—Annabelle.",
    popularity: 48.314,
    poster_path: "/tb86j8jVCVsdZnzf8I6cIi65IeM.jpg",
    release_date: "2017-08-03",
    title: "Annabelle: Creation",
    video: false,
    vote_average: 6.597,
    vote_count: 5056,
  },
  {
    adult: false,
    backdrop_path: "/kqZb0dzyCBSIoY5Nq0xGnKpWA57.jpg",
    genre_ids: [53],
    id: 1020910,
    original_language: "en",
    original_title: "Influencer",
    overview:
      "While struggling on a solo backpacking trip in Thailand, social media influencer Madison meets CW, who travels with ease and shows her a more uninhibited way of living. But CW's interest in her takes a darker turn.",
    popularity: 2.368,
    poster_path: "/8Fk0fxpCKZwBN52xEEog8liY2BY.jpg",
    release_date: "2023-05-18",
    title: "Influencer",
    video: false,
    vote_average: 0.0,
    vote_count: 0,
  },
]

function ForYouSectionItem({ movie }: { movie: MovieListEntry }) {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      "Movie Details": {
        id: number
      }
    }>
  >()

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Movie Details", {
          id: movie.id,
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
  return (
    <View>
      <Text
        className="text-white px-6 mb-3"
        style={{
          fontFamily: "Inter_700Bold",
        }}
      >
        For you
      </Text>
      <FlatList
        className="mb-3"
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FOR_YOU_DATA}
        renderItem={({ item }) => <ForYouSectionItem movie={item} />}
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  )
}

function FeaturedSection() {
  return (
    <View>
      <View className="flex-row justify-center gap-6 mb-3 px-6">
        <Text
          className="text-white"
          style={{
            fontFamily: "Inter_700Bold",
          }}
        >
          Movies
        </Text>
        <Text className="text-white">TV Shows</Text>
        <Text className="text-white">All Popular</Text>
      </View>
      <FlatList
        className="mb-3"
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={MOVIES_TVSHOWS_POPULAR_DATA}
        renderItem={({ item }) => <ForYouSectionItem movie={item} />}
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  )
}

const { height } = Dimensions.get("window")

export function HomeScreen() {
  return (
    <View>
      <LinearGradient
        colors={["#000000", "#393737"]}
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          height,
        }}
      />

      <ScrollView>
        <SearchSection />
        <NewReleaseSection />
        <ForYouSection />
        <FeaturedSection />
      </ScrollView>
    </View>
  )
}
