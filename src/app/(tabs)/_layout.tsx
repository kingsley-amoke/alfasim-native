import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { supabase } from '@/src/utils/supabase'

const TabLayout = () => {

  const router = useRouter();

  const logout = () => {
    supabase.auth.signOut().then(() => {
      router.replace('login')
    });
    
  }
  return (
    <Tabs>
        <Tabs.Screen name='index' options={{
          title: 'Alfasim Data',
          headerTitleAlign:'center',
          headerRight : ({pressColor}) => <MaterialIcons name='logout' size={30} color={pressColor} onPress={logout}/>
        }}/>
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})