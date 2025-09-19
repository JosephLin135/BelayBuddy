// tokenCache.ts
import * as SecureStore from 'expo-secure-store'
import type { TokenCache } from '@clerk/clerk-expo'

export const tokenCache: TokenCache = {
  getToken: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  saveToken: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value)
    } catch (err) {
      // ignore errors
    }
  },
}
