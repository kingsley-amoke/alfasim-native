import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Plan, transactionTypes } from "@/src/utils/types";
import {
  buyData,
  deductBalance,
  fetchUser,
  handleBuyData,
  setTransaction,
} from "@/src/utils/data";
import { useRouter } from "expo-router";
import { useDataPlanStore, useUserStore } from "@/src/state/store";
import { Colors } from "@/src/constants/Colors";
import useTheme from "@/src/hooks/useTheme";
import { Button, Dialog, Divider, Portal, TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { CustomToast } from "@/src/utils/shared";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const index = () => {
  interface DataType {
    id: number;
    type: string;
  }

  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const router = useRouter();

  const { plans } = useDataPlanStore();
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

  if (!plans) return;

  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan>();

  const [currentNetwork, setCurrentNetwork] = useState("Select Network");
  const [currentType, setCurrentType] = useState("Select Type");
  const [currentPlan, setCurrentPlan] = useState("Select Plan");
  const [dataType, setDataType] = useState<DataType[]>();
  const [dataPlan, setDataPlan] = useState<Plan[]>([]);

  const filterSelectedPlan = (id: string) => {
    const selectedPlan: Plan[] = dataPlan.filter(
      (plan) => plan.dataplan_id === id
    );

    const displayPlan =
      selectedPlan[0].plan +
      " " +
      selectedPlan[0].month_validate +
      " " +
      selectedPlan[0].plan_amount;

    setSelectedPlan(selectedPlan[0]);
    setCurrentPlan(displayPlan);
  };

  //all networks

  const networks = [
    { name: "MTN", id: 1 },
    { name: "Glo", id: 2 },
    { name: "9mobile", id: 3 },
    { name: "Airtel", id: 4 },
  ];

  //Data types

  const mtnDataTypes = [
    {
      id: 1,
      type: "SME",
    },
    {
      id: 2,
      type: "SME2",
    },
    {
      id: 3,
      type: "GIFTING",
    },
    {
      id: 4,
      type: "CORPORATE GIFTING",
    },
  ];
  const gloDataTypes = [
    {
      id: 1,
      type: "GIFTING",
    },
    {
      id: 2,
      type: "CORPORATE GIFTING",
    },
  ];
  const etisalatDataTypes = [
    {
      id: 1,
      type: "GIFTING",
    },
    {
      id: 2,
      type: "CORPORATE GIFTING",
    },
  ];
  const airtelDataTypes = [
    {
      id: 1,
      type: "GIFTING",
    },
    {
      id: 2,
      type: "CORPORATE GIFTING",
    },
  ];

  //all data plans
  const mtnPlans = plans.MTN_PLAN;
  const gloPlans = plans.GLO_PLAN;
  const etisalatPlans = plans["9MOBILE_PLAN"];
  const airtelPlans = plans.AIRTEL_PLAN;

  //mtn plans by type

  const mtnSME = mtnPlans.filter((plan) => plan.plan_type === "SME");
  const alfasimMtnSME: Plan[] = [];

  const unitGBSME = 270;

  mtnSME.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    alfasimMtnSME.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount:
        plan.plan.slice(-2) === "MB"
          ? (parseInt(plan.plan_amount) + 5).toString()
          : (integer * unitGBSME).toString(),
    });
  });
  const mtnSME2 = mtnPlans.filter((plan) => plan.plan_type === "SME2");
  const alfasimMtnSME2: Plan[] = [];

  const unitGBSME2 = 265;

  mtnSME2.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    alfasimMtnSME2.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount:
        plan.plan.slice(-2) === "MB"
          ? (parseInt(plan.plan_amount) + 5).toString()
          : (integer * unitGBSME2).toString(),
    });
  });

  const mtnGifting = mtnPlans.filter((plan) => plan.plan_type === "GIFTING");

  const alfasimMtnGifting: Plan[] = [];

  const unitGBGifting = 260;

  mtnGifting.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    const decimalPart = plan.plan.split(".")[1][0];

    const amount =
      plan.plan.slice(-2) === "MB"
        ? (parseInt(plan.plan_amount) + 5).toString()
        : decimalPart === "5"
        ? (integer * unitGBGifting + unitGBGifting / 2).toString()
        : (integer * unitGBGifting).toString();

    alfasimMtnGifting.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount: amount,
    });
  });

  const mtnCorporateGifting = mtnPlans.filter(
    (plan) => plan.plan_type === "CORPORATE GIFTING"
  );

  const alfasimMtnCorporateGifting: Plan[] = [];

  const unitGBCorporateGifting = 270;

  mtnCorporateGifting.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    alfasimMtnCorporateGifting.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount:
        plan.plan.slice(-2) === "MB"
          ? (parseInt(plan.plan_amount) + 5).toString()
          : (integer * unitGBCorporateGifting).toString(),
    });
  });

  const mtnCorporateGifting2 = mtnPlans.filter(
    (plan) => plan.plan_type === "CORPORATE GIFTING2"
  );

  const alfasimMtnCorporateGifting2: Plan[] = [];

  const unitGBCorporateGifting2 = 265 + 5;

  mtnCorporateGifting2.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    alfasimMtnCorporateGifting2.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount:
        plan.plan.slice(-2) === "MB"
          ? (parseInt(plan.plan_amount) + 5).toString()
          : (integer * unitGBCorporateGifting2).toString(),
    });
  });

  const mtnDataCoupons = mtnPlans.filter(
    (plan) => plan.plan_type === "DATA COUPONS"
  );

  const alfasimMtnDataCoupons: Plan[] = [];

  const unitGBDataCoupons = 245 + 5;

  mtnDataCoupons.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    alfasimMtnDataCoupons.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount:
        plan.plan.slice(-2) === "MB"
          ? (parseInt(plan.plan_amount) + 5).toString()
          : (integer * unitGBDataCoupons).toString(),
    });
  });

  //glo plans by type

  const gloGifting = gloPlans.filter((plan) => plan.plan_type === "GIFTING");

  const alfasimGloGifting: Plan[] = [];

  const unitGBGloGifting = 180 + 10;

  gloGifting.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    alfasimGloGifting.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount:
        plan.plan.slice(-2) === "MB"
          ? (parseInt(plan.plan_amount) + 5).toString()
          : (integer * unitGBGloGifting).toString(),
    });
  });

  const gloCorporateGifting = gloPlans.filter(
    (plan) => plan.plan_type === "CORPORATE GIFTING"
  );

  const alfasimGloCorporateGifting: Plan[] = [];

  const unitGBGloCorporateGifting = 230 + 10;

  gloCorporateGifting.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    alfasimGloCorporateGifting.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount:
        plan.plan.slice(-2) === "MB"
          ? (parseInt(plan.plan_amount) + 5).toString()
          : (integer * unitGBGloCorporateGifting).toString(),
    });
  });

  //etisalat plans by type

  const etisalatGifting = etisalatPlans.filter(
    (plan) => plan.plan_type === "GIFTING"
  );

  const alfasimEtisalatGifting: Plan[] = [];

  const unitGBEtisalatGifting = 225 + 10;

  etisalatGifting.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    alfasimEtisalatGifting.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount:
        plan.plan.slice(-2) === "MB"
          ? (parseInt(plan.plan_amount) + 5).toString()
          : (integer * unitGBEtisalatGifting).toString(),
    });
  });

  const etisalatCorporateGifting = etisalatPlans.filter(
    (plan) => plan.plan_type === "CORPORATE GIFTING"
  );

  const alfasimEtisalatCorporateGifting: Plan[] = [];

  const unitGBEtisalatCorporateGifting = 145 + 10;

  etisalatCorporateGifting.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    const decimalPart = plan.plan.split(".")[1][0];

    const amount =
      plan.plan.slice(-2) === "MB"
        ? (parseInt(plan.plan_amount) + 5).toString()
        : decimalPart === "5"
        ? (
            integer * unitGBEtisalatCorporateGifting +
            unitGBEtisalatCorporateGifting / 2
          ).toString()
        : (integer * unitGBEtisalatCorporateGifting).toString();

    alfasimEtisalatCorporateGifting.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount: amount,
    });
  });

  //airtel plans by type

  const airtelGifting = airtelPlans.filter(
    (plan) => plan.plan_type === "GIFTING"
  );

  const alfasimAirtelGifting: Plan[] = [];

  const unitGBAirtelGifting = 485 + 10;

  airtelGifting.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    const decimalPart = plan.plan.split(".")[1][0];

    const amount =
      plan.plan.slice(-2) === "MB"
        ? (parseInt(plan.plan_amount) + 5).toString()
        : decimalPart === "5"
        ? (integer * unitGBAirtelGifting + unitGBAirtelGifting / 2).toString()
        : (integer * unitGBAirtelGifting).toString();

    alfasimAirtelGifting.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount: amount,
    });
  });

  const airtelCorporateGifting = airtelPlans.filter(
    (plan) => plan.plan_type === "CORPORATE GIFTING"
  );

  const alfasimAirtelCorporateGifting: Plan[] = [];

  const unitGBAirtelCoporateGifting = 275 + 10;

  airtelCorporateGifting.forEach((plan) => {
    const integer = Math.trunc(parseInt(plan.plan.slice(0, -2)));

    const amount =
      plan.plan.slice(-2) === "MB"
        ? (parseInt(plan.plan_amount) + 5).toString()
        : (integer * unitGBAirtelCoporateGifting).toString();

    alfasimAirtelCorporateGifting.push({
      id: plan.id,
      dataplan_id: plan.dataplan_id,
      network: plan.network,
      plan_type: plan.plan_type,
      plan_network: plan.plan_network,
      month_validate: plan.month_validate,
      plan: plan.plan,
      plan_amount: amount,
    });
  });

  const handleNetworkSelect = (value: number) => {
    switch (value) {
      case 1:
        setCurrentNetwork("MTN");
        setDataType(mtnDataTypes);

        break;
      case 2:
        setCurrentNetwork("Glo");
        setDataType(gloDataTypes);
        break;
      case 3:
        setCurrentNetwork("etisalat");
        setDataType(etisalatDataTypes);
        break;
      case 4:
        setCurrentNetwork("Airtel");
        setDataType(airtelDataTypes);
        break;
    }
  };
  const handleDataTypeSelect = (value: string) => {
    switch (value) {
      case "SME":
        setDataPlan(alfasimMtnSME);
        break;
      case "SME2":
        setDataPlan(alfasimMtnSME2);
        break;
      case "GIFTING":
        switch (currentNetwork) {
          case "MTN":
            setDataPlan(alfasimMtnGifting);
            break;
          case "Glo":
            setDataPlan(alfasimGloGifting);
            break;
          case "etisalat":
            setDataPlan(alfasimEtisalatGifting);
            break;
          case "Airtel":
            setDataPlan(alfasimAirtelGifting);
            break;
        }
        break;
      case "CORPORATE GIFTING":
        switch (currentNetwork) {
          case "MTN":
            setDataPlan(alfasimMtnCorporateGifting);
            break;
          case "Glo":
            setDataPlan(alfasimGloCorporateGifting);
            break;
          case "etisalat":
            setDataPlan(alfasimEtisalatCorporateGifting);
            break;
          case "Airtel":
            setDataPlan(alfasimAirtelCorporateGifting);
            break;
        }
        break;
      case "CORPORATE GIFTING2":
        switch (currentNetwork) {
          case "MTN":
            setDataPlan(alfasimMtnCorporateGifting2);
            break;
        }
        break;
      case "DATA COUPONS":
        setDataPlan(alfasimMtnDataCoupons);
        break;
    }
  };

  const handleSubmitForm = async () => {
    if (!selectedPlan || !user) return;

    if (
      parseInt(user?.balance) < parseInt(selectedPlan?.plan_amount) ||
      !user.balance
    ) {
      CustomToast("Insufficient Balance", errorToastBg, errorToastText);
      return;
    }

    const integer = Math.trunc(parseInt(selectedPlan?.plan.slice(0, -2)));

    const commission = selectedPlan?.plan.slice(-2) === "MB" ? 0 : integer * 1;

    const dataInfo = {
      network: selectedPlan?.network.toString()!,
      plan: selectedPlan?.id.toString()!,
      mobile_number: phone,
      Ported_number: true,
    };

    setLoading(true);

    const response = await buyData(dataInfo);

    if (response.error) {
      const data: transactionTypes = {
        email: user?.email,
        amount: selectedPlan?.plan_amount,
        purpose: "data",
        status: "failed",
        transactionId: "failed",
        phone: phone,
        network: currentNetwork,
        planSize: selectedPlan.plan,
        previousBalance: user.balance,
        newBalance: user.balance,
      };

      setTransaction(data);
      CustomToast(
        "Network error, Try again later",
        errorToastBg,
        errorToastText
      );
      setLoading(false);
      return;
    }

    if (response.Status === "successful") {
      CustomToast("Successfull", bgColor, textColor);

      setLoading(false);

      //create a transaction

      const data: transactionTypes = {
        email: user?.email,
        amount: selectedPlan?.plan_amount,
        purpose: "data",
        status: response.Status,
        transactionId: response.ident,
        phone: phone,
        network: currentNetwork,
        planSize: selectedPlan.plan,
        previousBalance: user.balance,
        newBalance: (
          parseInt(user.balance) - parseInt(selectedPlan?.plan_amount)
        ).toString(),
      };

      handleBuyData(
        data,
        commission,
        user?.referee,
        user?.referral_bonus!
      ).then(async () => {
        const user = await fetchUser(data.email);
        storeUser(user![0]);
        router.push("/");
      });

      // setTransaction(data);

      // deductBalance(data.email, data.amount);

      // handleCommission(data.email, commission);
    } else {
      if (response.Status !== "failed") {
        console.log(response.Status);

        const data: transactionTypes = {
          email: user?.email,
          amount: selectedPlan?.plan_amount,
          purpose: "data",
          status: response.Status,
          transactionId: response.ident,
          phone: phone,
          network: currentNetwork,
          planSize: selectedPlan.plan,
          previousBalance: user.balance,
          newBalance: (
            parseInt(user.balance) - parseInt(selectedPlan?.plan_amount)
          ).toString(),
        };
        setLoading(false);
        deductBalance(data);
      }

      console.log(response.Status);
      setLoading(false);

      const data: transactionTypes = {
        email: user?.email,
        amount: selectedPlan?.plan_amount,
        purpose: "data",
        status: response.Status,
        transactionId: response.ident,
        phone: phone,
        network: currentNetwork,
        planSize: selectedPlan.plan,
        previousBalance: user.balance,
        newBalance:
          response.Status === "failed"
            ? user.balance
            : (
                parseInt(user.balance) - parseInt(selectedPlan?.plan_amount)
              ).toString(),
      };

      setTransaction(data);
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          borderRadius: 10,
          marginHorizontal: 10,
          backgroundColor: bgColor,
          padding: 10,
        }}
      >
        <View style={styles.network}>
          <Text style={{ color: textColor }}>*461*4#</Text>
          <Text style={{ color: textColor }}>MTN SME</Text>
        </View>
        <Divider bold horizontalInset />
        <View style={styles.network}>
          <Text style={{ color: textColor }}>*131*4#</Text>
          <Text style={{ color: textColor }}>MTN Gifting</Text>
        </View>
        <Divider bold horizontalInset />
        <View style={styles.network}>
          <Text style={{ color: textColor }}>*228#</Text>
          <Text style={{ color: textColor }}>9mobile</Text>
        </View>
        <Divider bold horizontalInset />
        <View style={styles.network}>
          <Text style={{ color: textColor }}>*140#</Text>
          <Text style={{ color: textColor }}>Airtel</Text>
        </View>
        <Divider bold horizontalInset />
        <View style={styles.network}>
          <Text style={{ color: textColor }}>*323#</Text>
          <Text style={{ color: textColor }}>Glo</Text>
        </View>
      </View>

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
          onSelectedItemsChange={(item) => handleNetworkSelect(item[0])}
          selectText={currentNetwork}
          single
          displayKey="name"
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />

        <Text>Data Type*</Text>
        <SectionedMultiSelect
          IconRenderer={MaterialIcons}
          items={dataType}
          uniqueKey="type"
          single
          displayKey="type"
          selectText={currentType}
          onSelectedItemsChange={(item) => {
            handleDataTypeSelect(item[0]);
            setCurrentType(item[0]);
          }}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />

        <Text>Data Plan*</Text>
        <SectionedMultiSelect
          IconRenderer={MaterialIcons}
          items={dataPlan}
          uniqueKey="dataplan_id"
          single
          displayKey="plan"
          selectText={currentPlan}
          onSelectedItemsChange={(item) => {
            setPlanId(item[0]);
            filterSelectedPlan(item[0]);
          }}
        />
        <Divider bold horizontalInset style={{ marginBottom: 30 }} />
        <Text>Phone Number*</Text>
        <TextInput
          mode="outlined"
          label="Phone Number"
          placeholder="09030220200"
          onChangeText={(value) => setPhone(value)}
        />
        <Button
          mode="outlined"
          style={{ marginVertical: 20, paddingVertical: 10 }}
          onPress={showDialog}
          disabled={loading ? true : false}
        >
          <Text style={{ fontSize: 20 }}>
            {loading ? "Submitting" : "Buy Data"}
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

export default index;

const styles = StyleSheet.create({
  network: {
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row-reverse",
  },
});
