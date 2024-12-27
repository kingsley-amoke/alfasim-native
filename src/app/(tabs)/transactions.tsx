import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import Transactions from "@/src/components/Transactions";
import { UIActivityIndicator } from "react-native-indicators";
import { Colors } from "@/src/constants/Colors";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { supabase } from "@/src/utils/supabase";
import { useRouter } from "expo-router";
import { CustomToast } from "@/src/utils/shared";
import { fetchTransactions } from "@/src/utils/data";
import { useTransactionStore } from "@/src/state/store";

const transactions = () => {
  const router = useRouter();
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const { transactions, storeTransactions } = useTransactionStore();

  const [value, setValue] = useState("all");
  const [loggedUser, setLoggedUser] = useState("");

  supabase.auth
    .getUser()
    .then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoggedUser(user.email!);
        fetchTransactions(loggedUser)
          .then((data) => storeTransactions(data!))
          .catch((error) => console.log(error));
      }
    })
    .catch((error) => {
      CustomToast(
        "Please login to continue...",
        Colors.light.error,
        Colors.light.onError
      );
      router.replace("/login");
    });

  const data = useMemo(
    () => transactions.filter((item) => item.purpose === "data"),
    [transactions.length]
  );
  const airtime = useMemo(
    () => transactions.filter((item) => item.purpose === "airtime"),
    [transactions.length]
  );
  const recharge = useMemo(
    () => transactions.filter((item) => item.purpose === "wallet"),
    [transactions.length]
  );

  return (
    <View style={{ flex: 1 }}>
      <SegmentedButtons
        value={value}
        theme={{
          colors: {
            secondaryContainer: Colors.light.primary,
            onSecondaryContainer: "white",
          },
        }}
        onValueChange={setValue}
        density="regular"
        style={{ height: 50, marginTop: 10 }}
        buttons={[
          {
            value: "all",
            label: "All",
            labelStyle: { fontSize: 20, marginTop: 8 },
          },
          {
            value: "data",
            label: "Data",
            labelStyle: { fontSize: 20, marginTop: 8 },
          },
          {
            value: "airtime",
            label: "Airtime",
            labelStyle: { fontSize: 20, marginTop: 8 },
          },
        ]}
      />
      {transactions.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {value === "all" ? (
            <View style={{ paddingHorizontal: 10 }}>
              <Transactions items={transactions} />
            </View>
          ) : value === "data" ? (
            <View>
              <Transactions items={data} />
            </View>
          ) : value === "airtime" ? (
            <View>
              <Transactions items={airtime} />
            </View>
          ) : (
            <View>
              <Transactions items={recharge} />
            </View>
          )}
        </ScrollView>
      ) : (
        <UIActivityIndicator color={Colors.light.primary} />
      )}
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

export default transactions;
