# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native / Expo app called "地球事" (v1.2.0) — a thin native shell that wraps a remote web app hosted at `https://www.webcad.online/index.html` using a full-screen WebView.

## Dev Commands

```bash
npm start          # start Expo dev server
npm run android    # run on Android
npm run ios        # run on iOS
npm run web        # run in browser
```

No lint or test scripts are configured.

## Architecture

The entire app logic is in a single file: [App.tsx](App.tsx)

- Single screen, no routing
- Renders a full-screen `WebView` pointing to `https://www.webcad.online/index.html`
- Black loading overlay with `ActivityIndicator` that dismisses 3 seconds after `onLoadEnd`
- No state management library — just one `useState` for the loading flag
- All app content is served from the remote URL; native code is purely a shell

Builds are managed via EAS ([eas.json](eas.json)). App config is in [app.json](app.json).
