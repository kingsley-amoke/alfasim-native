import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useUserStore } from "@/src/state/store";
import { alertPropsTypes, planTypes } from "@/src/utils/types";
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
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;
  const { user } = useUserStore();

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

  const [network, setNetwork] = useState("------");
  const [currentPlan, setCurrentPlan] = useState("------");
  const [plan, setPlan] = useState([{ name: "", price: "" }]);
  const [IUCNumber, setIUCNumber] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  //networks

  const networks = [
    { id: 1, name: "DSTV" },
    { id: 2, name: "GoTV" },
    { id: 3, name: "StarTimes" },
  ];

  //DSTV plans

  const DSTVPlans = [
    { id: 1, name: "DSTV Great Wall Standalone", price: "1500" },
    { id: 2, name: "DSTV Padi", price: "3000" },
    { id: 3, name: "DSTV ExtraView Access", price: "4100" },
    { id: 4, name: "DSTV HDPVR Access Service", price: "4100" },
    { id: 5, name: "DSTV Yanga", price: "4300" },
    { id: 6, name: "DSTV Padi + ExtraView ", price: "5900" },
    { id: 7, name: "DSTV Yanga + ExtraView", price: "6900" },
    { id: 8, name: "DSTV Confam", price: "7500" },
    { id: 9, name: "Asian Bouqet", price: "8300" },
    { id: 10, name: "DSTV Asia", price: "8300" },
    { id: 11, name: "DSTV Confam + ExtraView", price: "9600" },
    { id: 12, name: "DSTV Compact", price: "12600" },
    { id: 13, name: "DSTV Compact Plus - ExtraView", price: "17150" },
    { id: 14, name: "DSTV Compact Plus", price: "19900" },
    { id: 15, name: "DSTV Compact + ExtraView", price: "20000" },
    { id: 16, name: "DSTV Premium Asia", price: "27500" },
    { id: 17, name: "DSTV Premium + ExtraView", price: "27900" },
    { id: 18, name: "DSTV Premium", price: "29600" },
    { id: 19, name: "DSTV Premium French", price: "36600" },
  ];

  //GOTV plan

  const GOTVPlans = [
    { id: 1, name: "GoTV Smallie", price: "300" },
    { id: 2, name: "GoTV Jinja", price: "700" },
    { id: 3, name: "GoTV Smallie Quarterly", price: "1000" },
    { id: 4, name: "GoTV Jollie", price: "3000" },
    { id: 5, name: "GoTV Max", price: "3000" },
    { id: 6, name: "GoTV Smallie Annually", price: "3000" },
  ];

  //Startimes plans

  const StartimesPlans = [
    { id: 1, name: "Nova", price: "1500" },
    { id: 2, name: "Basic", price: "2600" },
    { id: 3, name: "Smart", price: "3500" },
    { id: 4, name: "Classic", price: "3800" },
    { id: 5, name: "Super", price: "6500" },
  ];

  const handleProviderSelect = (value: string) => {
    switch (value) {
      case "dstv":
        setPlan(DSTVPlans);

        break;
      case "gotv":
        setPlan(GOTVPlans);
        break;
      case "startimes":
        setPlan(StartimesPlans);
        break;
      default:
        setPlan([{ name: "", price: "" }]);
    }
  };

  const handleSubmitForm = () => {
    const dataInfo = {
      provider: network,
      plan: plan,
      iucNumber: IUCNumber,
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
          items={networks}
          selectText={network}
          single
          uniqueKey="name"
          onSelectedItemsChange={(value) => {
            handleProviderSelect(value[0]);
            setNetwork(value[0]);
          }}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>Plan*</Text>
        <SectionedMultiSelect
          IconRenderer={MaterialIcons}
          items={plan}
          uniqueKey="name"
          selectText={currentPlan}
          single
          onSelectedItemsChange={(value) => {
            const price = plan.filter((item) => item.name === value[0])[0]
              .price;
            setCurrentPlan(value[0]);
            setPrice(price);
          }}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>IUC Number*</Text>
        <TextInput
          label="IUC Number"
          mode="outlined"
          onChangeText={(value) => setIUCNumber(value)}
        />

        <Divider bold horizontalInset style={{ marginBottom: 30 }} />

        <TextInput
          label="Amount To Pay"
          keyboardType="numeric"
          mode="outlined"
          disabled
          value={price}
        />
        <Button
          mode="contained"
          style={{ marginVertical: 20, paddingVertical: 10 }}
          onPress={showDialog}
          disabled={loading ? true : false}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>
            {loading ? "Submitting" : "Pay"}
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
