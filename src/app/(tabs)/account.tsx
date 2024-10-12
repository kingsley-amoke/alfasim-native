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
import { developerLinks, socialLinks } from "@/src/utils/shared";

const profile = () => {
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
  const navigateToSupport = () => {
    router.push("htttps://whatsapp.com");
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
      subtext: "Switch app display mode to your preference",
      action: navigateToProfile,
    },
  ];

  const help = [
    {
      icon: "help-circle",
      text: "Help & Support",
      subtext: "Help or contact oyr cyustomer service",
      action: socialLinks.chat,
    },
  ];

  const followUs = [
    {
      icon: "whatsapp",
      text: "Whatsapp Channel",
      action: "",
    },

    {
      icon: "facebook-square",
      text: "Facebook",
      action: "",
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
      <MaterialCommunityIcons name={icon} size={40} color={color} />
      <View>
        <Text
          style={{
            marginLeft: 36,
            fontWeight: 600,
            fontSize: 20,
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
    <SafeAreaView>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 50,
        }}
      >
        <Avatar.Icon size={70} icon="account-edit-outline" />
        <Text>{user.firstName}</Text>
      </View>
      <ScrollView
        style={{ marginHorizontal: 10, marginBottom: 200, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
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
                  size={40}
                  color={color}
                />
                <View>
                  <Text
                    style={{
                      marginLeft: 36,
                      fontWeight: 600,
                      fontSize: 20,
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
                <FontAwesome name={item.icon} size={40} color={color} />
                <Text
                  style={{
                    marginLeft: 36,
                    fontWeight: 600,
                    fontSize: 20,
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
                <FontAwesome name={item.icon} size={40} color={color} />
                <Text
                  style={{
                    marginLeft: 36,
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  {item.text}{" "}
                </Text>
              </TouchableOpacity>
            </ExternalLink>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
