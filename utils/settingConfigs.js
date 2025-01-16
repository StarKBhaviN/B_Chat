export const settingsConfig = [
  {
    id: "usage",
    type: "row",
    cols: [
      {
        id: "usedToday",
        title: "10 mins Used Today",
        icon: "cookie-clock",
        flex: 4,
        backgroundColor: "#2f3a4b",
        textColor: "white",
        flexDirection : "row",
        marginTop : -1
      },
    ],
  },
  {
    id: "profileAndPrivacy",
    type: "row",
    cols: [
      {
        id: "editProfile",
        title: "Edit Profile",
        icon: "user",
        flex: 2,
      },
      {
        id: "privacy",
        title: "Privacy",
        icon: "privacy-tip",
        flex: 2,
      },
    ],
  },
  {
    id: "additionalOptions",
    type: "row",
    cols: [
      {
        id: "verifyEmail",
        title: "Verify Email",
        icon: "mail",
        flex: 1,
      },
      {
        id: "socials",
        title: "Socials",
        icon: "connect-without-contact",
        flex: 1,
      },
      {
        id: "sleep",
        title: "Sleep",
        icon: "sleep-off",
        flex: 1,
      },
      {
        id: "theme",
        title: "Theme",
        icon: "invert-mode",
        flex: 1,
      },
    ],
  },
  {
    id: "notificationsAndHelp",
    type: "row",
    cols: [
      {
        id: "notifications",
        title: "Notifications",
        icon: "bell-o",
        flex: 3,
      },
      {
        id: "help",
        title: "Help",
        icon: "help-circle-outline",
        flex: 1,
      },
    ],
  },
];
