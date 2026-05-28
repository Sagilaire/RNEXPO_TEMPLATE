import { render, screen } from "@testing-library/react-native";
import HomeScreen from "@/app/(tabs)/index";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Index (Home Screen)", () => {
  it("renders the app name", () => {
    renderWithTheme(<HomeScreen />);
    expect(screen.getByText("ExpoTemplate")).toBeTruthy();
  });

  it("renders the template tagline", () => {
    renderWithTheme(<HomeScreen />);
    expect(
      screen.getByText("A reusable Expo + React Native template.")
    ).toBeTruthy();
  });

  it("renders the body content", () => {
    renderWithTheme(<HomeScreen />);
    expect(screen.getByText("Ready to build.")).toBeTruthy();
  });

  it("renders the footer with tech stack info", () => {
    renderWithTheme(<HomeScreen />);
    expect(
      screen.getByText("Expo SDK 56 · TypeScript · expo-router")
    ).toBeTruthy();
  });

  it("shows auto light mode indicator by default", () => {
    renderWithTheme(<HomeScreen />);
    expect(screen.getByText("☀️ Light mode · Auto")).toBeTruthy();
  });
});
