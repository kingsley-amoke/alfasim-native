import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { supabase } from "@/src/utils/supabase";

import { Link, useRouter } from "expo-router";

import { Colors } from "@/src/constants/Colors";
import { CustomToast } from "@/src/utils/shared";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const login = () => {
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [show, setShow] = useState(true);

  const handleLogin = async () => {
    setLoading(true);
    const credentials = {
      email: email,
      password: password,
    };

    supabase.auth
      .signInWithPassword(credentials)
      .then(({ data, error }) => {
        if (error) {
          CustomToast(error.message, Colors.light.error, Colors.light.onError);
        } else {
          CustomToast(
            "Login successful",
            Colors.light.primary,
            Colors.light.onPrimary
          );
          router.replace("/home");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        return;
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 22,
          marginVertical: 20,
          marginLeft: 20,
          textAlign: "left",
        }}
      >
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
        <Text style={{ color: Colors.light.error }}>{error}</Text>
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
          style={{
            width: "100%",
            paddingVertical: 10,
            backgroundColor: loading ? "white" : Colors.primary,
          }}
          labelStyle={{ fontSize: 20 }}
          onPress={handleLogin}
          disabled={loading}
          loading={loading}
        >
          {loading ? "Please wait..." : "Sign In"}
        </Button>
        <Text style={{ marginVertical: 16 }}>
          Dont't have an account?{" "}
          <Link
            href={"/register"}
            style={{ color: Colors.light.primary, marginLeft: 16 }}
          >
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
