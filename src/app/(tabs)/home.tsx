import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";

import { actions, CustomToast } from "@/src/utils/shared";
import CustomCards from "@/src/components/CustomCard";
import { useUserStore } from "@/src/state/store";
import { Button, Text } from "react-native-paper";
import { Colors } from "@/src/constants/Colors";

import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  fetchLastTransaction,
  fetchUserAccount,
  getCustomerAccount,
  postUserAccounts,
  redeemBonus,
} from "@/src/utils/data";

interface AccountType {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

export default function home() {
  const router = useRouter();

  const colorScheme = useColorScheme();

  const { user, redeemUserBonus, increaseUserBalance } = useUserStore();

  const [clickedRedeem, setClickedRedeem] = useState(false);
  const [loading, setLoading] = useState(false);

  const [accounts, setAccounts] = useState<AccountType[]>([]);

  const bgColor =
    colorScheme === "dark" ? Colors.dark.inversePrimary : Colors.light.primary;
  const textColor =
    colorScheme == "dark" ? Colors.dark.onBackground : Colors.light.onPrimary;

  const errorBgColor =
    colorScheme === "dark" ? Colors.dark.error : Colors.light.error;

  const errorTextColor =
    colorScheme === "dark" ? Colors.dark.onError : Colors.light.onError;

  const balance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(parseFloat(user?.balance!));

  const handleRequestAccount = async () => {
    const contractCode = process.env
      .EXPO_PUBLIC_MONNIFY_CONTRACT_CODE as string;
    const bvn = process.env.EXPO_PUBLIC_BVN as string;

    const config = {
      accountReference: user.username,
      accountName: "Alfasimdata Reserved Account",
      currencyCode: "NGN",
      contractCode: contractCode,
      customerEmail: user?.email,
      bvn: bvn,
      customerName: user?.firstName + " " + user?.lastName,
      getAllAvailableBanks: true,
    };

    setLoading(true);

    const data = await getCustomerAccount(config);

    if (!data) {
      setLoading(false);
      CustomToast(
        "Failed to request account, please try again later",
        "red",
        "white"
      );
      return;
    }

    const userAccounts = {
      account_name: data.accountName,
      account_reference: data.accountReference,
      accounts: data.accounts,
      bvn: data.bvn,
      currency: data.currencyCode,
      customer_email: data.customerEmail,
      customer_name: data.customerName,
    };
    postUserAccounts(userAccounts);
    setLoading(false);
    CustomToast(
      "Account request submitted successfully",
      Colors.light.primary,
      "white"
    );
  };

  const handleRedeemBonus = async () => {
    setClickedRedeem(true);

    if (user.referral_bonus) {
      if (user?.referral_bonus === "0") {
        CustomToast(
          "No bonus this time, refer people to earn!",
          errorBgColor,
          errorTextColor
        );
        setClickedRedeem(false);
        return;
      }

      const response = await redeemBonus(user.username, user.referral_bonus);

      if (response?.error) {
        CustomToast("An error occurred!", errorBgColor, textColor);
        setClickedRedeem(false);
        return;
      }

      increaseUserBalance(parseFloat(user.referral_bonus));
      redeemUserBonus(user);

      CustomToast("Bonus has been added to your wallet", bgColor, textColor);

      setClickedRedeem(false);
    }
  };

  const getAccounts = async () => {
    fetchUserAccount(user?.email).then((data) => {
      if (!data) return;
      setAccounts(data[0].accounts);
    });
  };

  useEffect(() => {
    getAccounts();
    user?.username && fetchLastTransaction(user?.username);
  }, [user.username]);

  return (
    <ScrollView
      style={{
        flex: 1,
        marginHorizontal: 10,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginVertical: 10 }}>
          Hello {user?.username}!
        </Text>
        <View
          style={{
            backgroundColor: bgColor,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ margin: 10 }}>
            <Text style={{ color: textColor }}>Wallet balance</Text>
            <Text style={{ color: textColor, fontSize: 20 }}>{balance}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              marginVertical: 20,
            }}
          >
            <Button
              mode="outlined"
              icon={loading ? "loading" : "bank-plus"}
              disabled={loading}
              textColor={textColor}
              onPress={handleRequestAccount}
            >
              Request Account
            </Button>
            <Button
              mode="outlined"
              icon="plus"
              textColor={textColor}
              onPress={handleRedeemBonus}
              disabled={clickedRedeem}
            >
              Redeem Bonus
            </Button>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          marginTop: 10,
        }}
      >
        {accounts.map((account) => (
          <View
            key={account.accountNumber}
            style={{
              width: "40%",
              borderColor: "black",
              borderWidth: 1,
              marginVertical: 10,
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 20 }}>{account.bankName}</Text>
            <Text style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}>
              {account.accountNumber}
            </Text>
          </View>
        ))}
      </View>
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 20,
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "40%",
          }}
        >
          <MaterialCommunityIcons name="account-group" size={30} color="teal" />
          <View>
            <Text>Referals</Text>
            <Text
              style={{ fontWeight: "bold", textAlign: "center", fontSize: 17 }}
            >
              {user?.referrals}
            </Text>
          </View>
        </View>
        <View style={{ borderRightWidth: 1, borderColor: "grey" }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "40%",
          }}
        >
          <MaterialCommunityIcons name="gift-outline" size={30} color="teal" />
          <View>
            <Text>Referal Bonus</Text>
            <Text
              style={{ fontWeight: "bold", textAlign: "center", fontSize: 14 }}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "ngn",
              }).format(parseFloat(user?.referral_bonus!))}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          marginVertical: 20,
          flexDirection: "row",
          marginHorizontal: "auto",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {actions.map((action) => (
          <Link href={`${action.link}`} key={action.id} asChild>
            <TouchableOpacity style={{ width: 150 }}>
              <CustomCards action={action} />
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
