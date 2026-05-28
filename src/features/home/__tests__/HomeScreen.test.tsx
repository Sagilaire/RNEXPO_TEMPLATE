import { render, screen } from '@testing-library/react-native';
import HomeScreen from '@/features/home/screens/HomeScreen';
import { ThemeProvider, AnimatedThemeProvider } from '@/core';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AnimatedThemeProvider>
        {ui}
      </AnimatedThemeProvider>
    </ThemeProvider>,
  );
}

describe('HomeScreen', () => {
  it('renders the app name', () => {
    renderWithTheme(<HomeScreen />);
    expect(screen.getByText('ExpoTemplate')).toBeTruthy();
  });

  it('renders the template tagline', () => {
    renderWithTheme(<HomeScreen />);
    expect(
      screen.getByText('A reusable Expo + React Native template.'),
    ).toBeTruthy();
  });

  it('renders the body content', () => {
    renderWithTheme(<HomeScreen />);
    expect(screen.getByText('Ready to build.')).toBeTruthy();
  });

  it('renders the footer with tech stack info', () => {
    renderWithTheme(<HomeScreen />);
    expect(
      screen.getByText('Expo SDK 56 · TypeScript · expo-router'),
    ).toBeTruthy();
  });

  it('shows auto light mode indicator by default', () => {
    renderWithTheme(<HomeScreen />);
    expect(screen.getByText('☀️ Light mode · Auto')).toBeTruthy();
  });

  it('renders the hero section with header accessibility role', () => {
    renderWithTheme(<HomeScreen />);
    // The hero View has accessibilityRole="header"
    const heroContent = screen.getByText('EXPO TEMPLATE');
    expect(heroContent).toBeTruthy();
  });
});
