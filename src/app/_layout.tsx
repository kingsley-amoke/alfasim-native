import { Stack } from "expo-router";

import { RootSiblingParent } from "react-native-root-siblings";
import mobileAds from "react-native-google-mobile-ads";

import { getDataPlans } from "../utils/data";
import { useDataPlanStore } from "../state/store";
import { Provider } from "react-native-paper";

export default function RootLayout() {
  const { storePlans } = useDataPlanStore();

  getDataPlans().then((plans) => {
    storePlans(plans);
  });

  return (
    <RootSiblingParent>
      <Provider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(public)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="data/index"
            options={{
              title: "Buy Data",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="airtime/index"
            options={{
              title: "Airtime Topup",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="cable/index"
            options={{
              title: "Cable Subscription",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="electricity/index"
            options={{
              title: "Electricity Subscription",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="scratch-card/index"
            options={{
              title: "Scratch Card",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="airtime-2-cash/index"
            options={{
              title: "Airtime 2 Cash",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="fund-wallet/index"
            options={{
              title: "Fund Wallet",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="transactions/[id]"
            options={{
              title: "Alfasim Data",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="profile/index"
            options={{
              title: "Profile",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="referrals/index"
            options={{
              title: "Referrals",
              headerTitleAlign: "center",
            }}
          />
        </Stack>
      </Provider>
    </RootSiblingParent>
  );
}
