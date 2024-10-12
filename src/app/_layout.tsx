import { Redirect, Stack, useRouter } from "expo-router";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";
import { RootSiblingParent } from "react-native-root-siblings";
import mobileAds from "react-native-google-mobile-ads";

import { Colors } from "../constants/Colors";
import { StatusBar } from "expo-status-bar";
import useTheme from "../hooks/useTheme";
import { useEffect } from "react";
import { fetchAllUsers, fetchUserAccount, getDataPlans } from "../utils/data";
import { useDataPlanStore, useUsersStore } from "../state/store";
import { dataPlanTypes } from "../utils/types";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const router = useRouter();

  const { colorScheme } = useTheme();

  const { storePlans } = useDataPlanStore();
  const { storeUsers } = useUsersStore();

  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;

  const getPlans = async () => {
    const plans: dataPlanTypes = await getDataPlans();
    storePlans(plans);
  };

  const getUsers = async () => {
    const users = await fetchAllUsers();
    storeUsers(users!);
  };

  useEffect(() => {
    getPlans();
    getUsers();
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        // Initialization complete!
      });
  }, []);

  return (
    <RootSiblingParent>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={paperTheme}>
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
        </ThemeProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </PaperProvider>
    </RootSiblingParent>
  );
}
