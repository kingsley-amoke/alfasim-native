import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useUserStore } from "@/src/state/store";
import { verifyPayment, } from "@/src/utils/data";
import { ActivityIndicator, Button, MD2Colors, TextInput } from "react-native-paper";

import  { Paystack, paystackProps }  from 'react-native-paystack-webview';
import { CustomToast } from "@/src/utils/shared";
import { Colors } from "@/src/constants/Colors";
import useTheme from "@/src/hooks/useTheme";
import { useRouter } from "expo-router";

const index = () => {


  const router = useRouter();

  const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY as string;

  const { user, increaseUserBalance } = useUserStore();
  const { colorScheme } = useTheme();

  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(); 

  const [amount, setAmount] = useState<number>(0);
  const [paying, setPaying] = useState(false);

  const errorBgColor = colorScheme === "dark" ? Colors.dark.error : Colors.light.error;
  const errorTextColor = colorScheme === "dark"? Colors.dark.onError : Colors.light.onError;


  const handleInputChange = (value: string) => {
    // Access the value from the event
    const amount: number = parseInt(value, 10);
    setAmount(amount);
  };


  const handlePayment = async({data}) => {

    setPaying(true)

    const reference = data.transactionRef.trxref;

    verifyPayment(user, reference).then(() => {
      CustomToast("Successfull", 'green', 'white')
increaseUserBalance(amount)
      router.replace('/');
      setPaying(false)
    })

  }



  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >{
      !paying ? (

    
      <View style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}>
      <Paystack 
        paystackKey={paystackKey}
        amount={amount}
        channels={['bank_transfer', 'card', 'bank', 'qr', 'mobile_money', 'ussd']}
      
        billingEmail={user?.email!}
        activityIndicatorColor="teal"
        onCancel={(e) => {
          CustomToast("Payment cancelled", errorBgColor, errorTextColor)
        }}
        onSuccess={(res) => {
          handlePayment(res)
        }}
        ref={paystackWebViewRef}
      />
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 10,
          }}
        >
          Recharge your wallet
        </Text>
        <Text style={{}}>
          Enter the amount you want to fund your wallet with below.
        </Text>
          <Text>Note: All payments are processed by paystack.</Text>
        <View style={{marginVertical:10}}>
         
          <TextInput
            mode="outlined"
            label="Amount"
            autoFocus
            onChangeText={(value) => handleInputChange(value)}
            placeholder="Enter amount to recharge"
          />
        </View>
        <Button onPress={()=> paystackWebViewRef.current.startTransaction()} mode="contained" style={{borderRadius:5 ,  marginVertical:20}}>
          Recharge Now
        </Button>

        
      </View>

) : (<>
  <ActivityIndicator size={30} animating color={MD2Colors.teal400} style={{marginBottom:30}} />
  <Text>Processing, please wait...</Text>
</>
)
}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
