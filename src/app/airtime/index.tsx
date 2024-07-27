import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { alertPropsTypes, transactionTypes } from "@/src/utils/types";
import { useRouter } from "expo-router";
import { useUserStore } from "@/src/state/store";
import { CustomToast } from "@/src/utils/shared";
import useTheme from "@/src/hooks/useTheme";
import { Colors } from "@/src/constants/Colors";
import {
  buyAirtime,
  deductBalance,
  fetchUser,
  handleBuyAirtime,
  setTransaction,
} from "@/src/utils/data";
import { Button, Dialog, Divider, Portal, TextInput } from "react-native-paper";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { MaterialIcons } from "@expo/vector-icons";

const Airtime = () => {
  const router = useRouter();

  const { user, storeUser } = useUserStore();

  const { colorScheme } = useTheme();

  const bgColor =
    colorScheme === "dark" ? Colors.dark.inversePrimary : Colors.light.primary;
  const textColor =
    colorScheme == "dark" ? Colors.dark.onBackground : Colors.light.onPrimary;

  const errorToastBg =
    colorScheme === "dark" ? Colors.dark.error : Colors.light.error;
  const errorToastText =
    colorScheme === "dark" ? Colors.dark.onError : Colors.light.onError;

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [amountToPay, setAmountToPay] = useState("");
  const [currentNetwork, setCurrentNetwork] = useState("------");

  const networks = [
    { name: "MTN", id: 1 },
    { name: "Glo", id: 2 },
    { name: "9mobile", id: 3 },
    { name: "Airtel", id: 4 },
  ];

  //calculate discount

  const handleAmount = (value: string) => {
    if (value !== "") {
      const discount = (2 / 100) * parseInt(value);
      let pay = (parseInt(value) - discount).toString();
      setAmount(value);
      setAmountToPay(pay);
    }
  };

  const handleSubmitForm = async () => {
    if (!user || !phone || !amount || !network) return;

    if (parseInt(user?.balance) < parseInt(amountToPay) || !user.balance) {
      CustomToast("Insufficient Balance", errorToastBg, errorToastText);
      return;
    }

    setLoading(true);

    const airtimeInfo = {
      network: network,
      amount: amount,
      mobile_number: phone,
      Ported_number: true,
      airtime_type: "VTU",
    };

    const response = await buyAirtime(airtimeInfo);

    let networkName = "";

    switch (network) {
      case "1":
        networkName = "MTN";
        break;
      case "2":
        networkName = "Glo";
        break;
      case "3":
        networkName = "9mobile";
        break;
      case "4":
        networkName = "Airtel";
        break;
    }

    if (response.error) {
      CustomToast(
        "Network Error, Try again later",
        errorToastBg,
        errorToastText
      );
      setLoading(false);

      const data: transactionTypes = {
        email: user?.email,
        amount: amountToPay,
        purpose: "airtime",
        status: "failed",
        transactionId: "failed",
        phone: phone,
        network: networkName,
        planSize: amount,
        previousBalance: user.balance,
        newBalance: user.balance,
      };

      setTransaction(data);
      return;
    }

    if (response.Status === "successful") {
      CustomToast("Successfull", bgColor, textColor);

      setLoading(false);

      //create a transaction

      const data: transactionTypes = {
        email: user?.email,
        amount: amountToPay,
        purpose: "airtime",
        status: response.Status,
        transactionId: response.ident,
        phone: phone,
        network: networkName,
        planSize: amount,
        previousBalance: user.balance,
        newBalance: (parseInt(user.balance) - parseInt(amountToPay)).toString(),
      };

      handleBuyAirtime(data).then(async() => {
        const user = await fetchUser(data.email);
        storeUser(user![0]);
        router.push("/");
      });
    } else {
      if (response.Status !== "failed") {
        const data: transactionTypes = {
          email: user?.email,
          amount: amountToPay,
          purpose: "airtime",
          status: response.Status,
          transactionId: response.ident,
          phone: phone,
          network: networkName,
          planSize: amount,
          previousBalance: user.balance,
          newBalance: (
            parseInt(user.balance) - parseInt(amountToPay)
          ).toString(),
        };
        CustomToast(response.Status, errorToastBg, errorToastText);
        setLoading(false);

        deductBalance(data);
      }

      CustomToast(response.Status, errorToastBg, errorToastText);
      setLoading(false);

      const data: transactionTypes = {
        email: user?.email,
        amount: amountToPay,
        purpose: "airtime",
        status: response.Status,
        transactionId: response.ident,
        phone: phone,
        network: network,
        planSize: amount,
        previousBalance: user.balance,
        newBalance:
          response.results[0].Status === "failed"
            ? user.balance
            : (parseInt(user.balance) - parseInt(amountToPay)).toString(),
      };

      setTransaction(data);
    }
    setLoading(false);
  };

  return (
    <ScrollView>
      <View
        style={{
          borderRadius: 10,
          marginHorizontal: 10,
          marginVertical: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: bgColor,
        }}
      >
        <Text>Network*</Text>
        <SectionedMultiSelect
          IconRenderer={MaterialIcons}
          items={networks}
          uniqueKey="id"
          onSelectedItemsChange={(item) => {
            setNetwork(item[0]);
            const filteredNetwork = networks.filter(
              (network) => network.id === item[0]
            );
            setCurrentNetwork(filteredNetwork[0].name);
          }}
          selectText={currentNetwork}
          single
          displayKey="name"
        />

        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>Phone Number*</Text>
        <TextInput
          mode="outlined"
          label="Phone Number"
          placeholder="09030220200"
          onChangeText={(value) => setPhone(value)}
        />

        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>Amount (NGN)*</Text>
        <TextInput
          mode="outlined"
          label="Amount"
          
          onChangeText={(value) => handleAmount(value)}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>Amount To Pay</Text>
        <TextInput
          mode="outlined"
          label="Amount To Pay"
          value={amountToPay}
          disabled
          onChangeText={(value) => setAmountToPay(value)}
        />
        <Button
          mode="outlined"
          style={{ marginVertical: 20 }}
          onPress={showDialog}
          disabled={loading ? true : false}
        >
          <Text>{loading ? "Submitting" : "Buy Airtime"}</Text>
        </Button>
      </View>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Confirm</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to continue?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  handleSubmitForm();
                  hideDialog();
                }}
              >
                Continue
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </ScrollView>
  );
};

export default Airtime;

const styles = StyleSheet.create({});
