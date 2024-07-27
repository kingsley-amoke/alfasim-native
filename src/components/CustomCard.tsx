import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface ActionProps{
    id:number,
    name: string,
    icon: string,
    link: string
  }

  const CustomCards = ({action}: {action: ActionProps}) => {
    return (
      <View style={{justifyContent:'center', alignItems:'center', gap:20,paddingVertical:30, backgroundColor:'#eefe',shadowColor:'#ddd', shadowRadius:3, shadowOpacity: 3, shadowOffset:{width:30, height:30}}}>
        
        <MaterialIcons name={action.icon} size={40}/>
        <Text>{action.name}</Text>
      </View>
    )
  }

  export default CustomCards;