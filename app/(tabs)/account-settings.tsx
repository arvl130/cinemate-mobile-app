import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
} from "react-native"
import {
  User,
  getAuth,
  reauthenticateWithCredential,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth } from "../../src/firebase"
import { GradientBackground } from "../../src/components/gradient-bg"
import { IsAuthenticatedView } from "../../src/components/is-authenticated"
import Modal from "react-native-modal"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmailAuthProvider } from "firebase/auth/react-native"
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker"
import { FirebaseError } from "firebase/app"

function UpdatePhotoModal({
  isVisible,
  closeFn,
  user,
}: {
  isVisible: boolean
  closeFn: () => void
  user: User
}) {
  const [imageUri, setImageUri] = useState<string | null>(user.photoURL)

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => {
        closeFn()
      }}
      onBackdropPress={() => {
        closeFn()
      }}
      onSwipeComplete={() => {
        closeFn()
      }}
    >
      <View className="[background-color:_#2b2b2b] w-72 mx-auto px-6 pt-3 pb-5 rounded-2xl">
        <View className="flex-row  items-center gap-1 mb-2">
          <TouchableOpacity
            onPress={() => {
              closeFn()
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-lg pb-1">
            Change Profile Picture
          </Text>
        </View>

        <View>
          <View className="mb-3">
            <View className="w-20 h-20 mx-auto">
              {imageUri ? (
                <Image
                  className="w-full h-full rounded-full"
                  source={{
                    uri: imageUri,
                  }}
                />
              ) : (
                <Image
                  className="w-full h-full rounded-full"
                  source={require("../../assets/no-photo-url.jpg")}
                />
              )}
            </View>
          </View>

          <View className="mb-3 flex-row">
            <TouchableOpacity
              className="mx-auto"
              onPress={async () => {
                const result = await launchImageLibraryAsync({
                  mediaTypes: MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 1,
                })

                if (!result.assets) return
                setImageUri(result.assets[0].uri)
              }}
            >
              <Text className="bg-gray-300 text-gray-800 px-4 py-3 text-center rounded-lg">
                Choose an Image
              </Text>
            </TouchableOpacity>
            {imageUri !== null && (
              <TouchableOpacity
                className="mx-auto"
                onPress={async () => {
                  setImageUri(null)
                }}
              >
                <Text className="bg-gray-300 text-gray-800 px-4 py-3 text-center rounded-lg">
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            className="mx-auto"
            onPress={async () => {
              try {
                if (imageUri) {
                  const storage = getStorage()
                  const response = await fetch(imageUri)
                  const imageBlob = await response.blob()
                  const imageRef = ref(storage, `profile-pictures/${user.uid}`)

                  await uploadBytes(imageRef, imageBlob)
                  const downloadUrl = await getDownloadURL(imageRef)
                  await updateProfile(user, {
                    photoURL: downloadUrl,
                  })
                } else {
                  await updateProfile(user, {
                    photoURL: null,
                  })
                }
                closeFn()
              } catch (e) {
                console.log("Error occured", e)
              }
            }}
          >
            <Text className="[background-color:_#FE6007] text-white w-24 py-3 text-center rounded-lg">
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function UpdatePhotoSection({ user }: { user: User }) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <View className="flex-row items-center justify-center">
      <View className="items-center">
        <View>
          <View className="w-28 h-28 mx-auto">
            {user.photoURL ? (
              <Image
                className="w-full h-full rounded-full"
                source={{
                  uri: user.photoURL,
                }}
              />
            ) : (
              <Image
                className="w-full h-full rounded-full"
                source={require("../../assets/no-photo-url.jpg")}
              />
            )}
          </View>
        </View>
        <TouchableOpacity
          className="mt-2"
          onPress={() => setIsModalVisible(true)}
        >
          <Text className="text-blue-500 underline">Edit Picture</Text>
        </TouchableOpacity>
        <UpdatePhotoModal
          user={user}
          closeFn={() => setIsModalVisible(false)}
          isVisible={isModalVisible}
        />
      </View>
    </View>
  )
}

const updateNameFormSchema = z.object({
  displayName: z.string().min(1),
})

type UpdateNameFormType = z.infer<typeof updateNameFormSchema>

function UpdateNameModal({
  isVisible,
  closeFn,
  initialDisplayName,
  user,
}: {
  isVisible: boolean
  closeFn: () => void
  initialDisplayName: string
  user: User
}) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateNameFormType>({
    resolver: zodResolver(updateNameFormSchema),
    defaultValues: {
      displayName: initialDisplayName,
    },
  })

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => closeFn()}
      onBackdropPress={() => closeFn()}
      onSwipeComplete={() => closeFn()}
    >
      <View className="[background-color:_#2b2b2b] w-72 mx-auto px-6 pt-3 pb-5 rounded-2xl">
        <View className="flex-row  items-center gap-1 mb-2">
          <TouchableOpacity onPress={() => closeFn()}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-lg pb-1">
            Change Name
          </Text>
        </View>

        <View>
          <Text className="[color:_#7E7979] mb-1">Full name</Text>
          <Controller
            name="displayName"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Your beautiful name ..."
                className="[background-color:_#555555] rounded-md px-4 py-1 text-white"
              />
            )}
          />

          {errors.displayName && (
            <Text className="text-red-500 mt-1 text-right">
              This is required.
            </Text>
          )}

          <TouchableOpacity
            className="mt-3 mx-auto"
            onPress={handleSubmit(async (formData) => {
              await updateProfile(user, {
                displayName: formData.displayName,
              })
              closeFn()
            })}
          >
            <Text className="[background-color:_#FE6007] text-white w-24 py-3 text-center rounded-lg">
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function UpdateNameSection({ user }: { user: User }) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <View>
      <Text className="text-white font-medium [color:_#7E7979] mb-1">Name</Text>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Text className="[background-color:_#353535] rounded-md px-4 py-2 text-white">
          {user.displayName}
        </Text>
      </TouchableOpacity>
      <UpdateNameModal
        isVisible={isModalVisible}
        closeFn={() => setIsModalVisible(false)}
        initialDisplayName={user.displayName ?? ""}
        user={user}
      />
    </View>
  )
}

const updateEmailFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type UpdateEmailFormType = z.infer<typeof updateEmailFormSchema>

function UpdateEmailModal({
  isVisible,
  closeFn,
  user,
}: {
  isVisible: boolean
  closeFn: () => void
  user: User
}) {
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<UpdateEmailFormType>({
    resolver: zodResolver(updateEmailFormSchema),
    defaultValues: {
      email: user.email ?? "",
      password: "",
    },
  })

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => {
        reset()
        closeFn()
      }}
      onBackdropPress={() => {
        reset()
        closeFn()
      }}
      onSwipeComplete={() => {
        reset()
        closeFn()
      }}
    >
      <View className="[background-color:_#2b2b2b] w-72 mx-auto px-6 pt-3 pb-5 rounded-2xl">
        <View className="flex-row  items-center gap-1 mb-2">
          <TouchableOpacity
            onPress={() => {
              reset()
              closeFn()
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-lg pb-1">
            Change Email
          </Text>
        </View>

        <View>
          <View className="mb-3">
            <Text className="[color:_#7E7979] mb-1">Email</Text>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Your beautiful name ..."
                  className="[background-color:_#555555] rounded-md px-4 py-1 text-white"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500 mt-1">{errors.email.message}</Text>
            )}
          </View>

          <View className="mb-3">
            <Text className="[color:_#7E7979] mb-1">Password</Text>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder={"********"}
                  placeholderTextColor={"#7E7979"}
                  className="[background-color:_#555555] rounded-md px-4 py-1 text-white"
                  secureTextEntry={true}
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500 mt-1">
                {errors.password.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="mx-auto"
            onPress={handleSubmit(async (formData) => {
              const authCredential = EmailAuthProvider.credential(
                user.email ?? "",
                formData.password
              )
              const userCredential = await reauthenticateWithCredential(
                user,
                authCredential
              )
              await updateEmail(userCredential.user, formData.email)
              reset()
              closeFn()
            })}
          >
            <Text className="[background-color:_#FE6007] text-white w-24 py-3 text-center rounded-lg">
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function UpdateEmailSection({ user }: { user: User }) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <View>
      <Text className="text-white font-medium [color:_#7E7979] mt-3 mb-1">
        Email Address
      </Text>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Text className="[background-color:_#353535] rounded-md px-4 py-2 text-white">
          {user.email}
        </Text>
      </TouchableOpacity>
      <UpdateEmailModal
        isVisible={isModalVisible}
        closeFn={() => setIsModalVisible(false)}
        user={user}
      />
    </View>
  )
}

const updatePasswordFormSchema = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

type UpdatePasswordFormType = z.infer<typeof updatePasswordFormSchema>

function UpdatePasswordModal({
  isVisible,
  closeFn,
  user,
}: {
  isVisible: boolean
  closeFn: () => void
  user: User
}) {
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<UpdatePasswordFormType>({
    resolver: zodResolver(updatePasswordFormSchema),
  })

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => {
        reset()
        closeFn()
      }}
      onBackdropPress={() => {
        reset()
        closeFn()
      }}
      onSwipeComplete={() => {
        reset()
        closeFn()
      }}
    >
      <View className="[background-color:_#2b2b2b] w-72 mx-auto px-6 pt-3 pb-5 rounded-2xl">
        <View className="flex-row  items-center gap-1 mb-2">
          <TouchableOpacity
            onPress={() => {
              reset()
              closeFn()
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-lg pb-1">
            Change Password
          </Text>
        </View>

        <View>
          <View className="mb-3">
            <Text className="[color:_#7E7979] mb-1">Old Password</Text>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder={"********"}
                  placeholderTextColor={"#7E7979"}
                  className="[background-color:_#555555] rounded-md px-4 py-1 text-white"
                  secureTextEntry={true}
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500 mt-1">
                {errors.password.message}
              </Text>
            )}
          </View>

          <View className="mb-3">
            <Text className="[color:_#7E7979] mb-1">New Password</Text>
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder={"********"}
                  placeholderTextColor={"#7E7979"}
                  className="[background-color:_#555555] rounded-md px-4 py-1 text-white"
                  secureTextEntry={true}
                />
              )}
            />
            {errors.newPassword && (
              <Text className="text-red-500 mt-1">
                {errors.newPassword.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="mx-auto"
            onPress={handleSubmit(async (formData) => {
              const authCredential = EmailAuthProvider.credential(
                user.email ?? "",
                formData.password
              )
              const userCredential = await reauthenticateWithCredential(
                user,
                authCredential
              )
              await updatePassword(userCredential.user, formData.newPassword)
              reset()
              closeFn()
            })}
          >
            <Text className="[background-color:_#FE6007] text-white w-24 py-3 text-center rounded-lg">
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function UpdatePasswordSection({ user }: { user: User }) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <View>
      <Text className="text-white font-medium [color:_#7E7979] mt-3 mb-1">
        Password
      </Text>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Text className="[background-color:_#353535] rounded-md px-4 py-2 text-white">
          ********
        </Text>
      </TouchableOpacity>
      <UpdatePasswordModal
        closeFn={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        user={user}
      />
    </View>
  )
}

function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <View className="mt-6 bg-black">
      <TouchableOpacity
        onPress={async () => {
          setIsSigningOut(true)
          try {
            await signOut(auth)
          } finally {
            setIsSigningOut(false)
          }
        }}
      >
        <View
          style={{
            opacity: isSigningOut ? 0.6 : 1,
            borderRadius: 6,
          }}
          className="bg-red-500"
        >
          <Text className="text-white text-center px-4 py-3 uppercase font-medium">
            {isSigningOut ? "Logging Out ..." : "Logout"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default function AccountSettingsScreen() {
  return (
    <SafeAreaView>
      <GradientBackground />
      <IsAuthenticatedView>
        {(user) => (
          <>
            <View className="px-6">
              <UpdatePhotoSection user={user} />
              <UpdateNameSection user={user} />
              <UpdateEmailSection user={user} />
              <UpdatePasswordSection user={user} />
              <LogoutButton />
            </View>
          </>
        )}
      </IsAuthenticatedView>
    </SafeAreaView>
  )
}
