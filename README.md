<div align="center">

  <img src="https://img.shields.io/badge/Expo-56-blueviolet?style=for-the-badge&logo=expo" alt="Expo SDK 56" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/expo--router-000?style=for-the-badge&logo=expo&logoColor=white" alt="expo-router" />

  <br />
  <br />

  <h1>📱 ExpoTemplate</h1>
  <p><strong>A modern, reusable Expo + React Native template</strong></p>
  <p>Lightweight · Type-safe · Dark mode ready · NativeWind (Tailwind CSS)</p>

  <br />

  <p>
    <a href="#-features">Features</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-scripts">Scripts</a> •
    <a href="#-customization">Customization</a>
  </p>

  <br />

</div>

---

## ✨ Features

- **⚡ Expo SDK 56** — Latest Expo with fast development and OTA updates.
- **🗺️ expo-router** — File-based routing with typed routes.
- **🎨 NativeWind (Tailwind CSS)** — Utility-first styling with dark mode support.
- **🌗 Animated Theme System** — Light / Dark / Auto modes with smooth Reanimated transitions.
- **📐 TypeScript** — Fully type-safe codebase.
- **🔤 Inter Font** — Clean, modern typography with Inter (Regular & Bold).
- **🧩 Error Boundary** — Graceful error handling out of the box.
- **🧪 Testing** — Jest + React Native Testing Library configured.
- **🎨 Clean Architecture** — Feature-based separation of concerns.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install
```

### NativeWind Setup

NativeWind uses a Babel plugin and Metro configuration for Tailwind CSS support. The setup is pre-configured in:

- `tailwind.config.js` — Theme colors, fonts, and NativeWind preset
- `metro.config.js` — `withNativeWind` wrapper
- `babel.config.js` — `nativewind/babel` preset
- `global.css` — Tailwind directives entry point

To generate the TypeScript type declarations for NativeWind:

```bash
npx nativewind init
```

> This creates `nativewind-env.d.ts` and updates `tsconfig.json` for Tailwind class autocompletion.

### Start Development

```bash
npm start
```

Then press:

- `a` — Run on **Android** emulator/device
- `i` — Run on **iOS** simulator
- `w` — Run on **Web** browser

---

## 📁 Project Structure

```
src/
├── app/                        # File-based routes (expo-router)
│   ├── (tabs)/                 # Tab navigator layout
│   │   ├── index.tsx           # Home screen (imports features/home)
│   │   ├── settings.tsx        # Settings screen (imports features/settings)
│   │   └── _layout.tsx         # Tab navigator config
│   ├── +not-found.tsx          # 404 screen
│   └── _layout.tsx             # Root layout (fonts, theme, global.css)
│
├── core/                       # Shared cross-cutting layer
│   ├── components/             # UI primitives: Text, ThemedText, ErrorBoundary
│   ├── theme/                  # colors.ts, ThemeProvider, useTheme, AnimatedTheme
│   └── index.ts                # Barrel exports
│
├── features/                   # Business domain modules
│   ├── home/                   # Home screen (HeroSection, decorative styles)
│   ├── settings/               # Settings screen (theme toggle)
│   └── system/                 # System screens (Not Found)
│
├── assets/                     # Fonts, images
│   └── fonts/
│       ├── Inter-Regular.ttf
│       └── Inter-Bold.ttf
│
├── tailwind.config.js          # NativeWind / Tailwind CSS config
├── metro.config.js             # Metro bundler + NativeWind
├── babel.config.js             # Babel + NativeWind
├── global.css                  # NativeWind entry point
└── jest.config.js              # Test configuration
```

---

## 📜 Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm start`        | Start the Expo dev server          |
| `npm run android`  | Start and open on Android          |
| `npm run ios`      | Start and open on iOS              |
| `npm run web`      | Start and open in browser          |
| `npm test`         | Run all tests with Jest            |
| `npm run lint`     | Lint the codebase with ESLint      |

---

## 🎨 Customization

### Colors

Edit [`src/core/theme/colors.ts`](src/core/theme/colors.ts) to define your brand palette for both light and dark modes, then sync with [`tailwind.config.js`](tailwind.config.js).

### Fonts

Replace the `.ttf` files in `assets/fonts/`, then update the font loading in [`src/app/_layout.tsx`](src/app/_layout.tsx) and the Tailwind `fontFamily` config in [`tailwind.config.js`](tailwind.config.js).

### Routes

Add or remove screens by creating files in `src/app/`. See the [expo-router docs](https://expo.github.io/router/) for more.

---

## 🧪 Running Tests

```bash
npm test
```

The project uses [Jest](https://jestjs.io/) with [`@testing-library/react-native`](https://callstack.github.io/react-native-testing-library/) for component testing.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ using <a href="https://expo.dev">Expo</a></sub>
</div>
