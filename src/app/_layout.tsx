import { Stack, useRouter } from "expo-router";
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
import { RootSiblingParent } from 'react-native-root-siblings';

import { Colors } from "../constants/Colors";
import { StatusBar } from "expo-status-bar";
import useTheme from "../hooks/useTheme";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { fetchUser, getDataPlans } from "../utils/data";
import { useDataPlanStore, useUserStore } from "../state/store";
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
  const { storeUser } = useUserStore();
  const {storePlans} = useDataPlanStore();

  const iconColor = colorScheme === "dark" ? "white" : "black";

  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
    } else {
      fetchUser(user?.email).then((user) => {
        storeUser(user![0]);
        router.replace("/");
      });
    }
  };

  const getPlans = async() => {
    const plans: dataPlanTypes = await getDataPlans();
    storePlans(plans)
  }

  useEffect(() => {
    getUser();
    getPlans();
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
            name="data/index"
            options={{
              title: "Buy Data",
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
