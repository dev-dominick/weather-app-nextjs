# Atmos Weather (Next.js 16)

Production-style, Apple Weather–inspired weather dashboard built with Next.js App Router, React 19, TypeScript, Tailwind v4, TanStack Query, and Open-Meteo APIs.

## Highlights

- Worldwide city search with disambiguated geocoding results.
- Live current weather, 24-hour forecast, and 10-day forecast.
- Sunrise/sunset/daylight, UV, humidity, wind, and optional air-quality cards.
- Celsius/Fahrenheit switching with persisted user settings.
- Saved locations and optional browser geolocation (permission-based).
- Background data refresh with query caching and graceful error handling.
- Responsive sidebar + dashboard layout for mobile, tablet, and desktop.

## Tech stack

- Next.js `16.4.5` (App Router, static export)
- React `19`
- TypeScript (strict)
- Tailwind CSS v4 with semantic design tokens in [`src/styles/tokens.css`](./src/styles/tokens.css)
- TanStack Query for client data orchestration
- Zod for API and local-storage validation
- Vitest + React Testing Library
- Playwright for browser-level E2E coverage

## Local development

```bash
npm ci
npm run dev
```

Then open: <http://localhost:3000>

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Deployment notes

- The project uses static export (`output: "export"`), so it can deploy to static hosts (GitHub Pages, Netlify static, Azure Static Web Apps, S3/CloudFront, etc).
- Weather data is fetched client-side from Open-Meteo and does not require secrets.
- If deploying under a subpath, configure `basePath` and related asset settings intentionally.

## Security / audit status

- Ran `npm audit fix` with non-breaking updates.
- Remaining vulnerabilities require breaking-major upgrades (currently tied to transitive `vitest` and `eslint` dependency trees).

