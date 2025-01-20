import { router } from "expo-router";

export const handleProfileEdit = () => {
  router.push("profile");
};

export const onPrivacyClicked = () => {
  console.log("Privacy Clicked");
};
