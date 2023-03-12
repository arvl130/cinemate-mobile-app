import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  View,
  Text,
} from "react-native"
import type { ViewToken } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRef, useState } from "react"

function SearchSection() {
  return (
    <>
      <View className="flex-row justify-center items-center gap-3 mt-4 mb-3">
        <Image
          className="h-12 w-12"
          source={require("../assets/cinemate-logo.png")}
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
        <LinearGradient
          colors={["rgba(254, 96, 7, 0.3)", "rgba(237, 185, 123, 0.3)"]}
          locations={[0, 1]}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl"
        >
          <TextInput
            placeholder="Search"
            placeholderTextColor={"#ffffff"}
            className="border border-white/20 rounded-2xl px-6 py-2 "
          />
        </LinearGradient>
      </View>
    </>
  )
}

type MovieEntry = {
  id: string
  title: string
  publisher: string
  image: any
}

const NEW_RELEASE_DATA: Array<MovieEntry> = [
  {
    id: "1",
    title: "Shang-Chi",
    publisher: "Marvel Studios",
    image: require("../assets/posters/shang-chi.jpg"),
  },
  {
    id: "2",
    title: "Deadpool",
    publisher: "Marvel Studios",
    image: require("../assets/posters/deadpool.jpg"),
  },
  {
    id: "3",
    title: "Doctor Strange: Multiverse of Madness",
    publisher: "Marvel Studios",
    image: require("../assets/posters/doctor-strange-multiverse-of-madness.jpeg"),
  },
]

function NewReleaseSectionItem({ item }: { item: MovieEntry }) {
  return <Image source={item.image} className="rounded-3xl h-32 w-72 " />
}

function NewReleaseSection() {
  const flatList = useRef<FlatList | null>(null)
  const [currentItem, setCurrentItem] = useState<null | MovieEntry>(null)
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
        renderItem={({ item }) => <NewReleaseSectionItem item={item} />}
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
            <Text
              className="text-white"
              style={{
                fontFamily: "Inter_600SemiBold",
              }}
            >
              {currentItem.title}
            </Text>
            <Text className="text-white text-xs">{currentItem.publisher}</Text>
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

const FOR_YOU_DATA: Array<MovieEntry> = [
  {
    id: "1",
    title: "Shang-Chi",
    publisher: "Marvel Studios",
    image: require("../assets/posters/shang-chi.jpg"),
  },
  {
    id: "2",
    title: "Deadpool",
    publisher: "Marvel Studios",
    image: require("../assets/posters/deadpool.jpg"),
  },
  {
    id: "3",
    title: "Doctor Strange: Multiverse of Madness",
    publisher: "Marvel Studios",
    image: require("../assets/posters/doctor-strange-multiverse-of-madness.jpeg"),
  },
]

function ForYouSectionItem({ item }: { item: MovieEntry }) {
  return <Image source={item.image} className="rounded-3xl h-32 w-24" />
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
        renderItem={({ item }) => <ForYouSectionItem item={item} />}
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        keyExtractor={(item) => item.id}
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
        <Text className="text-white">New & Popular</Text>
      </View>
      <FlatList
        className="mb-3"
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FOR_YOU_DATA}
        renderItem={({ item }) => <ForYouSectionItem item={item} />}
        ItemSeparatorComponent={() => <View className="w-4"></View>}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

const { height } = Dimensions.get("window")

export function HomeScreen() {
  return (
    <LinearGradient
      colors={["#000000", "#393737"]}
      style={{
        height,
      }}
    >
      <ScrollView>
        <SearchSection />
        <NewReleaseSection />
        <ForYouSection />
        <FeaturedSection />
      </ScrollView>
    </LinearGradient>
  )
}
