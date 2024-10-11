import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { fetchOneTransaction } from "@/src/utils/data";
import { DBTransactionTypes } from "@/src/utils/types";
import { ActivityIndicator, DataTable } from "react-native-paper";

const Transaction = () => {
  const { id } = useLocalSearchParams();

  const navigation = useNavigation();

  const [transaction, setTransaction] = useState<DBTransactionTypes>();
  const [loading, setLoading] = useState(false)

  useLayoutEffect(() => {
    async function getTransaction() {
      setLoading(true);
      const transaction = await fetchOneTransaction(id?.toLocaleString()!);
      if (transaction) {
        setTransaction(transaction[0]);
        setLoading(false);
      } else {
        setLoading(false);
        navigation.goBack();
        alert("Transaction not found");
      }
    }
    getTransaction();
  }, [id]);

  return (
    <View style={{justifyContent:'center', alignItems:'center', paddingHorizontal:10}}>
      {loading? (
       <ActivityIndicator animating size={30} style={{marginTop:70}} />
      ) : (
  
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>
            <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center'}}>

            Transaction details
            </Text>
            </DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>{transaction?.network === "bank_transfer" ? "Type" : "Network"}</DataTable.Cell>
          <DataTable.Cell>{transaction?.network}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>{transaction?.network === "bank_transfer" ? "Currency" : "Plan Siza"}</DataTable.Cell>
          <DataTable.Cell>{transaction?.plan_size}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Previous Balance</DataTable.Cell>
          <DataTable.Cell>{transaction?.previous_balance}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>New Balance</DataTable.Cell>
          <DataTable.Cell>{transaction?.new_balance}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Amount</DataTable.Cell>
          <DataTable.Cell>{transaction?.amount}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>{transaction?.network === "bank_transfer" ? "Refrence ID" : "Phone"}</DataTable.Cell>
          <DataTable.Cell>{transaction?.phone}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Transaction ID</DataTable.Cell>
          <DataTable.Cell>
            <Text style={{fontSize:14}}>

            {transaction?.transaction_id}
            </Text>
            </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Status</DataTable.Cell>
          <DataTable.Cell>{transaction?.status}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Data</DataTable.Cell>
          <DataTable.Cell>{transaction?.created_at && new Date(transaction?.created_at).toLocaleDateString()}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      )}
    </View>
  );
};

export default Transaction;

const styles = StyleSheet.create({});
