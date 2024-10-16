import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/src/constants/Colors";
import { Button, TextInput } from "react-native-paper";
import { useUserStore } from "@/src/state/store";
import { supabase } from "@/src/utils/supabase";
import { CustomToast } from "@/src/utils/shared";
import { changePassword } from "@/src/utils/data";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");

  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setLoading(true);
    if (!newPassword) {
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Password does not match");
      return;
    }

    const res = await changePassword(newPassword);
    if (res) {
      CustomToast(res?.message, "red", "white");
      setLoading(false);
    } else {
      CustomToast("Successful", Colors.light.primary, "white");
      setLoading(false);
      router.replace("/home");
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
          style={{ width: "90%" }}
          onChangeText={(text) => setNewPassword(text)}
        />
        {error && <Text style={{ color: "red", fontSize: 18 }}>{error}</Text>}
        <TextInput
          label="New Password"
          style={{ width: "90%" }}
          onChangeText={(text) => setConfirmNewPassword(text)}
        />
        <Button
          style={{
            borderWidth: 1,
            borderColor: Colors.light.primary,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 10,
            alignItems: "center",
            gap: 10,
          }}
          labelStyle={{ fontSize: 22 }}
          icon={loading ? "loading" : "check-circle-outline"}
          onPress={handleChangePassword}
        >
          <Text>{loading ? "Please wait" : "Update"}</Text>
        </Button>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
