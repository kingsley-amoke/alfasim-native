import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Colors } from "../constants/Colors";

interface ActionProps {
  id: number;
  name: string;
  icon: string;
  link: string;
}

const CustomCards = ({ action }: { action: ActionProps }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        paddingVertical: 30,
        borderRadius: 20,
        backgroundColor: "#fff",
        shadowColor: Colors.primary,
        shadowRadius: 3,
        shadowOpacity: 3,
        elevation: 10,
        shadowOffset: { width: 30, height: -30 },
      }}
    >
      <MaterialIcons name={action.icon} size={40} />
      <Text style={{ color: "black" }}>{action.name}</Text>
    </View>
  );
};

export default CustomCards;
