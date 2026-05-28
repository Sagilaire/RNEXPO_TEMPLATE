import { render, screen, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
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

describe('SettingsScreen', () => {
  it('renders the heading', () => {
    renderWithTheme(<SettingsScreen />);
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('renders the appearance section label', () => {
    renderWithTheme(<SettingsScreen />);
    expect(screen.getByText('APPEARANCE')).toBeTruthy();
  });

  it('renders all three theme options', () => {
    renderWithTheme(<SettingsScreen />);
    expect(screen.getByText('Light')).toBeTruthy();
    expect(screen.getByText('Dark')).toBeTruthy();
    expect(screen.getByText('System (Auto)')).toBeTruthy();
  });

  it('shows matching description for auto mode by default', () => {
    renderWithTheme(<SettingsScreen />);
    expect(screen.getByText('Matches your device settings')).toBeTruthy();
  });

  it('switches to manual description when Light is pressed', () => {
    renderWithTheme(<SettingsScreen />);
    fireEvent.press(screen.getByText('Light'));
    expect(screen.getByText('Overrides your device settings')).toBeTruthy();
  });

  it('renders theme options as accessible radio buttons', () => {
    renderWithTheme(<SettingsScreen />);
    const lightRadio = screen.getByRole('radio', { name: 'Light theme' });
    expect(lightRadio).toBeTruthy();
    expect(lightRadio).toHaveProp('accessibilityState', { selected: false });

    const darkRadio = screen.getByRole('radio', { name: 'Dark theme' });
    expect(darkRadio).toBeTruthy();

    const autoRadio = screen.getByRole('radio', { name: 'System (Auto) theme' });
    expect(autoRadio).toBeTruthy();
    expect(autoRadio).toHaveProp('accessibilityState', { selected: true });
  });

  it('updates accessibility state when selecting a theme', () => {
    renderWithTheme(<SettingsScreen />);
    const lightRadio = screen.getByRole('radio', { name: 'Light theme' });

    fireEvent.press(lightRadio);

    expect(lightRadio).toHaveProp('accessibilityState', { selected: true });
  });
});
