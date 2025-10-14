import { useSignUp, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { StatusBar, Text, TextInput, TouchableOpacity, View,
    Keyboard, TouchableWithoutFeedback
} from 'react-native'
import React, { useRef, useState } from 'react'
import { Feather } from '@expo/vector-icons'

export default function Page() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const { user } = useUser()
  const router = useRouter()

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = useState(false)

  const lastNameRef = useRef<TextInput>(null)
  const phoneRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const onSignUpPress = async () => {
    if (!isLoaded) return
    try {
      const signUpAttempt = await signUp.create({
        emailAddress,
        password,
        phoneNumber, // only if required by Clerk dashboard
      })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/route-profile-setup') // Go to profile setup page
      } else {
        // handle verification if needed
      }
    } catch (err) {
      console.error('Sign up error:', err)
      if (
        err &&
        typeof err === 'object' && err !== null && 'errors' in err
      ) {
        // @ts-ignore
        console.error('Clerk errors:', err.errors)
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#f6f7f9' }}>
      <StatusBar barStyle="dark-content" />
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} 
        style={{ position: 'absolute', top: 75, left: 20, zIndex: 1 }}>
        <Text style={{ color: '#27526A', fontSize: 18 }}>← Back</Text>
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
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#27526A' }}>RouteVision</Text>
        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 16 }}>
        <TextInput
          value={firstName}
          placeholder="First Name"
          placeholderTextColor="#888"
          onChangeText = {text => setFirstName(text.charAt(0).toUpperCase() + text.slice(1))}
          returnKeyType="next"
          onSubmitEditing={() => lastNameRef.current?.focus()}
          style={{
              flex: 1,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              backgroundColor: '#f6f7f9',
              padding: 12,
              fontSize: 16,
              color: '#222',
              marginRight: 8,
              minWidth: 0
          }}
        />
        <TextInput
          ref={lastNameRef}
          value={lastName}
          placeholder="Last Name"
          placeholderTextColor="#888"
          onChangeText = {text => setLastName(text.charAt(0).toUpperCase() + text.slice(1))}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
          style={{
            flex: 1,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              backgroundColor: '#f6f7f9',
              padding: 12,
              fontSize: 16,
              color: '#222',
              minWidth: 0
          }}
        />
        </View>
        <TextInput
          ref={phoneRef}
          value={phoneNumber}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          onChangeText={setPhoneNumber}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
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
          ref={emailRef}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email"
          placeholderTextColor="#888"
          onChangeText={setEmailAddress}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
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
            ref={passwordRef}
            value={password}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={onSignUpPress}
            style={{
              flex: 1,
              padding: 12,
              fontSize: 16,
              color: '#222',
              backgroundColor: 'transparent',
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 12 }}>
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={onSignUpPress}
          style={{
            width: '100%',
            backgroundColor: '#e1dbcb',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 16
          }}>
          <Text style={{ color: '#27526A', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#888', marginBottom: 8 }}>Have an account?</Text>
          <Link href="/route-sign-in">
            <Text style={{ color: '#27526A', fontWeight: 'bold' }}>Sign In</Text>
          </Link>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

export function RouteProfileSetup() {
  const { user } = useUser()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const onSaveProfile = async () => {
    if (user) {
      await user.update({
        firstName,
        lastName,
      })
    }
  }

  return (
    <View>
      <TextInput value={firstName} onChangeText={setFirstName} placeholder="First Name" />
      <TextInput value={lastName} onChangeText={setLastName} placeholder="Last Name" />
      <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" />
      <TouchableOpacity onPress={onSaveProfile}>
        <Text>Save Profile</Text>
      </TouchableOpacity>
    </View>
  )
}
