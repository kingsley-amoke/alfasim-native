import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { Redirect, Tabs, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/src/utils/supabase";

const TabLayout = () => {

  const router = useRouter();

  const logout = () => {
    supabase.auth.signOut().then(() => {
      router.replace("login");
    });
  };
  return (
    <Tabs screenOptions={{tabBarStyle: {padding:15, height:50}, tabBarLabelStyle: {fontSize:10, fontWeight:'bold'}}}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Alfasim Data",
          headerTitleAlign: "center",
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" size={20} color={color}/>
          ),
          
          headerRight: ({ pressColor }) => (
            <TouchableOpacity style={{ marginRight: 20 }}>
              <MaterialIcons
                name="logout"
                size={30}
                color={pressColor}
                onPress={logout}
              />
            </TouchableOpacity>
          ),
        }}
      />


      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerTitleAlign: "center",
          tabBarIcon: ({color}) => (
            <MaterialIcons name="currency-exchange" size={20} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitleAlign: "center",
          tabBarIcon: ({color}) => (
            <MaterialIcons name="settings" size={20} color={color}/>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
