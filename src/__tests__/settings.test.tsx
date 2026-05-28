import { render, screen, fireEvent } from "@testing-library/react-native";
import SettingsScreen from "@/app/(tabs)/settings";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Settings Screen", () => {
  it("renders the heading", () => {
    renderWithTheme(<SettingsScreen />);
    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("renders the appearance section label", () => {
    renderWithTheme(<SettingsScreen />);
    expect(screen.getByText("APPEARANCE")).toBeTruthy();
  });

  it("renders all three theme options", () => {
    renderWithTheme(<SettingsScreen />);
    expect(screen.getByText("Light")).toBeTruthy();
    expect(screen.getByText("Dark")).toBeTruthy();
    expect(screen.getByText("System (Auto)")).toBeTruthy();
  });

  it("shows matching description for auto mode by default", () => {
    renderWithTheme(<SettingsScreen />);
    expect(screen.getByText("Matches your device settings")).toBeTruthy();
  });

  it("switches to manual description when Light is pressed", () => {
    renderWithTheme(<SettingsScreen />);
    fireEvent.press(screen.getByText("Light"));
    expect(screen.getByText("Overrides your device settings")).toBeTruthy();
  });
});
