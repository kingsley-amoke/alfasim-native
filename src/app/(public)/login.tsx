import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { supabase } from "@/src/utils/supabase";
import { fetchUser } from "@/src/utils/data";
import { useUserStore } from "@/src/state/store";
import { Link, useRouter } from "expo-router";
import useTheme from "@/src/hooks/useTheme";
import { Colors } from "@/src/constants/Colors";
import { CustomToast } from "@/src/utils/shared";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const login = () => {
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const router = useRouter();

  const colorScheme = useColorScheme();
  const { storeUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [show, setShow] = useState(true);

  const bgColor =
    colorScheme == "dark" ? Colors.dark.primary : Colors.light.primary;
  const textColor =
    colorScheme == "dark" ? Colors.dark.surface : Colors.light.surface;
  const errorColor =
    colorScheme == "dark" ? Colors.dark.error : Colors.light.error;

  const handleLogin = async () => {
    setLoading(true);
    const credentials = {
      email: email,
      password: password,
    };

    supabase.auth.signInWithPassword(credentials).then(({ data: { user } }) => {
      fetchUser(user?.email)
        .then((user) => {
          storeUser(user![0]);
          CustomToast("Login successful", bgColor, textColor);
          router.replace("/home");
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
          return;
        });
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontWeight: "bold", fontSize: 22, marginVertical: 20 }}>
        Welcome Back
      </Text>
      <View style={{ width: "100%", paddingHorizontal: 20, gap: 10 }}>
        <TextInput
          mode="outlined"
          label="Email"
          onChangeText={(value) => setEmail(value)}
        />
        <TextInput
          mode="outlined"
          secureTextEntry={show}
          style={{ position: "relative" }}
          label="Password"
          onChangeText={(value) => setPassword(value)}
        />
        <MaterialCommunityIcons
          name={!show ? "eye" : "eye-off"}
          size={20}
          style={{ position: "absolute", right: 30, bottom: 60 }}
          onPress={() => setShow(!show)}
        />

        <Text style={{ textAlign: "right", marginVertical: 10 }}>
          Forgot your password?{" "}
        </Text>
      </View>
      <View>
        <Text style={{ color: errorColor }}>{error}</Text>
      </View>

      <View
        style={{
          width: "100%",
          marginVertical: 20,
          paddingHorizontal: 20,
          paddingVertical: 20,
          alignItems: "center",
        }}
      >
        <Button
          mode="contained"
          style={{ width: "100%" }}
          onPress={handleLogin}
        >
          {loading ? "Please wait..." : "Sign In"}
        </Button>
        <Text style={{ marginVertical: 10 }}>
          Dont't have an account?{" "}
          <Link href={"/register"} style={{ color: bgColor, marginLeft: 10 }}>
            Sign up
          </Link>
        </Text>
      </View>
      <BannerAd
        unitId={liveBanner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          networkExtras: {
            collapsible: "bottom",
          },
        }}
      />
    </View>
  );
};

export default login;

const styles = StyleSheet.create({});
