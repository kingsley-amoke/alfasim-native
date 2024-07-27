import {  ScrollView, TouchableOpacity, View } from "react-native";
import { useEffect } from "react";
import { Link } from "expo-router";

import { actions } from "@/src/utils/shared";
import CustomCards from "@/src/components/CustomCard";
import { useUserStore } from "@/src/state/store";
import { Button, Text } from "react-native-paper";
import { Colors } from "@/src/constants/Colors";
import useTheme from "@/src/hooks/useTheme";

export default function Index() {

  const {colorScheme } = useTheme();

  const {user} = useUserStore()

  const bgColor = colorScheme === "dark" ? Colors.dark.primary : Colors.light.primary
  const textColor = colorScheme == "dark" ? Colors.dark.onPrimary : Colors.light.onPrimary;
  const balance = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(parseInt(user?.balance!))

  return (
    <ScrollView
      style={{
        flex:1,
        marginHorizontal:10
        
      }}
    >
      <View>
        <Text style={{fontWeight:'bold', fontSize:18, marginVertical:10}}>Hello {user?.username}!</Text>
        <View style={{backgroundColor:bgColor, borderRadius:10, paddingVertical:10, paddingHorizontal:10}}>
          <View style={{margin:10}}>

          <Text style={{color:textColor}}>Wallet balance</Text>
          <Text style={{color:textColor, fontSize:20}}>{balance}</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10, marginVertical:20}}>
           <Button mode="outlined" icon="plus" textColor={textColor}>
            Fund Wallet
            </Button>
           <Button mode="outlined" icon="plus" textColor={textColor}>Redeem Bonus</Button>
          </View>
          
        </View>
      </View>
      <View style={{width: "100%",
                marginVertical: 20,
                flexDirection: "row",
                marginHorizontal: "auto",
                flexWrap: "wrap",
                gap: 20,
                justifyContent:'center',
                alignItems:'center'}}>
        {actions.map((action) => (
          <Link
          href={`${action.link}`}
          key={action.id}
          asChild
        >
          <TouchableOpacity style={{ width: 180 }}>
            <CustomCards  action={action}/>
          </TouchableOpacity>
        </Link>
        ))}
      </View>
    </ScrollView>
  );
}
