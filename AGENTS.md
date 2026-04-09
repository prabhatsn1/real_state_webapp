<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project Guide: Prestige Realty

## Stack Snapshot

- Next.js 16.2.2 App Router with React 19 and TypeScript
- MUI v7 with Emotion for styling
- Framer Motion v12 for animation
- React Three Fiber and Drei for 3D hero scene
- Supabase for auth and persistence, with a mock mode fallback

## Repository Shape

- `app/`: route handlers and page trees
- `app/(site)/`: public site routes
- `app/admin/`: admin panel routes
- `src/components/`: shared UI components
- `src/lib/actions/`: server actions
- `src/lib/mock/`: mock auth and favourites
- `src/lib/supabase/`: browser/server/admin Supabase clients
- `src/data/mock.json`: baseline content
- `src/types/schema.ts`: shared schema and types

## Working Rules For This Codebase

- Preserve App Router conventions and avoid introducing legacy Pages Router patterns.
- Prefer existing MUI `sx` styling patterns over ad hoc CSS.
- Keep components focused and colocated with existing domain folders.
- Reuse shared types from `src/types/schema.ts` instead of redefining interfaces.
- Keep server writes inside server actions under `src/lib/actions/`.

## Mock Mode And Data Flow

- `NEXT_PUBLIC_USE_MOCK_DATA=true` runs mock auth/data flows.
- In mock mode, admin data comes from `loadAdminStore()` and persists via `saveAdminStore()`.
- In non-mock mode, admin data should load through `getAdminData()` and write via admin actions.
- When adding features, implement both mock and Supabase paths if the feature touches data.

## React 19 And Compiler Safety

- Do not call impure functions during render or render-adjacent logic.
- Avoid `Date.now()` and `Math.random()` in render paths, state initializers that run on render, or `useMemo` render code.
- Do not call `setState` synchronously inside `useEffect` just to derive local state.
- Prefer derived state, lazy initial state, subscriptions, async callbacks, or key-based remounting patterns.

## Framer Motion Typing Notes

- Use typed easing constants for reusable transitions, for example tuple easings with `as const`.
- Keep animation objects strongly typed-friendly to avoid `Variants` and `Transition` incompatibilities.

## Quality Gates Before Finishing

- Run formatting when needed: `npm run format`
- Run lint checks: `npm run lint`
- Run type checks: `npx tsc --noEmit`
- Run production build for behavior-sensitive changes: `npm run build`

## Change Scope Expectations

- Make minimal, targeted edits and do not reformat unrelated files.
- Keep behavior parity unless explicitly asked for feature changes.
- For admin and auth changes, verify both desktop and mobile UI behavior.
