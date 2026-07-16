---
name: Madarik Dual-Mode Architecture
description: Key decisions and structure of the Madarik Business+Personal dual-mode Expo mobile app
---

## Mode system
- `context/AppModeContext.tsx` — stores `'business' | 'personal' | null` in AsyncStorage (`madarik_mode_v1`)
- `app/index.tsx` — root redirect: no user → auth; no mode → mode-select; else → tabs
- `app/(auth)/mode-select.tsx` — mode selector shown after login/signup if mode not set
- Mode switching: available in both Settings screens via `setMode()` from AppModeContext

## Tab structure (4 tabs)
- `app/(tabs)/index.tsx` → imports BusinessHome or PersonalHome component based on mode
- `app/(tabs)/insights.tsx` → imports BusinessInsights or SmartInsights
- `app/(tabs)/ai.tsx` → shared Modrik chat with mode-aware system prompts
- `app/(tabs)/settings.tsx` → imports BusinessSettings or PersonalSettings
- `app/(tabs)/accounts.tsx` and `analytics.tsx` exist but are NOT in tab layout (legacy, safe to delete)

## Components
- `components/MadarikLogo.tsx` — SVG orbit rings + Arabic text; sizes: small/medium/large
- `components/BusinessHome.tsx` — dark navy dashboard for business mode
- `components/PersonalHome.tsx` — light white dashboard with behavioral score badges
- `components/SmartInsights.tsx` — full personal insights (behavior score, emotion, spending, goals)
- `components/BusinessInsights.tsx` — business analytics with charts and KPIs
- `components/PersonalSettings.tsx` — profile header + settings list + referral + switch mode
- `components/BusinessSettings.tsx` — dark header + settings sections + switch mode

## Stack screens
- `app/behavioral-assessment.tsx` — 5-section form (financial profile, experience, goal, risk, psych)
- All other stack screens (loan-review, ai-alerts, etc.) are business-mode only

**Why:** separation into components (not route files) for the two modes keeps expo-router clean while allowing mode-conditional rendering without remounting navigation.

## Auth
- `context/AuthContext.tsx` — User type has {name, email, company}; signup 4th param stored as company
- Login does NOT check real credentials (demo mode) — any password works
