import { StatusBar, Text, TextInput, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback} 
  from 'react-native'
import React, { useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Fonts } from '@/constants/theme'
import { Feather } from '@expo/vector-icons'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const onSignInPress = async () => {
    setError('')
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
        setError('Additional verification required.')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign in failed.')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#f6f7f9' }}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: 'absolute', top: 75, left: 20, zIndex: 1 }}>
          <Text style={{ color: '#000', fontSize: 18 }}>← Back</Text>
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
          <Text style={{ fontSize: 28, fontWeight: 'bold', fontFamily: Fonts.rounded, marginBottom: 24, color: '#222' }}>
            BelayBuddy
          </Text>
          {error ? (
            <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
          ) : null}
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
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
          <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            backgroundColor: '#f6f7f9',
            marginBottom: 24,
          }}>
            <TextInput
              value={password}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              style={{
                flex: 1,
                padding: 12,
                fontSize: 16,
                color: '#222',
                backgroundColor: 'transparent',
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 8 }}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onSignInPress}
            style={{
              width: '100%',
              backgroundColor: '#000',
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
          </TouchableOpacity>
          <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
            <Text style={{ color: '#888', marginBottom: 8 }}>Don't have an account?</Text>
            <Link href="/belay-sign-up">
              <Text style={{ color: '#000', fontWeight: 'bold' }}>Sign up</Text>
            </Link>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
