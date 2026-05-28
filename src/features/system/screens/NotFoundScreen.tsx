import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, useTheme } from '@/core';

export default function NotFoundScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 items-center justify-center px-8 gap-4">
        <Ionicons
          name="compass-outline"
          size={72}
          color={colors.textTertiary}
          accessibilityLabel="Page not found"
          accessibilityRole="image"
        />
        <Text variant="h2" themeColor="text">
          Page not found
        </Text>
        <Text variant="bodySmall" themeColor="textSecondary" className="text-center">
          {"The page you're looking for doesn't exist or has been moved."}
        </Text>
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel="Go home"
          accessibilityHint="Navigates to the home screen"
          className="flex-row items-center gap-2 px-6 py-3 rounded-xl mt-2"
          style={({ pressed }) => [
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="home-outline" size={18} color="#FFFFFF" />
          <Text variant="button" className="text-white">Go Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
