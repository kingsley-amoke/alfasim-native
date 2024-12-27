import { View } from "react-native";
import React, { useMemo } from "react";
import { supabase } from "@/src/utils/supabase";
import { fetchAllUsers } from "../utils/data";
import { useUsersStore } from "../state/store";
import { useRouter } from "expo-router";
import { UIActivityIndicator } from "react-native-indicators";
import { CustomToast } from "../utils/shared";
import { Colors } from "../constants/Colors";

const index = () => {
  const router = useRouter();
  const { storeUsers } = useUsersStore();

  fetchAllUsers().then((users) => storeUsers(users!));

  supabase.auth
    .getUser()
    .then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
      } else {
        router.replace("/home");
      }
    })
    .catch((error) => {
      CustomToast(
        "Please login to continue",
        Colors.light.error,
        Colors.light.onError
      );
      router.replace("/login");
    });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <UIActivityIndicator color={Colors.light.primary} />
    </View>
  );
};

export default index;
