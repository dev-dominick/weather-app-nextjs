# Weather App (Next.js)

Standalone weather search app built with Next.js App Router and TypeScript.

## Features

- City search via Open-Meteo geocoding
- Current temperature, humidity, wind, and feels-like data
- Five-day forecast cards
- Static export output for embedding in a parent portfolio site

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/weather-app-nextjs/`.

## Build

```bash
npm run build
```

This repo is configured for static export (`next.config.ts` uses `output: "export"`).
The generated static files are written to `out/` and can be copied into another host app.
