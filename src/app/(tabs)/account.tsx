import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { Avatar, Button, Text } from "react-native-paper";
import { supabase } from "@/src/utils/supabase";
import { useRouter } from "expo-router";
import { useUserStore } from "@/src/state/store";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ExternalLink } from "@/src/components/ExternalLink";
import { CustomToast, developerLinks, socialLinks } from "@/src/utils/shared";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { Colors } from "@/src/constants/Colors";

const profile = () => {
  const liveBanner = process.env.EXPO_PUBLIC_BANNER_ADS as string;

  const router = useRouter();

  const colorScheme = useColorScheme();
  const { user } = useUserStore();

  const color = colorScheme === "dark" ? "white" : "black";
  const navigateToProfile = () => {
    router.push("/profile");
  };
  const navigateToReferrals = () => {
    router.push("/referrals");
  };

  const toggleMode = () => {
    CustomToast("Coming soon...", Colors.light.primary, "white");
  };

  const settingItems = [
    {
      icon: "account-cog",
      text: "Settings",
      subtext: "Accounts, change password",
      action: navigateToProfile,
    },
    {
      icon: "account-group",
      text: "My Referral",
      subtext: "Referrals, commissions",
      action: navigateToReferrals,
    },
    {
      icon: "theme-light-dark",
      text: "Dark Mode",
      subtext: "Switch app display mode",
      action: toggleMode,
    },
  ];

  const help = [
    {
      icon: "help-circle",
      text: "Help & Support",
      subtext: "Help or contact our cyustomer service",
      action: socialLinks.chat,
    },
  ];

  const followUs = [
    {
      icon: "whatsapp",
      text: "Whatsapp Channel",
      action: socialLinks.whatsapp.link,
    },

    {
      icon: "facebook-square",
      text: "Facebook",
      action: socialLinks.facebook.link,
    },
    {
      icon: "instagram",
      text: "Instagram",
      action: socialLinks.instagram.link,
    },
  ];

  const DeveloperInfoItems = [
    {
      icon: "link",
      text: "Portfolio",
      action: developerLinks.website,
    },

    {
      icon: "facebook-square",
      text: "Facebook",
      action: developerLinks.facebook.link,
    },
    {
      icon: "github",
      text: "GitHub",
      action: developerLinks.github.link,
    },
    {
      icon: "linkedin",
      text: "LinkedIn",
      action: developerLinks.linkedIn.link,
    },
  ];

  interface settingsItemsProps {
    icon: any;
    text: string;
    subtext: string;
    action: () => void;
  }

  const renderSettingsItem = ({
    icon,
    text,
    subtext,
    action,
  }: settingsItemsProps) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
        borderRadius: 12,
      }}
    >
      <MaterialCommunityIcons name={icon} size={30} color={color} />
      <View>
        <Text
          style={{
            marginLeft: 36,
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {text}
        </Text>
        <Text
          style={{
            marginLeft: 36,
            color: "grey",
          }}
        >
          {subtext}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Avatar.Icon size={70} icon="account-edit-outline" />
        <Text>{user.firstName}</Text>
      </View>
      <View style={{ marginHorizontal: 10, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, color: "grey", marginBottom: 10 }}>
          General Settings
        </Text>
        <View>
          {settingItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItem(item)}
            </React.Fragment>
          ))}
          {help.map((item, index) => (
            <ExternalLink href={item.action} key={index}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingLeft: 12,
                  borderRadius: 12,
                }}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={30}
                  color={color}
                />
                <View>
                  <Text
                    style={{
                      marginLeft: 36,
                      fontWeight: 600,
                      fontSize: 18,
                    }}
                  >
                    {item.text}{" "}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 36,
                      color: "grey",
                    }}
                  >
                    {item.subtext}
                  </Text>
                </View>
              </TouchableOpacity>
            </ExternalLink>
          ))}
        </View>

        <Text style={{ fontSize: 20, color: "grey", marginVertical: 10 }}>
          Follow Us
        </Text>
        <View>
          {followUs.map((item, index) => (
            <ExternalLink href={item.action} key={index}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingLeft: 12,
                  borderRadius: 12,
                }}
              >
                <FontAwesome name={item.icon} size={30} color={color} />
                <Text
                  style={{
                    marginLeft: 36,
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  {item.text}{" "}
                </Text>
              </TouchableOpacity>
            </ExternalLink>
          ))}
        </View>
        <Text style={{ fontSize: 20, color: "grey", marginVertical: 10 }}>
          Developer Info
        </Text>
        <View>
          {DeveloperInfoItems.map((item, index) => (
            <ExternalLink href={item.action} key={index}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingLeft: 12,
                  borderRadius: 12,
                }}
              >
                <FontAwesome name={item.icon} size={30} color={color} />
                <Text
                  style={{
                    marginLeft: 36,
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  {item.text}{" "}
                </Text>
              </TouchableOpacity>
            </ExternalLink>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({});

//about

//developers info

//terms and conditions

//help center

//contact us

//logout

//change theme

//visit our website

//privacy policy

//change password
