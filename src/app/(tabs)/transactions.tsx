import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import Transactions from "@/src/components/Transactions";

import { useTransactionStore } from "@/src/state/store";
import { Colors } from "@/src/constants/Colors";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const transactions = () => {
  const [value, setValue] = useState("all");

  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const { transactions } = useTransactionStore();

  const data = transactions.filter((item) => item.purpose === "data");
  const airtime = transactions.filter((item) => item.purpose === "airtime");
  const recharge = transactions.filter((item) => item.purpose === "wallet");

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
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
        style={{ height: 50 }}
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
    </SafeAreaView>
  );
};

export default transactions;

const styles = StyleSheet.create({});
