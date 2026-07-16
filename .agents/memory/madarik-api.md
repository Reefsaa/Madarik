---
name: Madarik API Server
description: API server config, Claude integration, and DB schema for Madarik
---

## API server
- Location: `artifacts/api-server/`
- PreviewPath: `/api` (routes like `/api/chat`, `/api/healthz`)
- From mobile Expo web: use `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
- CORS is open (`app.use(cors())`) — cross-origin from Expo domain works fine
- Build: `node ./build.mjs` (esbuild) → `dist/index.mjs`; then `node --enable-source-maps dist/index.mjs`

## Claude integration
- Package: `@anthropic-ai/sdk` in `artifacts/api-server/package.json`
- Route: `POST /api/chat` — SSE stream using `anthropic.messages.stream()`
- Model: `claude-sonnet-4-6`, max_tokens: 8192
- System prompts: business vs personal (different finance domains)
- Secret: `ANTHROPIC_API_KEY` — must restart API server workflow after secret is added for it to load

**Why:** streaming SSE from API server rather than direct mobile→Claude avoids exposing API key in client bundle.

## Mobile API call
```typescript
const apiBase = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;
fetch(`${apiBase}/chat`, { method: 'POST', body: JSON.stringify({ messages, mode }) })
```
- EXPO_PUBLIC_DOMAIN is set to $REPLIT_DEV_DOMAIN in the mobile workflow
- Falls back to simulated responses if API unavailable

## DB tables added
- `personal_profiles` — behavioral score, risk profile, investment data
- `transactions` — personal/business flagged transactions  
- `behavioral_assessments` — full assessment form results + computed scores
- Schema: `lib/db/src/schema/` — exported from `index.ts`
