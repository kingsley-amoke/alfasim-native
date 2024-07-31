import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserStore } from "@/src/state/store";
import useTheme from "@/src/hooks/useTheme";
import { Colors } from "@/src/constants/Colors";
import ValidatedInput from "@/src/components/ValidatedInput";
import { useForm } from "react-hook-form";

const register = () => {
  const { colorScheme } = useTheme();

  const [loading, setLoading] = useState(false);

  const bgColor =
    colorScheme == " dark" ? Colors.dark.primary : Colors.light.primary;
  const textColor =
    colorScheme == "dark" ? Colors.dark.surface : Colors.light.surface;
  const errorColor =
    colorScheme == "dark" ? Colors.dark.error : Colors.light.error;

  const formSchema = z
    .object({
      firstName: z
        .string()
        .toLowerCase()
        .min(3, "FirstName must me more than 3 letters"),
      lastName: z
        .string()
        .toLowerCase()
        .min(3, "LastName must me more than 3 letters"),
      email: z.string().email("Please enter a valid email"),
      phone: z.string().min(11, "Please enter a valid phone number"),
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

  const handleRegister = async (data) => {
setLoading(true);
    console.log(data)
    setLoading(false);
  };
  return (
    <ScrollView style={{ flex: 1}}>
      <Text style={{ fontWeight: "bold", fontSize: 22, marginVertical: 20, textAlign:'center' }}>
        Register
      </Text>
      <View style={{ width: "100%", paddingHorizontal: 20, }}>
        <View style={{gap:20 }}>

        
        <ValidatedInput control={control} name={"firstname"} label="First Name"/>
        <ValidatedInput control={control} name={"lastname"} label="Last Name"/>
        <ValidatedInput control={control} name={"email"} label="Email"/>
        <ValidatedInput control={control} name={"phone"} keyboardType='numeric' label="Phone Number"/>
        <ValidatedInput control={control} name={"password"} label="Password"/>
        <ValidatedInput control={control} name={"passwordConfirm"} label='Confirm Password'/>
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
            backgroundColor: bgColor,
            paddingVertical: 5,
            paddingHorizontal: 30,
            borderRadius: 10,
          }}
          onPress={handleSubmit(handleRegister)}
        >
          <Text
            style={{ color: textColor, fontSize: 20, fontWeight: "condensed" }}
          >
            {loading ? "Please wait..." : "Register"}
          </Text>
        </Button>
        <Text style={{ marginVertical: 10 }}>
          Already a member?{" "}
          <Link href={"/login"} style={{ color: bgColor, marginLeft: 10 }}>
            Login
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
};
export default register;

const styles = StyleSheet.create({});
