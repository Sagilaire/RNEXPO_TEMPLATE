# Knowledge Base: React Native + Expo (SDK 56) — Best Practices

> **Target Stack:** Expo SDK 56 · React 19 · TypeScript 6 · Expo Router · React Native 0.85  
> **Purpose:** Definitive guide for building scalable, maintainable, and accessible professional apps.

---

## Table of Contents

1. [Design Principles (SOLID, DRY, KISS)](#1-design-principles-solid-dry-kiss)
2. [Feature-Based Scalable Architecture](#2-feature-based-scalable-architecture)
3. [Folder Structure (Feature-Based)](#3-folder-structure-feature-based)
4. [Navigation & Layouts with Expo Router (Advanced)](#4-navigation--layouts-with-expo-router-advanced)
5. [Data Management with TanStack Query & Axios](#5-data-management-with-tanstack-query--axios)
6. [Hybrid Styling: NativeWind (Tailwind CSS) + StyleSheet](#6-hybrid-styling-nativewind-tailwind-css--stylesheet)
7. [Forms with React Hook Form + Zod](#7-forms-with-react-hook-form--zod)
8. [Reusable Components & Composition](#8-reusable-components--composition)
9. [Storybook 9](#9-storybook-9)
10. [Accessibility (A11y) — Complete Guide](#10-accessibility-a11y--complete-guide)
11. [Testing](#11-testing)
12. [Performance & Optimization](#12-performance--optimization)
13. [Security](#13-security)
14. [Tech Stack Summary](#14-tech-stack-summary)

---

## 1. Design Principles (SOLID, DRY, KISS)

### 1.1 SOLID

#### S — Single Responsibility Principle (SRP)

> A component, hook, or function should have **one and only one reason to change**.

```tsx
// ❌ BAD: One component does everything — fetch, render, style, validate
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`)
      .then((r) => r.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <ActivityIndicator />;
  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user?.name}</Text>
      <Text style={{ color: '#666' }}>{user?.email}</Text>
    </View>
  );
}
```

```tsx
// ✅ GOOD: Separate concerns — API call, UI component, styling
// src/features/user/services/userApi.ts
export const userApi = {
  getById: (id: string) => apiClient.get<User>(`/users/${id}`).then((r) => r.data),
};

// src/features/user/hooks/useUser.ts
export function useUser(userId: string) {
  return useQuery({ queryKey: ['user', userId], queryFn: () => userApi.getById(userId) });
}

// src/features/user/components/UserProfile.tsx
export function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);
  if (isLoading) return <ActivityIndicator />;
  return (
    <Card>
      <UserName>{user?.name}</UserName>
      <UserEmail>{user?.email}</UserEmail>
    </Card>
  );
}
```

#### O — Open/Closed Principle (OCP)

> Components should be **open for extension, closed for modification**.

```tsx
// ❌ BAD: Adding a new variant requires modifying the Button component
function Button({ title, variant }: { title: string; variant: 'primary' | 'secondary' }) {
  const bg = variant === 'primary' ? '#208AEF' : '#E5E7EB';
  return <Pressable style={{ backgroundColor: bg }}><Text>{title}</Text></Pressable>;
}
```

```tsx
// ✅ GOOD: Use className + variant map — extensible without touching internals
const variantStyles: Record<string, string> = {
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-gray-100 text-gray-900',
  outline: 'border border-primary-500 text-primary-500',
  ghost: 'bg-transparent text-primary-500',
};

function Button({ title, variant = 'primary', className }: ButtonProps) {
  return (
    <Pressable className={`px-4 py-3 rounded-xl ${variantStyles[variant]} ${className ?? ''}`}>
      <Text>{title}</Text>
    </Pressable>
  );
}
```

#### L — Liskov Substitution Principle (LSP)

> Subtypes must be substitutable for their base types without breaking behavior.

```tsx
// ✅ GOOD: Base component defines a contract; variants honor it
interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}

function Card({ children, className, onPress }: CardProps) {
  return (
    <Pressable className={`bg-card rounded-2xl p-4 ${className ?? ''}`} onPress={onPress}>
      {children}
    </Pressable>
  );
}

// Any component replacing <Card> must accept the same props and behave consistently
function ProductCard(props: CardProps & { product: Product }) {
  return (
    <Card {...props}>
      <ProductImage source={props.product.image} />
    </Card>
  );
}
```

#### I — Interface Segregation Principle (ISP)

> Don't force components to depend on props they don't use.

```tsx
// ❌ BAD: One massive props interface
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  options?: { label: string; value: string }[]; // Only for Select
  thumbColor?: string; // Only for Switch
}

// ✅ GOOD: Separate interfaces, compose only what's needed
interface BaseFieldProps {
  label: string;
  error?: string;
}

interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (text: string) => void;
  secureTextEntry?: boolean;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}
```

#### D — Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

```tsx
// ❌ BAD: Component directly depends on Axios
function PostList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get('https://api.example.com/posts').then((r) => setPosts(r.data));
  }, []);
  // ...
}

// ✅ GOOD: Component depends on a hook, hook depends on a service function
// src/features/posts/services/postsApi.ts
export const postsApi = {
  getAll: () => apiClient.get<Post[]>('/posts').then((r) => r.data),
};

// src/features/posts/hooks/usePosts.ts
export function usePosts() {
  return useQuery({ queryKey: ['posts'], queryFn: postsApi.getAll });
}

// src/features/posts/components/PostList.tsx
export function PostList() {
  const { data: posts } = usePosts();
  // ...
}
```

### 1.2 DRY (Don't Repeat Yourself)

```tsx
// ❌ BAD: Repeated form logic across screens
function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ... 20 lines of form logic
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ... same 20 lines
}

// ✅ GOOD: Extract shared logic into custom hooks
// src/core/hooks/useFormField.ts
export function useFormField(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const reset = () => { setValue(initialValue); setError(null); };
  return { value, onChange: setValue, error, setError, reset };
}

// ✅ GOOD: Reusable form utilities
// src/core/utils/formatDate.ts — define once, use everywhere
export function formatDate(date: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date));
}
```

### 1.3 KISS (Keep It Simple, Stupid)

- Prefer **functional components** over class components.
- Use **clear, descriptive names**: `useUserProfile` not `useData`.
- Avoid premature abstraction — extract a hook or component **after** the second duplication, not before.
- Avoid over-engineering state: `useState` > `useReducer` > Context > Zustand (escalate only when needed).
- One component per file (with rare exceptions for small, co-located private helpers).

```tsx
// ❌ BAD: Over-engineered for a simple toggle
const ThemeActionType = { TOGGLE: 'TOGGLE', SET: 'SET' } as const;
function themeReducer(state, action) { /* 15 lines */ }

// ✅ GOOD: Simple state for a simple need
const [isDark, setIsDark] = useState(false);
```

---

## 2. Feature-Based Scalable Architecture

### 2.1 What Is a Feature?

A **feature** is a self-contained module that groups everything related to a business domain:

- **Screens** — route entry points (imported by `app/` files)
- **Components** — UI specific to the feature (forms, cards, lists)
- **Hooks** — data fetching, form logic, business rules
- **Services** — API calls (pure functions using the shared HTTP client)
- **Types** — interfaces and types unique to the feature
- **State (optional)** — local state or feature-specific Zustand stores

### 2.2 Core (Shared Layer)

Cross-cutting concerns live in `src/core/` and are available to all features:

| Directory | Purpose |
|-----------|---------|
| `core/components/` | Generic UI primitives: `Button`, `Card`, `Input`, `EmptyState` |
| `core/hooks/` | Shared hooks: `useDebounce`, `useAppState`, `useRefreshOnFocus` |
| `core/services/` | `apiClient` (Axios instance), `queryClient` (TanStack Query) |
| `core/theme/` | Design tokens, `ThemeProvider`, `useTheme`, `tailwind.config.ts` |
| `core/utils/` | Pure helpers: `formatDate`, `cn()` (classname merger), validators |
| `core/types/` | Global types: `PaginationParams`, `ApiResponse<T>`, `Maybe<T>` |

### 2.3 Feature Isolation

Each feature exposes a **minimal public interface**. The rest is private.

```tsx
// src/features/auth/index.ts — Public API
export { SignInScreen } from './screens/SignInScreen';
export { SignUpScreen } from './screens/SignUpScreen';
export { useAuth } from './hooks/useAuth';
export type { User, AuthCredentials } from './types';
```

- Features **never import from other features** directly. Cross-feature communication goes through:
  - Navigation params (Expo Router)
  - Shared core hooks/services
  - Global state (if truly necessary)

### 2.4 How It Scales

| Project Size | Structure |
|-------------|-----------|
| Small (1-2 devs) | 2–3 features: `auth`, `settings`, `home` |
| Medium (3–5 devs) | 5–8 features: add `posts`, `profile`, `search`, `notifications` |
| Large (5+ devs) | 10+ features, each owned by a team; add `payments`, `chat`, `analytics` |

New features are added **without touching existing ones**. No merge conflicts on shared folders like `components/` or `screens/`.

---

## 3. Folder Structure (Feature-Based)

```
my-app/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root layout — providers, fonts, theme
│   ├── index.tsx                # Entry screen (can redirect to tabs)
│   ├── (auth)/                  # Route group: auth flow (no tabs)
│   │   ├── _layout.tsx          # Stack navigator for auth
│   │   ├── sign-in.tsx          # → imports SignInScreen from features/auth
│   │   └── sign-up.tsx          # → imports SignUpScreen from features/auth
│   ├── (tabs)/                  # Route group: main app (with tabs)
│   │   ├── _layout.tsx          # Tabs navigator config
│   │   ├── home.tsx             # → imports HomeScreen from features/home
│   │   ├── profile.tsx          # → imports ProfileScreen from features/profile
│   │   └── settings.tsx         # → imports SettingsScreen from features/settings
│   ├── post/                    # Nested stack for post detail
│   │   ├── _layout.tsx
│   │   └── [id].tsx             # Dynamic route: post/:id
│   ├── modal.tsx                # Modal presented over tabs
│   └── +not-found.tsx           # 404 screen
│
├── src/
│   ├── core/                    # Shared cross-cutting layer
│   │   ├── components/          # UI primitives: Button, Card, Input, Modal
│   │   ├── hooks/               # useDebounce, useAppState, useRefreshOnFocus
│   │   ├── services/            # apiClient (Axios), queryClient
│   │   ├── theme/               # colors.ts, ThemeProvider, useTheme, fonts
│   │   ├── utils/               # cn(), formatDate(), validators
│   │   └── types/               # ApiResponse<T>, Pagination, Maybe<T>
│   │
│   ├── features/                # Business domain modules
│   │   ├── auth/
│   │   │   ├── components/      # SignInForm, SignUpForm, AuthGuard
│   │   │   ├── hooks/           # useLogin, useRegister, useLogout
│   │   │   ├── screens/         # SignInScreen, SignUpScreen
│   │   │   ├── services/        # authApi.ts (login, register, refreshToken)
│   │   │   ├── types/           # User, AuthCredentials, AuthState
│   │   │   └── index.ts         # Public exports (barrel file)
│   │   │
│   │   ├── posts/
│   │   │   ├── components/      # PostCard, PostForm, CommentList
│   │   │   ├── hooks/           # usePosts, useCreatePost, usePost
│   │   │   ├── screens/         # PostListScreen, PostDetailScreen
│   │   │   ├── services/        # postsApi.ts
│   │   │   ├── types/           # Post, CreatePostInput
│   │   │   └── index.ts
│   │   │
│   │   └── profile/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── screens/
│   │       ├── services/
│   │       └── ...
│   │
│   └── store/                   # Global state (Zustand) — only if truly global
│       └── useAppStore.ts
│
├── assets/
│   ├── fonts/                   # Inter-Regular.ttf, Inter-Bold.ttf
│   └── images/                  # icons, splash, etc.
│
├── app.json                     # Expo config
├── tsconfig.json                # TypeScript config (paths: @/* → ./src/*)
├── tailwind.config.ts           # NativeWind theme extension
├── metro.config.js              # Metro bundler + NativeWind
├── global.css                   # NativeWind entry point
├── jest.config.js
├── jest-setup.js
└── package.json
```

**Key rules:**
- `app/` files are **thin entry points** — they import screens from `src/features/` and render them.
- Layouts (`_layout.tsx`) live in `app/` and define navigation structure.
- Business logic, API calls, and feature-specific UI live in `src/features/`.
- Cross-cutting concerns live in `src/core/`.

```tsx
// app/(auth)/sign-in.tsx — Thin entry point
import { SignInScreen } from '@/features/auth';

export default function SignInRoute() {
  return <SignInScreen />;
}
```

---

## 4. Navigation & Layouts with Expo Router (Advanced)

### 4.1 File-Based Routing Conventions

| File | URL | Purpose |
|------|-----|---------|
| `app/index.tsx` | `/` | Home / entry point |
| `app/about.tsx` | `/about` | Static route |
| `app/post/[id].tsx` | `/post/123` | Dynamic route |
| `app/blog/[...slug].tsx` | `/blog/a/b/c` | Catch-all route |
| `app/_layout.tsx` | (wraps children) | Layout — React component wrapper |
| `app/(group)/_layout.tsx` | (no URL segment) | Group layout — organizes without affecting URL |

### 4.2 Route Groups `(group)`

Parentheses define **groups** that organize routes **without adding URL segments**:

```
app/
├── (auth)/          ← Group: no "/auth" in URL
│   ├── _layout.tsx  ← Stack navigator for auth
│   ├── sign-in.tsx  ← URL: /sign-in
│   └── sign-up.tsx  ← URL: /sign-up
└── (tabs)/          ← Group: no "/tabs" in URL
    ├── _layout.tsx  ← Tabs navigator
    ├── home.tsx     ← URL: /home
    └── profile.tsx  ← URL: /profile
```

### 4.3 Nested Layouts

```tsx
// app/_layout.tsx — Root layout
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, ErrorBoundary } from '@/core';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Inter: require('../assets/fonts/Inter-Regular.ttf') });

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

```tsx
// app/(auth)/_layout.tsx — Auth group layout (Stack, no tabs)
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
```

```tsx
// app/(tabs)/_layout.tsx — Tabs layout
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/core/theme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { backgroundColor: colors.card },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### 4.4 Modals

Place a `modal.tsx` at the same level as `(tabs)/` and wrap both in a root Stack:

```
app/
├── _layout.tsx      ← Root Stack wraps (tabs) + modal
├── (tabs)/
│   ├── _layout.tsx
│   └── ...
└── modal.tsx        ← Presented as modal
```

```tsx
// app/_layout.tsx
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Create Post',
        }}
      />
    </Stack>
  );
}
```

### 4.5 Protected Routes with Guards

Expo Router provides `Stack.Protected` and `Tabs.Protected` for auth guards:

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useAuth } from '@/features/auth';

export default function ProtectedTabsLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Tabs.Protected guard={isAuthenticated} fallback="../sign-in">
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" />
    </Tabs.Protected>
  );
}
```

```tsx
// app/(auth)/_layout.tsx — Redirect if already authenticated
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/features/auth';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Redirect href="/(tabs)/home" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
```

### 4.6 Deep Linking

Expo Router handles deep links automatically. Configure the scheme in `app.json`:

```json
{
  "expo": {
    "scheme": "myapp",
    "plugins": ["expo-router"]
  }
}
```

- `myapp://post/42` → opens `app/post/[id].tsx` with `{ id: '42' }`
- `myapp://settings` → opens `app/(tabs)/settings.tsx`

No manual linking configuration needed — Expo Router infers routes from the file structure.

### 4.7 Typed Routes

Enable in `app.json`:

```json
{
  "expo": {
    "experiments": { "typedRoutes": true }
  }
}
```

Now `router.push('/post/[id]')` is type-checked — passing wrong params is a compile error.

---

## 5. Data Management with TanStack Query & Axios

### 5.1 Installation

```bash
npm install @tanstack/react-query axios
```

### 5.2 Global QueryClient Configuration

```tsx
// src/core/services/queryClient.ts
import { QueryClient, onlineManager, focusManager } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Refetch on app foreground
focusManager.setEventListener((handleFocus) => {
  if (Platform.OS === 'web') {
    const onFocus = () => handleFocus();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active') handleFocus();
  });
  return () => sub.remove();
});

// Pause queries when offline
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 min
      gcTime: 30 * 60 * 1000,           // 30 min (garbage collection)
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 5.3 Axios Client with Interceptors

```tsx
// src/core/services/apiClient.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — refresh token or redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Optional: attempt token refresh
      // const newToken = await refreshToken();
      // if (newToken) retry original request

      // Otherwise, redirect to sign-in
      // router.replace('/(auth)/sign-in');
    }
    return Promise.reject(error);
  },
);
```

### 5.4 Feature API Services (Pure Functions)

```tsx
// src/features/auth/services/authApi.ts
import { apiClient } from '@/core/services/apiClient';
import type { AuthCredentials, AuthResponse } from '../types';

export const authApi = {
  login: (credentials: AuthCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials).then((r) => r.data),

  register: (data: RegisterInput) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken }).then((r) => r.data),
};
```

### 5.5 Feature Hooks (useQuery / useMutation)

```tsx
// src/features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../services/authApi';
import type { AuthCredentials } from '../types';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => authApi.login(credentials),
    onSuccess: async (data) => {
      await SecureStore.setItemAsync('accessToken', data.accessToken);
      await SecureStore.setItemAsync('refreshToken', data.refreshToken);
      router.replace('/(tabs)/home');
    },
  });
}
```

```tsx
// src/features/posts/hooks/usePosts.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { postsApi } from '../services/postsApi';

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', { page }],
    queryFn: () => postsApi.getAll({ page }),
    placeholderData: keepPreviousData, // smooth pagination
  });
}
```

### 5.6 Optimistic Updates

```tsx
// src/features/posts/hooks/useToggleLike.ts
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsApi.toggleLike(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previous = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (old: Post[]) =>
        old.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)),
      );

      return { previous }; // rollback context
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData(['posts'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

---

## 6. Hybrid Styling: NativeWind (Tailwind CSS) + StyleSheet

### 6.1 NativeWind as Primary Styling

#### Installation (Expo SDK 56)

```bash
npm install nativewind tailwindcss
npx tailwindcss init
```

#### metro.config.js

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

#### global.css

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Configuration

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F4FE',
          100: '#C2E3FC',
          500: '#208AEF',   // Brand primary
          600: '#1A6FD4',
          700: '#1558B0',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#161B22',
        },
        background: {
          light: '#F5F7FA',
          dark: '#0D1117',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        bold: ['Inter-Bold', 'System'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

#### Daily Usage

```tsx
// ✅ Preferred: Tailwind classes are fast to write, easy to read
function PostCard({ post }: { post: Post }) {
  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm">
      <Text className="text-lg font-bold text-primary-500">{post.title}</Text>
      <Text className="text-sm text-gray-500 mt-1">{post.excerpt}</Text>
      <View className="flex-row items-center mt-3">
        <Text className="text-xs text-gray-400">{formatDate(post.createdAt)}</Text>
      </View>
    </View>
  );
}
```

#### Conditional Styles

```tsx
import { clsx } from 'clsx';

function Button({ variant = 'primary', disabled, className, children }: ButtonProps) {
  return (
    <Pressable
      className={clsx(
        'px-4 py-3 rounded-xl font-semibold',
        variant === 'primary' && 'bg-primary-500 text-white',
        variant === 'secondary' && 'bg-gray-100 text-gray-900',
        variant === 'outline' && 'border border-primary-500 text-primary-500',
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
}
```

#### Platform-Specific Prefixes

```tsx
<Pressable className="
  bg-primary-500
  web:hover:bg-primary-600
  ios:active:bg-primary-700
  android:active:bg-primary-800
  web:cursor-pointer
">
  <Text className="text-white">Tap Me</Text>
</Pressable>
```

#### Dark Mode

```tsx
// Uses `darkMode: 'class'` — add/remove 'dark' class on root based on theme
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-gray-100">Content</Text>
</View>
```

### 6.2 When to Use StyleSheet

Use `StyleSheet.create` in these cases:

1. **Performance-critical lists** — `FlatList` with hundreds of items; StyleSheet avoids class processing overhead.
2. **Highly dynamic styles** — styles that depend on gesture position, animation values, or math that can't be expressed as Tailwind classes.
3. **Reanimated animated styles** — always use `useAnimatedStyle` with `StyleSheet` objects.

```tsx
// ✅ GOOD: StyleSheet for FlatList items (performance)
const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
  },
});

function PostItem({ post }: { post: Post }) {
  return <View style={styles.item}>...</View>;
}

// ✅ GOOD: Dynamic style from gesture
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(progress.value, [0, 1], [1, 0.95]) }],
  opacity: interpolate(progress.value, [0, 1], [1, 0.5]),
}));
```

### 6.3 Integration with Theme

NativeWind detects dark mode via the `darkMode: 'class'` strategy. In React Native, you pass the `colorScheme` prop to the root provider:

```tsx
// app/_layout.tsx — Root layout with NativeWind + custom theme
import { useColorScheme } from 'react-native';
import { ThemeProvider, useTheme } from '@/core/theme';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { effectiveScheme } = useTheme();

  // Pass the resolved color scheme to NativeWind
  return (
    <View className={effectiveScheme === 'dark' ? 'dark' : ''} style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
```

With this setup, all `dark:` prefixed classes (e.g. `dark:bg-gray-900`, `dark:text-white`) automatically respond to the theme:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-gray-100">Adaptive content</Text>
</View>
```

### 6.4 Testing with NativeWind

Jest needs to transform NativeWind classes. Configure in `jest.config.js`:

```js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|nativewind)',
  ],
};
```

In tests, verify styles with `toHaveStyle`:

```tsx
test('Button applies primary variant', () => {
  const { getByRole } = render(<Button variant="primary">Save</Button>);
  const button = getByRole('button');
  // Check the computed style (NativeWind resolves classes to StyleSheet internally)
  expect(button).toHaveStyle({ backgroundColor: '#208AEF' });
});
```

---

## 7. Forms with React Hook Form + Zod

### 7.1 Installation

```bash
npm install react-hook-form @hookform/resolvers zod
```

### 7.2 Basic Form with Validation

```tsx
// src/features/auth/components/SignInForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInInput = z.infer<typeof signInSchema>;

export function SignInForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useLogin(); // from '@/features/auth/hooks/useLogin'

  const onSubmit = async (data: SignInInput) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('root', { message: 'Invalid email or password' });
      }
    }
  };

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text className="text-sm font-semibold mb-1">Email</Text>
            <TextInput
              className={`border rounded-xl px-4 py-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text className="text-sm font-semibold mb-1">Password</Text>
            <TextInput
              className={`border rounded-xl px-4 py-3 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
          </View>
        )}
      />

      {errors.root && (
        <Text className="text-red-500 text-sm text-center">{errors.root.message}</Text>
      )}

      <Pressable
        className="bg-primary-500 rounded-xl py-3 items-center"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting || loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Sign In</Text>
        )}
      </Pressable>
    </View>
  );
}
```

### 7.3 Reusable Form Components

```tsx
// src/core/components/FormTextField.tsx
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { TextInput, View, Text, type TextInputProps } from 'react-native';

interface FormTextFieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  ...textInputProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <View className="gap-1">
          <Text className="text-sm font-semibold">{label}</Text>
          <TextInput
            className={`border rounded-xl px-4 py-3 ${error ? 'border-red-500' : 'border-gray-300'}`}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            value={field.value}
            {...textInputProps}
          />
          {error && <Text className="text-red-500 text-xs">{error.message}</Text>}
        </View>
      )}
    />
  );
}
```

### 7.4 Feature-Level Form Hook

```tsx
// src/features/auth/hooks/useRegisterForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from './useRegister';

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const registerMutation = useRegister();

  const onSubmit = form.handleSubmit((data) => registerMutation.mutateAsync(data));

  return { form, onSubmit, isPending: registerMutation.isPending };
}
```

---

## 8. Reusable Components & Composition

### 8.1 Presentational / Container Pattern

```tsx
// ✅ GOOD: Container handles logic, Presentational handles rendering
// Container
function PostListContainer() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) return <PostListSkeleton />;
  if (!posts?.length) return <EmptyState message="No posts yet" />;

  return <PostList posts={posts} />;
}

// Presentational — pure, testable, reusable
function PostList({ posts }: { posts: Post[] }) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
```

### 8.2 Composition with `children`

```tsx
// src/core/components/Card.tsx
interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}

export function Card({ children, className, onPress }: CardProps) {
  const content = (
    <View className={`bg-card rounded-2xl p-4 shadow-sm border border-cardBorder ${className ?? ''}`}>
      {children}
    </View>
  );

  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

// Usage — compose freely
<Card onPress={() => router.push(`/post/${post.id}`)}>
  <Text className="text-lg font-bold">{post.title}</Text>
  <Text className="text-sm text-gray-500 mt-2">{post.excerpt}</Text>
  <View className="flex-row justify-between mt-4">
    <Text className="text-xs text-gray-400">{formatDate(post.createdAt)}</Text>
    <LikeButton postId={post.id} liked={post.liked} />
  </View>
</Card>
```

### 8.3 Extensible Components with `className` + `style`

All core components accept `className` (for NativeWind) and `style` (for overrides):

```tsx
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className,
  style,
  onPress,
}: ButtonProps) {
  const sizeStyles = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-3', lg: 'px-6 py-4 text-lg' };
  const variantStyles = {
    primary: 'bg-primary-500',
    secondary: 'bg-gray-100',
    outline: 'border border-primary-500',
    ghost: 'bg-transparent',
  };

  return (
    <Pressable
      className={clsx(
        'rounded-xl items-center justify-center flex-row gap-2',
        sizeStyles[size],
        variantStyles[variant],
        disabled && 'opacity-50',
        className,
      )}
      style={style}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading && <ActivityIndicator size="small" />}
      {children}
    </Pressable>
  );
}
```

---

## 9. Storybook 9

### 9.1 Installation

```bash
npx expo install @storybook/react-native @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-react-native-web
```

### 9.2 Configuration```tsx
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-react-native-web',
  ],
  framework: { name: '@storybook/react-native', options: {} },
};

export default config;
```

### 9.3 Story Examples (CSF 3)

#### Button with Variants

```tsx
// src/core/components/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { View } from 'react-native';

const meta = {
  title: 'Core/Button',
  component: Button,
  decorators: [(Story) => <View className="p-4"><Story /></View>],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary Button' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary Button' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline Button' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving...' },
};

export const AllVariants: Story = {
  render: () => (
    <View className="gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </View>
  ),
};
```

#### FormTextField with React Hook Form

```tsx
// src/core/components/FormTextField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormTextField } from './FormTextField';

const meta = {
  title: 'Core/FormTextField',
  component: FormTextField,
  decorators: [
    (Story) => {
      const schema = z.object({ email: z.string().email() });
      const form = useForm({ resolver: zodResolver(schema) });
      return <Story args={{ control: form.control, name: 'email', label: 'Email' }} />;
    },
  ],
} satisfies Meta<typeof FormTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  play: async ({ canvasElement }) => {
    // Trigger validation to show error
  },
};
```

#### Component with Mocked TanStack Query Data

```tsx
// src/features/posts/components/PostList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostList } from './PostList';
import { View } from 'react-native';

// Mock query client with pre-populated cache
const mockQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

mockQueryClient.setQueryData(['posts'], [
  { id: '1', title: 'Getting Started with Expo', excerpt: 'Learn the basics...', createdAt: '2025-05-01', author: { name: 'Jane' } },
  { id: '2', title: 'Advanced Navigation', excerpt: 'Deep dive into Expo Router...', createdAt: '2025-05-02', author: { name: 'John' } },
  { id: '3', title: 'Testing Best Practices', excerpt: 'How to test your components...', createdAt: '2025-05-03', author: { name: 'Alex' } },
]);

const meta = {
  title: 'Features/Posts/PostList',
  component: PostList,
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockQueryClient}>
        <View className="p-4 flex-1">
          <Story />
        </View>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {};

export const Empty: Story = {
  decorators: [
    (Story) => {
      const emptyClient = new QueryClient();
      emptyClient.setQueryData(['posts'], []);
      return (
        <QueryClientProvider client={emptyClient}>
          <View className="p-4 flex-1">
            <Story />
          </View>
        </QueryClientProvider>
      );
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      const loadingClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // No data set → query stays in loading state
      return (
        <QueryClientProvider client={loadingClient}>
          <View className="p-4 flex-1">
            <Story />
          </View>
        </QueryClientProvider>
      );
    },
  ],
};
```

---

## 10. Accessibility (A11y) — Complete Guide

### 10.1 Core A11y Props

```tsx
// ✅ GOOD: Fully accessible button
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Sign in to your account"
  accessibilityHint="Navigates to the sign in screen"
  accessibilityState={{ disabled: isLoading }}
  onPress={handleSignIn}
>
  <Ionicons name="log-in" size={20} />
  <Text>Sign In</Text>
</Pressable>

// ✅ GOOD: Icon-only button — label is essential
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Close"
  onPress={onClose}
>
  <Ionicons name="close" size={24} />
</Pressable>

// ✅ GOOD: Image with meaningful alt text
<Image
  accessible
  accessibilityRole="image"
  accessibilityLabel="Profile photo of John Doe"
  source={{ uri: user.avatarUrl }}
/>

// ✅ GOOD: Tab / toggle
<Switch
  accessible
  accessibilityRole="switch"
  accessibilityLabel="Enable dark mode"
  accessibilityState={{ checked: isDark }}
  value={isDark}
  onValueChange={toggleDarkMode}
/>
```

### 10.2 Grouping & Focus Order

```tsx
// ✅ GOOD: Card as a single accessible element
<Pressable
  accessible
  accessibilityRole="link"
  accessibilityLabel={`Post: ${post.title}. By ${post.author}. ${formatDate(post.createdAt)}`}
  onPress={() => router.push(`/post/${post.id}`)}
>
  <View>
    <Text>{post.title}</Text>
    <Text>{post.author}</Text>
  </View>
</Pressable>

// ❌ BAD: Each Text is a separate focus target — noisy for screen readers
<Pressable onPress={() => router.push(`/post/${post.id}`)}>
  <Text>{post.title}</Text>
  <Text>{post.author}</Text>
</Pressable>
```

### 10.3 Semantic Roles

| Role | Use Case |
|------|----------|
| `button` | Tappable actions |
| `link` | Navigation to another screen |
| `header` | Section headers (`accessibilityRole="header"`) |
| `tab` | Tab bar items |
| `image` | Images with meaningful content |
| `switch` | Toggle controls |
| `adjustable` | Sliders |
| `none` | Decorative elements (hide from screen reader) |

### 10.4 Gesture Actions

```tsx
<View
  accessible
  accessibilityRole="adjustable"
  accessibilityLabel="Brightness"
  accessibilityValue={{ min: 0, max: 100, now: brightness }}
  accessibilityActions={[
    { name: 'increment', label: 'Increase brightness' },
    { name: 'decrement', label: 'Decrease brightness' },
  ]}
  onAccessibilityAction={(event) => {
    switch (event.nativeEvent.actionName) {
      case 'increment':
        setBrightness((b) => Math.min(100, b + 10));
        break;
      case 'decrement':
        setBrightness((b) => Math.max(0, b - 10));
        break;
    }
  }}
>
  <Slider value={brightness} />
</View>
```

### 10.5 Contrast & Font Scaling

```tsx
// ✅ GOOD: Respect user font scaling
<Text allowFontScaling style={{ fontSize: 16 }}>
  This text scales with the user's accessibility settings.
</Text>

// ✅ GOOD: Use theme to guarantee contrast ratios
const { colors } = useTheme();

// lightColors.text (#1A1A2E) on lightColors.background (#F5F7FA) = 15.3:1 contrast ratio ✅
// darkColors.text (#E6EDF3) on darkColors.background (#0D1117) = 15.1:1 contrast ratio ✅
<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Readable content</Text>
</View>
```

### 10.6 A11y Checklist

- [ ] All images have `accessibilityLabel`
- [ ] All buttons have `accessibilityLabel` (especially icon-only buttons)
- [ ] Groups are merged into single accessible elements when appropriate
- [ ] Forms have clear error messages linked to fields
- [ ] Focus order follows visual order
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- [ ] `allowFontScaling` is not disabled unless absolutely necessary
- [ ] Dynamic content changes are announced (`accessibilityLiveRegion`)
- [ ] Tested with TalkBack (Android) and VoiceOver (iOS)

### 10.7 Testing Accessibility

```tsx
import { render, screen } from '@testing-library/react-native';

test('Button is accessible', () => {
  render(<Button onPress={jest.fn()} title="Sign In" />);

  const button = screen.getByRole('button', { name: 'Sign In' });
  expect(button).toBeOnTheScreen();
  expect(button).toHaveAccessibilityLabel('Sign In');
});

test('Card groups content into one accessible element', () => {
  render(<PostCard post={mockPost} />);
  // Query by accessibility label set via accessibilityLabel prop
  const card = screen.getByLabelText(/Post:.*Mock Title.*/);
  expect(card).toBeOnTheScreen();
  expect(card).toHaveAccessibilityLabel(expect.stringContaining('Mock Title'));
});
```

---

## 11. Testing

### 11.1 Test Setup (Jest + RNTL)

The project uses `jest-expo` preset with `@testing-library/react-native` and `@testing-library/jest-native` matchers.

```js
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|nativewind)',
  ],
};
```

### 11.2 Component Tests

```tsx
// src/features/posts/__tests__/PostCard.test.tsx
import { render, screen } from '@testing-library/react-native';
import { PostCard } from '../components/PostCard';

const mockPost = {
  id: '1',
  title: 'Test Post',
  excerpt: 'This is a test',
  createdAt: '2025-01-15T10:00:00Z',
  author: { name: 'Jane' },
};

test('renders post title and excerpt', () => {
  render(<PostCard post={mockPost} />);

  expect(screen.getByText('Test Post')).toBeOnTheScreen();
  expect(screen.getByText('This is a test')).toBeOnTheScreen();
});

test('applies correct styles', () => {
  const { getByText } = render(<PostCard post={mockPost} />);

  const title = getByText('Test Post');
  // Verify Tailwind classes resolved to styles
  expect(title).toHaveStyle({ fontWeight: '700' }); // from "font-bold"
});
```

### 11.3 Hook Tests with React Query

```tsx
// src/features/posts/__tests__/usePosts.test.tsx
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePosts } from '../hooks/usePosts';
import { postsApi } from '../services/postsApi';

jest.mock('../services/postsApi');

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

test('fetches posts successfully', async () => {
  (postsApi.getAll as jest.Mock).mockResolvedValue([
    { id: '1', title: 'Post 1' },
    { id: '2', title: 'Post 2' },
  ]);

  const { result } = renderHook(() => usePosts(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(2);
  expect(result.current.data?.[0].title).toBe('Post 1');
});
```

### 11.4 Form Tests

```tsx
// src/features/auth/__tests__/SignInForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInForm } from '../components/SignInForm';

test('shows validation errors on empty submit', async () => {
  render(<SignInForm />);

  fireEvent.press(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => {
    expect(screen.getByText('Email is required')).toBeOnTheScreen();
    expect(screen.getByText('Password must be at least 8 characters')).toBeOnTheScreen();
  });
});

test('submits form with valid data', async () => {
  const mockLogin = jest.fn();
  render(<SignInForm onSubmit={mockLogin} />);

  fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'test@test.com');
  fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'password123');
  fireEvent.press(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });
  });
});
```

---

## 12. Performance & Optimization

### 12.1 React Compiler (Enabled)

The project has `"reactCompiler": true` in `app.json`. React 19's compiler auto-memoizes components — manual `useMemo`/`useCallback`/`React.memo` is **no longer needed** for most cases.

```tsx
// ✅ With React Compiler enabled, this is automatically optimized:
function ExpensiveList({ items }: { items: Item[] }) {
  return items.map((item) => <ItemRow key={item.id} item={item} />);
}
// No need for React.memo or useMemo — compiler handles it.
```

### 12.2 Lazy Loading

```tsx
import { lazy, Suspense } from 'react';
import { ActivityIndicator } from 'react-native';

const HeavyComponent = lazy(() => import('@/features/analytics/components/Dashboard'));

export default function AnalyticsScreen() {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 12.3 Reanimated & Gesture Handler

Use `react-native-reanimated` for animations (runs on UI thread, 60fps) and `react-native-gesture-handler` for gestures.

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

function SwipeableCard({ children }: { children: ReactNode }) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => { translateX.value = e.translationX; })
    .onEnd(() => { translateX.value = withSpring(0); });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
}
```

### 12.4 FlatList Best Practices

```tsx
<FlatList
  data={posts}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <PostCard post={item} />}
  getItemLayout={(_, index) => ({ length: 120, offset: 120 * index, index })} // Fixed-height items
  removeClippedSubviews                // Off-screen items unmount
  maxToRenderPerBatch={10}             // Render in batches
  windowSize={5}                       // Render 5 screens worth
  initialNumToRender={10}              // First batch size
/>
```

### 12.5 Styling Performance

| Approach | Perf | When to Use |
|----------|------|-------------|
| NativeWind (Tailwind) | Good (compiled at build) | Daily UI, 95% of cases |
| StyleSheet.create | Excellent (native bridge) | FlatList items, frequently re-rendering components |
| Inline `style={{}}` | Poor (new object each render) | **Never** |

---

## 13. Security

### 13.1 Secure Storage

Never store tokens in AsyncStorage — use `expo-secure-store`:

```tsx
import * as SecureStore from 'expo-secure-store';

// ✅ GOOD
await SecureStore.setItemAsync('accessToken', token);
const token = await SecureStore.getItemAsync('accessToken');
await SecureStore.deleteItemAsync('accessToken');

// ❌ BAD
await AsyncStorage.setItem('accessToken', token);
```

### 13.2 Authentication with PKCE (OAuth)

For OAuth flows, use PKCE (Proof Key for Code Exchange):

```bash
npm install expo-auth-session expo-crypto
```

```tsx
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

const redirectUri = AuthSession.makeRedirectUri();
const codeVerifier = Crypto.randomUUID();
const codeChallenge = await Crypto.digestStringAsync(
  Crypto.CryptoDigestAlgorithm.SHA256,
  codeVerifier,
);
```

### 13.3 Error Boundaries

Wrap every screen or section with error boundaries:

```tsx
// src/core/components/ErrorBoundary.tsx — Already implemented in this template
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
    // Optionally report to Sentry
    // Sentry.Native.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackScreen onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

### 13.4 Error Monitoring with Sentry

```bash
npm install @sentry/react-native
```

```tsx
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development',
});

// Wrap root layout
export default Sentry.wrap(RootLayout);
```

### 13.5 Environment Variables

```bash
# .env.local (never committed)
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/123
EXPO_PUBLIC_ENVIRONMENT=development
```

```tsx
// Access in code — Expo auto-replaces at build time
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

---

## 14. Tech Stack Summary

| Category | Library | Version / Notes |
|----------|---------|-----------------|
| **Framework** | Expo SDK | 56 |
| **UI Library** | React Native | 0.85 |
| **Language** | TypeScript | 6.0 |
| **Routing** | Expo Router | File-based, typed routes |
| **Styling (Primary)** | NativeWind (Tailwind CSS) | Utility-first, dark mode, platform prefixes |
| **Styling (Perf)** | StyleSheet | FlatList items, Reanimated styles |
| **Forms** | React Hook Form + Zod | Schema validation, typed inference |
| **Server State** | TanStack Query | Caching, mutations, optimistic updates |
| **HTTP Client** | Axios | Interceptors, token management |
| **Authentication** | expo-secure-store, PKCE | Secure token storage |
| **Animations** | react-native-reanimated | 60fps, UI thread |
| **Gestures** | react-native-gesture-handler | Pan, swipe, pinch |
| **Icons** | @expo/vector-icons | Ionicons, MaterialIcons, etc. |
| **Fonts** | expo-font | Inter (Regular + Bold) |
| **Testing** | Jest + @testing-library/react-native | Component, hook, form tests |
| **Storybook** | @storybook/react-native | Component catalog, a11y addon |
| **Linting** | ESLint (eslint-config-expo) | Flat config |
| **Formatting** | Prettier | Single quotes, trailing commas, 100 print width |
| **Error Monitoring** | @sentry/react-native | Crash reporting, traces |
| **React Compiler** | Built-in (React 19) | Auto-memoization enabled |

---

## Appendix: Project Conventions

This section references specific conventions from the Aulivo / ExpoTemplate project.

### Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/assets/*": ["./assets/*"]
    }
  }
}
```

All imports use `@/` prefix: `import { Button } from '@/core/components/Button'`.

### Theme System

The project has a built-in theme system with light/dark/auto modes:

- `src/theme/colors.ts` — Color definitions (`lightColors`, `darkColors`, `Theme`, `ThemeMode`)
- `src/context/ThemeContext.tsx` — `ThemeProvider` + `useTheme()` (persisted via AsyncStorage)
- `src/context/AnimatedThemeContext.tsx` — `AnimatedThemeProvider` + `useAnimatedColors()` (Reanimated transitions)

### Code Style

- Prettier: single quotes, trailing commas, 100 char width, 2-space tabs, LF line endings
- ESLint: `eslint-config-expo/flat` configuration
- File naming: `PascalCase.tsx` for components, `camelCase.ts` for utilities/hooks/services

### React Compiler

The React 19 compiler is enabled (`experiments.reactCompiler: true`). Manual memoization (`useMemo`, `useCallback`, `React.memo`) is unnecessary in most cases.
