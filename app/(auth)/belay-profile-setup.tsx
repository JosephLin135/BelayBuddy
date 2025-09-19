import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import React from 'react'

export default function ProfileSetup() {
  const { user } = useUser()
  const router = useRouter()
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')

  const onSaveProfile = async () => {
    try {
      if (user) {
        await user.update({
          firstName,
          lastName,
        })
        router.replace('/') // Go to home or wherever you want
      } else {
        console.error('User is not defined.')
      }
    } catch (err) {
      console.error('Profile update error:', err)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        value={firstName}
        placeholder="First Name"
        onChangeText={setFirstName}
        style={{ /* ...styles... */ }}
      />
      <TextInput
        value={lastName}
        placeholder="Last Name"
        onChangeText={setLastName}
        style={{ /* ...styles... */ }}
      />
      <TouchableOpacity onPress={onSaveProfile} style={{ /* ...styles... */ }}>
        <Text>Save Profile</Text>
      </TouchableOpacity>
    </View>
  )
}