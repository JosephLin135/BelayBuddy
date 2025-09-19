// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Slot, Stack } from 'expo-router'
import { tokenCache } from '@/app/tokenCache' 

export default function RootLayout() {
  const colorScheme = useColorScheme()

    if (!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to you .env file!')
    }

  return (
    <>
    <StatusBar style="auto" />
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}>
        <ClerkLoaded>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false}}/>
          <Stack.Screen name="(auth)" options={{ headerShown: false}}/>
        </Stack>
      </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
    </>
  )
}
