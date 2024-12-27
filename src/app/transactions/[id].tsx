import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { DataTable } from "react-native-paper";
import { useTransactionStore } from "@/src/state/store";
import { UIActivityIndicator } from "react-native-indicators";
import { Colors } from "@/src/constants/Colors";

const Transaction = () => {
  const { id } = useLocalSearchParams();

  const { transactions } = useTransactionStore();

  const transaction = useMemo(
    () =>
      transactions.find((trans) => {
        console.log(trans);
        return trans.id == id;
      }),
    [id, transactions.length]
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex:start",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      {!transaction ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <UIActivityIndicator color={Colors.light.primary} />
        </View>
      ) : (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "black",
                }}
              >
                Transaction details
              </Text>
            </DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>
                {transaction?.network === "bank_transfer" ? "Type" : "Network"}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>{transaction?.network}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>
                {transaction?.network === "bank_transfer"
                  ? "Currency"
                  : "Plan Size"}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>{transaction?.plan_size}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>Previous Balance</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>
                {transaction?.previous_balance}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>New Balance</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>{transaction?.new_balance}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>Amount</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>{transaction?.amount}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>
                {transaction?.network === "bank_transfer"
                  ? "Refrence ID"
                  : "Phone"}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>{transaction?.phone}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>Transaction ID</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>
                {transaction?.transaction_id}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>Status</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text
                style={{
                  fontSize: 18,
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                {transaction?.status}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>Date</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ fontSize: 18 }}>
                {transaction?.created_at &&
                  new Date(transaction?.created_at).toLocaleDateString()}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      )}
    </View>
  );
};

export default Transaction;

const styles = StyleSheet.create({});
