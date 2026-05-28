import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const heroStyles = StyleSheet.create({
  decoCircleLarge: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: -SCREEN_WIDTH * 0.15,
    right: -SCREEN_WIDTH * 0.2,
  },
  decoCircleMedium: {
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_WIDTH * 0.45,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    bottom: -SCREEN_WIDTH * 0.12,
    left: -SCREEN_WIDTH * 0.1,
  },
  decoCircleSmall: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: SCREEN_WIDTH * 0.05,
    left: SCREEN_WIDTH * 0.12,
  },
  decoDot1: {
    width: 8,
    height: 8,
    top: '22%',
    right: '18%',
  },
  decoDot2: {
    width: 5,
    height: 5,
    top: '38%',
    right: '28%',
  },
  decoDot3: {
    width: 6,
    height: 6,
    bottom: '30%',
    left: '22%',
  },
});
