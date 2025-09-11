import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = async () => {
    if (!isLoaded) return
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/') // You can still force home after login
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {/* 🔙 Back button */}
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Text style={{ color: 'blue' }}>← Back</Text>
      </TouchableOpacity>

      <Text>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        style={{ borderWidth: 1, width: '100%', marginVertical: 8, padding: 8 }}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, width: '100%', marginVertical: 8, padding: 8 }}
      />
      <TouchableOpacity onPress={onSignInPress} style={{ marginTop: 12 }}>
        <Text>Continue</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Link href="/sign-up">
          <Text style={{ color: 'blue' }}>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}
