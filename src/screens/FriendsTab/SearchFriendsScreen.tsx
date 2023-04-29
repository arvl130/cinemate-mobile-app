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
import { searchUserProfiles } from "../../utils/api"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { UserRecord } from "../../types/user"
import { AppStackProp } from "../../types/routes"
import { GradientBackground } from "../../components/gradient-bg"

function SearchResult({ userRecord }: { userRecord: UserRecord }) {
  const navigation = useNavigation<AppStackProp>()

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        className="[background-color:_#353535] h-24 flex-row mb-2 px-3"
        onPress={() =>
          navigation.push("Friend Profile", {
            friendId: userRecord.uid,
          })
        }
      >
        <View className="flex-row flex-1 gap-x-6 items-center">
          <View className="w-20 h-20">
            {userRecord.photoURL ? (
              <Image
                className="w-full h-full rounded-full"
                source={{
                  uri: userRecord.photoURL,
                }}
              />
            ) : (
              <Image
                className="w-full h-full rounded-full"
                source={require("../../assets/no-photo-url.jpg")}
              />
            )}
          </View>

          <View className="flex-1">
            <Text className="text-white">{userRecord.displayName}</Text>
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

function RecentSearchesSection() {
  return (
    <View>
      <View className="px-6 flex-row justify-between items-center my-3">
        <Text className="font-semibold text-white text-lg">
          Recent Searches
        </Text>
        <TouchableOpacity activeOpacity={0.5}>
          <Text className="[color:_#FE6007]">Clear</Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  )
}

const formSchema = z.object({
  query: z.string().min(1),
})

type FormType = z.infer<typeof formSchema>

export function SearchFriendsScreen() {
  const [query, setQuery] = useState("")
  const { isLoading, isError, data } = useQuery({
    queryKey: ["searchFriends", query],
    queryFn: () => searchUserProfiles(query),
    enabled: query !== "",
  })

  const { control, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  })

  return (
    <View>
      <GradientBackground />

      <ScrollView>
        <Controller
          name="query"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
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
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit((formData) => {
                    setQuery(formData.query)
                  })}
                />
              </LinearGradient>
            </View>
          )}
        />

        {query.length > 1 ? (
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
                    {data.length === 0 ? (
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
                          {data.map((userRecord) => (
                            <SearchResult
                              key={userRecord.uid}
                              userRecord={userRecord}
                            />
                          ))}
                        </View>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </View>
        ) : (
          <RecentSearchesSection />
        )}
      </ScrollView>
    </View>
  )
}
