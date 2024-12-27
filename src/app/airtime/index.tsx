import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { alertPropsTypes, transactionTypes } from "@/src/utils/types";
import { useRouter } from "expo-router";
import { useUsersStore, useUserStore } from "@/src/state/store";
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
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { supabase } from "@/src/utils/supabase";

const Airtime = () => {
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const router = useRouter();
  const { users } = useUsersStore();

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [amountToPay, setAmountToPay] = useState(0);
  const [currentNetwork, setCurrentNetwork] = useState("------");

  const [loggedUser, setLoggedUser] = useState("");

  supabase.auth
    .getUser()
    .then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoggedUser(user.email!);
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

  const user = useMemo(
    () => users.find((usr) => usr.email == loggedUser)!,
    [loggedUser]
  );

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
      let pay = parseInt(value) - discount;
      setAmount(value);
      setAmountToPay(pay);
    }
  };

  const handleSubmitForm = async () => {
    if (!user || !phone || !amount || !network) return;

    if (parseInt(user?.balance) < amountToPay || !user.balance) {
      CustomToast(
        "Insufficient Balance",
        Colors.light.error,
        Colors.light.onError
      );
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
        Colors.light.error,
        Colors.light.onError
      );
      setLoading(false);

      const data: transactionTypes = {
        email: user?.email,
        amount: amountToPay.toString(),
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
      CustomToast("Successfull", Colors.light.primary, Colors.light.onPrimary);

      setLoading(false);

      //create a transaction

      const data: transactionTypes = {
        email: user?.email,
        amount: amountToPay.toString(),
        purpose: "airtime",
        status: response.Status,
        transactionId: response.ident,
        phone: phone,
        network: networkName,
        planSize: amount,
        previousBalance: user.balance,
        newBalance: (parseInt(user.balance) - amountToPay).toString(),
      };

      handleBuyAirtime(data).then(() => {
        router.push("/");
      });
    } else {
      if (response.Status !== "failed") {
        const data: transactionTypes = {
          email: user?.email,
          amount: amountToPay.toString(),
          purpose: "airtime",
          status: response.Status,
          transactionId: response.ident,
          phone: phone,
          network: networkName,
          planSize: amount,
          previousBalance: user.balance,
          newBalance: (parseInt(user.balance) - amountToPay).toString(),
        };
        CustomToast(response.Status, Colors.light.error, Colors.light.onError);
        setLoading(false);

        deductBalance(data);
      }

      CustomToast(response.Status, Colors.light.error, Colors.light.onError);
      setLoading(false);

      const data: transactionTypes = {
        email: user?.email,
        amount: amountToPay.toString(),
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
            : (parseInt(user.balance) - amountToPay).toString(),
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
          borderColor: Colors.primary,
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

        <TextInput
          mode="outlined"
          keyboardType="numeric"
          label="Amount To Pay"
          value={amountToPay.toString()}
          disabled
        />
        <Button
          mode={loading ? "outlined" : "contained"}
          style={{
            marginVertical: 20,
            paddingVertical: 10,
            backgroundColor: loading ? "white" : Colors.primary,
          }}
          onPress={showDialog}
          disabled={loading}
          loading={loading}
        >
          <Text
            style={{
              fontSize: 20,
              color: loading ? Colors.primary : Colors.light.onPrimary,
            }}
          >
            {loading ? "Submitting" : "Buy Airtime"}
          </Text>
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
                labelStyle={{ fontSize: 20 }}
              >
                Continue
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
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
    </ScrollView>
  );
};

export default Airtime;

const styles = StyleSheet.create({});
