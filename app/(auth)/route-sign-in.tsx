import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#f6f7f9' }}>
      <StatusBar barStyle="dark-content" />
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} 
        style={{ position: 'absolute', top: 75, left: 20, zIndex: 1 }}>
        <Text style={{ color: '#3b82f6', fontSize: 18 }}>← Back</Text>
      </TouchableOpacity>
      <View style={{
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#222' }}>RouteVision</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email"
          placeholderTextColor="#888"
          onChangeText={setEmailAddress}
          style={{
            width: '100%',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            backgroundColor: '#f6f7f9',
            padding: 12,
            marginBottom: 16,
            fontSize: 16,
            color: '#222'
          }}
        />
        <TextInput
          value={password}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
          style={{
            width: '100%',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            backgroundColor: '#f6f7f9',
            padding: 12,
            marginBottom: 24,
            fontSize: 16,
            color: '#222'
          }}
        />
        <TouchableOpacity
          onPress={onSignInPress}
          style={{
            width: '100%',
            backgroundColor: '#3b82f6',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 16
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
        </TouchableOpacity>
        <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#888', marginBottom: 8 }}>Don't have an account?</Text>
          <Link href="/sign-up">
            <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
