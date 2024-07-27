import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { supabase } from "@/src/utils/supabase";
import { fetchUser } from "@/src/utils/data";
import { useUserStore } from "@/src/state/store";
import { useRouter } from "expo-router";

const login = () => {
  const router = useRouter();

  const { storeUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const credentials = {
      email: email,
      password: password,
    };

    const {
      data: { user }, error
    } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      console.log(error);
      return;
    }

    fetchUser(user?.email).then((user) => {
        storeUser(user![0]);
      router.replace("/");
    });
  };

  return (
    <View>
      <Text>login</Text>
      <View>
        <TextInput
          mode="outlined"
          label="Email"
          onChangeText={(value) => setEmail(value)}
        />
        <TextInput
          mode="outlined"
          label="Password"
          onChangeText={(value) => setPassword(value)}
        />
      </View>
      <Button onPress={handleLogin}>Login</Button>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({});
