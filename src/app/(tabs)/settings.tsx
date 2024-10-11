import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { supabase } from '@/src/utils/supabase'
import { useRouter } from 'expo-router'

const profile = () => {

  const router = useRouter();

  const handleLogout = () => {
    supabase.auth.signOut().then(() => {
      router.replace("/login");
    });

  }
  return (
    <View>
      <Button mode='outlined' onPress={() => handleLogout()}>Logout</Button>
    </View>
  )
}

export default profile

const styles = StyleSheet.create({})


//about

//developers info


//terms and conditions


//help center


//contact us


//logout

//change theme

//visit our website

//privacy policy

//change password
