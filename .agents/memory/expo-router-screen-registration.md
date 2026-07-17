---
name: Expo Router screen registration
description: Screens in app/ must be explicitly listed in the root Stack in _layout.tsx or navigation pushes to them silently fail.
---

## Rule
Every new `app/<name>.tsx` screen that will be pushed to via `router.push('/<name>')` **must** have a `<Stack.Screen name="<name>" />` entry inside the `<Stack>` in `app/_layout.tsx`.

## Why
Without an explicit `Stack.Screen` entry the route exists on disk but Expo Router's Stack navigator does not register it; `router.push()` silently no-ops or falls back to the previous screen. This is the cause of all "Coming Soon" popups persisting after screens were added to disk in a previous session.

## How to apply
After writing any new `app/<name>.tsx`, immediately add:
```tsx
<Stack.Screen name="<name>" />
```
inside `RootLayoutNav` in `app/_layout.tsx`. The top-level `screenOptions={{ headerShown: false }}` propagates automatically — no per-screen overrides needed unless the screen needs a special animation or header.
