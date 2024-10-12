import * as React from "react";
import { DataTable } from "react-native-paper";
import { useUsersStore, useUserStore } from "../state/store";
import { ScrollView } from "react-native";

const Referrals = () => {
  const { users } = useUsersStore();
  const { user } = useUserStore();

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 20, 50]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const referrals = users?.filter((item) => item?.referee == user?.email);

  const [items] = React.useState(referrals);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <ScrollView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Username</DataTable.Title>
          <DataTable.Title numeric>No of Referrals</DataTable.Title>
        </DataTable.Header>

        {items.slice(from, to).map((item) => (
          <DataTable.Row key={item.username}>
            <DataTable.Cell>{item.username}</DataTable.Cell>
            <DataTable.Cell numeric>{item.referrals}</DataTable.Cell>
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
    </ScrollView>
  );
};

export default Referrals;
