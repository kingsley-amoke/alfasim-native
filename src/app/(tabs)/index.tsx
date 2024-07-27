import {  View } from "react-native";
import { Button, Text } from "react-native-paper";
import { supabase } from "../../utils/supabase";
import { useEffect } from "react";

export default function Index() {


  useEffect(()=>{
  

  },[])


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button>hfjh</Button>
    </View>
  );
}
