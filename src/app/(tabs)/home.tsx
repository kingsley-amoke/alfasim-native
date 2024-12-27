import { ScrollView, TouchableOpacity, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "expo-router";
import { UIActivityIndicator } from "react-native-indicators";

import { actions, CustomToast } from "@/src/utils/shared";
import CustomCards from "@/src/components/CustomCard";
import { useUsersStore, useUserStore } from "@/src/state/store";
import { Button, Text } from "react-native-paper";
import { Colors } from "@/src/constants/Colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  fetchLastTransaction,
  fetchUserAccount,
  getCustomerAccount,
  postUserAccounts,
  redeemBonus,
} from "@/src/utils/data";
import { supabase } from "@/src/utils/supabase";

export default function home() {
  const router = useRouter();
  const { users } = useUsersStore();
  const { redeemUserBonus, increaseUserBalance } = useUserStore();

  const [clickedRedeem, setClickedRedeem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loggedUser, setLoggedUser] = useState("");

  supabase.auth
    .getUser()
    .then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoggedUser(user.email!);
        fetchUserAccount(user.email!)
          .then((data) => {
            setAccounts(data[0].accounts);
          })
          .catch((error) => console.log(error));
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

  const balance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(parseFloat(user?.balance!));

  const handleRequestAccount = async () => {
    const contractCode = process.env
      .EXPO_PUBLIC_MONNIFY_CONTRACT_CODE as string;
    const bvn = process.env.EXPO_PUBLIC_BVN as string;

    const config = {
      accountReference: user?.username,
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

    if (user?.referral_bonus) {
      if (user?.referral_bonus === "0") {
        CustomToast(
          "No bonus this time, refer people to earn!",
          Colors.light.error,
          Colors.light.onError
        );
        setClickedRedeem(false);
        return;
      }

      const response = await redeemBonus(user?.username, user?.referral_bonus);

      if (response?.error) {
        CustomToast(
          "An error occurred!",
          Colors.light.error,
          Colors.light.onError
        );
        setClickedRedeem(false);
        return;
      }

      increaseUserBalance(parseFloat(user.referral_bonus));
      redeemUserBonus(user);

      CustomToast(
        "Bonus has been added to your wallet",
        Colors.light.primary,
        Colors.light.onError
      );

      setClickedRedeem(false);
    }
  };

  useEffect(() => {
    loggedUser && fetchLastTransaction(loggedUser);
  }, []);

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
            backgroundColor: Colors.light.primary,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ margin: 10 }}>
            <Text style={{ color: Colors.light.onPrimary }}>
              Wallet balance
            </Text>
            <Text style={{ color: Colors.light.onPrimary, fontSize: 20 }}>
              {balance}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              gap: 10,
              marginVertical: 20,
            }}
          >
            <Button
              mode="outlined"
              icon={loading ? "loading" : "bank-plus"}
              style={{ paddingVertical: 10 }}
              labelStyle={{ fontSize: 18 }}
              disabled={loading}
              textColor={Colors.light.onPrimary}
              onPress={handleRequestAccount}
            >
              Request
            </Button>
            <Button
              mode="outlined"
              icon="database-plus"
              style={{ paddingVertical: 10 }}
              labelStyle={{ fontSize: 18 }}
              textColor={Colors.light.onPrimary}
              onPress={handleRedeemBonus}
              disabled={clickedRedeem}
            >
              Redeem
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
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <View
              key={account.accountNumber}
              style={{
                width: "45%",
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
          ))
        ) : (
          <UIActivityIndicator color={Colors.light.primary} />
        )}
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
