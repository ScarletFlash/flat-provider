# Flat Provider

A simple and type-safe multiprovider implementation for React applications.

#### Turns this:

```tsx
export default function Layout({ children }: PropsWithChildren): ReactElement {
  // ...

  return (
    <UserTrackingProvider apiKey={process.env.TRACKING_API_KEY}>
      <AuthProvider session={session}>
        <UiKitProvider>
          <ThemeProvider>
            <OnboardingProvider>
              <ProjectsProvider>{children}</ProjectsProvider>
            </OnboardingProvider>
          </ThemeProvider>
        </UiKitProvider>
      </AuthProvider>
    </UserTrackingProvider>
  );
}
```

#### Into this:

```tsx
import { FlatProvider } from 'flat-provider';

export default function Layout({ children }: PropsWithChildren): ReactElement {
  // ...

  return FlatProvider.append(UserTrackingProvider, { apiKey: process.env.TRACKING_API_KEY })
    .append(AuthProvider, { session })
    .append(UiKitProvider)
    .append(ThemeProvider)
    .append(OnboardingProvider)
    .append(ProjectsProvider)
    .getLayout(children);
}
```

---

- 100% test-coverage
- Type-safe
- Great match for
  [react/jsx-max-depth](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-depth.md)
  ESLint rule
- Fully compatible with client and server components ― no hooks inside
