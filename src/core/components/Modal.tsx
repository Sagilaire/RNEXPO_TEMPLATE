import { useEffect, type ReactNode } from 'react';
import { View, Pressable, Modal as RNModal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/core/theme';
import { Text } from './Text';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  const { colors } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessible
      accessibilityRole="none"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={onClose}
          accessible
          accessibilityRole="none"
          accessibilityLabel="Close modal"
        >
          <Pressable
            className="rounded-t-2xl p-6 gap-4 max-h-[85%]"
            style={{ backgroundColor: colors.card }}
            onPress={() => {}}
            accessible
            accessibilityRole="none"
          >
            {/* Handle */}
            <View className="items-center">
              <View
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: colors.textTertiary, opacity: 0.3 }}
              />
            </View>

            {/* Header */}
            {title && (
              <View className="flex-row items-center justify-between">
                <Text variant="h3" themeColor="text">
                  {title}
                </Text>
                <Pressable
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  onPress={onClose}
                  style={({ pressed }) => [
                    { padding: 4 },
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            )}

            {/* Content */}
            <View className="flex-1">{children}</View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
