import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='login' options={{
          title: 'Alfasim Data',
          headerTitleAlign:'center'
        }}/>
        <Stack.Screen name='register' options={{
          title: 'Alfasim Data',
          headerTitleAlign:'center'
        }}/>
    </Stack>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})