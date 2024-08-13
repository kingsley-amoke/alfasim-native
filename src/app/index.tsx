import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { supabase } from "@/src/utils/supabase";
import { fetchTransactions, fetchUser } from "../utils/data";
import { useTransactionStore, useUserStore } from "../state/store";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native-paper";

const index = () => {
  const router = useRouter();
  const { storeTransactions } = useTransactionStore();
  const { storeUser } = useUserStore();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
    } else {
      fetchUser(user?.email).then(async (user) => {
        storeUser(user![0]);
        const transactions = await fetchTransactions(user![0].email);
        storeTransactions(transactions!);
        router.replace("/home");
      });
    }
  };
  useEffect(() => {
    getUser();
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color="teal" size="small" animating />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
