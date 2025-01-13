/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#cdcdcd';
const tintColorDark = '#222831';

export const Colors = {
  light: {
    text: '#3c3c3c',
    background: '#FCFCFC',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    placeholder : "#7e7e7e",
    glow : "#000000",
    specialBg : "#8f9699",
    border : "#423b3b",
    appBg : "#FCFCFC"
  },
  dark: {
    text: '#959497',
    background: '#1A1A1D',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    placeholder : "#727275",
    glow : "#b8b8bc",
    specialBg : "#2f3a4b",
    border : "#1C1D1C",
    appBg : "#1B1A22"
  },
};
