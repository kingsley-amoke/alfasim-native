import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useUserStore } from "@/src/state/store";
import { alertPropsTypes } from "@/src/utils/types";
import {
  Button,
  Dialog,
  Divider,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "@/src/hooks/useTheme";
import { Colors } from "@/src/constants/Colors";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const index = () => {
  const { user } = useUserStore();
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

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

  const [provider, setProvider] = useState("------");
  const [meterType, setMeterType] = useState("------");
  const [meterNumber, setMeterNumber] = useState("");

  const [amount, setAmount] = useState<string>("");
  const [amountToPay, setAmountToPay] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const providers = [
    { id: 1, name: "IBEC" },
    { id: 2, name: "EEDC" },
  ];

  const meterTypes = [
    {
      id: 1,
      name: "PREPAID",
    },
    {
      id: 2,
      name: "POSTPAID",
    },
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
    const dataInfo = {
      disco_name: "disco",
      MeterType: meterType,
      meter_number: meterNumber,
      amount: amount,
    };

    console.log(dataInfo);
  };

  return (
    <SafeAreaView style={{ flex: 1, marginVertical: 10 }}>
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
        <Text>Provider*</Text>
        <SectionedMultiSelect
          IconRenderer={MaterialIcons}
          items={providers}
          uniqueKey="name"
          single
          selectText={provider}
          onSelectedItemsChange={(value) => setProvider(value[0])}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>Meter Typer*</Text>
        <SectionedMultiSelect
          IconRenderer={MaterialIcons}
          items={meterTypes}
          uniqueKey="name"
          selectText={meterType}
          single
          onSelectedItemsChange={(value) => setMeterType(value[0])}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>Meter Number*</Text>
        <TextInput
          label="Meter Number*"
          keyboardType="numeric"
          mode="outlined"
          onChangeText={(value) => setMeterNumber(value)}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>Amount (NGN)*</Text>
        <TextInput
          label="Amount (NGN)*"
          keyboardType="numeric"
          mode="outlined"
          onChangeText={(value) => {
            handleAmount(value);
          }}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />

        <TextInput
          label="Amount To Pay"
          keyboardType="numeric"
          mode="outlined"
          value={amountToPay.toString()}
          disabled
        />
        <Button
          mode="contained"
          style={{
            marginVertical: 20,
            paddingVertical: 10,
            // backgroundColor: Colors.primary,
          }}
          onPress={showDialog}
          disabled
          loading={loading}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>
            {/* {loading ? "Submitting" : "Pay"}
             */}
            Coming Soon...
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
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
