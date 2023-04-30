import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { GradientBackground } from "../../components/gradient-bg"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  deleteSchedule,
  editSchedule,
  getFriends,
  getSchedule,
  getUserProfile,
} from "../../utils/api"
import { IsAuthenticatedView } from "../../components/is-authenticated"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DateTime } from "luxon"
import { useNavigation } from "@react-navigation/native"
import { AppStackProp } from "../../types/routes"

function DatePicker({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date
  setSelectedDate: (newSelectedDate: Date) => void
}) {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  function formattedDate(date: Date) {
    const monthInt = date.getMonth() + 1
    const month = monthInt > 9 ? `${monthInt}` : `0${monthInt}`
    const dayInt = date.getDate()
    const day = dayInt > 9 ? `${dayInt}` : `0${dayInt}`

    return `${date.getFullYear()}-${month}-${day}`
  }

  return (
    <View className="[background-color:_#2B2B2B] rounded-2xl px-4 py-2 mb-3">
      <View className="mb-1">
        <Text className="text-white">
          Selected Date: {formattedDate(selectedDate)}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        className="[background-color:_#FE6007] rounded-md font-medium mb-3"
        onPress={() => setIsDatePickerVisible(true)}
      >
        <Text className="text-white text-center py-3 font-medium">
          SELECT DATE
        </Text>
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={selectedDate}
          mode={"date"}
          is24Hour={true}
          onChange={(event, newSelectedDate) => {
            if (!newSelectedDate) return

            setIsDatePickerVisible(false)
            setSelectedDate(newSelectedDate)
          }}
        />
      )}
    </View>
  )
}

function TimePicker({
  selectedTime,
  setSelectedTime,
}: {
  selectedTime: Date
  setSelectedTime: (newSelectedTime: Date) => void
}) {
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)

  function formattedTime(date: Date) {
    const hoursInt = date.getHours()
    const hours = hoursInt > 9 ? `${hoursInt}` : `0${hoursInt}`
    const minutesInt = date.getMinutes()
    const minutes = minutesInt > 9 ? `${minutesInt}` : `0${minutesInt}`

    return `${hours}:${minutes}`
  }

  return (
    <View className="[background-color:_#2B2B2B] rounded-2xl px-4 py-2 mb-3">
      <View className="mb-1">
        <Text className="text-white">
          Selected Time: {formattedTime(selectedTime)}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        className="[background-color:_#FE6007] rounded-md font-medium mb-3"
        onPress={() => setIsTimePickerVisible(true)}
      >
        <Text className="text-white text-center py-3 font-medium">
          SELECT TIME
        </Text>
      </TouchableOpacity>
      {isTimePickerVisible && (
        <DateTimePicker
          value={selectedTime}
          mode={"time"}
          is24Hour={true}
          onChange={(event, newSelectedTime) => {
            if (!newSelectedTime) return

            setIsTimePickerVisible(false)
            setSelectedTime(newSelectedTime)
          }}
        />
      )}
    </View>
  )
}

function FriendsPickerItem({
  friendId,
  selectedFriends,
  setSelectedFriends,
}: {
  friendId: string
  selectedFriends: string[]
  setSelectedFriends: (newSelectedFriends: string[]) => void
}) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["userProfile", friendId],
    queryFn: () => getUserProfile(friendId),
  })

  if (isLoading)
    return (
      <View className="px-6 py-2 flex-row justify-center items-center">
        <Text className="text-white">Loading ...</Text>
      </View>
    )

  if (isError)
    return (
      <View className="px-6 py-2 flex-row justify-center items-center">
        <Text className="text-red-500">
          An error occured while retrieving this user.
        </Text>
      </View>
    )

  const isSelected = selectedFriends.some(
    (selectedFriendId) => selectedFriendId === friendId
  )

  return (
    <View className="flex-row items-center gap-6">
      <View className="h-20 w-20">
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
      </View>
      <View className="flex-1 flex-row justify-between">
        <Text className="text-white">{data.displayName}</Text>
        <>
          {isSelected ? (
            <TouchableOpacity
              onPress={() => {
                setSelectedFriends(
                  selectedFriends.filter(
                    (selectedFriendId) => selectedFriendId !== friendId
                  )
                )
              }}
            >
              <Text className="text-red-500 font-medium">Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setSelectedFriends([...selectedFriends, friendId])
              }}
            >
              <Text className="[color:_#FE6007] font-medium">Invite</Text>
            </TouchableOpacity>
          )}
        </>
      </View>
    </View>
  )
}

function FriendsPicker({
  userId,
  selectedFriends,
  setSelectedFriends,
}: {
  userId: string
  selectedFriends: string[]
  setSelectedFriends: (newSelectedFriends: string[]) => void
}) {
  const {
    isLoading,
    isError,
    data: friends,
  } = useQuery({
    queryKey: ["getFriends", userId],
    queryFn: () => getFriends(),
  })

  if (isLoading)
    return (
      <View className="px-4">
        <Text className="text-white text-center py-6">Loading ...</Text>
      </View>
    )

  if (isError)
    return (
      <View className="px-4">
        <Text className="text-white mb-3 font-semibold">Invited Friends</Text>
        <Text className="text-white text-center py-6">
          An error occured while retrieving friends :{"("}
        </Text>
      </View>
    )

  if (friends.length === 0)
    return (
      <View className="px-4">
        <Text className="text-white mb-3 font-semibold">Invited Friends</Text>
        <Text className="text-white text-center py-6">No friends added.</Text>
      </View>
    )

  return (
    <ScrollView className="flex-1 mb-3 px-4">
      <Text className="text-white mb-3 font-semibold">Invited Friends</Text>
      {friends.map((friend) => (
        <FriendsPickerItem
          key={friend.friendId}
          friendId={friend.friendId}
          selectedFriends={selectedFriends}
          setSelectedFriends={setSelectedFriends}
        />
      ))}
    </ScrollView>
  )
}

const formSchema = z.object({
  isoDate: z.string().datetime({
    offset: true,
  }),
  movieId: z.number(),
  invitedFriendIds: z.string().length(28).array(),
})

type FormType = z.infer<typeof formSchema>

function EditForm({
  movieId,
  initialDate,
  initialSelectedFriends,
  userId,
}: {
  movieId: number
  initialDate: Date
  initialSelectedFriends: string[]
  userId: string
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedTime, setSelectedTime] = useState(initialDate)
  const [selectedFriends, setSelectedFriends] = useState<string[]>(
    initialSelectedFriends
  )

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movieId,
      invitedFriendIds: [],
      isoDate:
        DateTime.fromObject(
          {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
            hour: selectedTime.getHours(),
            minute: selectedTime.getMinutes(),
          },
          {
            zone: "Asia/Manila",
          }
        ).toISO() ?? undefined,
    },
  })

  const navigation = useNavigation<AppStackProp>()
  const { mutate: doEditSchedule } = useMutation({
    mutationKey: ["editSchedule", userId, initialDate],
    mutationFn: (values: {
      userId: string
      isoDate: string
      newIsoDate: string
      movieId: number
      invitedFriendIds: string[]
    }) => editSchedule(values),
    onSuccess: () => {
      navigation.navigate("Authenticated Tabs", {
        screen: "Schedules Tab",
      })
    },
  })

  const { mutate: doDeleteSchedule } = useMutation({
    mutationKey: ["deleteSchedule", userId, initialDate],
    mutationFn: (values: { userId: string; isoDate: string }) =>
      deleteSchedule(values),
    onSuccess: () => {
      navigation.navigate("Authenticated Tabs", {
        screen: "Schedules Tab",
      })
    },
  })

  return (
    <View className="flex-1">
      <View className="flex-1 px-3">
        <GradientBackground />
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={(newSelectedDate: Date) => {
            const isoDateObj = DateTime.fromObject(
              {
                year: newSelectedDate.getFullYear(),
                month: newSelectedDate.getMonth() + 1,
                day: newSelectedDate.getDate(),
                hour: selectedTime.getHours(),
                minute: selectedTime.getMinutes(),
              },
              {
                zone: "Asia/Manila",
              }
            )
            const isoDateStr = isoDateObj.toISO()
            if (!isoDateStr) return

            setSelectedDate(newSelectedDate)
            setValue("isoDate", isoDateStr)
          }}
        />
        <TimePicker
          selectedTime={selectedTime}
          setSelectedTime={(newSelectedTime: Date) => {
            const isoDateObj = DateTime.fromObject(
              {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
                hour: newSelectedTime.getHours(),
                minute: newSelectedTime.getMinutes(),
              },
              {
                zone: "Asia/Manila",
              }
            )
            const isoDateStr = isoDateObj.toISO()
            if (!isoDateStr) return

            setSelectedTime(newSelectedTime)
            setValue("isoDate", isoDateStr)
          }}
        />
        <FriendsPicker
          userId={userId}
          selectedFriends={selectedFriends}
          setSelectedFriends={(newSelectedFriends: string[]) => {
            setSelectedFriends(newSelectedFriends)
            setValue("invitedFriendIds", newSelectedFriends)
          }}
        />
      </View>
      <View className="px-3">
        <TouchableOpacity
          onPress={handleSubmit(async (formData) => {
            doDeleteSchedule({
              userId,
              isoDate:
                DateTime.fromJSDate(initialDate, {
                  zone: "Asia/Manila",
                }).toISO() ?? "",
            })
          })}
          activeOpacity={0.6}
          className="bg-red-500 rounded-md font-medium mb-3"
        >
          <Text className="text-white text-center py-3 font-medium">
            DELETE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit(async (formData) => {
            doEditSchedule({
              isoDate:
                DateTime.fromJSDate(initialDate, {
                  zone: "Asia/Manila",
                }).toISO() ?? "",
              invitedFriendIds: formData.invitedFriendIds,
              newIsoDate: formData.isoDate,
              movieId: formData.movieId,
              userId,
            })
          })}
          activeOpacity={0.6}
          className="bg-white rounded-md font-medium mb-6"
        >
          <Text className="[color:_#FE6007] text-center py-3 font-medium">
            SAVE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function UserLoaded({
  movieId,
  isoDate,
  userId,
}: {
  movieId: number
  isoDate: string
  userId: string
}) {
  const {
    isLoading,
    isError,
    data: schedule,
  } = useQuery({
    queryKey: ["getSchedule", userId, isoDate],
    queryFn: () => getSchedule(userId, isoDate),
  })

  if (isLoading)
    return <Text className="text-center text-white">Loading ...</Text>
  if (isError)
    return (
      <Text className="text-center text-red-500">
        An error occured while retrieving schedule
      </Text>
    )

  return (
    <EditForm
      initialDate={new Date(schedule.isoDate)}
      userId={userId}
      movieId={movieId}
      initialSelectedFriends={schedule.scheduleInvites.map(
        (scheduleInvite) => scheduleInvite.friendId
      )}
    />
  )
}

export function EditScheduleScreen({ route }: any) {
  const { movieId, isoDate } = route.params

  return (
    <IsAuthenticatedView>
      {(user) => (
        <UserLoaded userId={user.uid} movieId={movieId} isoDate={isoDate} />
      )}
    </IsAuthenticatedView>
  )
}
