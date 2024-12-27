import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs, useRouter } from "expo-router";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/src/utils/supabase";
import { Avatar } from "react-native-paper";
import images from "@/images";
import { Colors } from "@/src/constants/Colors";

const TabLayout = () => {
  const router = useRouter();

  const logout = () => {
    supabase.auth.signOut().then(() => {
      router.replace("/login");
    });
  };
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            padding: 15,
            marginBottom: 2,
            height: 70,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: "bold" },
          tabBarIconStyle: { color: Colors.primary },
          tabBarActiveTintColor: Colors.primary,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Alfasim Data",
            headerTitleAlign: "center",
            tabBarLabel: "Home",
            tabBarLabelStyle: { fontSize: 15, paddingBottom: 5 },
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={30} color={color} />
            ),

            headerRight: () => (
              <TouchableOpacity style={{ marginRight: 20 }}>
                <MaterialIcons
                  name="logout"
                  size={30}
                  color={Colors.light.error}
                  onPress={() => logout()}
                />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <Avatar.Image
                source={images.icon}
                size={44}
                style={{ paddingLeft: 2, marginLeft: 5 }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="transactions"
          options={{
            title: "Transactions",
            headerTitleAlign: "center",
            tabBarLabelStyle: { fontSize: 15, paddingBottom: 5 },
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="naira-sign" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            headerTitleAlign: "center",
            tabBarLabelStyle: { fontSize: 15, paddingBottom: 5 },
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person" size={30} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
