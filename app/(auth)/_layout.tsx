import { Redirect, Stack, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()
  const params = useLocalSearchParams()

  if (isSignedIn) {
    if (params.from === 'belay') {
      return <Redirect href="../tabs/index" />
    }
    // Default to explore if from=route or anything else
    return <Redirect href="/explore" />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}