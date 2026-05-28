import { render } from '@testing-library/react-native';
import TabLayout from '@/app/(tabs)/_layout';

// Must be before imports that use useTheme
const mockUseTheme = jest.fn();
jest.mock('@/core/theme', () => {
  const actual = jest.requireActual('@/core/theme');
  return {
    ...actual,
    useTheme: () => mockUseTheme(),
  };
});

const baseTheme = {
  colors: {
    primary: '#208AEF',
    background: '#F5F7FA',
    card: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.04)',
    text: '#1A1A2E',
    textSecondary: '#8E8E93',
    textTertiary: '#A0A0A8',
    heroText: '#FFFFFF',
    heroTextSecondary: 'rgba(255, 255, 255, 0.85)',
    circleDecoration: '#FFFFFF',
  },
  colorScheme: 'light' as const,
  mode: 'auto' as const,
  setMode: jest.fn(),
};

describe('TabNavigator', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ ...baseTheme, isDark: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing in light mode', () => {
    mockUseTheme.mockReturnValue({ ...baseTheme, isDark: false });
    expect(() => render(<TabLayout />)).not.toThrow();
  });

  it('renders without crashing in dark mode', () => {
    mockUseTheme.mockReturnValue({ ...baseTheme, isDark: true });
    expect(() => render(<TabLayout />)).not.toThrow();
  });

  it('renders without crashing in auto mode', () => {
    mockUseTheme.mockReturnValue({ ...baseTheme, isDark: false, mode: 'auto' as const });
    expect(() => render(<TabLayout />)).not.toThrow();
  });

  it('handles theme transitions (light → dark → light)', () => {
    // Light
    mockUseTheme.mockReturnValue({ ...baseTheme, isDark: false });
    const { rerender } = render(<TabLayout />);

    // Switch to dark
    mockUseTheme.mockReturnValue({ ...baseTheme, isDark: true });
    expect(() => rerender(<TabLayout />)).not.toThrow();

    // Switch back to light
    mockUseTheme.mockReturnValue({ ...baseTheme, isDark: false });
    expect(() => rerender(<TabLayout />)).not.toThrow();
  });
});
