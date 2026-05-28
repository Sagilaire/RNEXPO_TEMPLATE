import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-reanimated', () => {
  const { View, Text, Image, ScrollView, FlatList } = jest.requireActual('react-native');

  return {
    __esModule: true,
    default: {
      View,
      Text,
      Image,
      ScrollView,
      FlatList,
      createAnimatedComponent: (Component) => Component,
    },
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: (fn) => fn(),
    useDerivedValue: (fn) => ({ value: fn() }),
    withTiming: (val) => val,
    withSpring: (val) => val,
    interpolateColor: (value, _, outputRange) =>
      value > 0.5 ? outputRange[1] : outputRange[0],
    interpolate: (_, __, outputRange) => outputRange[0],
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    cancelAnimation: () => {},
    Easing: { linear: () => 0, ease: () => 0, Out: { ease: () => 0 } },
  };
});

jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');

  return {
    ...actual,
    Stack: ({ children }) => children,
    Tabs: Object.assign(({ children }) => children, {
      Screen: ({ children }) => children,
    }),
    SplashScreen: {
      preventAutoHideAsync: jest.fn(),
      hideAsync: jest.fn(),
    },
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
    },
    useLocalSearchParams: () => ({}),
    useGlobalSearchParams: () => ({}),
    useSegments: () => [],
    usePathname: () => '/',
    Link: ({ children }) => children,
  };
});

jest.mock('expo-font', () => ({
  useFonts: () => [true],
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
}));

jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: () => 'light',
  addChangeListener: () => ({ remove: jest.fn() }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
  clear: () => Promise.resolve(),
}));
