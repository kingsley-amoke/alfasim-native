import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import Transactions from "@/src/components/Transactions";

import { useTransactionStore } from "@/src/state/store";

const transactions = () => {
  const [value, setValue] = useState("all");
  
  const {transactions} = useTransactionStore();

  const data = transactions.filter((item) => item.purpose === 'data');
  const airtime = transactions.filter((item) => item.purpose === 'airtime');
  const recharge = transactions.filter((item) => item.purpose === 'wallet');

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: "all",
            label: "All",
          },
          {
            value: "data",
            label: "Data",
          },
          { value: "airtime", label: "Airtime" },
          {
            value: "recharge",
            label: "Recharge",
          },
        ]}
      />
      <ScrollView>
        {value === "all" ? (
          <View style={{paddingHorizontal:10}}>
            <Transactions items={transactions}/>
          </View>
        ) : value === "data" ? (
          <View>
            <Transactions items={data}/>
          </View>
        ) : value === "airtime" ? (
          <View>
            <Transactions items={airtime}/>
          </View>
        ) : (
          <View>
            <Transactions items={recharge}/>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default transactions;

const styles = StyleSheet.create({});
