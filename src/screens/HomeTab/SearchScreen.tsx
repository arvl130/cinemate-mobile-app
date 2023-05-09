import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useState } from "react"
import type { MovieListEntry } from "../../types/Movie"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { searchMovies } from "../../utils/api"
import type { Movie } from "tmdb-ts"
import { GradientBackground } from "../../components/gradient-bg"
import { AppStackProp } from "../../types/routes"

function SearchResult({ movie }: { movie: MovieListEntry }) {
  const navigation = useNavigation<AppStackProp>()

  return (
    <>
      <TouchableOpacity
        key={movie.id}
        activeOpacity={0.8}
        className="[background-color:_#353535] h-24 flex-row mb-2"
        onPress={() => {
          navigation.navigate("Movie Details", {
            movieId: movie.id,
          })
        }}
      >
        <View>
          {movie.poster_path ? (
            <>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
                }}
                className="h-24 w-32"
              />
            </>
          ) : (
            <View className="bg-gray-300 h-24 w-32 flex-row justify-center items-center">
              <Text className=" text-gray-500 text-xs px-3 text-center">
                No Poster Available
              </Text>
            </View>
          )}
        </View>
        <View className="px-4 py-2">
          <Text className="text-white">{movie.title}</Text>
          <Text className="text-white">{movie.release_date}</Text>
          <View className="flex-row gap-1">
            {movie.genre_ids.map((id) => {
              return (
                <Text className="text-white" key={id}>
                  {id}
                </Text>
              )
            })}
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}

function SearchSection({
  searchTerm,
  setSearchTerm,
  onSubmitFn,
}: {
  searchTerm: string
  setSearchTerm: (text: string) => void
  onSubmitFn: () => void
}) {
  return (
    <>
      <View className="px-6 mt-3">
        <LinearGradient
          colors={["rgba(254, 96, 7, 0.3)", "rgba(237, 185, 123, 0.3)"]}
          locations={[0, 1]}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl"
        >
          <TextInput
            returnKeyType="search"
            placeholder="Search"
            placeholderTextColor={"#ffffff"}
            className="text-white border border-white/20 rounded-2xl px-6 py-2"
            blurOnSubmit={searchTerm.length > 0}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            onSubmitEditing={onSubmitFn}
          />
        </LinearGradient>
      </View>
    </>
  )
}

const RECENT_SEARCHES_DATA = [
  {
    adult: false,
    backdrop_path: "/6O1mOoTXuc1WqjKd2R7MFQHZ7Eb.jpg",
    genre_ids: [14, 16, 10751],
    id: 8392,
    original_language: "ja",
    original_title: "となりのトトロ",
    overview:
      "Two sisters move to the country with their father in order to be closer to their hospitalized mother, and discover the surrounding trees are inhabited by Totoros, magical spirits of the forest. When the youngest runs away from home, the older sister seeks help from the spirits to find her.",
    popularity: 56.446,
    poster_path: "/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg",
    release_date: "1988-04-16",
    title: "My Neighbor Totoro",
    video: false,
    vote_average: 8.069,
    vote_count: 6712,
  },
  {
    adult: false,
    backdrop_path: "/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg",
    genre_ids: [16, 10751, 14],
    id: 129,
    original_language: "ja",
    original_title: "千と千尋の神隠し",
    overview:
      "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    popularity: 92.13,
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    release_date: "2001-07-20",
    title: "Spirited Away",
    video: false,
    vote_average: 8.54,
    vote_count: 14053,
  },
  {
    adult: false,
    backdrop_path: "/27ZkYMWynuK2qiDP6awc3MsCaOs.jpg",
    genre_ids: [10749, 18],
    id: 527641,
    original_language: "en",
    original_title: "Five Feet Apart",
    overview:
      "Seventeen-year-old Stella spends most of her time in the hospital as a cystic fibrosis patient. Her life is full of routines, boundaries and self-control — all of which get put to the test when she meets Will, an impossibly charming teen who has the same illness. There's an instant flirtation, though restrictions dictate that they must maintain a safe distance between them. As their connection intensifies, so does the temptation to throw the rules out the window and embrace that attraction.",
    popularity: 59.75,
    poster_path: "/kreTuJBkUjVWePRfhHZuYfhNE1T.jpg",
    release_date: "2019-03-14",
    title: "Five Feet Apart",
    video: false,
    vote_average: 8.3,
    vote_count: 5068,
  },
]

function RecentSearchesSection() {
  return (
    <View>
      <View className="px-6 flex-row justify-between items-center my-3">
        <Text className="font-semibold text-white text-lg">
          Recent Searches
        </Text>
        <TouchableOpacity>
          <Text className="[color:_#FE6007]">Clear</Text>
        </TouchableOpacity>
      </View>
      <View>
        {RECENT_SEARCHES_DATA.map((movie) => (
          <SearchResult movie={movie} key={movie.id} />
        ))}
      </View>
    </View>
  )
}

function SearchResultsSection({
  searchResults,
  isLoading,
  isError,
}: {
  searchResults: Array<MovieListEntry>
  isLoading: boolean
  isError: boolean
}) {
  return (
    <View>
      {isLoading ? (
        <Text className="text-white text-center my-3 text-lg">
          Searching ...
        </Text>
      ) : (
        <>
          {isError ? (
            <>
              <Text className="text-white text-center my-3 text-lg">
                An error occured while searching. {")"}:
              </Text>
            </>
          ) : (
            <>
              {searchResults.length === 0 ? (
                <>
                  <Text className="text-white text-center my-3 text-lg">
                    No results found.
                  </Text>
                </>
              ) : (
                <>
                  <View className="px-6 flex-row justify-between items-center my-3">
                    <Text className="font-bold text-white text-lg">
                      Search Results
                    </Text>
                  </View>
                  <View>
                    {searchResults.map((movie) => (
                      <SearchResult movie={movie} key={movie.id} />
                    ))}
                  </View>
                </>
              )}
            </>
          )}
        </>
      )}
    </View>
  )
}

export function SearchScreen({ route }: any) {
  const navigation = useNavigation<
    NativeStackNavigationProp<{
      Home: undefined
      Search: {
        query: string
      }
    }>
  >()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  async function loadSearchResults(searchQuery: string) {
    try {
      setIsLoading(true)
      setHasSearched(true)

      const results = await searchMovies(searchQuery)

      setSearchResults(results)
      setIsError(false)
    } catch (e) {
      setIsError(true)
      console.log("error occured", e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View>
      <GradientBackground />

      <ScrollView>
        <SearchSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmitFn={() => {
            loadSearchResults(searchTerm)
          }}
        />

        {hasSearched ? (
          <>
            <SearchResultsSection
              searchResults={searchResults}
              isLoading={isLoading}
              isError={isError}
            />
          </>
        ) : (
          <>
            <RecentSearchesSection />
          </>
        )}
      </ScrollView>
    </View>
  )
}
