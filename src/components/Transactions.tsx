import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import { DBTransactionTypes, transactionTypes } from "@/src/utils/types";
import { fetchTransactions } from "@/src/utils/data";
import { useTransactionStore, useUserStore } from "@/src/state/store";
import { Link } from "expo-router";

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
        <DataTable.Title>Type</DataTable.Title>
        <DataTable.Title numeric>{items[0]?.purpose === 'wallet' ? 'Reference ID' : 'Phone Number'}</DataTable.Title>
        <DataTable.Title numeric>Amunt</DataTable.Title>
      </DataTable.Header>

      {items.slice(from, to).map((item) => (
        <DataTable.Row key={item.id}>
          <DataTable.Cell>
            <Link
              href={{ pathname: `transactions/${item.id}` }}
              asChild
            >
              <Text style={{ textTransform: "capitalize" }}>
                {item.purpose}
              </Text>
            </Link>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Link
              href={{ pathname: `transactions/${item.id}` }}
              asChild
            >
              <Text>

              {item.phone}
              </Text>
            </Link>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Link
              href={{ pathname: `transactions/${item.id}`}}
              asChild
            >
              <Text>

              {item.amount}
              </Text>
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
