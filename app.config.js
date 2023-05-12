require("dotenv").config()

module.exports = {
  name: "Cinemate",
  version: "1.0.0",
  android: {
    package: "com.ageulin.cinemate",
  },
  extra: {
    eas: {
      projectId: "a33dbfc2-6503-46a8-b7d8-04b75aae200d",
    },
    firebaseConfig: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
    backendBaseUrl: process.env.BACKEND_BASE_URL,
    nativeNotifyAppId: process.env.NATIVE_NOTIFY_APP_ID,
    nativeNotifyAppToken: process.env.NATIVE_NOTIFY_APP_TOKEN,
    tmdbAccessToken: process.env.TMDB_ACCESS_TOKEN,
  },
}
