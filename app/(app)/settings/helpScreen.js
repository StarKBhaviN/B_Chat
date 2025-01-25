import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TextInput } from "react-native";
import CustomAlert from "../../../components/Custom/CustomAlert";
import { useAlert } from "../../../context/alertContext";
// import { useAuth } from "../../../context/authContext";
// import { send, EmailJSResponseStatus } from '@emailjs/react-native';

export default function helpScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  // const { user } = useAuth();

  const [helpText, setHelpText] = useState("");

  const { showAlert } = useAlert();
  const handleHelpSend = async () => {
    if (!helpText) {
      showAlert('Help', 'You must fill all the details.');
      return;
    } else {
      showAlert('Help', 'Feature coming soon.');
    }
    // try {
    //   const templateParams = {
    //     to_name: "BhaviN",
    //     from_name: user?.profileName,
    //     user_email: user?.userId,
    //     help_text: helpText,
    //   };

    //   await send("service_o1j15nm", "template_7alqnj9", templateParams, {
    //     publicKey: "WNq1oPQb6cbsbt4El",
    //   });

    //   console.log("SUCCESS!");
    // } catch (err) {
    //   if (err instanceof EmailJSResponseStatus) {
    //     console.log("EmailJS Request Failed...", err);
    //   }
    // }
  };

  return (
    <View style={styles.container}>
      <View className="gap-2">
        <Text style={styles.heading}>Help Request</Text>

        <View className="flex flex-row justify-between">
          <TextInput
            style={styles.emailInput}
            value={helpText}
            onChangeText={setHelpText}
            placeholder="Send Bugs or Feature Requests."
            placeholderTextColor={theme.placeholder}
          />
          <Pressable
            className="flex items-center justify-center rounded-lg"
            style={styles.btnVerify}
            onPress={handleHelpSend}
          >
            <Text style={{ color: theme.glow }}>Send</Text>
          </Pressable>
        </View>

        <Text className="mt-2" style={{ color: theme.placeholder }}>
          Need assistance? We're here to help! Reach out to our support team for
          any questions you may have. Your smooth experience is our priority!
        </Text>
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    heading: {
      fontSize: 16,
      color: theme.glow,
    },
    emailInput: {
      width: wp(65),
      color: theme.text,
      fontSize: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingVertical: 5,
    },
    btnVerify: {
      backgroundColor: theme.tint,
      width: wp(20),
      padding: 4,
    },
  });
}
