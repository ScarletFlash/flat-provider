# Multiprovider

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
import { Multiprovider } from "multiprovider";

export default function Layout({ children }: PropsWithChildren): ReactElement {
  // ...

  return Multiprovider
    .append(UserTrackingProvider, { apiKey: process.env.TRACKING_API_KEY })
    .append(AuthProvider, { session })
    .append(UiKitProvider)
    .append(ThemeProvider)
    .append(OnboardingProvider)
    .append(ProjectsProvider)
    .getLayout(children);
}
```
