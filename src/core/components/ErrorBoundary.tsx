import { Component, type ReactNode } from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '@/core/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <FallbackScreen onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

function FallbackScreen({ onReset }: { onReset: () => void }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }]}>
      <View className="flex-1 items-center justify-center px-8 gap-4">
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={colors.textSecondary}
          accessibilityLabel="Error"
          accessibilityRole="image"
        />
        <Text variant="h2" themeColor="text">
          Something went wrong
        </Text>
        <Text variant="bodySmall" themeColor="textSecondary" className="text-center">
          {'An unexpected error occurred.\nPlease try again.'}
        </Text>
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel="Try again"
          accessibilityHint="Reloads the current screen"
          className="flex-row items-center gap-2 px-6 py-3 rounded-xl mt-2"
          style={({ pressed }) => [
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8 },
          ]}
          onPress={onReset}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text variant="button" className="text-white">Try Again</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
