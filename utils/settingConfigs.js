// settingsConfig.js
export const settingsConfig = [
  {
    id: "usage",
    title: "Usage",
    type: "box",
    description: "10 Mins Used Today",
  },
  {
    id: "profileEdit",
    title: "Profile Edit",
    type: "row",
    items: [
      { id: "editName", label: "Edit Name" },
      { id: "editProfilePic", label: "Edit Profile Picture" },
    ],
    bar: { id: "fontSize", label: "Font Size" },
  },
  {
    id: "privacy",
    title: "Privacy",
    type: "box",
    description: "Who can see your active status, Last online, About",
  },
  {
    id: "email",
    title: "Email Change & Verification",
    type: "box",
  },
  {
    id: "manageFriends",
    title: "Manage Friends",
    type: "box",
  },
  {
    id: "offline",
    title: "Go Offline/Sleep",
    type: "button",
  },
  {
    id: "theme",
    title: "Theme",
    type: "switch",
    options: ["Dark", "Light", "System Default"],
  },
  {
    id: "notifications",
    title: "Notification Settings",
    type: "box",
    description: "Coming Soon",
  },
  {
    id: "help",
    title: "Help",
    type: "box",
  },
];
