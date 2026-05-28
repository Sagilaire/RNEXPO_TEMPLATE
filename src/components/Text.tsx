import { Text as NativeText, type TextProps, StyleSheet } from "react-native";

export function Text({ style, ...props }: TextProps) {
  return <NativeText style={[styles.base, style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Inter",
  },
});
