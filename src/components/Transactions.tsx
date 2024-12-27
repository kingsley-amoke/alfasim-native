import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import { DBTransactionTypes, transactionTypes } from "@/src/utils/types";
import { fetchTransactions } from "@/src/utils/data";
import { useTransactionStore, useUserStore } from "@/src/state/store";
import { Link } from "expo-router";
import { Colors } from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Transactions = ({ items }: { items: DBTransactionTypes[] }) => {
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([10, 20, 50]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Status</Text>
        </DataTable.Title>
        <DataTable.Title numeric>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            {items[0]?.purpose === "wallet" ? "Reference ID" : "Phone Number"}
          </Text>
        </DataTable.Title>
        <DataTable.Title numeric>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Amount</Text>
        </DataTable.Title>
      </DataTable.Header>

      {items.slice(from, to).map((item) => (
        <DataTable.Row
          key={item.id}
          style={{
            marginBottom: 10,
            borderBottomWidth: 1,
            elevation: 0.1,
            paddingVertical: 10,
          }}
        >
          <DataTable.Cell>
            <Link href={{ pathname: `transactions/${item.id}` }} asChild>
              {item.status == "successful" ? (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={30}
                  color={Colors.success}
                />
              ) : item.status == "failed" ? (
                <MaterialCommunityIcons
                  name="cancel"
                  size={30}
                  color={Colors.failed}
                />
              ) : (
                <MaterialCommunityIcons
                  name="information"
                  size={30}
                  color={Colors.pending}
                />
              )}
              {/* <Text style={{ textTransform: "capitalize", fontSize: 18 }}>
                {item.}
              </Text> */}
            </Link>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Link href={{ pathname: `transactions/${item.id}` }} asChild>
              <Text style={{ fontSize: 18 }}>{item.phone}</Text>
            </Link>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Link href={{ pathname: `transactions/${item.id}` }} asChild>
              <Text style={{ fontSize: 18 }}>{item.amount}</Text>
            </Link>
          </DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={"Rows per page"}
      />
    </DataTable>
  );
};

export default Transactions;

const styles = StyleSheet.create({});
