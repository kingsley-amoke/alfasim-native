import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";
import useTheme from "../hooks/useTheme";
import { Colors } from "../constants/Colors";

interface ActionProps{
    id:number,
    name: string,
    icon: string,
    link: string
  }

  const CustomCards = ({action}: {action: ActionProps}) => {

    const {colorScheme } = useTheme();

  
    const bgColor = colorScheme === "dark" ? Colors.dark.inversePrimary : Colors.light.inverseOnSurface
    const textColor = colorScheme == "dark" ? Colors.dark.onBackground : Colors.light.shadow;

    return (
      <View style={{justifyContent:'center', alignItems:'center', gap:20,paddingVertical:30, borderRadius:20, backgroundColor:bgColor,shadowColor:'#ddd', shadowRadius:3, shadowOpacity: 3, shadowOffset:{width:30, height:30}}}>
        
        <MaterialIcons name={action.icon} size={40}/>
        <Text style={{color:textColor}}>{action.name}</Text>
      </View>
    )
  }

  export default CustomCards;