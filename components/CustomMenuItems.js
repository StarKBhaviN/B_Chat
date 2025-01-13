import { useContext } from "react";
import { View, Text } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemeContext } from "../context/ThemeContext";

export const MenuItems = ({ text, action, value, icon }) => {
  const {theme} = useContext(ThemeContext)

  return (
    <MenuOption onSelect={() => action(value)}>
      <View className="px-4 py-1 flex-row justify-between items-center">
        <Text
          style={{ fontSize: hp(1.7), color : theme.text }}
          className="font-semibold"
        >
          {text}
        </Text>
        {icon}
      </View>
    </MenuOption>
  );
};
