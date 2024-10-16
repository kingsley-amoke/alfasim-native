import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const index = () => {
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginVertical: 20 }}>Coming soon ...</Text>
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
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
