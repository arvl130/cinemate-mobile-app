export declare class UserRecord {
  uid: string
  email?: string
  emailVerified: boolean
  displayName?: string
  photoURL?: string
  phoneNumber?: string
  disabled: boolean
  metadata: {
    lastSignInTime: string
    creationTime: string
    lastRefreshTime: string
  }
  providerData: {
    uid: string
    displayName: string
    email: string
    providerId: string
  }[]
  passwordHash?: string
  passwordSalt?: string
  customClaims?: {
    [key: string]: any
  }
  tenantId?: string | null
  tokensValidAfterTime?: string
}
