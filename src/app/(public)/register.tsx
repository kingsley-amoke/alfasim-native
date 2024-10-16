import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserStore } from "@/src/state/store";
import useTheme from "@/src/hooks/useTheme";
import { Colors } from "@/src/constants/Colors";
import ValidatedInput from "@/src/components/ValidatedInput";
import { useForm } from "react-hook-form";
import { CustomToast } from "@/src/utils/shared";
import { supabase } from "@/src/utils/supabase";
import { createCustomer, handleReferral } from "@/src/utils/data";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const register = () => {
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const router = useRouter();

  const { colorScheme } = useTheme();
  const { storeUser } = useUserStore();

  const [loading, setLoading] = useState(false);

  const bgColor =
    colorScheme == " dark" ? Colors.dark.primary : Colors.light.primary;
  const textColor =
    colorScheme == "dark" ? Colors.dark.surface : Colors.light.surface;
  const errorColor =
    colorScheme == "dark" ? Colors.dark.error : Colors.light.error;

  const formSchema = z
    .object({
      firstname: z
        .string()
        .toLowerCase()
        .min(3, "FirstName must be more than 3 letters"),
      lastname: z
        .string()
        .toLowerCase()
        .min(3, "LastName must be more than 3 letters"),
      email: z.string().email("Please enter a valid email"),
      phone: z.string().min(11, "Please enter a valid phone number"),
      referee: z.string().optional(),
      password: z.string().min(6, "Password must be at least 6 characters"),
      passwordConfirm: z.string(),
    })
    .refine(
      (data) => {
        return data.password === data.passwordConfirm;
      },
      {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
      }
    );

  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    const credentials = {
      email: data.email,
      password: data.password,
    };

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp(credentials);

    if (error) {
      CustomToast(error.message, errorColor, textColor);
      setLoading(false);
      return;
    }

    const newUser = {
      uuid: user?.id,
      email: data.email,
      first_name: data.firstname,
      last_name: data.lastname,
      balance: 0,
      referrals: 0,
      referral_bonus: 0,
      username: data?.email?.slice(0, -10),
      referee: data.referee || null,
      is_admin: false,
    };

    supabase
      .from("users")
      .insert([newUser])
      .select()
      .then(() => {
        const localUser = {
          email: newUser.email,
          username: newUser.username,
          balance: "0",
          referrals: "0",
          referee: newUser.referee,
          referral_bonus: "0",
          is_admin: false,
        };
        if (data.referee) {
          CustomToast("Registration Successful", textColor, bgColor);
          storeUser(localUser);
          router.replace("/home");

          handleReferral(data.referee, data.email);
          setLoading(false);
        } else {
          CustomToast("Registration Successful", textColor, bgColor);
          storeUser(localUser);
          router.replace("/home");
          setLoading(false);
        }
      });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 22,
          marginVertical: 20,
          textAlign: "center",
        }}
      >
        Register
      </Text>
      <View style={{ width: "100%", paddingHorizontal: 20 }}>
        <View style={{ gap: 20 }}>
          <ValidatedInput
            control={control}
            name={"firstname"}
            label="First Name"
          />
          <ValidatedInput
            control={control}
            name={"lastname"}
            label="Last Name"
          />
          <ValidatedInput control={control} name={"email"} label="Email" />
          <ValidatedInput
            control={control}
            name={"phone"}
            keyboardType="numeric"
            label="Phone Number"
          />
          <ValidatedInput
            control={control}
            name={"referee"}
            label="Referee (Optional)"
          />
          <ValidatedInput
            control={control}
            name={"password"}
            label="Password"
          />
          <ValidatedInput
            control={control}
            name={"passwordConfirm"}
            label="Confirm Password"
          />
        </View>
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
          style={{
            width: "100%",
          }}
          labelStyle={{ fontSize: 20 }}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        >
          {loading ? "Please wait..." : "Register"}
        </Button>
        <Text style={{ marginVertical: 10 }}>
          Already a member?{" "}
          <Link href={"/login"} style={{ color: bgColor, marginLeft: 10 }}>
            Login
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
    </ScrollView>
  );
};
export default register;

const styles = StyleSheet.create({});
