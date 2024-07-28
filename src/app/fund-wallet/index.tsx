import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useUserStore } from "@/src/state/store";
import { paystackPay, verifyPayment, verifyPaystackTransaction } from "@/src/utils/data";
import { Button, TextInput } from "react-native-paper";

import  { Paystack, paystackProps }  from 'react-native-paystack-webview';
import { CustomToast } from "@/src/utils/shared";
import { Colors } from "@/src/constants/Colors";
import useTheme from "@/src/hooks/useTheme";

const index = () => {

  const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY as string;

  const { user } = useUserStore();
  const { colorScheme } = useTheme();

  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(); 

  const [amount, setAmount] = useState<number>(0);

  const errorBgColor = colorScheme === "dark" ? Colors.dark.errorContainer : Colors.light.errorContainer;
  const errorTextColor = colorScheme === "dark"? Colors.dark.error : Colors.light.error;


  const handleInputChange = (value: string) => {
    // Access the value from the event
    const amount: number = parseInt(value, 10);
    setAmount(amount);
  };


  const handlePayment = async({data}) => {

    const reference = data.transactionRef.trxref;

    verifyPaystackTransaction(reference).then((res) => {
      console.log(res);
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
    >
      <View style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}>
      <Paystack 
        paystackKey="pk_test_2e5447a1ae8b8beaba3dc9331ccc00fd8bcb7f74"
        amount={amount}
        billingEmail={user?.email!}
        activityIndicatorColor="green"
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
            onChangeText={(value) => handleInputChange(value)}
            placeholder="Enter amount to recharge"
          />
        </View>
        <Button onPress={()=> paystackWebViewRef.current.startTransaction()} mode="contained" style={{borderRadius:5 ,  marginVertical:20}}>
          Recharge Now
        </Button>

        
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
