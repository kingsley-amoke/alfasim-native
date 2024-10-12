import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/src/constants/Colors";
import { Button, TextInput } from "react-native-paper";
import { useUserStore } from "@/src/state/store";
import { supabase } from "@/src/utils/supabase";
import { CustomToast } from "@/src/utils/shared";

const index = () => {
  const [newPassword, setNewPassword] = useState("");

  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    if (!newPassword) return;

    if (newPassword !== confirmNewPassword) {
      setError("Password does not match");
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      error && CustomToast(error?.message, "red", "white");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          borderWidth: 1,
          width: "80%",
          height: 400,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Change Password
        </Text>

        <TextInput
          label="New Password"
          style={{ width: 300 }}
          onChangeText={(text) => setNewPassword(text)}
        />
        {error && <Text style={{ color: "red", fontSize: 18 }}>{error}</Text>}
        <TextInput
          label="New Password"
          style={{ width: 300 }}
          onChangeText={(text) => setConfirmNewPassword(text)}
        />
        <Button
          style={{
            borderWidth: 1,
            borderColor: Colors.light.primary,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginTop: 10,
            alignItems: "center",
            gap: 10,
          }}
          icon="check-circle-outline"
          onPress={handleChangePassword}
        >
          <Text style={{ fontSize: 20 }}>Update</Text>
        </Button>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
