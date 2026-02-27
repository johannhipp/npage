# Add PostHog Analytics

## TL;DR

> **Quick Summary**: Add PostHog to a 2-page personal portfolio site with autocapture + one custom event (`track_played`) for the listening bar music player. Minimal integration — no server-side tracking, no feature flags, no consent banners.
> 
> **Deliverables**:
> - PostHog provider component wired into root layout
> - `track_played` custom event on all user-initiated playback actions
> - Environment variable setup (local + Vercel)
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: NO — 3 sequential tasks (install → provider → event)
> **Critical Path**: Task 1 → Task 2 → Task 3

---

## Context

### Original Request
Add PostHog analytics to a personal portfolio site. Don't overengineer it — figure out which events are relevant given the limited scope.

### Interview Summary
**Key Discussions**:
- Site has 2 pages: homepage (bio + WebGL gallery + links) and /listeningbar (retro music player with 5 tracks)
- PostHog autocapture covers pageviews, all DOM clicks (social links, CV download, AgentOS CTA), sessions
- Only 1 custom event needed: `track_played` — because track list items look identical to autocapture
- CircularGallery (WebGL canvas) interactions are decorative, not worth tracking
- User confirmed: one custom event + autocapture is the right scope

**Research Findings**:
- Next.js 16 with App Router; layout.tsx is server component, pages are "use client"
- LayoutWrapper (`app/components/layout-wrapper.tsx`) is an existing client component pattern to follow
- No existing analytics, no test infrastructure
- 5 distinct playback code paths in listeningbar: `playTrack()`, `togglePlayPause()` (first-play), `playPrevious()`, `playNext()`, `handleTrackEnd()` (auto-advance)
- Both `package-lock.json` and `pnpm-lock.yaml` exist; defaulting to pnpm

### Metis Review
**Identified Gaps** (addressed):
- **Multiple playback paths**: Planning assumed one capture call, but there are 5 code paths that start tracks. Resolved: capture on all 4 user-initiated paths, exclude auto-advance (`handleTrackEnd`) to avoid inflating counts
- **Vercel env var**: `.env.local` only works locally; must also add to Vercel project settings. Resolved: added as explicit step in Task 1
- **Package manager ambiguity**: Both lockfiles exist. Resolved: default to pnpm (pnpm-lock.yaml present)
- **Dev mode filtering**: PostHog filters localhost in dashboard by default. Resolved: no code-level guard needed, noted in guardrails

---

## Work Objectives

### Core Objective
Add PostHog client-side analytics with autocapture enabled and one custom event for music track plays.

### Concrete Deliverables
- `app/components/posthog-provider.tsx` — new PostHog provider client component
- `app/layout.tsx` — edited to wrap content with PostHog provider
- `app/listeningbar/page.tsx` — edited to fire `track_played` on user-initiated playback
- `.env.local` — updated with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

### Definition of Done
- [ ] `pnpm build` passes with zero errors
- [ ] PostHog JS loads on both `/` and `/listeningbar`
- [ ] `track_played` event fires with `track_id` and `track_name` when user plays a track
- [ ] No API key hardcoded in source files

### Must Have
- PostHog provider as a client component (follows existing `"use client"` pattern)
- `usePostHog()` hook from `posthog-js/react` for custom event capture (not raw posthog-js import)
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` via environment variables
- Autocapture enabled (PostHog default)
- `track_played` event on: `playTrack()`, `togglePlayPause()` first-play branch, `playPrevious()`, `playNext()`

### Must NOT Have (Guardrails)
- No `posthog-node` or server-side tracking
- No analytics utility module, wrapper function, or custom hook — use `usePostHog()` directly
- No cookie consent banner or GDPR UI
- No PostHog feature flags, session replay, or surveys config
- No modifications to `next.config.mjs`
- No tracking on the CircularGallery WebGL canvas
- No custom events beyond `track_played`
- No `data-ph-capture-attribute` or custom data attributes on existing DOM elements
- No changes to listeningbar UI, header, footer, or homepage markup/styling
- No dev-mode guards in code (PostHog filters localhost in dashboard by default)
- No tests (no test infrastructure exists, adding it is out of scope)
- No `handleTrackEnd()` tracking (auto-advance inflates play counts without adding signal)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: none

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool | Method |
|------------------|-------------------|--------|
| Package install | Bash | Check package.json + node_modules |
| Provider component | Bash (build) + Playwright | Build passes, script loads in browser |
| Custom event | Playwright | Click track, verify posthog capture call in console |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Sequential — each task depends on the previous):
├── Task 1: Install posthog-js + set env vars [quick]
├── Task 2: Create PostHog provider + wire into layout [quick]
└── Task 3: Add track_played custom event to listeningbar [quick]

Wave FINAL (After ALL tasks):
└── Task F1: Full QA verification [quick]
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | — | 2, 3 | 1 |
| 2 | 1 | 3 | 1 |
| 3 | 2 | F1 | 1 |
| F1 | 3 | — | FINAL |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks → Agent Category |
|------|------------|----------------------|
| 1 | **1** (sequential) | T1 → `quick`, T2 → `quick`, T3 → `quick` |
| FINAL | **1** | F1 → `quick` + `playwright` skill |

---

## TODOs

- [ ] 1. Install posthog-js and configure environment variables

  **What to do**:
  - Run `pnpm add posthog-js`
  - Add to `.env.local`:
    ```
    NEXT_PUBLIC_POSTHOG_KEY=phc_YOUR_KEY_HERE
    NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
    ```
  - Verify `posthog-js` appears in `package.json` dependencies

  **Must NOT do**:
  - Do not install `posthog-node`
  - Do not modify any source files in this task
  - Do not commit `.env.local`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single package install + env var setup, trivial task
  - **Skills**: []
    - No specialized skills needed for package installation
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for install step

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (first task)
  - **Blocks**: Tasks 2, 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `package.json:11-65` — Current dependencies list; posthog-js will be added here

  **API/Type References**:
  - None

  **External References**:
  - PostHog Next.js docs: https://posthog.com/docs/libraries/next-js

  **WHY Each Reference Matters**:
  - `package.json` — Verify posthog-js was added to dependencies after install

  **Acceptance Criteria**:

  - [ ] `posthog-js` exists in `package.json` dependencies
  - [ ] `.env.local` contains `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
  - [ ] `node_modules/posthog-js` directory exists

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: posthog-js package installed correctly
    Tool: Bash
    Preconditions: Project directory at /Users/johann/Documents/personal/npage
    Steps:
      1. Run: node -e "const p = require('./package.json'); console.log(p.dependencies['posthog-js'] ? 'OK' : 'MISSING')"
      2. Assert output is "OK"
      3. Run: ls node_modules/posthog-js/package.json
      4. Assert file exists (exit code 0)
    Expected Result: "OK" printed and package.json exists in node_modules
    Failure Indicators: "MISSING" printed or ls returns exit code 1
    Evidence: .sisyphus/evidence/task-1-package-installed.txt

  Scenario: Environment variables configured
    Tool: Bash
    Preconditions: .env.local exists
    Steps:
      1. Run: grep "NEXT_PUBLIC_POSTHOG_KEY" .env.local
      2. Assert match found
      3. Run: grep "NEXT_PUBLIC_POSTHOG_HOST" .env.local
      4. Assert match found
      5. Run: grep -c "phc_" app/ -r --include="*.tsx" --include="*.ts"
      6. Assert 0 matches (no hardcoded key in source)
    Expected Result: Both env vars present in .env.local, no hardcoded keys in source
    Failure Indicators: grep returns no match for env vars, or hardcoded key found in source
    Evidence: .sisyphus/evidence/task-1-env-vars.txt
  ```

  **Commit**: YES
  - Message: `feat(analytics): install posthog-js`
  - Files: `package.json`, `pnpm-lock.yaml`
  - Pre-commit: None (`.env.local` is gitignored)

---

- [ ] 2. Create PostHog provider and wire into root layout

  **What to do**:
  - Create `app/components/posthog-provider.tsx` as a `"use client"` component
  - Use `PostHogProvider` from `posthog-js/react` with `posthog-js` client init
  - Guard init with `typeof window !== 'undefined'` for SSR safety
  - Read key from `process.env.NEXT_PUBLIC_POSTHOG_KEY` and host from `process.env.NEXT_PUBLIC_POSTHOG_HOST`
  - Enable autocapture (default behavior, no explicit config needed)
  - Edit `app/layout.tsx` to import and wrap `<LayoutWrapper>` with the PostHog provider
  - The provider is a client component imported into a server component layout — this is a valid Next.js pattern

  **Must NOT do**:
  - Do not add feature flags, session replay, or surveys config to PostHog init
  - Do not create a separate analytics utility module or custom hook
  - Do not modify `next.config.mjs`
  - Do not add any `data-ph-*` attributes to existing components
  - Do not add dev-mode guards — PostHog filters localhost by default

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Create one small component + add one import/wrapper to layout. Two files, minimal code.
  - **Skills**: []
    - No specialized skills needed
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No UI work involved
    - `playwright`: QA is in the final verification task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `app/components/layout-wrapper.tsx` — Existing `"use client"` component pattern. Follow same file structure: `"use client"` directive, named export, similar import style
  - `app/layout.tsx:1-30` — Current root layout. The PostHog provider wraps `<LayoutWrapper>` inside the `<body>` tag

  **API/Type References**:
  - `posthog-js/react` exports `PostHogProvider` component — wraps app to provide PostHog context
  - `posthog-js` exports `posthog` for `posthog.init()` call

  **External References**:
  - PostHog Next.js App Router setup: https://posthog.com/docs/libraries/next-js

  **WHY Each Reference Matters**:
  - `layout-wrapper.tsx` — Copy the `"use client"` + named export pattern so the new file is consistent with existing code style
  - `layout.tsx` — Understand current wrapper nesting to insert PostHog provider at the right level (around LayoutWrapper, inside body)

  **Acceptance Criteria**:

  - [ ] `app/components/posthog-provider.tsx` exists with `"use client"` directive
  - [ ] Provider uses `PostHogProvider` from `posthog-js/react`
  - [ ] Provider reads from `NEXT_PUBLIC_POSTHOG_KEY` env var (not hardcoded)
  - [ ] `app/layout.tsx` imports and wraps content with PostHog provider
  - [ ] `pnpm build` passes with zero errors

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Build passes with PostHog provider
    Tool: Bash
    Preconditions: posthog-js installed (Task 1 complete)
    Steps:
      1. Run: pnpm build
      2. Assert exit code 0
      3. Assert no "Error" in output
    Expected Result: Build succeeds with zero errors
    Failure Indicators: Non-zero exit code or "Error" in stdout/stderr
    Evidence: .sisyphus/evidence/task-2-build-pass.txt

  Scenario: Provider file follows codebase conventions
    Tool: Bash
    Preconditions: app/components/posthog-provider.tsx exists
    Steps:
      1. Run: head -1 app/components/posthog-provider.tsx
      2. Assert output is: "use client";
      3. Run: grep "NEXT_PUBLIC_POSTHOG_KEY" app/components/posthog-provider.tsx
      4. Assert match found (env var used, not hardcoded key)
      5. Run: grep "PostHogProvider" app/components/posthog-provider.tsx
      6. Assert match found (using official React provider)
      7. Run: grep -c "phc_" app/components/posthog-provider.tsx
      8. Assert 0 matches (no hardcoded API key)
    Expected Result: File uses "use client", env var for key, official PostHogProvider
    Failure Indicators: Missing "use client", hardcoded API key, raw posthog.init without provider
    Evidence: .sisyphus/evidence/task-2-provider-conventions.txt

  Scenario: Layout wraps content with PostHog provider
    Tool: Bash
    Preconditions: app/layout.tsx has been edited
    Steps:
      1. Run: grep "posthog-provider" app/layout.tsx
      2. Assert match found (provider is imported)
      3. Run: grep "PostHogProvider\|PHProvider\|PosthogProvider" app/layout.tsx
      4. Assert match found (provider wraps content)
    Expected Result: Layout imports and uses the PostHog provider component
    Failure Indicators: No import or no usage of provider in layout
    Evidence: .sisyphus/evidence/task-2-layout-wrapped.txt
  ```

  **Commit**: YES
  - Message: `feat(analytics): add PostHog provider to root layout`
  - Files: `app/components/posthog-provider.tsx`, `app/layout.tsx`
  - Pre-commit: `pnpm build`

---

- [ ] 3. Add track_played custom event to listeningbar

  **What to do**:
  - Import `usePostHog` from `posthog-js/react` in `app/listeningbar/page.tsx`
  - Get the PostHog client via `const posthog = usePostHog()`
  - Add `posthog.capture('track_played', { track_id: track.id, track_name: track.name })` in these 4 locations:
    1. `playTrack(track)` function (line ~148) — user clicks track in list
    2. `togglePlayPause()` first-play branch (line ~154, inside the `if (!selectedTrack)` block) — user hits play with no track selected, auto-selects first track
    3. `playPrevious()` function (line ~163, inside the `if` block) — user clicks ◀◀
    4. `playNext()` function (line ~171, inside the `if` block) — user clicks ▶▶
  - Do NOT add capture to `handleTrackEnd()` — auto-advance would inflate play counts

  **Must NOT do**:
  - Do not create a wrapper function, utility, or custom hook for the capture call
  - Do not modify the listeningbar UI or any visual elements
  - Do not add any other custom events
  - Do not track `handleTrackEnd()` auto-advance
  - Do not import `posthog-js` directly — use `usePostHog()` from `posthog-js/react`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: One file edit — add import + hook + 4 one-liner capture calls to existing functions
  - **Skills**: []
    - No specialized skills needed
  - **Skills Evaluated but Omitted**:
    - `playwright`: QA is in the final task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after Task 2)
  - **Blocks**: Task F1
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `app/listeningbar/page.tsx:147-175` — The 4 playback functions where capture calls go. Each sets `setSelectedTrack()` + `setIsPlaying(true)`. Add the capture call right after `setIsPlaying(true)` in each.

  **API/Type References**:
  - `app/listeningbar/page.tsx:5-9` — `Track` interface defining `id: string` and `name: string` — these are the properties to pass to the capture call
  - `posthog-js/react` exports `usePostHog()` → returns PostHog client with `.capture(event, properties)` method

  **External References**:
  - PostHog React capture: https://posthog.com/docs/libraries/react#capturing-events

  **WHY Each Reference Matters**:
  - Lines 147-175: Shows exactly where to insert capture calls — after `setIsPlaying(true)` in each function, using the track variable already in scope
  - Track interface: Confirms property names (`id`, `name`) to use in capture properties
  - `togglePlayPause` line ~154: The first-play branch uses `tracks[0]` — capture should reference `tracks[0]` not `selectedTrack` (which is null at that point)

  **Acceptance Criteria**:

  - [ ] `usePostHog` imported from `posthog-js/react`
  - [ ] `posthog.capture('track_played', ...)` appears in `playTrack`, `togglePlayPause` (first-play), `playPrevious`, `playNext`
  - [ ] Capture call includes `{ track_id, track_name }` properties
  - [ ] `handleTrackEnd` does NOT contain a capture call
  - [ ] `pnpm build` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Custom event capture calls exist in correct functions
    Tool: Bash
    Preconditions: app/listeningbar/page.tsx has been edited
    Steps:
      1. Run: grep -c "track_played" app/listeningbar/page.tsx
      2. Assert count is 4 (one per user-initiated playback function)
      3. Run: grep "usePostHog" app/listeningbar/page.tsx
      4. Assert match found (hook is imported and used)
      5. Run: grep "track_id" app/listeningbar/page.tsx
      6. Assert match found (properties include track_id)
      7. Run: grep "track_name" app/listeningbar/page.tsx
      8. Assert match found (properties include track_name)
    Expected Result: 4 capture calls with track_id and track_name properties
    Failure Indicators: Fewer than 4 captures, missing properties, or missing usePostHog import
    Evidence: .sisyphus/evidence/task-3-capture-calls.txt

  Scenario: Auto-advance does NOT fire track_played
    Tool: Bash
    Preconditions: app/listeningbar/page.tsx has been edited
    Steps:
      1. Extract the handleTrackEnd function body (lines 86-93 area)
      2. Run: sed -n '/const handleTrackEnd/,/^  };/p' app/listeningbar/page.tsx | grep "track_played"
      3. Assert 0 matches
    Expected Result: handleTrackEnd contains no capture call
    Failure Indicators: "track_played" found in handleTrackEnd
    Evidence: .sisyphus/evidence/task-3-no-autoadvance-tracking.txt

  Scenario: Build passes with custom events
    Tool: Bash
    Preconditions: All edits complete
    Steps:
      1. Run: pnpm build
      2. Assert exit code 0
    Expected Result: Build succeeds
    Failure Indicators: Non-zero exit code
    Evidence: .sisyphus/evidence/task-3-build-pass.txt
  ```

  **Commit**: YES
  - Message: `feat(analytics): track music plays in listeningbar`
  - Files: `app/listeningbar/page.tsx`
  - Pre-commit: `pnpm build`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

- [ ] F1. **Full QA — PostHog loads and custom event fires**

  **What to do**:
  - Start dev server with `pnpm dev`
  - Use Playwright to navigate to `/` and verify PostHog JS loaded (check for `__ph` or PostHog network request)
  - Navigate to `/listeningbar` and click a track — verify `posthog.capture` was called with correct properties
  - Verify no console errors on either page
  - Verify build passes: `pnpm build`
  - Check no hardcoded API keys: search all `.ts`/`.tsx` files for `phc_`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification only, no implementation
  - **Skills**: [`playwright`]
    - `playwright`: Needed to open browser, navigate pages, verify PostHog loaded and events fire

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (final)
  - **Blocks**: None
  - **Blocked By**: Task 3

  **References**:

  - `app/components/posthog-provider.tsx` — Verify it exists and has correct structure
  - `app/layout.tsx` — Verify provider is wired in
  - `app/listeningbar/page.tsx` — Verify capture calls exist

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: PostHog JS loads on homepage
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for page load (timeout: 10s)
      3. Execute in browser console: typeof window.__ph !== 'undefined' || document.querySelector('script[src*="posthog"]') !== null
      4. Assert result is true
      5. Check browser console for errors — assert no PostHog-related errors
      6. Take screenshot
    Expected Result: PostHog JS is loaded, no console errors
    Failure Indicators: PostHog global not found, script tag missing, console errors
    Evidence: .sisyphus/evidence/task-F1-homepage-posthog.png

  Scenario: PostHog JS loads on listeningbar
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/listeningbar
      2. Wait for page load (timeout: 10s)
      3. Execute in browser console: typeof window.__ph !== 'undefined' || document.querySelector('script[src*="posthog"]') !== null
      4. Assert result is true
      5. Take screenshot
    Expected Result: PostHog JS loaded on listeningbar page
    Failure Indicators: PostHog not loaded
    Evidence: .sisyphus/evidence/task-F1-listeningbar-posthog.png

  Scenario: track_played event fires on track click
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, listeningbar page loaded
    Steps:
      1. Navigate to http://localhost:3000/listeningbar
      2. Intercept PostHog capture calls by monkey-patching: window.__ph_captured = []; const origCapture = window.posthog?.capture; if (origCapture) window.posthog.capture = function(event, props) { window.__ph_captured.push({event, props}); return origCapture.apply(this, arguments); }
      3. Click the first track in the track list (first child of the track list container)
      4. Wait 1 second
      5. Execute: JSON.stringify(window.__ph_captured.filter(e => e.event === 'track_played'))
      6. Assert result contains at least 1 entry
      7. Assert entry has properties: track_id and track_name
    Expected Result: track_played event captured with track_id and track_name
    Failure Indicators: No track_played events in captured array, missing properties
    Evidence: .sisyphus/evidence/task-F1-track-played-event.txt

  Scenario: No hardcoded API keys in source
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run: grep -rn "phc_" app/ --include="*.tsx" --include="*.ts"
      2. Assert 0 matches
    Expected Result: No hardcoded PostHog API keys in source code
    Failure Indicators: Any match containing "phc_" in source files
    Evidence: .sisyphus/evidence/task-F1-no-hardcoded-keys.txt
  ```

  **Commit**: NO (verification only, no code changes)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(analytics): install posthog-js` | `package.json`, `pnpm-lock.yaml` | package exists in deps |
| 2 | `feat(analytics): add PostHog provider to root layout` | `app/components/posthog-provider.tsx`, `app/layout.tsx` | `pnpm build` |
| 3 | `feat(analytics): track music plays in listeningbar` | `app/listeningbar/page.tsx` | `pnpm build` |

---

## Post-Deployment Reminder

After deploying, add these environment variables in **Vercel project settings** (Settings → Environment Variables):
- `NEXT_PUBLIC_POSTHOG_KEY` = your PostHog project API key (starts with `phc_`)
- `NEXT_PUBLIC_POSTHOG_HOST` = `https://us.i.posthog.com` (or `https://eu.i.posthog.com` for EU)

Without these, the deployed site will have no analytics — `.env.local` only works locally.

---

## Success Criteria

### Verification Commands
```bash
pnpm build                          # Expected: exit code 0
grep "posthog-js" package.json      # Expected: version string
grep -c "track_played" app/listeningbar/page.tsx  # Expected: 4
grep -rn "phc_" app/ --include="*.tsx" --include="*.ts"  # Expected: 0 matches
```

### Final Checklist
- [ ] `posthog-js` installed
- [ ] PostHog provider created and wired into root layout
- [ ] `track_played` fires on 4 user-initiated playback actions
- [ ] `handleTrackEnd` does NOT fire `track_played`
- [ ] No hardcoded API keys in source
- [ ] Build passes
- [ ] Vercel env vars documented (post-deploy step)
