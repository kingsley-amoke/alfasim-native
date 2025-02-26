import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Plan, transactionTypes } from "@/src/utils/types";
import {
  buyData,
  deductBalance,
  fetchUser,
  handleBuyData,
  setTransaction,
} from "@/src/utils/data";
import { useRouter } from "expo-router";
import { useDataPlanStore, useUsersStore } from "@/src/state/store";
import { Colors } from "@/src/constants/Colors";
import { Button, Dialog, Divider, Portal, TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { CustomToast } from "@/src/utils/shared";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { supabase } from "@/src/utils/supabase";

const index = () => {
  interface DataType {
    id: number;
    type: string;
  }

  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const router = useRouter();

  const { plans } = useDataPlanStore();
  const { users } = useUsersStore();

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  if (!plans) return;

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

  const mtnSME = useMemo(
    () => mtnPlans.filter((plan) => plan.plan_type === "SME"),
    [mtnPlans.length]
  );
  const alfasimMtnSME: Plan[] = [];

  const unitGBSME = 610;

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
  const mtnSME2 = useMemo(
    () => mtnPlans.filter((plan) => plan.plan_type === "SME2"),
    [mtnPlans.length]
  );
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

  const mtnGifting = useMemo(
    () => mtnPlans.filter((plan) => plan.plan_type === "GIFTING"),
    [mtnPlans.length]
  );

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

  const mtnCorporateGifting = useMemo(
    () => mtnPlans.filter((plan) => plan.plan_type === "CORPORATE GIFTING"),
    [mtnPlans.length]
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

  const gloGifting = useMemo(
    () => gloPlans.filter((plan) => plan.plan_type === "GIFTING"),
    [gloPlans.length]
  );

  const alfasimGloGifting: Plan[] = gloGifting;

  const gloCorporateGifting = useMemo(
    () => gloPlans.filter((plan) => plan.plan_type === "CORPORATE GIFTING"),
    [gloPlans.length]
  );

  const alfasimGloCorporateGifting: Plan[] = [];

  const unitGBGloCorporateGifting = 275;

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

  const etisalatGifting = useMemo(
    () => etisalatPlans.filter((plan) => plan.plan_type === "GIFTING"),
    [etisalatPlans.length]
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

  const etisalatCorporateGifting = useMemo(
    () =>
      etisalatPlans.filter((plan) => plan.plan_type === "CORPORATE GIFTING"),
    [etisalatPlans.length]
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

  const airtelGifting = useMemo(
    () => airtelPlans.filter((plan) => plan.plan_type === "GIFTING"),
    [airtelPlans.length]
  );

  const alfasimAirtelGifting: Plan[] = [];

  const unitGBAirtelGifting = 240;

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

  const airtelCorporateGifting = useMemo(
    () => airtelPlans.filter((plan) => plan.plan_type === "CORPORATE GIFTING"),
    [airtelPlans.length]
  );

  const alfasimAirtelCorporateGifting: Plan[] = [];

  const unitGBAirtelCoporateGifting = 285;

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
    }
  };

  const handleSubmitForm = async () => {
    if (!selectedPlan || !user) return;

    if (
      parseInt(user?.balance) < parseInt(selectedPlan?.plan_amount) ||
      !user.balance
    ) {
      CustomToast(
        "Insufficient Balance",
        Colors.light.error,
        Colors.light.onError
      );
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
        Colors.light.error,
        Colors.light.onError
      );
      setLoading(false);
      return;
    }

    if (response.Status === "successful") {
      CustomToast("Successfull", Colors.light.primary, Colors.light.onPrimary);

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
      ).then(() => router.push("/"));
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
          backgroundColor: Colors.primary,
          padding: 10,
        }}
      >
        <View style={styles.network}>
          <Text style={{ color: Colors.light.onPrimary }}>*461*4#</Text>
          <Text style={{ color: Colors.light.onPrimary }}>MTN SME</Text>
        </View>
        <Divider bold horizontalInset />
        <View style={styles.network}>
          <Text style={{ color: Colors.light.onPrimary }}>*131*4#</Text>
          <Text style={{ color: Colors.light.onPrimary }}>MTN Gifting</Text>
        </View>
        <Divider bold horizontalInset />
        <View style={styles.network}>
          <Text style={{ color: Colors.light.onPrimary }}>*228#</Text>
          <Text style={{ color: Colors.light.onPrimary }}>9mobile</Text>
        </View>
        <Divider bold horizontalInset />
        <View style={styles.network}>
          <Text style={{ color: Colors.light.onPrimary }}>*140#</Text>
          <Text style={{ color: Colors.light.onPrimary }}>Airtel</Text>
        </View>
        <Divider bold horizontalInset />
        <View style={styles.network}>
          <Text style={{ color: Colors.light.onPrimary }}>*323#</Text>
          <Text style={{ color: Colors.light.onPrimary }}>Glo</Text>
        </View>
      </View>

      <View
        style={{
          borderRadius: 10,
          marginHorizontal: 10,
          marginVertical: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: Colors.light.primary,
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
